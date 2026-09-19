---
layout: post
title: "Vercel Preview에서만 테이블이 없다고 할 때 — 코드와 DB 스키마의 버전 불일치"
date: 2026-09-19 21:40:00 +0900
categories: [트러블슈팅]
tags: [migration, database]
snippet: |
  relation "facility_status" does not exist
  PostgreSQL error code: 42P01
---

로컬에서는 멀쩡한데 Vercel Preview에서만 API가 500을 반환했다. 코드 문제인 줄 알았지만, 원인은 Preview가 연결된 DB의 스키마가 구버전이었던 것이다.

## 어떤 증상이었나

GitHub의 `dev` 브랜치를 Vercel Preview에 배포해 개발 중인 기능을 확인하고 있었다. 그런데 어느 순간 Preview 사이트에 접속하자 홈 화면에서 기기 정보를 불러오지 못했다.

API별로 확인해보니 일부만 실패하고 있었다.

```text
/api/queue      200
/api/session    200
/api/machines   500
```

`/api/machines`만 실패했고, Vercel Function Log에는 아래 오류가 반복해서 남았다.

```text
Failed to fetch machines: Error [NeonDbError]: relation "facility_status" does not exist
PostgreSQL error code: 42P01
```

`42P01`은 PostgreSQL 에러 코드 중 `undefined_table`, 즉 조회하려는 테이블이 존재하지 않는다는 뜻이다. 로컬 DB에는 `facility_status` 테이블이 있었고 테스트도 통과했기 때문에, 처음에는 코드 쪽 문제처럼 보였다.

## 한 문장으로 말하면

코드는 최신이었지만 Vercel Preview가 연결된 Neon DB의 스키마가 오래된 상태여서, 최신 코드가 조회하는 테이블이 DB에 없었던 문제였다.

이걸 이해하려면 GitHub, Vercel, Neon을 서로 다른 역할로 나눠서 봐야 했다.

```text
GitHub = 코드 관리
Vercel = 코드 실행/배포
Neon   = PostgreSQL 데이터베이스
```

우리 프로젝트는 대략 이렇게 연결되어 있었다.

```text
GitHub main          GitHub dev
    ↓                    ↓
Vercel Production    Vercel Preview
    ↓                    ↓
Neon main            Neon preview/dev
```

여기서 가장 중요한 건, 이름이 비슷하다고 GitHub `dev`와 Neon `preview/dev`가 같은 것은 아니라는 점이다.

> GitHub 브랜치는 **코드의 버전**이고, Neon 브랜치는 **데이터베이스의 버전**이다.

Neon 문서도 브랜치의 성격을 이렇게 설명한다.

> changes made to a branch don't affect its parent

브랜치는 만들어지는 시점에 부모의 스키마와 데이터를 그대로 가져오지만, 그 이후로는 부모와 격리된다. 사진과 비슷하다. 원본을 찍어서 사본을 만든 것까지는 같지만, 그 뒤에 원본이 바뀐다고 이미 찍어둔 사진이 따라 바뀌지는 않는다.

그래서 GitHub `dev`가 최신이라고 해서, Neon `preview/dev`의 DB 구조까지 자동으로 최신인 것은 아니다.

## Migration은 무엇이었나

DB 구조는 코드와 별개로 관리된다. 기능을 추가하다 보면 테이블 추가, 컬럼 추가, CHECK 제약조건 변경, INDEX 추가, 외래키 변경 같은 일이 생기는데, 이 변경 내용을 SQL 파일로 기록해 둔 것이 Migration이다.

```text
db/migrations/
├── 0001_push_subscriptions.sql
├── 0002_notices.sql
├── 0003_email_verifications.sql
├── ...
├── 0010_facility_inspection_status.sql
└── 0011_manual_warning_types.sql
```

여기서 놓치고 있던 점이 하나 있었다.

```text
Migration 파일이 GitHub에 merge됨
            ≠
실제 PostgreSQL DB가 변경됨
```

파일이 저장소에 있다고 DB에 자동으로 적용되는 게 아니라, 대상 DB에 Migration을 실행하는 과정이 따로 필요하다. Vercel의 Neon Integration은 배포마다 `Create database branch for deployment`로 Preview용 DB 브랜치를 만들어주지만, 그 브랜치에 최신 Migration까지 알아서 적용해주지는 않았다.

## 직접 해보기

### 1. 바로 고치지 않고 상태부터 확인했다

먼저 `preview/dev`에 어떤 Migration이 적용되어 있는지만 조회했다. 이 명령은 DB를 바꾸지 않는다.

이때 로컬 `.env.local`을 그대로 쓰지 않고, `preview/dev` 전용 임시 환경변수 파일을 따로 만들었다.

```env
DATABASE_URL=<preview/dev pooled connection string>
DATABASE_URL_UNPOOLED=<preview/dev direct connection string>
```

> Connection String에는 DB 비밀번호가 포함되므로 GitHub, 블로그, 채팅 등에 올리면 안 된다. 작업이 끝나면 임시 파일도 지워야 한다.

```bash
node --env-file="$TEMP/preview-dev.env" scripts/db-migrate-status.mjs
```

결과는 이랬다.

```text
적용됨  0001_push_subscriptions.sql
적용됨  0002_notices.sql
적용됨  0003_email_verifications.sql
적용됨  0004_notification_notice_link.sql
적용됨  0005_report_evidence.sql

미적용  0006_machine_inspection_status.sql
미적용  0007_retention_indexes.sql
미적용  0008_warning_usage_history_ref.sql
미적용  0010_facility_inspection_status.sql
미적용  0011_manual_warning_types.sql
```

저장소에는 Migration이 10개 있는데 Preview DB에는 5개만 적용된 상태였다. 그리고 `facility_status`를 만드는 Migration이 미적용 목록 안에 있었다.

```text
0010_facility_inspection_status.sql
```

증상과 원인이 여기서 정확히 맞아떨어졌다.

### 2. 대상 DB를 명시적으로 지정했다

가장 위험했던 부분이다. 로컬 `.env.local`이 Neon `main`을 가리키는 상태에서 무심코 아래 명령을 실행하면, 고치려던 `preview/dev`가 아니라 다른 DB에 Migration이 적용될 수 있다.

```bash
npm run db:migrate
```

Git 브랜치를 바꾸는 것과 DB 연결 대상은 아무 관계가 없다.

```text
git switch dev   →  코드 브랜치만 바뀜
DATABASE_URL     →  실제로 연결되는 DB를 결정
```

그래서 실행할 때도 상태 확인과 똑같이 대상 DB를 명시했다.

```bash
node --env-file="$TEMP/preview-dev.env" scripts/db-migrate.mjs
```

### 3. 누락된 Migration만 적용됐는지 확인했다

이미 적용된 것은 건너뛰고 누락된 5개만 순서대로 적용됐다.

```text
건너뜀  0001_push_subscriptions.sql
...
건너뜀  0005_report_evidence.sql

적용   0006_machine_inspection_status.sql
적용   0007_retention_indexes.sql
적용   0008_warning_usage_history_ref.sql
적용   0010_facility_inspection_status.sql
적용   0011_manual_warning_types.sql

마이그레이션 5개를 적용했습니다.
```

그 다음 다시 `db-migrate-status.mjs`를 실행해서 저장소의 Migration과 DB의 상태가 일치하는지 검증했다.

### 4. 재배포 없이 기존 Preview를 다시 확인했다

코드는 원래부터 최신이었으므로 Vercel을 새로 배포하지 않고 기존 `dev` Preview를 그대로 확인했다.

```text
Before                      After

/api/machines → 500         /api/machines → 200
                            /api/queue    → 200
```

홈 화면에서도 세탁기/건조기 정보가 정상적으로 표시됐다. 결국 바뀐 건 코드가 아니라 DB 스키마의 버전뿐이었다.

```text
Before                        After

GitHub dev        최신 ✅     GitHub dev        최신 ✅
Vercel Preview    최신 ✅     Vercel Preview    최신 ✅
Neon preview/dev  구버전 ❌   Neon preview/dev  최신 ✅
```

## 헷갈렸던 점

가장 헷갈렸던 건 "지금 내가 어떤 DB를 보고 있는가"였다. 코드 브랜치와 DB 브랜치, 그리고 조회 명령과 변경 명령을 구분하고 나니 정리가 됐다.

| 헷갈렸던 것 | 실제 |
|------|------|
| `git switch dev`를 하면 DB도 `preview/dev`가 된다 | 코드 브랜치만 바뀐다. DB는 `DATABASE_URL`이 결정한다 |
| Migration 파일이 merge되면 DB에도 반영된다 | 파일 존재와 DB 적용은 별개다 |
| `db:migrate:status`와 `db:migrate`는 비슷한 명령이다 | `status`는 조회(DB 변경 없음), `migrate`는 변경(DB 변경 있음) |
| Preview가 500이면 프론트/API 코드 문제다 | 스키마 불일치일 수 있다. 로그의 에러 코드부터 본다 |

`Reset from parent`를 바로 누르지 않은 것도 같은 맥락이었다. `preview/dev`를 부모 `main` 기준으로 Reset하면 스키마는 맞출 수 있지만, Preview DB에 쌓아둔 테스트 데이터나 변경사항까지 덮어쓸 수 있다. DB 작업에서는 "일단 초기화"보다 **현재 상태를 먼저 확인하고 필요한 변경만 적용하는 것**이 안전하다고 느꼈다.

## 앞으로의 절차

`db/migrations/*.sql`이 추가되거나 수정된 PR을 `dev`에 merge했다면, 아래 순서를 확인하기로 했다.

```text
1. feature → dev merge
2. dev 최신화
3. Neon preview/dev 대상으로 db:migrate:status
4. 미적용 Migration 확인
5. 대상 DB가 preview/dev가 맞는지 다시 확인
6. db:migrate
7. 다시 db:migrate:status
8. Vercel dev Preview 테스트
```

DB 구조를 건드리지 않는 UI 수정이나 로직 변경 PR이라면 새 Migration이 없을 수도 있다. 그래도 `dev` 통합 후 `db:migrate:status`만 한 번 돌려두면 환경 불일치를 일찍 발견할 수 있다.

`dev`를 `main`으로 반영할 때도 같은 과정을 Neon `main`을 대상으로 생각해야 한다. 다만 Production은 Preview보다 훨씬 신중해야 하고, Pending Migration 검토와 백업/롤백 전략 확인이 먼저다. `preview/dev`에 쓰던 Connection String을 그대로 쓰거나 그 반대가 되지 않도록 주의해야 한다.

한 문장으로 줄이면 이렇다.

> `db:migrate:status`는 자주 확인하고, `db:migrate`는 Pending Migration이 있을 때만 대상 DB를 확인하고 실행한다.

## 다음에 같은 오류를 만나면

`relation "xxx" does not exist`, `column "xxx" does not exist`, 제약조건 관련 오류가 Preview에서만 발생하면 아래 순서로 확인할 예정이다.

- [ ] Vercel Function Log에서 실제 에러 메시지와 코드 확인
- [ ] Preview가 연결된 Neon branch 확인
- [ ] GitHub의 최신 Migration 파일 확인
- [ ] 해당 Neon branch 대상으로 `db:migrate:status` 실행
- [ ] Pending Migration 확인
- [ ] 실행 직전에 대상 DB 다시 확인
- [ ] 필요한 Migration만 적용
- [ ] 다시 `db:migrate:status`로 검증
- [ ] Preview API와 실제 UI까지 동작 확인
- [ ] 임시 DB Connection String 파일 삭제

## 더 학습하면 좋은 개념

- **배포 단계에서 Migration 자동 실행** — 이번엔 수동으로 적용했다. 빌드/배포 과정에 Migration을 넣으면 같은 문제가 반복되지 않을 것 같은데, 실패 시 배포를 어떻게 처리할지는 아직 모른다.
- **Neon GitHub Actions** — 브랜치 생성/삭제/reset을 자동화할 수 있다고 한다. Preview 환경을 PR 단위로 관리할 때 필요할 것 같다.
- **Schema diff와 Reset from parent** — 두 DB 브랜치의 스키마 차이를 비교하는 방법. 이번처럼 "어디가 다른지"를 확인할 때 유용해 보인다.
- **Production Migration 롤백 전략** — 적용은 해봤지만 되돌리는 방법은 아직 안 해봤다. down migration이나 백업 시점 복구를 확인해야 한다.
- **Migration 도구** — 지금은 직접 만든 스크립트로 관리 중인데, Drizzle Kit이나 Prisma Migrate 같은 도구가 상태 관리를 어떻게 하는지 비교해보고 싶다.

## 참고 자료

- [Get started with branching - Neon Docs](https://neon.com/docs/guides/branching-intro)
- [The Neon-Managed Vercel Integration - Neon Docs](https://neon.com/docs/guides/neon-managed-vercel-integration)
- [Reset from parent - Neon Docs](https://neon.com/docs/guides/reset-from-parent)
- [Appendix A. PostgreSQL Error Codes](https://www.postgresql.org/docs/current/errcodes-appendix.html)