---
layout: post
title: "자손·형제 선택자와 상속 정리"
date: 2026-09-08 23:26:59 +0900
categories: [개념]
tags: [CSS, selector, inheritance]
snippet: |
  div p { color: red; }
  /* p, span 둘 다 빨간색 */

  div p { border: 1px solid red; }
  /* p만 테두리, span은 그대로 */
---

자손 선택자를 써보다가, 선택하지도 않은 요소까지 스타일이 적용되는 걸 보고 선택자가 어디까지 영향을 주는지 헷갈렸다.

## 이게 없으면 뭐가 불편할까

`div p { color: red; }`처럼 자손 선택자를 쓰고 나서, `p` 안에 있는 `span`까지 빨갛게 변한 걸 봤다. 분명 `div p`라고만 썼는데 `span`까지 영향을 받으니, 이 선택자가 실제로 어디까지 적용되는 건지 알 수가 없었다. 선택자의 적용 범위와, 그 결과로 보이는 범위가 다를 수 있다는 걸 모르면 계속 헷갈리게 된다.

## 한 문장으로 말하면

자손 선택자는 두 선택자 사이에 띄어쓰기만 넣어서, 앞의 요소 안에 몇 단계를 거쳐 들어가 있든 상관없이 뒤의 요소를 전부 찾아 스타일을 적용하는 선택자다.

MDN에는 이렇게 정의돼 있다.

> The descendant combinator — typically represented by a single space (" ") character — combines two selectors such that elements matched by the second selector are selected if they have an ancestor (parent, parent's parent, parent's parent's parent, etc.) element matching the first selector.

풀어 쓰면, `div p`는 `div`의 자식이든, 자식의 자식이든, 몇 대를 내려가든 상관없이 `div` 안에 있는 모든 `p`를 찾는다는 뜻이다.

자손 선택자는 "우리 집안 사람 전부"를 부르는 것과 비슷하다. 몇 대를 내려가든 상관없이 그 집안 사람이면 다 해당된다. 다만 실제 집안은 촌수가 멀어질수록 관계가 약해지지만, 자손 선택자는 몇 단계를 내려가든 똑같이 적용된다는 점이 다르다.

## 직접 해보기

이렇게 중첩된 요소를 만들고

```html
<div>
  <p>텍스트 <span>span 텍스트</span></p>
</div>
```

자손 선택자로 색을 줘봤다.

```css
div p {
  color: red;
}
```

결과: `p`뿐만 아니라 `span`까지 빨간색이 됐다. `div p`는 `span`을 선택한 적이 없는데도 그랬다.

## 헷갈렸던 점

처음엔 "`span`이 `p`의 자식이니까 자손 선택자가 거기까지 걸리나 보다"라고 생각했다. 그런데 이번엔 자식한테 저절로 안 물려지는 속성으로 같은 실험을 해봤다.

```css
div p {
  border: 1px solid red;
}
```

결과: `p`에만 테두리가 생기고 `span`에는 안 생겼다. 이걸 보고서야 `color`와 `border`가 다르게 동작한 이유가 선택자가 아니라 **상속**(inheritance, 부모에게 적용된 스타일 값이 자식에게 자동으로 넘어가는 것) 때문이라는 걸 알았다.

MDN의 설명은 이렇다.

> CSS properties can be categorized in two types: inherited properties, which by default are set to the computed value of the parent element; non-inherited properties, which by default are set to initial value of the property.

`color`는 상속되는 속성이라서 부모 `p`의 빨간색이 자식 `span`에게 그대로 넘어갔다. `border`는 상속되지 않는 속성이라서 `p`에서 멈췄다.

즉 `div p { }`가 실제로 스타일을 "적용"하는 대상은 조건에 맞는 `p`뿐이다. `span`까지 빨개진 건 선택자가 거기까지 미쳐서가 아니라, `p`에 적용된 색이 상속을 타고 내려간 것이다.

여기서 자식 선택자(child selector)와도 비교가 됐다. `div p`는 몇 단계든 다 찾지만, `div > p`처럼 `>`를 쓰면 바로 한 단계 아래 자식만 찾는다.

| 선택자 | 문법 | 찾는 범위 |
|--------|------|-----------|
| 자손 선택자 | `div p` | 깊이 상관없이 안에 있는 모든 `p` |
| 자식 선택자 | `div > p` | `div` 바로 한 단계 아래 `p`만 |

### 상속되는 속성, 안 되는 속성

`color`와 `border`로 상속을 확인해봤는데, 다른 속성은 어떤지 궁금해서 자주 쓰는 속성 위주로 최대한 정리해봤다. CSS 속성은 수백 개라 이게 진짜 전체는 아니고, 정확한 여부는 각 속성의 MDN 문서 하단 "적용 대상" 옆의 Inherited 항목에서 확인할 수 있다.

**상속되는 속성 (자주 쓰는 것 기준)**

| 분류 | 속성 |
|------|------|
| 글자 | `color`, `font`, `font-family`, `font-size`, `font-weight`, `font-style`, `line-height`, `letter-spacing`, `word-spacing` |
| 텍스트 정렬/모양 | `text-align`, `text-indent`, `text-transform`, `text-shadow`, `white-space`, `direction` |
| 목록 | `list-style`, `list-style-type`, `list-style-position`, `list-style-image` |
| 기타 | `cursor`, `visibility`, `quotes` |

**상속되지 않는 속성 (자주 쓰는 것 기준)**

| 분류 | 속성 |
|------|------|
| 여백/테두리 | `margin`, `padding`, `border`, `border-radius` |
| 배경 | `background`, `background-color`, `background-image` |
| 크기 | `width`, `height`, `min-width`, `max-width`, `min-height`, `max-height` |
| 배치 | `display`, `position`, `top`, `right`, `bottom`, `left`, `float`, `clear`, `z-index`, `vertical-align` |
| 기타 | `box-shadow`, `box-sizing`, `overflow`, `opacity`, `outline` |

대략 "글자와 관련된 속성"은 상속되고, "박스의 크기나 배치와 관련된 속성"은 상속되지 않는 경우가 많았다. 다만 이건 지금까지 확인한 것들에서 느낀 경향이고, 모든 속성에 그대로 적용되는 규칙인지는 확신할 수 없다.

## 형제 선택자도 있다 — 인접 형제(+), 일반 형제(~)

지금까지는 부모-자식, 부모-자손 관계로만 요소를 골랐다. 그런데 "이미지 바로 다음에 오는 문단만" 처럼, 같은 부모를 가진 형제 요소들 사이의 관계로 골라야 할 때도 있다.

인접 형제 선택자(`+`)는 바로 다음에 오는 형제 하나만 고르고, 일반 형제 선택자(`~`)는 뒤에 오는 형제를 전부 고른다. 둘 다 같은 부모를 가진 요소 사이에서만 동작한다.

MDN은 각각 이렇게 정의한다.

> The next-sibling combinator (`+`) separates two selectors and matches the second element only if it immediately follows the first element, and both are children of the same parent element.

> The subsequent-sibling combinator (`~`, a tilde) separates two selectors and matches all instances of the second element that follow the first element (not necessarily immediately) and share the same parent element.

버스 정류장 줄로 비유하면, 인접 형제 선택자는 "내 바로 뒤에 줄 선 사람 한 명"만 부르는 것이고, 일반 형제 선택자는 "내 뒤에 줄 선 사람 전부"를 부르는 것이다. 다만 실제 줄서기와 달리, 이건 항상 같은 부모(같은 줄) 안에서만 적용되고 앞에서 뒤 방향으로만 찾는다는 점이 다르다.

```html
<article>
  <p>문단</p>
  <code>코드</code>
  <span>스팬</span>
</article>
```

```css
p + code {
  color: blue;
}
p ~ span {
  color: green;
}
```

`p + code`는 `p` 바로 다음에 오는 `code`만 파란색으로 만든다. `p ~ span`은 사이에 `code`가 끼어 있어도 상관없이, `p` 뒤에 오는 `span`을 전부 초록색으로 만든다.

## 더 학습하면 좋은 개념

- **자식 선택자(child selector) 직접 실험해보기** — `div > p`로 바꿨을 때 손자뻘 `p`(`div` 안의 다른 요소 안에 있는 `p`)가 안 걸리는지 아직 코드로 확인 안 해봤다.
- **명시도(specificity)** — 여러 선택자가 겹칠 때 뭐가 우선되는지 정하는 규칙. 상속과는 다른 개념인데 헷갈릴 수 있어서 미리 알아두면 좋을 것 같다.
- **`inherit`, `initial`, `unset` 키워드** — 상속되는지 여부는 속성마다 정해져 있지만, 이 키워드들로 강제로 상속시키거나 초기값으로 되돌릴 수 있다고 들었다.
- **형제 선택자와 flex, grid 함께 쓰기** — 형제 선택자로 특정 아이템만 골라 스타일을 다르게 주는 경우를 봤는데, 아직 직접 써보지 않았다.

## 참고 자료

- [Descendant combinator - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Descendant_combinator)
- [Inheritance - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascade/Inheritance)
- [Adjacent sibling combinator - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Adjacent_sibling_combinator)
- [General sibling combinator - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/General_sibling_combinator)
