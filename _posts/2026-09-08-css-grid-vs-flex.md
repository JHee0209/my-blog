---
layout: post
title: "grid는 왜 필요할까 — flex와 언제 다르게 쓸지 정리"
date: 2026-09-08 23:53:42 +0900
categories: [개념]
tags: [CSS, grid, layout]
snippet: |
  .container {
    display: grid;
    grid-template-columns: 100px 100px 100px;
    gap: 10px;
  }
---

flex만으로는 가로세로를 동시에 짜는 레이아웃이 번거로웠는데, grid를 쓰면 이 문제가 해결된다.

## 이게 없으면 뭐가 불편할까

flex는 [주축(main axis) 하나의 방향으로만 아이템을 정렬한다]({{ site.baseurl }}{% post_url 2026-09-08-css-flexbox-justify-align %}). 그래서 가로 한 줄, 세로 한 줄을 정렬하는 데는 강하다.

문제는 헤더, 사이드바, 본문, 푸터처럼 가로 방향과 세로 방향을 동시에 맞춰야 하는 전체 페이지 레이아웃이다. flex만 쓰면 컨테이너 안에 컨테이너를 계속 중첩하고, `flex-direction`을 번갈아 바꿔가면서 짜야 한다. 이럴 때 grid는 한 컨테이너 안에서 가로줄과 세로줄을 한 번에 정의할 수 있다.

## 한 문장으로 말하면

grid는 컨테이너를 가로줄(row)과 세로줄(column)로 동시에 나눠서, 아이템을 그 격자 칸에 배치하는 레이아웃 방식이다.

MDN은 이렇게 설명한다.

> CSS grid layout introduces a two-dimensional grid system to CSS. Grids can be used to lay out major page areas or small user interface elements.

flex와 grid의 가장 큰 차이도 여기 있다. flex는 한 방향(1차원)만 다루고, grid는 가로세로(2차원)를 동시에 다룬다.

grid는 달력과 비슷하다. 몇 월 며칠 칸에 일정을 넣을지 정하는 것처럼, grid도 몇 번째 줄 몇 번째 칸에 아이템을 놓을지 정한다. 다만 실제 달력은 모든 칸 크기가 똑같지만, grid는 칸마다 크기(고정값, 비율 등)를 자유롭게 다르게 정할 수 있다는 점이 다르다.

## 직접 해보기

*(아직 직접 써본 코드가 없어서, 이해를 위한 예시 코드로 만들었다.)*

```html
<div class="container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 100px 100px 100px;
  gap: 10px;
}
```

`grid-template-columns: 100px 100px 100px;`는 100px짜리 세로줄(열) 3개를 만든다는 뜻이다. 아이템 1, 2, 3은 첫 번째 가로줄(행)의 세 칸에 순서대로 들어간다. 4번째 아이템은 3칸을 다 채우고 나면 자동으로 다음 줄로 넘어가서, 두 번째 줄 첫 칸에 놓인다.

`gap`은 칸과 칸 사이 간격을 준다. flex에서 배운 `gap`과 같은 속성이다.

칸 너비를 매번 픽셀로 고정하는 대신, 아래처럼 `fr`(fraction, 남는 공간을 비율로 나누는 단위) 단위를 쓰면 컨테이너 크기에 맞게 유연하게 늘어난다.

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}
```

세 열이 컨테이너 너비를 똑같이 3등분해서 차지한다.

## 헷갈렸던 점

가장 헷갈렸던 건 "flex랑 grid 중에 언제 뭘 써야 하나"였다. 둘 다 레이아웃을 잡는 속성이라 구분이 잘 안 됐는데, 기준은 **몇 차원을 다루느냐**였다.

| 상황 | 추천 |
|------|------|
| 한 방향(가로 또는 세로)으로만 나열 (네비게이션 메뉴, 버튼 그룹) | flex |
| 가로세로를 동시에 짜야 하는 전체 레이아웃 (헤더/사이드바/본문/푸터) | grid |
| 아이템 개수가 자주 바뀌고, 줄바꿈만 자연스럽게 되면 되는 경우 | flex (`flex-wrap`) |
| 특정 아이템을 정확히 몇 번째 줄, 몇 칸에 배치해야 하는 경우 | grid |

MDN도 "grid layout and flexbox can be combined for responsive, flexible, and accessible layouts"라고 안내한다. 즉 하나만 써야 하는 게 아니라, 전체 페이지 뼈대는 grid로 짜고, 그 안의 버튼 줄이나 네비게이션처럼 한 방향 정렬이 필요한 부분은 flex로 짜는 식으로 같이 쓸 수 있다.

## 더 학습하면 좋은 개념

- **grid-template-rows** — 이번엔 열(column)만 정의해봤다. 행(row)의 높이도 직접 정하는 방법을 아직 안 써봤다.
- **grid-template-areas** — 칸 이름을 정해서 "헤더", "사이드바"처럼 영역으로 배치하는 방법이 있다고 들었다. 페이지 전체 레이아웃을 짤 때 유용할 것 같다.
- **repeat() 함수** — `1fr 1fr 1fr`처럼 반복되는 값을 `repeat(3, 1fr)`로 줄여 쓰는 방법. 열이 많아지면 필요할 것 같다.
- **grid-column, grid-row로 아이템 크기 지정하기** — 특정 아이템이 2칸을 차지하게 만드는 방법. 아직 직접 해보지 않았다.

## 참고 자료

- [Basic concepts of grid layout - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Basic_concepts_of_grid_layout)
