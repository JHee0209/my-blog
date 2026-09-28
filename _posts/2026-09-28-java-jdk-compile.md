---
layout: post
title: "자바 코드는 왜 바로 실행되지 않을까"
date: 2026-09-28 17:00:00 +0900
categories: [개념]
tags: [Java, JDK, JVM]
snippet: |
  javac Application.java
  java Application
---

자바로 짠 코드는 저장한 파일 그대로 실행되지 않고, 실행 전에 한 번 변환하는 과정을 거친다.

## 이게 없으면 뭐가 불편할까

자바 소스 코드(`.java` 파일)는 사람이 읽을 수 있는 글자로 되어 있다. 컴퓨터는 이 글자를 그대로 읽고 실행하지 못한다. 그래서 실행하기 전에 컴퓨터가 처리할 수 있는 형태로 한 번 바꿔주는 과정이 필요하다. 이 과정이 없으면 자바로 짠 코드는 그냥 텍스트 파일일 뿐, 프로그램으로 돌아가지 않는다.

## 한 문장으로 말하면

자바 코드를 실행 가능한 상태로 바꿔주는 과정을 컴파일이라고 하고, JDK(Java Development Kit)는 이 컴파일과 실행에 필요한 도구를 모아놓은 것이다.

컴파일은 번역과 비슷하다. 외국어로 쓴 설명서를 기계가 알아듣는 언어로 옮기는 것과 같다. 다만 이 비유에는 한계가 있다. 보통의 번역은 한 번 하면 끝나지만, 자바는 번역된 결과(바이트코드)를 JVM이 실행하는 순간에 다시 한번 그때그때 해석한다는 점이 다르다.

## 그림으로 보기

```mermaid
flowchart LR
    A[소스코드] --> B[컴파일러]
    B --> C[바이트코드]
    C --> D[JVM]
    D --> E[실행]
```

`.java` 소스 코드를 컴파일러(javac)가 바이트코드(`.class`)로 바꾸고, 이 바이트코드를 JVM이 실행한다.

## 직접 해보기

아래는 이 흐름을 보여주는 예시 코드다. 앞서 작성한 `Application.java`를 기준으로 실제 실행하면 이런 명령어가 된다.

```bash
javac Application.java
java Application
```

첫 번째 줄(`javac`)은 `.java` 소스 코드를 읽어서 JVM에서 실행할 수 있는 `.class` 파일(바이트코드)로 컴파일한다. 자바 공식 문서는 이렇게 설명한다.

> The `javac` command reads source files ... and compiles them into class files that run on the Java Virtual Machine.

두 번째 줄(`java`)은 JVM을 실행시켜서, 컴파일된 클래스를 불러오고 그 클래스의 `main()` 메서드를 호출한다.

> The `java` command starts a Java application. It does this by starting the Java Virtual Machine (JVM), loading the specified class, and calling that class's `main()` method.

## 헷갈렸던 점

JDK, JRE, JVM은 이름이 비슷해서 헷갈리기 쉽다. 셋의 관계를 정리하면 이렇다.

| 이름 | 역할 |
|------|------|
| JVM | 바이트코드를 실행하는 가상 머신 |
| JRE | JVM에 실행용 라이브러리를 더한 것 |
| JDK | JRE에 컴파일 등 개발 도구(javac 등)를 더한 것 |

즉 JDK 안에 JRE가 있고, JRE 안에 JVM이 있는 구조다. 코드를 직접 짜고 컴파일해야 하는 개발 단계에서는 JDK가 필요하고, 이미 컴파일된 프로그램을 실행만 하는 경우에는 JRE만 있어도 된다.

## 더 학습하면 좋은 개념

- **바이트코드** — `.class` 파일 안에 실제로 무엇이 들어있고, JVM이 이걸 어떻게 기계어로 바꿔서 실행하는지 더 자세히 알아볼 필요가 있다.
- **패키지(package)** — 앞서 작성한 코드에 있던 `package com.wanted.b_variable.module01;`이 클래스를 어떻게 묶어주는지 아직 정확히 모른다.
- **main 메서드의 조건** — `public static void main(String[] args)`가 왜 꼭 이 모양이어야 하는지는 다음에 알아봐야 한다.
- **변수와 자료형** — 오늘 정리한 [자료형 개념]({{ site.baseurl }}{% post_url 2026-09-28-java-data-types %})과 이어지는, 코드 안에서 실제로 값을 다루는 다음 단계다.

## 참고 자료

- [javac Command (JDK 21 Tool Specifications)](https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html)
- [java Command (JDK 21 Tool Specifications)](https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html)
