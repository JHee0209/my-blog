---
layout: post
title: "IoC 컨테이너와 의존성 주입, 결제 예제로 이해하기"
date: 2026-10-26 20:00:00 +0900
categories: [개념]
tags: [Spring, IoC, DI]
snippet: |
  @Bean("single")
  @Scope("singleton")
  public PaymentService paymentService() {
    return new PaymentService(
        naverPayGateway());
  }
---

이 글은 결제 예제 하나로 Spring의 IoC 컨테이너, Bean과 스코프, 컴포넌트 스캔, 그리고 세 가지 의존성 주입 방법을 차례로 정리한 글이다.

2026년 10월 26일 수업에서 진행한 내용을 정리했다.

## 이게 없으면 뭐가 불편할까

쇼핑몰에 결제 기능이 있다고 해 보자. 지금은 네이버페이로 결제한다. 그런데 어느 날 "카카오페이로 바꿔 주세요"라는 요청이 들어온다.

결제 코드 안에 `new NaverPayGateway()`가 직접 적혀 있으면, 그 줄을 찾아서 고쳐야 한다. 네이버페이를 쓰는 곳이 열 군데라면 열 군데를 다 고친다. 카카오페이의 메서드 이름이나 매개변수가 다르면 호출하는 코드까지 고쳐야 한다.

부품 하나를 바꾸려고 기계 전체를 뜯는 셈이다. 이 글은 이 문제를 단계별로 풀어 가는 과정이다.

1. 처음에는 `new`로 직접 객체를 만든다. 문제를 직접 겪는다.
2. 인터페이스로 메서드 이름을 맞춘다.
3. 객체 만드는 일을 Spring에게 넘긴다. (IoC 컨테이너)
4. Spring이 만든 객체가 몇 개인지 살펴본다. (스코프)
5. 객체 등록을 자동으로 맡긴다. (컴포넌트 스캔)
6. 필요한 객체를 받는 방법 세 가지를 비교한다. (의존성 주입)

---

## 먼저, Spring은 어떤 그림 안에 있을까?

수업 첫 그림은 "Spring 생태계"였다. 큰 상자 안에 두 개의 컨테이너가 나란히 있다. 컨테이너는 무언가를 담아 두고 관리하는 상자라는 뜻이다.

| 컨테이너 | 안에 있는 것 | 하는 일 |
|----------|--------------|---------|
| 서블릿 컨테이너 | 필터(filter), 서블릿 | HTTP 요청을 받아들이고, HTTP 응답을 돌려준다 |
| IoC 컨테이너 | Controller, Service, DAO | 실제 일을 하는 객체들을 담고 관리한다 |

서블릿 컨테이너는 [웹 서버, Tomcat, 서블릿 글]({{ site.baseurl }}{% post_url 2026-10-21-java-web-server-tomcat-servlet %})에서 다룬 Tomcat이 하던 역할이다. 이번 글은 오른쪽의 IoC 컨테이너를 다룬다.

```mermaid
flowchart LR
    A[요청] --> B[필터]
    B --> C[서블릿]
    C --> D[컨트롤러]
    D --> E[서비스]
    E --> F[DAO]
```

요청은 필터와 서블릿을 지나 IoC 컨테이너 안의 컨트롤러, 서비스, DAO 순서로 전달되고, 응답은 같은 길을 거꾸로 돌아 나간다.

두 번째 그림은 삼각형이었다. 가운데에 **IoC**가 있고, 세 꼭짓점에 DI, AOP, PSA가 적혀 있다. Spring의 여러 기능이 IoC 위에서 돌아간다는 뜻이다. 이 글에서는 IoC와 DI를 다루고, AOP와 PSA는 아직 이름만 들었다. (맨 아래 "더 학습하면 좋은 개념"에 적어 두었다.)

> 한 줄 요약: Spring 안에는 요청을 받는 서블릿 컨테이너와, 일하는 객체를 관리하는 IoC 컨테이너가 있다.

---

## 실습은 어떻게 준비했을까?

Gradle 프로젝트를 만들고, `build.gradle`에 Spring의 핵심 라이브러리를 추가했다. Gradle은 필요한 라이브러리를 대신 내려받아 주는 도구다.

```groovy
// Source: https://mvnrepository.com/artifact/org.springframework/spring-context
/* spring-context : Spring 프레임워크의 핵심 의존성. IoC Container를 생성할 수 있는 의존성 */
implementation 'org.springframework:spring-context:7.0.8'
```

`spring-context`가 있어야 IoC 컨테이너를 만들 수 있다.

노트에는 `7.0.8`이 적혀 있다. 그런데 수업 파일을 열어 보니 첫 번째 프로젝트(`chap01-IoC-container`)는 `6.1.13`, 두 번째 프로젝트(`chap02-dependency-injection`)는 `7.0.8`을 쓰고 있었다. 이 글에서 쓰는 기능은 두 버전 모두에 있다.

---

## 1. new로 직접 만들면 무엇이 문제일까?

### 상황 만들기

결제 시나리오는 이렇다. `Application`이 `PaymentService`를 부르면, `PaymentService`가 상황에 맞는 Pay를 불러서 결제한다.

먼저 결제를 실제로 하는 클래스 두 개를 만든다. 이런 클래스를 결제 창구라는 뜻으로 게이트웨이(gateway)라고 불렀다.

```java
package com.wanted.container.section01.gateway;

public class KaKaoPayGateway {

    // 카카오페이 결제를 담당하는 메서드
    // 매개변수는 주문 번호 / 수량 두 개
    public boolean pay(String orderId, int amount) {
        System.out.println("카카오페이로 결제 시작! : 주문 ID = " + orderId + ", 수량 = " + amount);
        return true;
    }
}
```

```java
package com.wanted.container.section01.gateway;

public class NaverPayGateway {

    public boolean pay(String orderId, double amount) {
        System.out.println("네이버페이로 결제 시작! : 주문 ID = " + orderId + ", 수량 = " + amount);
        return true;
    }
}
```

두 클래스를 잘 보면 다른 점이 있다. 카카오페이는 수량을 `int`로, 네이버페이는 `double`로 받는다. 일부러 다르게 만든 것이다. 실제 회사들이 만든 결제 모듈도 이렇게 생김새가 제각각일 수 있다는 걸 보여 주려는 것이다.

이제 `PaymentService`가 네이버페이를 직접 만들어서 쓴다.

```java
package com.wanted.container.section01.service;

import com.wanted.container.section01.gateway.NaverPayGateway;

public class PaymentService {

    private NaverPayGateway naverPayGateway;

    public PaymentService() {
        this.naverPayGateway = new NaverPayGateway();
    }

    // 반환 타입을 void 대신에 boolean으로 변경
    public boolean processPay(String orderId, int amount) {
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);
        boolean result = naverPayGateway.pay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패!");
        }

        return result;
    }
}
```

`Application`에서는 `PaymentService`를 `new`로 만들고 주문 번호와 수량을 넘긴다.

```java
package com.wanted.container.section01;

import com.wanted.container.section01.service.PaymentService;

public class Application {
    public static void main(String[] args) {
        System.out.println("============Spring 없이 객체를 직접 생성 했을 때==============");

        // 객체 생성
        PaymentService paymentService = new PaymentService();

        // 주문번호, 수량 전달
        boolean result = paymentService.processPay("order-001", 3);

        System.out.println("결제 결과 : " + result);
    }
}
```

### "카카오페이로 바꿔 주세요"

요구사항이 추가됐다. 네이버페이를 카카오페이로 바꿔야 한다. `PaymentService`를 이렇게 고쳤다.

```java
package com.wanted.container.section01.service;

import com.wanted.container.section01.gateway.KaKaoPayGateway;

public class PaymentService {

    // private NaverPayGateway naverPayGateway;
    private KaKaoPayGateway kakaoPayGateway;

    public PaymentService() {
        // this.naverPayGateway = new NaverPayGateway();
        this.kakaoPayGateway = new KaKaoPayGateway();
    }

    public boolean processPay(String orderId, int amount) {
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);

        // boolean result = naverPayGateway.pay(orderId, amount);
        boolean result = kakaoPayGateway.pay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패!");
        }

        return result;
    }
}
```

필드, 생성자, 메서드 호출까지 세 군데를 고쳤다. 결제 수단 하나를 바꿨을 뿐인데 말이다.

### 무엇이 문제였을까?

수업에서 정리한 문제는 두 가지다.

1. 요구사항이 바뀌면 결제 구현체를 **직접** 바꿔야 한다. 구현체는 실제로 동작하는 코드를 가진 클래스다. 여기서는 `NaverPayGateway`, `KaKaoPayGateway`다.
2. 구현체마다 메서드 이름이나 매개변수가 다르면, 부르는 쪽 코드도 전부 고쳐야 한다.

이 상황을 SOLID 원칙 중 **개방-폐쇄 원칙(OCP, Open-Closed Principle)** 을 어겼다고 말한다. SOLID는 객체지향 설계에서 지키면 좋은 원칙 다섯 개의 앞 글자를 모은 말이다.

개방-폐쇄 원칙은 "소프트웨어는 확장에는 열려 있고, 변경에는 닫혀 있어야 한다"는 뜻이다. 콘센트를 떠올리면 쉽다. 새 가전제품을 사도 벽을 뜯지 않는다. 플러그만 꽂으면 된다. 새 기능을 붙이는 건 쉽고(확장에 열림), 기존 코드는 건드리지 않는다(변경에 닫힘).

지금 코드는 반대다. 결제 수단 하나를 바꾸려고 `PaymentService`를 뜯어고쳤다.

> 한 줄 요약: `new`로 구현체를 직접 만들면, 구현체가 바뀔 때마다 쓰는 쪽 코드까지 고쳐야 한다.

---

## 2. 인터페이스로 메서드 이름을 맞추면?

### 한 문장으로 말하면

문제 2번, "메서드 이름이나 매개변수가 다르다"는 **인터페이스**로 푼다. 인터페이스는 "이 기능은 꼭 이 모양으로 만들어야 한다"는 약속 목록이다.

콘센트 규격과 비슷하다. 규격만 맞으면 어느 회사 제품이든 꽂을 수 있다. 다만 콘센트 규격은 모양만 정한다. 실제로 전기를 쓰는 일은 각 제품이 한다. 인터페이스도 메서드 모양만 정하고, 실제 결제는 각 게이트웨이가 한다.

### 직접 해보기

결제 약속을 인터페이스로 만든다.

```java
package com.wanted.container.section02.gateway;

/* section01에서 생긴 구현체별 메서드 이름, 매개변수 타입/순서 문제를
   인터페이스의 특징을 활용해서 해결 */
public interface PaymentInterface {
    // 결제 시 주문 번호와 수량 받도록 함
    boolean processPay(String orderId, int amount);
}
```

두 게이트웨이가 이 인터페이스를 구현하게 바꾼다. `implements`는 "이 약속을 지키겠다"는 선언이다.

```java
package com.wanted.container.section02.gateway;

public class NaverPayGateway implements PaymentInterface {

    // 인터페이스에서 구현하도록 한 메서드
    @Override
    public boolean processPay(String orderId, int amount) {
        System.out.println("네이버페이로 결제 시작! : 주문 ID = " + orderId + ", 수량 = " + amount);
        return true;
    }
}
```

```java
package com.wanted.container.section02.gateway;

public class KaKaoPayGateway implements PaymentInterface {

    @Override
    public boolean processPay(String orderId, int amount) {
        System.out.println("카카오페이로 결제 시작! : 주문 ID = " + orderId + ", 수량 = " + amount);
        return true;
    }
}
```

이제 두 게이트웨이 모두 `processPay(String, int)`라는 같은 모양을 가졌다. 부르는 쪽은 어느 게이트웨이인지 몰라도 `processPay`만 부르면 된다.

> 한 줄 요약: 인터페이스로 메서드 모양을 통일하면, 구현체가 바뀌어도 부르는 코드는 그대로다.

---

## 3. 객체 만드는 일을 Spring에게 맡기면? — IoC 컨테이너

### 왜 필요할까

인터페이스로 이름 문제는 풀었다. 그런데 문제 1번이 남았다. `PaymentService` 안에 여전히 `new KaKaoPayGateway()`가 적혀 있다면, 바꿀 때마다 이 줄을 고쳐야 한다.

수업에서는 이렇게 정리했다. `new`로 객체를 직접 만들면 객체끼리 **결합도**가 높아진다. 결합도는 두 코드가 얼마나 단단히 묶여 있는지를 뜻한다. `PaymentService`가 만들어질 때 카카오페이 객체도 같이 만들어지니, 둘은 떼어 낼 수 없이 붙어 있다. 그래서 변경이 생기면 직접 다 찾아 고쳐야 하고, 유지보수가 어려워진다.

문제는 "직접"이다. 그렇다면 직접 만들지 않으면 된다.

### 한 문장으로 말하면

식당을 떠올려 보자. 요리사가 재료를 직접 사러 시장에 가지 않는다. 재료 담당 직원이 필요한 재료를 사다가 주방에 넣어 준다. 요리사는 받은 재료로 요리만 한다. 내일 양파 납품처가 바뀌어도 요리사는 신경 쓰지 않는다.

**IoC(Inversion of Control, 제어의 역전)** 는 객체를 만들고 연결하는 일을 개발자가 아니라 프레임워크가 맡는 것이다. 원래는 내 코드가 `new`로 객체를 만들었다. 이제는 Spring이 만들어서 건네준다. 주도권이 뒤집혔다고 해서 "역전"이라고 부른다.

Spring 공식 문서는 IoC를 이렇게 설명한다. 원래는 객체가 필요한 다른 객체를 `new`로 직접 만들거나 찾아왔다. IoC에서는 객체가 "이게 필요하다"고 밝히기만 하고, 컨테이너가 객체를 만들 때 그것을 넣어 준다. 흐름이 반대로 바뀐 것이다. 공식 문서는 뒤에서 볼 DI(의존성 주입)를 IoC의 한 형태라고 소개한다.

비유에는 한계가 있다. 재료 담당 직원은 눈치껏 알아서 재료를 고르지만, Spring은 눈치가 없다. 무엇을 만들어 둘지, 누구에게 무엇을 넣어 줄지 개발자가 **설정으로 알려 줘야** 한다. 그 설정이 바로 아래의 `AppConfig`다.

수업 그림으로 비교하면 이렇다.

| | 기존 방식 | Spring 방식 |
|--|-----------|-------------|
| 객체를 누가 만드나 | `Application`이 `new Payment()`로 직접 | IoC 컨테이너가 만들어서 담아 둔다 |
| 쓰는 쪽은 어떻게 받나 | 직접 만든 객체를 바로 쓴다 | 컨테이너에서 꺼내 받는다 |
| 둘의 관계 | `Application`과 `Payment`가 직접 묶여 있다 | 둘 다 컨테이너하고만 연결된다 |

노트에는 이 그림 옆에 "의존성의 역전(Spring이 의존을 대신 준다)"이라고 적어 두었다. 이 글에서는 공식 문서의 용어를 따라 "제어의 역전(IoC)"으로 부른다.

### Bean은 무엇일까?

**Bean**은 Spring이 만들어서 IoC 컨테이너 안에 담아 둔 객체를 부르는 말이다. 평소 `new`로 만든 객체와 똑같은 자바 객체지만, Spring이 만들고 관리한다는 점이 다르다.

### 직접 해보기

먼저 `PaymentService`가 구체적인 게이트웨이 대신 인터페이스를 받게 바꾼다. 어떤 게이트웨이를 쓸지는 생성자로 받는다.

```java
package com.wanted.container.section02.service;

import com.wanted.container.section02.gateway.PaymentInterface;

public class PaymentService {
    // private NaverPayGateway naverPayGateway;
    // private KaKaoPayGateway kakaoPayGateway;
    private final PaymentInterface paymentInterface;
    // final은 초기화 의무

    public PaymentService(PaymentInterface paymentInterface) {
        this.paymentInterface = paymentInterface;
    }

    public boolean processPay(String orderId, int amount) {
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);
        boolean result = paymentInterface.processPay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패!");
        }

        return result;
    }
}
```

`PaymentService` 안에서 `new`가 사라졌다. 이제 이 클래스는 "결제할 수 있는 무언가"만 받으면 된다. 그게 네이버페이인지 카카오페이인지 모른다.

다음은 IoC 컨테이너에 등록할 객체를 모아 두는 설정 클래스다.

```java
package com.wanted.container.section02.config;

import com.wanted.container.section02.service.PaymentService;
import com.wanted.container.section02.gateway.KaKaoPayGateway;
import com.wanted.container.section02.gateway.NaverPayGateway;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/* IoC 컨테이너에게 등록할 객체를 모아둔 설정 클래스 */
@Configuration
public class AppConfig {

    // @Bean -> 객체로 등록할 것들 만들기
    @Bean
    public KaKaoPayGateway kaKaoPayGateway() {
        return new KaKaoPayGateway();
    }

    @Bean
    public NaverPayGateway naverPayGateway() {
        return new NaverPayGateway();
    }

    // Application에서는 PaymentService를 호출해야 하니까 Bean 하나 더 만들기
    @Bean
    public PaymentService paymentService() {
        return new PaymentService(naverPayGateway());   // 카카오로 하고 싶으면 여기만 수정
    }
}
```

어노테이션은 `@`로 시작하는 표시다. 코드에 붙여서 Spring에게 "이건 이런 용도야"라고 알려 준다.

| 어노테이션 | 뜻 |
|------------|----|
| `@Configuration` | 이 클래스는 Bean 설정을 모아 둔 클래스다 |
| `@Bean` | 이 메서드가 돌려주는 객체를 Bean으로 등록해라 |

`@Bean`으로 등록한 Bean의 이름은 **메서드 이름**이 기본값이다. 공식 문서에도 기본적으로 Bean 이름은 메서드 이름과 같다고 나와 있다. 그래서 `paymentService()` 메서드로 만든 Bean의 이름은 `"paymentService"`다.

이제 카카오페이로 바꾸고 싶으면 `naverPayGateway()`를 `kaKaoPayGateway()`로 바꾸면 끝이다. `PaymentService`는 건드리지 않는다.

마지막으로 `Application`에서 IoC 컨테이너를 만들고, 그 안에서 Bean을 꺼낸다.

```java
package com.wanted.container.section02;

import com.wanted.container.section02.config.AppConfig;
import com.wanted.container.section02.service.PaymentService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    public static void main(String[] args) {

        // IoC 컨테이너 생성 (객체들을 담을 수 있는 하나의 컨테이너)
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        // getBean() : 컨테이너 내부에 있는 객체를 꺼내오는 메서드 ("객체명", 자료형)
        PaymentService paymentService = context.getBean("paymentService", PaymentService.class);

        // 주문번호, 수량 전달
        boolean result = paymentService.processPay("order-001", 3);

        System.out.println("결제 결과 : " + result);
    }
}
```

- `new AnnotationConfigApplicationContext(AppConfig.class)` — `AppConfig`를 설정으로 읽어서 IoC 컨테이너를 만든다. 이때 `@Bean` 메서드들이 실행되고, 만들어진 객체가 컨테이너에 담긴다.
- `context.getBean("paymentService", PaymentService.class)` — 컨테이너에서 이름이 `paymentService`이고 자료형이 `PaymentService`인 Bean을 꺼낸다.

`Application`에도 `new PaymentService()`가 없다. 객체를 만드는 일은 전부 컨테이너가 했다.

> 한 줄 요약: `@Configuration`과 `@Bean`으로 "무엇을 만들지" 알려 주면, IoC 컨테이너가 객체를 만들어 담아 두고 `getBean()`으로 꺼내 준다.

---

## 4. Bean은 몇 개 만들어질까? — 싱글톤과 프로토타입

### 한 문장으로 말하면

사무실 정수기를 떠올려 보자. 직원 열 명이 물을 마셔도 정수기는 한 대다. 모두가 같은 정수기를 쓴다. 반면 종이컵은 마실 때마다 새로 하나씩 뽑는다.

Bean도 이렇게 두 가지로 만들 수 있다. 이 방식을 **스코프(scope)** 라고 부른다. 스코프는 Bean이 몇 개, 언제 만들어지는지를 정하는 범위다.

| 스코프 | 비유 | 동작 |
|--------|------|------|
| `singleton` | 정수기 한 대 | 컨테이너 안에 객체가 **하나만** 있다. 몇 번을 꺼내도 같은 객체를 준다. **기본값이다** |
| `prototype` | 종이컵 | 꺼낼 때마다 **새 객체**를 만들어 준다 |

공식 문서에 따르면 싱글톤 Bean은 공유 인스턴스 하나만 관리하고, 그 Bean을 요청하면 항상 같은 인스턴스를 돌려준다. 프로토타입은 요청할 때마다 새 인스턴스를 만든다.

수업에서 정리한 싱글톤의 장점은 두 가지다.

1. 메모리를 아낀다. 객체 하나를 돌려 쓰기 때문이다.
2. 동작을 예상하기 쉽다. 늘 같은 인스턴스라서 늘 같은 동작을 한다.

비유에는 한계가 있다. 정수기는 누가 물을 받아도 정수기 상태가 바뀌지 않는다. 그런데 싱글톤 Bean이 값을 저장하는 필드를 가지면, 한 사람이 바꾼 값을 다른 사람도 보게 된다. 이 문제는 아래에서 직접 확인한다.

### 직접 해보기

`section03` 패키지를 만들고 `section02` 파일들을 복사해 붙여 넣었다. 그리고 `AppConfig`에 같은 `PaymentService`를 스코프만 다르게 두 번 등록했다.

```java
package com.wanted.container.section03.config;

import com.wanted.container.section03.gateway.KaKaoPayGateway;
import com.wanted.container.section03.gateway.NaverPayGateway;
import com.wanted.container.section03.service.PaymentService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class AppConfig {

    @Bean
    public KaKaoPayGateway kaKaoPayGateway() {
        return new KaKaoPayGateway();
    }

    @Bean
    public NaverPayGateway naverPayGateway() {
        return new NaverPayGateway();
    }

    @Bean("single")         // 기본 이름은 메서드명이지만, 직접 이름 지정 가능
    @Scope("singleton")     // 여기에는 지정된 값 작성
    public PaymentService paymentService() {
        return new PaymentService(naverPayGateway());
    }

    @Bean("proto")
    @Scope("prototype")
    public PaymentService paymentService2() {
        return new PaymentService(naverPayGateway());
    }
}
```

`@Bean("single")`처럼 괄호 안에 이름을 적으면 메서드 이름 대신 그 이름으로 등록된다. `@Scope`에는 `"singleton"`이나 `"prototype"`처럼 정해진 값을 적는다.

같은 객체인지 확인하려고 `PaymentService`에 `orderId` 필드를 하나 추가했다. 결제할 때 주문 번호를 저장해 두고, `getOrderId()`로 꺼내 볼 수 있게 했다.

```java
package com.wanted.container.section03.service;

import com.wanted.container.section03.gateway.PaymentInterface;

public class PaymentService {
    // final은 초기화 의무
    private final PaymentInterface paymentInterface;

    private String orderId;

    public PaymentService(PaymentInterface paymentInterface) {
        this.paymentInterface = paymentInterface;
    }

    public boolean processPay(String orderId, int amount) {
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);

        this.orderId = orderId;

        boolean result = paymentInterface.processPay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패!");
        }

        return result;
    }

    public String getOrderId() {
        return this.orderId;
    }
}
```

`Application`에서 각 Bean을 두 번씩 꺼낸다. 첫 번째로 꺼낸 것만 결제하고, 두 번째로 꺼낸 것은 주문 번호만 확인한다.

```java
package com.wanted.container.section03;

import com.wanted.container.section03.config.AppConfig;
import com.wanted.container.section03.service.PaymentService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    public static void main(String[] args) {
        // Bean 의 스코프
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        System.out.println("=================singleton 확인!!======================");

        PaymentService single = context.getBean("single", PaymentService.class);
        single.processPay("order-001", 3);
        System.out.println("single 의 주문 ID = " + single.getOrderId());

        PaymentService single2 = context.getBean("single", PaymentService.class);
        /* getBean()으로 객체를 2번 꺼냈는데 orderId는 동일하다.
         * 1개의 인스턴스를 공유한다는 뜻이다. == 싱글톤이다. */
        System.out.println("single2 의 주문 ID = " + single2.getOrderId());

        System.out.println("================prototype 확인==================");

        PaymentService proto = context.getBean("proto", PaymentService.class);
        proto.processPay("order-002", 3);
        System.out.println("proto 의 주문 ID = " + proto.getOrderId());

        PaymentService proto2 = context.getBean("proto", PaymentService.class);
        System.out.println("proto 의 주문 ID = " + proto2.getOrderId());
    }
}
```

실행 결과는 이렇게 나왔다.

```text
=================singleton 확인!!======================
결제 비즈니스 로직 시작! 주문 ID = order-001, 수량 = 3
네이버페이로 결제 시작! : 주문 ID = order-001, 수량 = 3
결제 성공!
single 의 주문 ID = order-001
single2 의 주문 ID = order-001
================prototype 확인==================
결제 비즈니스 로직 시작! 주문 ID = order-002, 수량 = 3
네이버페이로 결제 시작! : 주문 ID = order-002, 수량 = 3
결제 성공!
proto 의 주문 ID = order-002
proto 의 주문 ID = null
```

- `single2`는 결제한 적이 없는데 `order-001`이 나왔다. `single`과 **같은 객체**라서, `single`이 저장한 값을 그대로 본 것이다.
- `proto2`는 `null`이 나왔다. 꺼낼 때 **새 객체**가 만들어졌고, 이 객체는 아직 결제를 한 번도 하지 않았기 때문이다.

마지막 줄의 출력 문구가 `proto2`가 아니라 `proto`로 적혀 있다. 코드의 문자열을 복사하다 생긴 것이라 동작에는 영향이 없다. 다만 결과를 읽을 때 헷갈리지 않게 주의한다.

### Service를 만들 때 가장 주의할 점은?

위 결과가 바로 위험 신호다. 수업 코드에는 이런 주석이 별표와 함께 적혀 있었다.

- Bean은 기본적으로 싱글톤이다.
- Bean이 상태(필드) 값을 가지면 **모든 요청이 그 필드 값을 공유하게 된다.**
- 즉, 데이터를 저장하는 변수를 두면 위험하다. 이런 데이터는 DTO로 빼야 한다. 필드에는 행위, 동작을 담당하는 변수만 둔다.
- 따라서 필드에는 행위 위주의 클래스(예: service, dao)만 두고, 데이터 저장이 필요하면 요청마다 DTO로 데이터를 저장한다.

DTO(Data Transfer Object)는 데이터를 담아 옮기는 상자 역할의 객체다. [JDBC 글]({{ site.baseurl }}{% post_url 2026-10-15-java-jdbc-basics %})에서 다뤘다.

예를 들어 손님 A가 `order-001`로 결제하는 도중에 손님 B가 `order-002`로 결제하면, 하나뿐인 `orderId` 필드를 B가 덮어쓴다. A의 주문 번호가 사라진다. `paymentInterface`처럼 "결제하는 기능"을 가리키는 필드는 괜찮다. 누가 써도 바뀌지 않기 때문이다.

공식 문서도 같은 기준을 말한다. 상태를 갖는 Bean에는 프로토타입을, 상태가 없는 Bean에는 싱글톤을 쓰는 것이 원칙이라고 설명한다.

> 한 줄 요약: Bean은 기본이 싱글톤이라 모두가 같은 객체를 쓴다. 그래서 Service에 요청마다 달라지는 값을 필드로 두면 안 된다.

---

## 5. Bean이 100개라면? — @ComponentScan

### 왜 필요할까

지금까지는 `AppConfig`에 `@Bean` 메서드를 하나씩 적어서 등록했다. 수업에서 문제를 하나 던졌다. **Bean이 100개라면?** 메서드를 100개 적어야 한다. 클래스를 하나 추가할 때마다 `AppConfig`도 같이 고쳐야 한다.

### 한 문장으로 말하면

학교 출석부를 생각해 보자. 선생님이 전교생 이름을 하나하나 받아 적는 대신, "우리 반 교실에 있는 학생 중 이름표를 단 사람은 다 출석"이라고 정한다. 그러면 이름표만 달면 자동으로 출석부에 올라간다.

**컴포넌트 스캔(component scan)** 은 정해진 패키지를 훑어서, 특정 표시가 붙은 클래스를 찾아 자동으로 Bean으로 등록하는 기능이다. 그 표시가 `@Component`다.

비유와 다른 점도 있다. 출석부는 사람이 보고 확인하지만, 컴포넌트 스캔은 이름표(`@Component`)가 없는 클래스는 절대 등록하지 않는다. 그리고 어느 교실까지 훑을지(스캔 범위)를 정해 줘야 한다.

### 직접 해보기

새 프로젝트 `chap02-dependency-injection`을 만들고, 이전 프로젝트의 `section03` 파일을 복사해 `di.section01` 패키지에 붙여 넣었다. `AppConfig`는 이렇게 바꿨다. 원래 있던 `@Bean` 메서드는 다 지웠다.

```java
package com.wanted.di.section01.config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
// 범위 지정 무조건 해야함!!!
@ComponentScan(basePackages = "com.wanted.di.section01")
public class AppConfig {
    // Bean으로 작성했었던 원래 코드는 다 지워줌
}
```

`basePackages`는 스캔을 시작할 패키지다. 여기서는 `com.wanted.di.section01` 아래를 다 훑는다.

그리고 Bean으로 만들 클래스에 이름표를 붙인다. 게이트웨이에는 `@Component`를 붙였다.

```java
package com.wanted.di.section01.gateway;

import org.springframework.stereotype.Component;

@Component
public class NaverPayGateway implements PaymentInterface {

    // 인터페이스에서 구현하도록 한 메서드
    @Override
    public boolean processPay(String orderId, int amount) {
        System.out.println("네이버페이로 결제 시작! : 주문 ID = " + orderId + ", 수량 = " + amount);
        return true;
    }
}
```

`PaymentService`에는 `@Service`를 붙였다.

```java
package com.wanted.di.section01.service;

import com.wanted.di.section01.gateway.PaymentInterface;
import org.springframework.stereotype.Service;

/* @Service 어노테이션은 @Component의 특수한 형태이다.
   MVC 패턴 중 Service 계층에 해당하는 Bean에 붙이게 된다. */
@Service
public class PaymentService {

    private String orderId;

    // final은 초기화 의무
    private final PaymentInterface paymentInterface;

    public PaymentService(PaymentInterface paymentInterface) {
        this.paymentInterface = paymentInterface;
    }

    public boolean processPay(String orderId, int amount) {
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);

        this.orderId = orderId;

        boolean result = paymentInterface.processPay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패!");
        }

        return result;
    }

    public String getOrderId() {
        return this.orderId;
    }
}
```

`@Service`는 `@Component`의 한 종류다. 공식 문서에서는 `@Service`, `@Repository`, `@Controller`를 `@Component`를 특정 계층에 맞게 구체화한 어노테이션이라고 설명한다. 그래서 `@Service`를 붙여도 컴포넌트 스캔이 찾아낸다. 이름표 색깔만 다르고, 이름표라는 점은 같다.

컴포넌트 스캔으로 등록한 Bean의 이름은 **클래스 이름의 첫 글자를 소문자로 바꾼 것**이 기본값이다. 그래서 `PaymentService`는 `"paymentService"`로 꺼낸다.

```java
package com.wanted.di.section01;

import com.wanted.di.section01.config.AppConfig;
import com.wanted.di.section01.service.PaymentService;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    public static void main(String[] args) {
        // IoC 컨테이너 생성 (객체들을 담을 수 있는 하나의 컨테이너)
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        PaymentService pay = context.getBean("paymentService", PaymentService.class);
        pay.processPay("order-003", 3);
    }
}
```

### 실행했더니 에러가 났다 — 같은 타입의 Bean이 두 개

처음에는 카카오페이와 네이버페이 게이트웨이 **둘 다** `@Component`를 붙였다. 실행하니 이런 에러가 났다.

```text
Caused by: org.springframework.beans.factory.NoUniqueBeanDefinitionException: No qualifying bean of type 'com.wanted.di.section01.gateway.PaymentInterface' available: expected single matching bean but found 2: kaKaoPayGateway,naverPayGateway
```

에러 메시지를 풀어 보면 이렇다. "`PaymentInterface` 타입의 Bean 하나를 기대했는데, `kaKaoPayGateway`와 `naverPayGateway` 두 개를 찾았다."

`PaymentService`의 생성자는 `PaymentInterface` 하나를 달라고 한다. Spring이 컨테이너를 둘러보니 `PaymentInterface`를 구현한 Bean이 두 개다. 카카오페이를 넣을지 네이버페이를 넣을지 Spring은 혼자 정할 수 없다. 그래서 에러를 내고 실행을 멈춘다.

수업에서는 `KaKaoPayGateway` 클래스를 지워서 풀었다. 후보가 `naverPayGateway` 하나만 남으니, Spring이 고민 없이 그것을 넣어 준다. 클래스를 지우는 대신 `@Component`만 떼어도 Bean 후보에서 빠지니 같은 효과가 난다.

가장 단순하고 빠른 방법이지만 유일한 방법은 아니다. 둘 다 남겨 두고 "이걸 먼저 써"라고 알려 주는 방법도 있다. (아래 "더 학습하면 좋은 개념"에 적어 두었다.)

### basePackages를 안 적으면 어디까지 훑을까?

`config` 패키지 안에 `@Component`만 붙인 빈 `Test` 클래스를 하나 만들었다. 그리고 `AppConfig`에서 `basePackages`를 지우고 `@ComponentScan`만 남겨서, 어디까지 스캔하는지 확인했다.

```java
package com.wanted.di.section01.config;

import org.springframework.stereotype.Component;

@Component
public class Test {
}
```

수업 주석에는 이렇게 적었다. `basePackages`를 지정하지 않으면, `@ComponentScan`이 달린 클래스와 같은 패키지까지만 스캔한다. 그래서 `config` 폴더에 함께 있는 `Test`만 보이고, `gateway`나 `service`에 있는 클래스는 못 찾는다.

여기서 하나 정확히 해 둔다. 공식 문서에 따르면 `basePackages`가 없을 때는 `@ComponentScan`을 선언한 클래스의 패키지에서 시작해서 **그 아래 하위 패키지까지** 훑는다. 실습에서 `config` 하나만 잡힌 이유는 `config` 아래에 하위 패키지가 없었기 때문이다. `gateway`와 `service`는 `config`의 형제 패키지라서 범위 밖이다.

그래서 이 구조에서는 `basePackages`를 꼭 적어야 한다. 노트에 "범위 지정 무조건 해야함!!!"이라고 적은 이유다.

### 스캔에서 빼고 싶은 것이 있다면? — excludeFilters

스캔 범위 안에 있어도 특정 클래스는 Bean으로 만들고 싶지 않을 때 `excludeFilters`를 쓴다. 수업에서는 세 가지 방법을 써 봤다. 한 번에 하나만 켜고 나머지는 주석으로 막았다.

```java
package com.wanted.di.section01.config;

import com.wanted.di.section01.service.PaymentService;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.FilterType;

@Configuration
@ComponentScan(
    basePackages = "com.wanted.di.section01",
    excludeFilters = @ComponentScan.Filter(
        // 1. 클래스명 제외
        //type = FilterType.ASSIGNABLE_TYPE, classes = {PaymentService.class}

        // 2. 어노테이션 제외 (@Service가 붙은 클래스를 제외해라)
        //type = FilterType.ANNOTATION, classes = {org.springframework.stereotype.Service.class}

        // 3. 정규표현식 제외
        type = FilterType.REGEX,
        pattern = {"com.wanted.di.section01.service.*"}
    )
)
public class AppConfig {
}
```

| `type` | 무엇으로 고르나 | 위 코드에서 빠지는 것 |
|--------|-----------------|-----------------------|
| `FilterType.ASSIGNABLE_TYPE` | 클래스(타입) | `PaymentService` 클래스 |
| `FilterType.ANNOTATION` | 붙어 있는 어노테이션 | `@Service`가 붙은 모든 클래스 |
| `FilterType.REGEX` | 클래스 전체 이름의 글자 패턴 | `...section01.service`로 시작하는 모든 클래스 |

정규표현식(regex)은 글자 모양으로 찾는 규칙이다. `.*`는 "뒤에 무엇이 오든 상관없다"는 뜻이다.

수업 메모에는 "기껏 Bean으로 만들어 놓고 뺄 일은 딱히 없다"고도 적혀 있다. 스캔 범위를 이해하려고 연습해 본 기능으로 보면 된다.

여기서 주의할 점이 두 가지 있다.

- 세 방법 모두 `PaymentService`를 스캔에서 뺀다. 빠진 클래스는 Bean이 아니므로 컨테이너에 없다. 그래서 필터를 켠 채로 `Application`의 `getBean("paymentService", ...)`을 실행하면 꺼낼 Bean이 없다. 확인이 끝나면 필터를 끄고 원래대로 돌려야 한다.
- 수업 파일 중 다음 단계(`section02`)의 `AppConfig`는 `basePackages`를 `com.wanted.di.section02`로 바꿨는데, 정규표현식은 여전히 `section01.service`를 가리키고 있었다. 스캔 범위 안에 이 패턴에 맞는 클래스가 없으니, 그쪽 필터는 아무것도 빼지 않는다. 복사해서 쓸 때는 패턴도 같이 바꿔야 한다.

> 한 줄 요약: `@ComponentScan`은 지정한 패키지와 그 하위 패키지에서 `@Component` 계열 표시가 붙은 클래스를 찾아 Bean으로 등록한다. 같은 타입 Bean이 둘이면 Spring은 고르지 못하고 에러를 낸다.

---

## 6. 필요한 객체는 어떻게 받을까? — 의존성 주입 세 가지

### 한 문장으로 말하면

`PaymentService`는 결제하려면 `PaymentInterface`가 꼭 필요하다. 이렇게 "A가 일하려면 B가 필요하다"는 관계를 **의존**이라고 부른다. 여기서 `PaymentService`는 `PaymentInterface`에 의존한다.

**DI(Dependency Injection, 의존성 주입)** 는 필요한 객체를 내가 `new`로 만들지 않고, IoC 컨테이너가 넣어 주는 것이다. 수업 주석에는 이렇게 정리했다. 개발자가 직접 객체 사이의 연결을 관리하지 않고, IoC 컨테이너가 자동으로 객체 사이의 의존성을 넣어 준다. 즉 `new` 키워드를 쓰지 않는다.

택배와 비슷하다. 물건이 필요할 때 공장에 직접 가지 않고, 주소만 알려 주면 택배 기사가 문 앞에 갖다 준다. 다만 택배는 받는 방법이 하나지만, Spring은 받는 자리가 세 군데다. 현관문(생성자), 우편함(setter 메서드), 그리고 창문으로 던져 넣기(필드)다.

세 가지를 하나씩 만들어 보고, 왜 생성자 주입만 쓰는지 확인했다. 실습은 `di.section02` 패키지에 `field`, `setter`, `constructor` 패키지를 따로 만들고, 각각 `PaymentService`를 복사해서 고쳤다. `AppConfig`의 `basePackages`도 `com.wanted.di.section02`로 바꿨다.

### 1) 필드 주입

```java
package com.wanted.di.section02.service.field;

import com.wanted.di.section02.gateway.PaymentInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("field")
public class PaymentServiceField {

    // final 지우고 생성자 지웠음
    @Autowired
    private PaymentInterface paymentInterface;

    public boolean processPay(String orderId, int amount) {
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);

        boolean result = paymentInterface.processPay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패!");
        }

        return result;
    }
}
```

`@Autowired`는 "IoC 컨테이너에서 알맞은 Bean을 찾아서 여기에 넣어 줘"라는 표시다. 필드 바로 위에 붙이면 필드에 직접 넣어 준다. `@Service("field")`처럼 괄호에 이름을 적으면 그 이름으로 Bean이 등록된다.

수업에서 정리한 필드 주입의 단점은 두 가지다.

- **`final`을 쓸 수 없다.** `final` 필드는 객체가 만들어지는 순간 값이 정해져야 한다. 그런데 필드 주입은 객체를 먼저 만들고 나서 값을 넣는다. 그래서 `final`을 붙이면 컴파일이 안 된다. `final`을 꼭 쓰고 싶다면 결국 `new`로 바로 만들어 넣는 수밖에 없다.
- **누가 다른 객체를 넣어도 막을 수 없다.** 필드에 `= new NaverPayGateway()`처럼 직접 객체를 만들어 대입해도 컴파일 에러가 나지 않는다. 개발자가 `new`를 써 버려도 막을 방법이 없다.

### 2) setter 주입

```java
package com.wanted.di.section02.service.setter;

import com.wanted.di.section02.gateway.PaymentInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("setter")
public class PaymentServiceSetter {

    // final 키워드 지움
    private PaymentInterface paymentInterface;

    // 필드에 값을 대입하는 setter 하나 추가
    @Autowired
    public void setPaymentInterface(PaymentInterface paymentInterface) {
        this.paymentInterface = paymentInterface;
    }

    public boolean processPay(String orderId, int amount) {
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);

        boolean result = paymentInterface.processPay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패!");
        }

        return result;
    }
}
```

setter는 필드에 값을 넣어 주는 메서드다. 이름이 보통 `set`으로 시작한다. 여기에 `@Autowired`를 붙이면 Spring이 이 메서드를 불러서 값을 넣어 준다.

| | 내용 |
|--|------|
| 단점 1 | `final`을 쓸 수 없다. 생성자가 끝난 뒤에 값이 들어오기 때문이다 |
| 단점 2 | setter가 불리지 않으면 필드는 `null`인 채로 남는다. 그 상태로 `processPay`를 부르면 에러가 난다 |
| 장점 | **선택적 의존 관계**를 가질 수 있다. "있으면 쓰고, 없어도 괜찮은" 객체를 받을 때 쓴다 |

공식 문서도 setter 주입은 주로 선택적인 의존성, 즉 클래스 안에서 적당한 기본값을 정해 둘 수 있는 경우에 쓰라고 권한다.

### 3) 생성자 주입

```java
package com.wanted.di.section02.service.constructor;

import com.wanted.di.section02.gateway.PaymentInterface;
import org.springframework.stereotype.Service;

@Service("constructor")
public class PaymentServiceConstructor {

    // final은 값이 한 번 들어가는 순간 값을 변경할 수 없음
    private final PaymentInterface paymentInterface;

    // 생성자가 여러 개일 땐 @Autowired 무조건 작성해야 함
    public PaymentServiceConstructor(PaymentInterface paymentInterface) {
        this.paymentInterface = paymentInterface;
    }

    public boolean processPay(String orderId, int amount) {
        // paymentInterface = new NaverPayGateway();
        // final 때문에 컴파일 오류 발생
        System.out.println("결제 비즈니스 로직 시작! 주문 ID = " + orderId + ", 수량 = " + amount);

        boolean result = paymentInterface.processPay(orderId, amount);

        if (result) {
            System.out.println("결제 성공!");
        } else {
            System.out.println("결제 실패..");
        }
        return result;
    }
}
```

생성자로 필요한 객체를 받는다. 이 코드에는 `@Autowired`가 없다. 그래도 주입이 된다. 공식 문서에 따르면 클래스에 생성자가 **하나뿐이면** `@Autowired`를 붙이지 않아도 그 생성자를 쓴다. 생성자가 여러 개라면 어느 것을 쓸지 `@Autowired`로 하나를 골라 줘야 한다.

수업에서 정리한 생성자 주입의 장점이다.

1. **바꿀 수 없다(불변성).** `final`을 붙일 수 있어서, 한 번 들어간 의존성을 바꾸지 못한다. 위 주석처럼 `processPay` 안에서 `paymentInterface = new NaverPayGateway()`를 쓰면 컴파일 에러가 난다.
2. **꼭 필요한 것을 빠뜨릴 수 없다(필수 의존성 강제).** `final` 필드는 반드시 초기화해야 한다. 생성자로 받으면 객체가 만들어지는 순간 의존 관계가 바로 정해진다.

이런 이유로 생성자 주입이 Spring이 공식적으로 권장하는 방식이다. 공식 문서도 꼭 필요한 의존성은 생성자로, 선택적인 의존성은 setter로 받는 것을 권장한다. 생성자 주입을 쓰면 객체를 불변으로 만들 수 있고, 필수 의존성이 `null`이 아님을 보장할 수 있다고 설명한다.

### 세 가지를 한눈에 비교하면

| | 필드 주입 | setter 주입 | 생성자 주입 |
|--|-----------|-------------|-------------|
| `@Autowired` 위치 | 필드 | setter 메서드 | 생성자 (하나뿐이면 생략 가능) |
| `final` 사용 | 불가 | 불가 | **가능** |
| 의존성이 `null`일 위험 | 있음 | setter가 안 불리면 있음 | 없음 (생성 시점에 받는다) |
| 나중에 바뀔 위험 | 다른 객체를 대입해도 못 막음 | setter로 바꿀 수 있음 | 바꿀 수 없음 |
| 언제 쓰나 | 수업에서는 쓰지 않기로 함 | 선택적 의존성 | **기본으로 이것만 쓴다** |

### 세 Bean을 꺼내 실행하기

```java
package com.wanted.di.section02;

import com.wanted.di.section02.config.AppConfig;
import com.wanted.di.section02.service.constructor.PaymentServiceConstructor;
import com.wanted.di.section02.service.field.PaymentServiceField;
import com.wanted.di.section02.service.setter.PaymentServiceSetter;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Application {
    public static void main(String[] args) {
        // IoC Container == Application Context == Bean Factory
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        // 새로 만든 PaymentServiceField 클래스로 지정
        PaymentServiceField pay = context.getBean("field", PaymentServiceField.class);
        pay.processPay("order-003", 3);

        System.out.println("=====================================");
        PaymentServiceSetter pay2 = context.getBean("setter", PaymentServiceSetter.class);
        pay.processPay("order-003", 3);

        System.out.println("=====================================");
        PaymentServiceConstructor pay3 = context.getBean("constructor", PaymentServiceConstructor.class);
        pay.processPay("order-003", 3);
    }
}
```

여기서 놓치기 쉬운 부분이 있다. 두 번째와 세 번째 블록에서 `pay2`, `pay3`를 꺼내 놓고 실제로는 `pay.processPay(...)`를 불렀다. 그래서 세 번 모두 **필드 주입 Bean**이 실행된다. setter 주입과 생성자 주입을 확인하려면 각각 `pay2.processPay(...)`, `pay3.processPay(...)`로 고쳐야 한다. `getBean()`으로 꺼내는 과정에서 Bean이 정상적으로 만들어졌는지는 확인되지만, 결제 출력은 필드 주입 쪽 결과다.

> 한 줄 요약: 의존성 주입은 필드, setter, 생성자로 할 수 있다. `final`로 바꿀 수 없고 빠뜨릴 수 없게 만드는 생성자 주입만 쓴다.

---

## 헷갈렸던 점

### 1. IoC 컨테이너, ApplicationContext, BeanFactory는 완전히 같은 말일까?

수업 코드 주석에는 `IoC Container == Application Context == Bean Factory`라고 적었다. 처음 배울 때는 "셋 다 IoC 컨테이너를 부르는 이름"으로 이해하면 충분하다.

다만 공식 문서를 보면 조금 다르다.

| 이름 | 공식 문서 설명 |
|------|----------------|
| `BeanFactory` | Bean을 만들고 관리하는 가장 기본 기능을 가진 인터페이스 |
| `ApplicationContext` | `BeanFactory`를 물려받아 기능을 더한 인터페이스. `BeanFactory`의 기능을 모두 갖는다 |
| `AnnotationConfigApplicationContext` | `ApplicationContext`의 구현체 중 하나. `@Configuration` 클래스를 읽어 컨테이너를 만든다 |

`ApplicationContext`가 `BeanFactory`보다 큰 집합이다. 그래서 "같다"보다는 "`ApplicationContext`도 `BeanFactory`다"가 더 정확하다. 공식 문서는 IoC 컨테이너를 나타내는 인터페이스로 `ApplicationContext`를 소개한다.

참고로 수업 파일에는 이 줄이 `Contaitner`로 오타가 나 있었다. 수업 중에도 "바로 아랫줄 오타 수정"이라는 안내가 있었다. 이 글에서는 `Container`로 고쳐 적었다.

### 2. 생성자 주입 코드에 @Autowired가 없는데 왜 주입될까?

필드 주입과 setter 주입에는 `@Autowired`가 있었다. 그런데 생성자 주입 코드에는 없다. 처음 보면 "빼먹은 건가?" 싶다.

공식 문서에 따르면, 클래스에 생성자가 하나만 있으면 Spring은 `@Autowired`가 없어도 그 생성자를 쓴다. 고를 생성자가 하나뿐이니 물어볼 필요가 없다. 생성자가 여러 개이고 기본 생성자도 없다면, 그중 하나에 `@Autowired`를 붙여서 "이걸 써"라고 알려 줘야 한다.

### 3. 노트의 NaverPayGateway 출력 문구와 수업 파일이 달랐다

노트에 붙여 둔 `NaverPayGateway`(section01) 코드는 출력 문구가 "카카오페이로 결제 시작!"이었다. 카카오페이 클래스를 복사하면서 문구를 그대로 둔 것이다. 수업 파일에서는 "네이버페이로 결제 시작!"으로 고쳐져 있어서, 이 글도 그쪽을 따랐다.

같은 클래스에서 수량을 `double`로 받는 부분은 오타가 아니다. "구현체마다 매개변수가 다를 수 있다"는 문제를 보여 주려고 일부러 다르게 만든 것이다. `int`를 `double` 자리에 넘기는 것은 자바가 자동으로 바꿔 주기 때문에 컴파일은 된다.

> 한 줄 요약: `ApplicationContext`는 `BeanFactory`를 확장한 IoC 컨테이너이고, 생성자가 하나면 `@Autowired`는 생략해도 된다.

---

## 더 학습하면 좋은 개념

- **`@Primary`와 `@Qualifier`** — 이번에는 같은 타입 Bean이 둘이라 하나를 지워서 에러를 풀었다. 카카오페이와 네이버페이를 둘 다 남겨 두고 "기본은 이것", "여기엔 저것"이라고 알려 주는 방법이다. 실제로 결제 수단을 바꾸려면 꼭 필요하다.
- **AOP(Aspect Oriented Programming)** — 수업 삼각형 그림의 한 꼭짓점이다. 로그 남기기처럼 여러 클래스에 똑같이 들어가는 코드를 한곳으로 모으는 방법이다. Service 코드를 결제 로직에만 집중하게 만들 수 있다.
- **PSA(Portable Service Abstraction)** — 삼각형의 또 다른 꼭짓점이다. 바탕 기술이 바뀌어도 코드를 덜 고치게 해 주는 Spring의 설계 방식이다. 이번 글의 "인터페이스로 구현체 갈아 끼우기"와 같은 생각에서 출발한다.
- **Bean 생명주기(lifecycle)** — Bean이 언제 만들어지고 언제 없어지는지에 관한 내용이다. 공식 문서에 따르면 프로토타입 Bean은 Spring이 끝까지 관리하지 않는다. 스코프를 고를 때 이 차이를 알아야 한다.
- **`@Configuration` 안에서 `@Bean` 메서드를 다시 부르면?** — `AppConfig`에서 `paymentService()`가 `naverPayGateway()`를 직접 불렀다. 그런데도 네이버페이 객체가 두 개 생기지 않는 이유가 있다. 싱글톤이 어떻게 지켜지는지 이해할 수 있다.

## 참고 자료

- [Spring Framework Reference — Introduction to the Spring IoC Container and Beans](https://docs.spring.io/spring-framework/reference/core/beans/introduction.html)
- [Spring Framework Reference — Container Overview](https://docs.spring.io/spring-framework/reference/core/beans/basics.html)
- [Spring Framework Reference — Using the @Bean Annotation](https://docs.spring.io/spring-framework/reference/core/beans/java/bean-annotation.html)
- [Spring Framework Reference — Bean Scopes](https://docs.spring.io/spring-framework/reference/core/beans/factory-scopes.html)
- [Spring Framework Reference — Classpath Scanning and Managed Components](https://docs.spring.io/spring-framework/reference/core/beans/classpath-scanning.html)
- [Spring Framework Javadoc — @ComponentScan](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/context/annotation/ComponentScan.html)
- [Spring Framework Reference — Dependency Injection](https://docs.spring.io/spring-framework/reference/core/beans/dependencies/factory-collaborators.html)
- [Spring Framework Reference — Using @Autowired](https://docs.spring.io/spring-framework/reference/core/beans/annotation-config/autowired.html)
