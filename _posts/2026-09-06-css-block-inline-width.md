---
layout: post
title: "span에 width가 안 먹힌 이유 — block과 inline의 차이"
date: 2026-09-06 22:07:16 +0900
categories: [개념]
tags: [CSS, block, inline]
snippet: |
  <span style="width: 200px">
    테스트
  </span>
  → 아무 변화 없음, 에러도 없음
---

div와 span을 같이 써보면 레이아웃이 다르게 잡히는데, 그 차이가 display 속성에서 온다.

## 이게 없으면 뭐가 불편할까

div로 박스 두 개를 나란히 만들려고 했는데 자꾸 위아래로 쌓인다. 반대로 span 두 개는 붙여 쓰려 하지 않아도 알아서 한 줄에 나온다.

여기서 더 헷갈리는 건, span에 크기를 정해주고 싶어서 `width`를 줬는데 아무 일도 안 일어나는 경우다. 에러 메시지도 없이 그냥 무시된다. 이걸 이해하려면 div와 span이 애초에 다른 방식으로 화면에 배치된다는 것부터 알아야 한다.

## 한 문장으로 말하면

div와 span의 차이는, 화면에서 한 줄을 통째로 차지하느냐 아니면 글자 크기만큼만 차지하느냐다.

정확히는 `display` 속성 값이 다르기 때문이다. div는 기본값이 `block`이고, span은 기본값이 `inline`이다.

- **block**: 한 줄을 다 차지한다. 그래서 block 요소를 연달아 쓰면 항상 다음 줄로 넘어간다.
- **inline**: 내용(글자)만큼만 차지한다. 그래서 inline 요소를 연달아 쓰면 같은 줄에 나란히 붙는다.

block은 편지지에 문단을 쓰는 것과 비슷하다. 문단을 쓰기 시작하면 그 줄은 통째로 그 문단 차지가 되고, 다음 문단은 항상 새 줄에서 시작한다. 다만 실제 편지지는 문단 사이에 자동으로 여백이 생기지만, block 요소는 `margin`을 따로 주지 않으면 바로 붙어버린다는 점이 다르다.

inline은 문장 속에서 형광펜으로 칠한 단어와 비슷하다. 형광펜은 그 단어 글자 크기만큼만 칠해지고, 문장의 줄바꿈 흐름을 끊지 않는다. 다만 실제 형광펜은 칠하는 사람이 굵기를 마음대로 정할 수 있지만, inline 요소는 크기(`width`, `height`)를 줘도 반영되지 않는다는 점이 다르다.

## 직접 해보기

div 두 개를 이렇게 써보면

```html
<div style="background: skyblue;">첫 번째 div</div>
<div style="background: pink;">두 번째 div</div>
```

두 div가 위아래로 쌓여서 나온다. 각 div가 한 줄을 통째로 차지하기 때문이다.

같은 걸 span으로 바꾸면

```html
<span style="background: skyblue;">첫 번째 span</span>
<span style="background: pink;">두 번째 span</span>
```

두 span이 나란히 한 줄에 붙어서 나온다. 각 span이 글자 크기만큼만 차지하기 때문이다.

## 헷갈렸던 점

직접 써본 코드는 이거였다.

```html
<span style="width: 200px">테스트</span>
```

기대한 건 span의 너비가 200px로 늘어나는 거였는데, 실제로는 아무 변화가 없었다. 에러도 안 뜨길래 처음엔 코드가 잘못된 줄 알았다.

찾아보니 이건 오류가 아니라 명세에 정의된 동작이었다. MDN의 `width` 속성 문서에는 이 속성이 적용되는 대상이 다음과 같이 나와 있다.

> all elements but non-replaced inline elements, table rows, and row groups

풀어 쓰면 "non-replaced inline element"(내용이 텍스트로만 채워지는 inline 요소, 예: span)에는 `width`가 적용되지 않는다는 뜻이다. `height`, 그리고 위아래 `margin`도 마찬가지로 적용되지 않는다.

왜 이렇게 정해졌는지까지는 명세에서 명확한 이유를 찾지 못했다. 지금 이해한 수준에서는 "inline 요소는 줄(line) 안에 흐르는 내용으로 취급되기 때문에, 박스 크기를 직접 정하는 개념 자체가 없다" 정도로 알아두려 한다. 이 부분은 더 정확히 알게 되면 글을 보강할 것이다.

| 구분 | block (예: div) | inline (예: span) |
|------|------------------|---------------------|
| 줄바꿈 | 항상 새 줄에서 시작 | 다른 요소와 한 줄에 나란히 |
| width, height | 적용됨 | 적용 안 됨 |
| 위아래 margin | 적용됨 | 적용 안 됨 |
| 좌우 margin, padding | 적용됨 | 적용됨 |

span에 크기를 꼭 줘야 한다면 `display: inline-block`으로 바꾸면 된다는 것까지 알았다.

## 더 학습하면 좋은 개념

- **inline-block** — span처럼 한 줄에 붙어 있으면서도 width, height를 적용하고 싶을 때 쓰는 방법. width가 왜 안 먹혔는지 알았으니 다음은 이 문제를 해결하는 법을 배워야 한다.
- **박스 모델(margin, border, padding, content)** — inline 요소에서 위아래 margin이 왜 무시되는지 정확히 이해하려면 박스 모델부터 알아야 한다.
- **CSS Flexbox** — block과 inline만으로는 요소를 원하는 위치에 배치하기 어렵다. 레이아웃을 자유롭게 짜려면 다음 단계로 필요하다.
- **display: none과 visibility: hidden의 차이** — 둘 다 요소를 안 보이게 하지만 동작 방식이 완전히 다르다. display 속성을 배운 김에 헷갈리기 쉬운 개념이라 같이 짚어두면 좋다.

## 참고 자료

- [width - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/width)
- [박스 모델 - Web 개발 학습하기 | MDN](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Box_model)
