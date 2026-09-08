---
layout: post
title: "flex 정렬과 줄바꿈 — justify-content, align-items, flex-wrap"
date: 2026-09-08 22:23:22 +0900
categories: [개념]
tags: [CSS, flex, wrap]
snippet: |
  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
---

flex에서 justify-content와 align-items를 언제 써야 할지 헷갈렸는데, 알고 보니 둘이 정렬하는 축이 다르다는 게 핵심이었다.

## 이게 없으면 뭐가 불편할까

지금까지 배운 block, inline만으로는 요소들을 가로로 나란히 놓거나 화면 가운데로 정렬하는 게 번거로웠다. `display: flex`를 쓰면 컨테이너 안의 요소들을 한 방향으로 줄 세우고, 남는 공간을 자동으로 배분할 수 있다.

문제는 정렬을 담당하는 속성이 `justify-content`와 `align-items` 두 개로 나뉘어 있다는 거였다. 둘 다 이름에 "정렬"이 들어가 있어서, 언제 뭘 써야 하는지 기준이 없으면 그냥 아무거나 써보고 되는 쪽을 쓰게 된다.

## 한 문장으로 말하면

flex는 컨테이너 안 요소들을 한 방향으로 정렬하는 레이아웃 방식이고, 그 방향을 기준으로 "주축"과 "교차축"이라는 두 개의 축이 생긴다.

정확히는, `display: flex`를 준 요소(컨테이너) 안에서 `flex-direction`이 정한 방향이 **주축(main axis)**이 되고, 그와 수직인 방향이 **교차축(cross axis)**이 된다. `justify-content`는 주축을 따라 요소를 정렬하고, `align-items`는 교차축을 따라 정렬한다.

컨테이너를 책장이라고 하면 이해하기 쉽다. `flex-direction`은 책을 눕혀서 꽂을지 세로로 꽂을지 정하는 것과 같다. `justify-content`는 책이 나열된 긴 방향으로 책 사이 간격을 조절하는 것이고, `align-items`는 그와 수직인 짧은 방향으로 책 위치를 맞추는 것이다. 다만 실제 책장은 책을 눕히든 세우든 책장 모양 자체는 안 바뀌지만, flex는 `flex-direction`을 바꾸면 주축과 교차축이 서로 자리를 바꾼다는 점이 다르다.

## 직접 해보기

아래는 이해를 위해 직접 만들어본 예시 코드다.

```html
<div class="container">
  <div class="box">1</div>
  <div class="box">2</div>
  <div class="box">3</div>
</div>
```

```css
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 1px solid gray;
}
```

결과: 박스 세 개가 가로 한 줄에 나란히 놓이고, `justify-content: center`가 그 줄을 컨테이너 가로 중앙에, `align-items: center`가 세로 중앙에 위치시킨다.

이제 코드는 그대로 두고 `flex-direction`만 `column`으로 바꿔본다.

```css
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  border: 1px solid gray;
}
```

결과: 박스들이 세로로 쌓이고, `justify-content: center`는 이제 세로 방향 가운데 정렬을, `align-items: center`는 가로 방향 가운데 정렬을 담당한다. `justify-content`와 `align-items` 코드는 하나도 안 바꿨는데, 둘이 담당하는 방향이 서로 뒤바뀐다.

## 헷갈렸던 점

### justify-content vs align-items

처음엔 `justify-content`와 `align-items` 둘 다 "정렬"을 위한 속성이라, 아무거나 써도 비슷하게 동작할 줄 알았다. 실제로는 `flex-direction`이 정한 주축을 `justify-content`가, 나머지 한 방향인 교차축을 `align-items`가 담당한다는 규칙이 있었다.

| 속성 | 담당하는 축 | flex-direction: row일 때 | flex-direction: column일 때 |
|------|-------------|--------------------------|------------------------------|
| justify-content | 주축(main axis) | 가로 방향 정렬 | 세로 방향 정렬 |
| align-items | 교차축(cross axis) | 세로 방향 정렬 | 가로 방향 정렬 |

그래서 "언제 뭘 써야 하나"의 답은 이거였다. 방향을 먼저 정하는 게 아니라, 지금 `flex-direction`이 뭔지부터 확인한다. 그 방향(주축)을 조절하고 싶으면 `justify-content`, 그 수직 방향(교차축)을 조절하고 싶으면 `align-items`를 쓴다.

### flex-wrap: nowrap, wrap, wrap-reverse

아이템이 많아지면 컨테이너 폭을 넘어설 수 있다. `flex-wrap`은 이때 아이템을 다음 줄로 넘길지 말지를 정한다. 아래는 이해를 위해 직접 만들어본 예시 코드다.

```css
.container {
  display: flex;
  flex-wrap: nowrap; /* 기본값 */
  width: 300px;
  border: 1px solid gray;
}
.box {
  width: 100px;
  flex-shrink: 0;
}
```

박스 다섯 개(각 100px)를 폭 300px짜리 컨테이너에 넣으면, `flex-wrap: nowrap`(기본값)에서는 줄을 바꾸지 않고 한 줄에 다 몰아넣는다. `flex-shrink: 0`으로 아이템이 줄어들지 못하게 했기 때문에, 컨테이너 밖으로 넘쳐버린다.

`flex-wrap: wrap`으로 바꾸면 한 줄에 300px만큼(박스 3개)만 넣고, 나머지 2개는 다음 줄로 넘어간다. 처음에는 `wrap`과 `wrap-reverse`가 뭐가 다른지 헷갈렸는데, 아이템이 줄바꿈되는 것 자체는 둘 다 똑같다. 차이는 그 줄들이 쌓이는 방향이다. `wrap`은 줄을 위에서 아래로 쌓고, `wrap-reverse`는 반대로 아래에서 위로 쌓는다. 그래서 `wrap-reverse`를 쓰면, 원래 첫 줄이었던 아이템들이 화면 아래쪽에, 나중 줄이었던 아이템들이 위쪽에 나온다.

| 값 | 한 줄에 안 들어갈 때 | 줄이 쌓이는 방향 |
|----|----------------------|------------------|
| nowrap (기본값) | 줄바꿈 안 함, 넘치거나 찌그러짐 | - |
| wrap | 다음 줄로 넘김 | 위 → 아래 |
| wrap-reverse | 다음 줄로 넘김 | 아래 → 위 |

## 더 학습하면 좋은 개념

- **flex-grow, flex-shrink, flex-basis** — 이번에 `flex-shrink: 0`을 예시에 써봤는데, 이 세 속성이 정확히 뭘 하는지는 아직 제대로 모른다. 아이템이 남는 공간을 어떻게 나눠 갖는지 이해하려면 필요하다.
- **gap** — 아이템 사이 간격을 margin 없이 주는 속성. 지금은 정렬과 줄바꿈만 다뤘는데, 간격 조절까지 알아야 실제 레이아웃을 짤 수 있다.
- **align-content** — `flex-wrap`으로 여러 줄이 생겼을 때, 그 줄들 전체를 컨테이너 안에서 어떻게 배치할지 정하는 속성이라고 들었다. `align-items`와 이름이 비슷해서 헷갈릴 것 같아 미리 짚어두고 싶다.
- **CSS Grid** — flex는 한 방향 정렬에 강하지만, 가로세로를 동시에 짜야 하는 레이아웃에는 grid가 낫다고 한다. flex의 축 개념을 알고 나니 비교해서 배우면 좋을 것 같다.

## 참고 자료

- [Basic concepts of flexbox - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox)
- [flex-wrap - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)
