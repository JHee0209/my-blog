---
layout: post
title: "Migration은 왜 필요할까 — DB 구조를 코드처럼 관리하기"
date: 2026-09-19 22:30:00 +0900
categories: [개념]
tags: [database, migration, PostgreSQL, SQL]
snippet: |
  -- db/migrations/0012_machine_memo.sql
  ALTER TABLE machines
    ADD COLUMN memo TEXT;
---

코드는 Git으로 버전을 관리하는데 DB 구조는 그렇지 않아서 환경마다 상태가 달라지는 문제가 있었는데, Migration을 쓰면 이 문제가 해결된다.

## 이게 없으면 뭐가 불편할까

코드는 파일이라서 `git pull` 한 번이면 모두 같은 상태가 된다. 하지만 DB는 이미 데이터를 담고 있는 상태이기 때문에 파일처럼 덮어쓸 수가 없다. 기존 데이터를 그대로 두면서 구조만 바꿔야 한다.

그래서 Migration 없이 DB를 관리하면 이런 일이 생긴다.

```text
나:     로컬 DB에 직접 ALTER TABLE 실행 → 잘 됨
팀원:   최신 코드를 받았는데 그 컬럼이 없음 → 에러
배포:   배포 서버 DB도 그 컬럼이 없음 → 에러
```

문제는 세 가지다.

- **공유가 안 된다.** 내가 DB 콘솔에서 직접 실행한 SQL은 나만 알고 있다.
- **재현이 안 된다.** 새로 합류한 사람이 빈 DB에서 시작하면, 지금 구조를 만들기까지 무엇을 어떤 순서로 실행해야 하는지 알 수 없다.
- **순서와 기록이 없다.** "언제 무엇을 왜 바꿨는지"가 남지 않는다.

코드는 커밋으로 변경 이력이 남는데, DB 구조만 이력이 없는 상태가 되는 것이다.

## 한 문장으로 말하면

Migration은 DB 구조의 변경을 SQL 파일로 하나씩 기록해두고, 정해진 순서대로 적용하면서 어디까지 적용했는지 DB 안에 추적하는 방식이다.

Prisma 문서는 이렇게 설명한다.

> Migrations help you transition your database schema from one state to another.

즉 Migration은 "완성된 최종 구조"를 적어둔 게 아니라, **한 상태에서 다음 상태로 넘어가는 변경분**을 적어둔 것이다.

Migration은 조립 가구 설명서와 비슷하다. 완성품 사진만 주면 이미 절반쯤 조립한 사람은 어디를 더 해야 할지 알 수 없다. 하지만 1번부터 번호가 붙은 설명서를 주면, 몇 번까지 했는지 확인하고 그 다음 장부터 이어서 진행할 수 있다. Migration도 마찬가지로 번호 순서대로 쌓이고, 각 DB는 자기가 몇 번까지 적용했는지 기억한다.

그래서 Migration에는 보통 세 가지 규칙이 따라온다.

| 규칙 | 이유 |
|------|------|
| 파일에 번호(또는 타임스탬프)를 붙인다 | 적용 순서가 결과를 바꾸기 때문 |
| 이미 적용된 파일은 수정하지 않는다 | 남들은 이미 그 버전을 적용했기 때문 |
| 적용 이력을 DB 안에 기록한다 | 어디까지 적용됐는지 DB 스스로 알아야 하기 때문 |

## 직접 해보기

*(구조 이해를 위해 단순화한 예시다.)*

기기 테이블에 메모 컬럼을 추가한다고 하면, DB 콘솔에서 직접 실행하는 대신 파일로 남긴다.

```sql
-- db/migrations/0012_machine_memo.sql
ALTER TABLE machines
  ADD COLUMN memo TEXT;
```

이 파일은 코드와 함께 커밋해서 올린다. 이 시점에서는 아직 어떤 DB도 바뀌지 않았다.

```text
db/migrations/
├── 0010_facility_inspection_status.sql
├── 0011_manual_warning_types.sql
└── 0012_machine_memo.sql   ← 새로 추가
```

적용 전에 먼저 상태를 조회한다. 이 명령은 DB를 바꾸지 않는다.

```bash
npm run db:migrate:status
```

```text
적용됨  0010_facility_inspection_status.sql
적용됨  0011_manual_warning_types.sql
미적용  0012_machine_memo.sql
```

그 다음 실제로 적용한다.

```bash
npm run db:migrate
```

```text
건너뜀  0010_facility_inspection_status.sql
건너뜀  0011_manual_warning_types.sql
적용   0012_machine_memo.sql
```

여기서 "건너뜀"이 나오는 이유는, DB 안에 적용 이력을 저장하는 테이블이 따로 있기 때문이다. 이름은 도구마다 다르지만(`schema_migrations` 같은 이름을 많이 쓴다), 역할은 같다.

```text
DB 안의 이력 테이블
0010  적용 완료
0011  적용 완료
```

Migration 도구는 실행할 때마다 이 테이블과 `db/migrations/` 폴더의 파일 목록을 비교해서, **아직 기록에 없는 파일만** 순서대로 실행한다. 그래서 같은 명령을 여러 번 실행해도 같은 SQL이 두 번 실행되지 않는다.

## 언제 해야 할까

헷갈렸던 게 "언제 Migration 파일을 만들어야 하고, 언제 실행해야 하나"였다. 이건 두 개의 다른 질문이었다.

**만드는 시점**은 DB의 구조를 바꾸는 코드를 작성할 때다. 구조를 바꾸는지 아닌지로 구분하면 된다.

| 상황 | Migration 필요? |
|------|------|
| 테이블 추가/삭제, 컬럼 추가/삭제 | 필요 |
| CHECK 제약조건, 외래키, INDEX 변경 | 필요 |
| 컬럼 타입이나 NOT NULL 변경 | 필요 |
| 기존 테이블을 조회하는 쿼리만 수정 | 불필요 |
| UI나 API 로직만 수정 | 불필요 |
| 데이터 몇 건을 직접 수정 | 불필요 (구조가 아니라 데이터라서) |

**실행하는 시점**은 그 코드가 실제로 돌아가는 환경마다 따로다. 파일을 만든 것과 적용한 것은 별개라서, DB가 여러 개면 각각 적용해야 한다.

```text
로컬 DB          → 기능 개발하면서 적용
Preview DB       → dev에 merge한 뒤 적용
Production DB    → main에 반영해서 배포할 때 적용
```

중요한 건 순서다. 최신 코드는 새 컬럼을 사용하는데 DB에 그 컬럼이 없으면 그 순간 에러가 난다. 그래서 **DB를 먼저 최신으로 만들고 코드를 배포하는 쪽**이 대체로 안전하다. (컬럼을 삭제하는 경우는 반대로, 코드에서 먼저 안 쓰게 만든 다음 지워야 한다.)

실제로 이 순서가 어긋나서 Preview 환경만 500이 났던 기록은 [따로 정리해뒀다]({{ site.baseurl }}{% post_url 2026-09-19-vercel-preview-neon-migration-mismatch %}).

## 헷갈렸던 점

| 헷갈렸던 것 | 실제 |
|------|------|
| Migration 파일을 merge하면 DB도 바뀐다 | 파일은 코드일 뿐이다. 대상 DB에 실행해야 바뀐다 |
| 코드 브랜치를 바꾸면 연결 DB도 따라 바뀐다 | DB는 `DATABASE_URL` 같은 연결 정보가 결정한다 |
| 구조를 바꾸려면 이미 만든 파일을 고치면 된다 | 남들은 이미 그 파일을 적용했다. 수정 대신 새 번호의 파일을 추가한다 |
| `db:migrate:status`와 `db:migrate`는 비슷하다 | `status`는 조회(변경 없음), `migrate`는 실제 DB 변경 |
| Migration은 한 번 만들어두면 알아서 유지된다 | 환경마다 따로 적용된다. 새 DB를 만들면 처음부터 다시 적용해야 한다 |

특히 마지막 항목이 감이 잘 안 왔는데, 반대로 생각하니 이해가 됐다. Migration이 1번부터 순서대로 다 있으면, 빈 DB에 전부 실행하는 것만으로 지금과 똑같은 구조를 만들 수 있다. 그게 Migration을 순서대로 쌓아두는 이유이기도 하다.

## 더 학습하면 좋은 개념

- **롤백(down migration)** — 적용한 Migration을 되돌리는 방법. 적용만 해봤고 되돌려본 적은 없다. 되돌릴 수 없는 변경(컬럼 삭제 등)은 어떻게 하는지 아직 모른다.
- **데이터 Migration** — 구조가 아니라 기존 데이터 자체를 바꾸는 경우. 예를 들어 컬럼을 둘로 쪼개면서 기존 값을 옮겨야 할 때가 있다고 한다.
- **무중단 배포와 호환성** — 컬럼 삭제나 이름 변경을 한 번에 하면 배포 중에 에러가 난다고 들었다. 여러 단계로 나눠서 적용하는 패턴이 있다고 한다.
- **Migration 도구** — 지금은 직접 만든 스크립트를 쓰는데, Drizzle Kit이나 Prisma Migrate가 파일 생성과 이력 관리를 어떻게 하는지 비교해보고 싶다.
- **seed 데이터** — 구조를 만든 뒤 초기 데이터를 넣는 과정. Migration과 어떻게 구분해서 관리하는지 아직 안 써봤다.

## 참고 자료

- [Understanding Migrations - Prisma Docs](https://www.prisma.io/docs/orm/prisma-migrate/understanding-prisma-migrate/mental-model)
- [ALTER TABLE - PostgreSQL Documentation](https://www.postgresql.org/docs/current/sql-altertable.html)