# 블로그 정리 + 새 테마 적용 가이드

## 0. 먼저 오해 하나 풀기

첨부한 스크린샷에서 `git-github.html`, `markdown.html` 같은 파일이 보여서 "글이 HTML로 올라가고 있나?" 싶으셨을 텐데,
그 파일들은 전부 **`_site/` 폴더 안**에 있습니다. `_site`는 Jekyll이 마크다운을 읽어서 **자동으로 만들어내는 빌드 결과물**입니다.

즉 지금도 글은 이미 마크다운(`_posts/*.md`)으로 잘 작성되고 있습니다.
`_site`는 지우고 `.gitignore`에 넣어두면 그만입니다. (GitHub Pages가 서버에서 다시 만들어 줍니다.)

---

## 1. 지울 것 / 남길 것

| 파일·폴더 | 처리 | 이유 |
|---|---|---|
| `_site/` | **삭제 + gitignore** | 빌드 결과물. 커밋하면 매번 수백 줄 diff가 생깁니다 |
| `.jekyll-cache/` | **삭제 + gitignore** | 로컬 캐시 |
| `cacert.pem` (루트) | **삭제 + gitignore** | 윈도우 SSL 오류 때문에 받아둔 인증서. 저장소에 있을 필요 없음 |
| `_site/cacert.pem`, `_site/CLAUDE.md` | 삭제 | `_site` 지우면 같이 사라짐 |
| `_data/theme.yml` | **삭제** | `basically-basic` 원격 테마 전용 설정. 새 테마에서는 안 씁니다 |
| `Gemfile.lock` | gitignore | GitHub Pages 서버 환경과 충돌할 수 있음 |
| `.claude/`, `CLAUDE.md` | 로컬에만 두고 gitignore | 커밋해도 되지만 공개 저장소라면 정리 추천 |
| `_posts/*.md` | **유지** | 실제 글. 그대로 씁니다 |
| `index.md`, `archive.md`, `tags.md`, `concept.md`, `trouble.md` | **교체** | 새 테마용으로 앞머리만 바뀝니다 |

### 명령어

```bash
cd my-blog

# 1) 추적 중인 빌드 결과물 제거 (로컬 파일도 함께 삭제)
git rm -r --cached _site .jekyll-cache
rm -rf _site .jekyll-cache

# 2) 필요 없는 파일 제거
git rm --cached cacert.pem
rm -f cacert.pem
git rm _data/theme.yml

# 3) .gitignore 추가 후 커밋
git add .gitignore
git commit -m "chore: 빌드 결과물과 불필요한 파일 정리"
```

---

## 2. 새 테마 적용

이 폴더의 파일을 `my-blog/` 안에 그대로 덮어쓰면 됩니다.

```
my-blog/
├── _config.yml          ← 교체
├── .gitignore           ← 신규
├── Gemfile              ← 교체
├── _data/categories.yml ← 신규 (theme.yml은 삭제)
├── _layouts/            ← default, home, post, page, category, archive, tags
├── _includes/           ← head, header, footer, heatmap, post-card
├── assets/css/theme.css
├── assets/js/blog.js
└── index.md / archive.md / tags.md / concept.md / trouble.md
```

`_config.yml`에서 `remote_theme`과 `jekyll-remote-theme` 플러그인이 빠졌습니다.
이제 레이아웃이 전부 내 저장소 안에 있으니 **디자인을 마음대로 고칠 수 있습니다.**

색·모양은 거의 전부 `assets/css/theme.css` 맨 위 CSS 변수에 모여 있습니다.

```bash
git add .
git commit -m "feat: 커스텀 테마 적용"
git push
```

푸시 후 1~2분 뒤 https://jhee0209.github.io/my-blog 에서 확인하세요.

---

## 3. 스킨 두 가지

`_config.yml` 한 줄만 바꾸면 분위기가 통째로 바뀝니다.

```yaml
skin: default   # 카카오 기술블로그 같은 흰 배경 + 보라 포인트
skin: forest    # 동물의 숲 같은 크림색 종이 + 초록 포인트, 둥근 모서리
```

`forest`에서는 잔디 칸이 동그라미로 바뀌고 모서리 반경이 커집니다.
둘 다 켜본 다음 마음에 드는 쪽으로 두세요.

---

## 4. 글 쓰는 방법

`_posts/2026-08-31-git-branch-strategy.md` 처럼 **`날짜-영문제목.md`** 로 만듭니다.
파일명은 영문·숫자·하이픈만 쓰는 걸 권합니다. (한글이면 URL이 `%EA%B0%9C...` 로 깨져 보입니다.)

````markdown
---
title: "Git 브랜치 전략 비교"
date: 2026-08-31 21:00:00 +0900
categories: [concept]     # concept | trouble | project | retrospect
tags: [git, branch, 협업]
---

## 왜 필요한가

본문은 여기부터 마크다운으로 씁니다.

```bash
git switch -c feature/login
```
````

- `categories`는 **영문 한 개**만 쓰세요. `/concept/`, `/trouble/` 페이지에 자동으로 모입니다.
  화면에 보이는 한글 이름은 `_data/categories.yml`에서 바꿉니다.
- `tags`는 한글도 괜찮습니다. 태그 페이지가 자동 생성됩니다.
- 기존 글에 `categories: [개념]` 처럼 한글이 들어가 있으면 `[concept]`로 바꿔 주세요.

---

## 5. 누적 방문자 수 붙이기

GitHub Pages는 정적 사이트라서 서버가 없습니다. 그래서 외부 카운터 서비스를 씁니다.

> 참고: 국내 블로그 글에 많이 나오는 `hits.seeyoufarm.com`은 **서비스가 종료됐습니다.**
> 그 방법을 따라 하면 배지가 깨진 이미지로 나옵니다.

### 추천: GoatCounter (무료, 개인 블로그는 제한 없음)

1. https://www.goatcounter.com 에서 회원가입하고 코드(주소)를 정합니다. 예: `zoohi-study`
2. 설정에서 **"Allow using the API / public counter"** (사이트 설정 → *Allow adding visitor counts to your website*) 를 켭니다.
3. `_config.yml`에 코드를 넣습니다.

```yaml
goatcounter: "zoohi-study"
```

이렇게만 하면 페이지 상단 기록 카드에 **누적 방문** 숫자가 자동으로 채워집니다.
비워두면 그 칸이 아예 표시되지 않습니다.

### 더 간단한 대안

배지 이미지 하나로 끝내고 싶으면 `https://hits.sh` 나 `https://hitscounter.dev` 에서
URL을 넣고 받은 `<img>` 태그를 `_includes/footer.html`에 붙이면 됩니다. 정확도는 낮습니다.

---

## 6. 글 쓴 날 보여주기 (잔디)

메인 상단의 잔디는 **외부 서비스 없이** 동작합니다.
`_posts` 안 글들의 날짜를 읽어서 최근 6개월치를 그립니다. 별도 설정이 필요 없습니다.

- 칸 색: 그날 쓴 글이 0 / 1 / 2 / 3개 이상
- 옆 숫자: 쓴 글 수, 기록한 날 수, 누적 방문
- 기간을 바꾸려면 `assets/js/blog.js` 맨 위 `var WEEKS = 27;` 을 조정하세요. (52 = 1년)

---

## 7. 댓글 (선택)

GitHub Issues를 댓글로 쓰는 utterances입니다.

1. https://github.com/apps/utterances 에서 `my-blog` 저장소에 설치
2. `_config.yml`:

```yaml
comments:
  repo: "JHee0209/my-blog"
```

---

## 8. 로컬에서 미리 보기

```bash
bundle install
bundle exec jekyll serve --livereload
# http://127.0.0.1:4000/my-blog/
```

`bundle install`이 SSL 오류로 막히면 (윈도우에서 자주 납니다):

```bash
bundle config set --local ssl_ca_cert /경로/cacert.pem
```

인증서 파일은 저장소 안이 아니라 **저장소 밖**에 두세요.
