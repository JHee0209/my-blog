---
layout: post
title: "i++와 ++i, 단독으로 쓸 때는 왜 차이가 없을까"
date: 2026-09-28 23:00:00 +0900
categories: [개념]
tags: [Java, 연산자, 증감연산자]
snippet: |
  int i = 3;
  System.out.println(i++); // 3
  System.out.println(i);   // 4
  System.out.println(++i); // 5
---

`i++`와 `++i`는 둘 다 i를 1 증가시키지만, 어떤 상황에서는 결과가 다르게 나온다.

## 이게 없으면 뭐가 불편할까

`i++;`나 `++i;`처럼 한 줄에 증가 연산만 딱 써놓으면 둘 다 i를 1 증가시키는 것으로 끝난다. 그런데 이 연산자를 다른 변수에 대입하거나 `System.out.println()`처럼 다른 코드와 같이 쓰면, 어떤 걸 쓰느냐에 따라 결과 값이 달라진다. 이 차이를 모르면 "분명 같은 연산자인데 왜 결과가 다르지"하고 헷갈리게 된다.

## 한 문장으로 말하면

전위 연산자(`++i`)는 변수를 먼저 증가시키고 그 증가된 값을 결과로 쓰고, 후위 연산자(`i++`)는 원래 값을 결과로 쓴 다음에 변수를 증가시킨다.

> The increment/decrement operators can be applied before (prefix) or after (postfix) the operand. ... The only difference is that the prefix version (`++result`) evaluates to the incremented value, whereas the postfix version (`result++`) evaluates to the original value.

비유: 후위 연산자는 번호표 뽑는 기계와 비슷하다. 먼저 지금 번호를 뽑아서 손에 쥐고(결과로 쓰고), 그다음에 기계 안의 다음 번호를 하나 올린다. 전위 연산자는 기계 안의 번호를 먼저 올리고, 그 올라간 번호를 바로 뽑아서 손에 쥔다. 다만 이 비유에는 한계가 있다. 번호표 기계는 사람이 순서대로 행동하지만, 실제 코드에서는 이 과정이 한 줄 안에서 한 번에 일어난다.

## 직접 해보기

아래는 이 차이를 보여주는 예시 코드다.

```java
int i = 3;
System.out.println(i++);   // 3
System.out.println(i);     // 4
System.out.println(++i);   // 5
System.out.println(i);     // 5
```

`i++`는 출력 시점의 원래 값인 3을 먼저 내보내고, 그 다음에 i가 4로 바뀐다. `++i`는 i를 먼저 5로 올린 다음, 그 5를 내보낸다.

## 헷갈렸던 점

단독으로 쓸 때와 다른 곳에 값을 담을 때 왜 차이가 생기는지가 헷갈렸다.

**단독으로 쓸 때(`i++;`, `++i;`만 한 줄에 있을 때)**는 이 연산이 만들어낸 "결과 값"을 아무도 쓰지 않는다. 그래서 i가 1 증가한다는 사실만 남고, 전위든 후위든 똑같아 보인다.

**다른 변수에 담거나 다른 연산과 같이 쓸 때**는 이 연산의 결과 값 자체가 중요해진다. 이때 전위와 후위가 서로 다른 값을 결과로 내놓기 때문에 차이가 드러난다. 아래도 예시 코드다.

```java
int i = 3;
int a = i++;   // a에는 원래 값 3이 담긴다. i는 그 후 4가 된다.

int b = 3;
int c = ++b;   // b가 먼저 4가 되고, 그 4가 c에 담긴다.
```

| 코드 | 연산자 뒤 변수의 최종 값 | 대입된 변수에 담기는 값 |
|------|--------------------------|--------------------------|
| `int a = i++;` (i는 3에서 시작) | i = 4 | a = 3 |
| `int c = ++b;` (b는 3에서 시작) | b = 4 | c = 4 |

변수(i, b) 자신은 두 경우 다 결국 4가 된다는 점은 같다. 다른 건 그 순간에 "대입되는 값"이 원래 값이냐, 증가된 값이냐 뿐이다.

## 더 학습하면 좋은 개념

- **연산자 우선순위** — `++`, `--`가 다른 연산자와 한 식에 섞였을 때 어떤 순서로 계산되는지 알아야 한다.
- **복합 대입 연산자(`+=`, `-=` 등)** — [byte 오버플로우 글]({{ site.baseurl }}{% post_url 2026-09-28-java-byte-overflow %})에서 나온 것처럼, 이 연산자들도 내부적으로 형변환이 얽혀 있어서 함께 봐야 한다.
- **부작용(side effect)이 있는 식** — 증가 연산자처럼 실행하면서 변수 값 자체를 바꿔버리는 식이 한 문장에 여러 번 나오면 어떤 문제가 생기는지 알아볼 필요가 있다.
- **반복문(for문)** — `for` 문에서 `i++`가 왜 그렇게 자주 쓰이는지, 반복문을 배우면서 이어서 확인해야 한다.

## 참고 자료

- [Assignment, Arithmetic, and Unary Operators (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op1.html)
