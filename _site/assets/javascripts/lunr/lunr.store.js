var store = [{
        "title": "2026-08-28 배웠던 Git 정리",
        "excerpt":"오늘 배운 것 Git은 저장 지점을 남기고 되돌릴 수 있게 해주는 도구다. 커밋까지의 세 단계 단계 명령 하는 일 1 git add 커밋에 담을 것을 고른다 2 git commit 고른 것을 한 덩어리로 기록한다 3 git push 기록을 GitHub로 올린다 가장 헷갈렸던 건 add와 commit이 왜 나뉘어 있는가였다.파일을 두 개...","categories": ["개념"],
        "tags": ["git"],
        "url": "http://localhost:4000/my-blog/%EA%B0%9C%EB%85%90/2026/08/28/git-github.html"
      },{
        "title": "마크다운 문법 정리",
        "excerpt":"제목은 # 갯수로 단계를 만들 수 있다. # 갯수에 따라 글씨가 점점 작아진다. 굵은 글씨 쓰거나 기울여 쓸 수 있다. 순서가 없는 목록 만들기 첫 번째 두 번째 세 번째 네 번째 4-1. 번째 순서가 있는 목록 하나 둘 셋링크를 첨부하는 방법 네이버이미지를 첨부하는 방법 인용하는 구문은 꺽쇠로 만든다.남의 말이나...","categories": ["개념"],
        "tags": ["마크다운"],
        "url": "http://localhost:4000/my-blog/%EA%B0%9C%EB%85%90/2026/08/28/markdown.html"
      },{
        "title": "브랜치와 merge, 그리고 충돌(conflict) 해결하기",
        "excerpt":"지난번에 브랜치를 만들고 merge로 합치는 것까지 배웠다.그런데 두 브랜치에서 같은 부분을 서로 다르게 고쳤다면 어떻게 될까?이번 글에서는 그 상황, 즉 충돌(conflict)이 생겼을 때 어떻게 해결하는지 정리해본다. 먼저, 충돌이 없는 merge 복습 브랜치는 원래 줄기에서 갈라져 나온 또 다른 줄기이고,merge는 그 갈라진 줄기를 다시 하나로 합치는 것이었다. gitGraph commit id: \"main...","categories": ["개념"],
        "tags": ["브랜치","merge","conflict"],
        "url": "http://localhost:4000/my-blog/%EA%B0%9C%EB%85%90/2026/08/31/branch-merge-conflict-solve.html"
      },{
        "title": "브랜치로 작업하고 Merge까지, 흐름과 방식 정리하기",
        "excerpt":"들어가며 (Situation) 브랜치를 만들어서 작업하는 것까지는 익숙해졌지만,막상 git merge를 실행할 때마다 “지금 fast-forward인지, 3-way merge인지,아니면 squash를 써야 하는지”가 헷갈렸다.merge 명령어 하나에도 여러 방식이 섞여 있다는 걸 알고, 개념부터 정리해보기로 했다. 문제 상황 (Task) 정리가 필요했던 부분은 크게 두 가지였다. 브랜치 생성부터 merge까지의 기본 흐름을 순서대로 설명할 수 있는가 merge 방식(fast-forward...","categories": ["개념"],
        "tags": ["branch","merge"],
        "url": "http://localhost:4000/my-blog/%EA%B0%9C%EB%85%90/2026/08/31/git-branch-merge-guide.html"
      },{
        "title": "잦은 merge 충돌 문제, 브랜치 전략 비교로 실마리 찾기",
        "excerpt":"들어가며 (Situation) 팀원들과 함께하는 다른 프로젝트에서 Git을 사용하고 있었다.브랜치를 어떻게 쓸지에 대한 규칙은 따로 정하지 않은 채,그때그때 편한 방식으로 작업해왔다. 문제 상황 (Task) merge를 할 때마다 충돌이 잦았다.돌이켜보면 팀 안에서 두 가지 방식을 섞어서 쓰고 있었다. main에 바로 커밋하기: 작은 수정은 브랜치를 만들지 않고 바로 main에 커밋 기능별 브랜치 만들기:...","categories": ["개념"],
        "tags": ["branch","workflow","merge"],
        "url": "http://localhost:4000/my-blog/%EA%B0%9C%EB%85%90/2026/08/31/git-branch-strategy-comparison.html"
      },{
        "title": "혼자 하던 커밋을 팀 작업으로 — commit, push, pull, PR 정리",
        "excerpt":"아래 예시는 실제 프로젝트가 아니라, 개념을 설명하기 위해 임의로 만든 예시 상황입니다. 들어가며 (Situation) 혼자 블로그 저장소에 git add → git commit → git push만 반복하다가,“팀원이 생기면 이 순서만으로는 부족하다”는 걸 알게 됐다.예를 들어 두 명이 같은 저장소에서 각자 다른 기능을 작업한다고 가정해보자. 나는 main 브랜치에서 바로 작업하고 있었다. 팀원...","categories": ["개념"],
        "tags": ["commit","pull-request"],
        "url": "http://localhost:4000/my-blog/%EA%B0%9C%EB%85%90/2026/08/31/git-commit-push-pull-pr.html"
      },{
        "title": "이번 주에 배운 Git·GitHub 명령어 정리",
        "excerpt":"이번 주에는 나만의 폴더를 버전 관리가 되는 저장소로 만들고,바꾼 내용을 기록하고, GitHub에 올리고 받아오는 법까지 배웠다.배운 순서대로 하나씩 정리해본다. 전체 그림부터 보기 Git은 파일이 이동하는 “공간”이 여러 개 있다고 생각하면 이해가 쉽다. flowchart LR A[작업 폴더\\n파일을 고치는 곳] -- 스테이징 --&gt; B[Staging Area\\n커밋할 것을 모아두는 곳] B -- 커밋 --&gt;...","categories": ["개념"],
        "tags": ["git","github","정리"],
        "url": "http://localhost:4000/my-blog/%EA%B0%9C%EB%85%90/2026/08/31/git-github-command-study.html"
      }]
