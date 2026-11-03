---
layout: post
title: "Spring Boot 컨트롤러는 요청을 어떻게 받을까 — 요청 매핑과 핸들러 메서드"
date: 2026-10-28 20:00:00 +0900
categories: [개념]
tags: [Java, Spring, SpringBoot]
snippet: |
  @RequestMapping("/order/*")
  @GetMapping("/detail/{orderNo}")
  @PathVariable("orderNo") int no

  @RequestParam("modifyPrice") int price
  @ModelAttribute("menu") MenuDTO menu

  return "request/printResult";
---

이 글은 Spring Boot에서 요청 주소를 메서드에 연결하는 방법(요청 매핑)과, 사용자가 보낸 값을 메서드에서 받는 방법(`WebRequest`, `@RequestParam`, `@ModelAttribute`)을 정리한 글이다.

2026년 10월 28일 수업에서 진행한 내용을 정리했다.

## 이게 없으면 뭐가 불편할까

[서블릿 글]({{ site.baseurl }}{% post_url 2026-10-21-java-web-server-tomcat-servlet %})에서는 주소 하나마다 서블릿 클래스를 하나씩 만들었다. 그리고 `doGet`, `doPost`를 덮어쓰고, `req.getParameter("name")`으로 값을 꺼냈다. 숫자는 `Integer.parseInt`로 직접 바꿨다.

메뉴 등록, 메뉴 수정, 주문 등록, 주문 상세…. 기능이 늘 때마다 클래스가 늘어난다. 입력칸이 10개면 `getParameter`와 `parseInt`도 10줄씩 쓴다.

Spring Boot를 쓰면 이 반복이 많이 줄어든다. 주소는 어노테이션 한 줄로 메서드에 연결하고, 값은 매개변수로 받는다. 어노테이션은 `@`로 시작하는 표시다. 코드에 붙여 두면 Spring이 그 표시를 보고 일을 대신 해 준다.

이 글은 수업에서 만든 두 프로젝트를 따라간다.

| 프로젝트 | 다룬 내용 |
|----------|-----------|
| `chap01-request-mapping` | 주소를 메서드에 연결하는 방법 (요청 매핑) |
| `chap02-handler-method` | 사용자가 보낸 값을 메서드에서 받는 방법 |

---

## 0. 프로젝트는 어떻게 만들었을까?

### 만드는 순서

1. 실습용 폴더를 하나 만든다.
2. IntelliJ에서 새 Spring Boot 프로젝트를 만든다. 언어는 Java, 빌드 도구는 Gradle, Java 버전은 21로 골랐다.
3. 필요한 기능(의존성)을 고른다. 의존성은 "이 프로젝트는 이 라이브러리를 가져다 쓴다"는 목록이다.

수업에서 고른 의존성은 이렇다.

| 의존성 | 하는 일 |
|--------|---------|
| Spring Web (`spring-boot-starter-webmvc`) | 웹 요청을 받고 응답하는 기능. 톰캣도 함께 들어온다 |
| Thymeleaf | HTML 안에 자바에서 보낸 값을 채워 넣는 도구 |
| Lombok (chap02에서 추가) | getter, setter, 생성자 같은 반복 코드를 자동으로 만들어 주는 도구 |

의존성을 고르는 화면에는 구글 로그인이나 카카오 로그인 같은 기능을 붙일 수 있는 항목도 있다고 배웠다. 이번 실습에서는 쓰지 않았다.

깜빡하고 의존성을 고르지 못했어도 괜찮다. 프로젝트의 `build.gradle` 파일에 직접 적으면 된다. 아래는 chap02 프로젝트의 `build.gradle` 일부다.

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    implementation 'org.springframework.boot:spring-boot-starter-webmvc'
    compileOnly 'org.projectlombok:lombok'
    annotationProcessor 'org.projectlombok:lombok'
    testImplementation 'org.springframework.boot:spring-boot-starter-thymeleaf-test'
    testImplementation 'org.springframework.boot:spring-boot-starter-webmvc-test'
    testCompileOnly 'org.projectlombok:lombok'
    testRuntimeOnly 'org.junit.platform:junit-platform-launcher'
    testAnnotationProcessor 'org.projectlombok:lombok'
}
```

IntelliJ에서는 `dependencies {` 옆에 "스타터 추가" 버튼이 보인다. 이 버튼으로도 의존성을 추가할 수 있다.

### 설정 파일 — application.yaml

프로젝트를 만들면 `src/main/resources/application.yaml` 파일이 생긴다. 프로그램의 환경 설정을 적는 파일이다. 수업에서는 서버 포트 번호를 바꿨다. 포트는 한 컴퓨터 안에서 프로그램을 구분하는 문 번호 같은 것이다.

```yaml
spring:
  application:
    name: chap01-request-mapping
server:
  port: 7777

# 환경설정 파일과 같다.
#  spring.application.name=chap01-rquest-mapping 과 같다.
```

Spring Boot 공식 문서에 따르면 내장 서버는 기본으로 `8080` 포트에서 요청을 기다린다. `server.port`를 적으면 그 번호로 바뀐다. 그래서 chap01은 `http://localhost:7777`로 접속한다.

주석에 적은 것처럼, yaml 파일은 `application.properties`와 같은 설정을 다른 모양으로 적은 것이다. properties는 `spring.application.name=...`처럼 한 줄에 점으로 이어 쓰고, yaml은 들여쓰기로 계층을 표현한다.

수업에서는 "애플리케이션을 실행하자마자 yml 파일부터 읽는다"고 배웠다. 서버를 켜기 전에 포트 같은 설정을 먼저 알아야 하기 때문이다.

### 실행하는 클래스 — @SpringBootApplication

프로젝트를 만들면 `main` 메서드가 있는 클래스가 하나 생긴다.

```java
@SpringBootApplication
public class Chap01RequestMappingApplication {

    public static void main(String[] args) {
        SpringApplication.run(Chap01RequestMappingApplication.class, args);
    }

}
```

이 클래스를 실행하면 Spring Boot가 켜진다. 서블릿 실습 때처럼 톰캣을 따로 설치하고 연결할 필요가 없다. Spring Boot 안에 톰캣이 들어 있기 때문이다. 이렇게 프로그램 안에 들어 있는 서버를 **내장 서버**라고 부른다.

수업에서는 `Test.java`라는 클래스로 하나를 더 확인했다.

```java
@Component      //=> 객체가된다.
public class Test {
    // Spring Boot => IoC 컨테이너/톰캣 내장되어 있음. 따라서 안 만들어도 됨
}
```

`@Component`를 붙이면 Spring이 이 클래스의 객체를 직접 만들어서 보관한다. 객체를 만들고 보관하는 이 창고를 **IoC 컨테이너**라고 부른다. 주석의 뜻은 "IoC 컨테이너도, 톰캣도 Spring Boot에 이미 들어 있으니 내가 따로 만들지 않아도 된다"는 것이다.

### 첫 화면 — static/index.html

`src/main/resources/static` 폴더에 `index.html`을 만들었다. 버튼을 눌러 여러 요청을 보내 보는 연습용 화면이다. 아래는 앞부분이다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
    <h1>Spring Web MVC Request-Mapping</h1>
    <hr>
    <h2>1. 메소드에 요청 매핑하기!!</h2>
    <h3>GET 방식의 요청 : /menu/regist</h3>
    <button onclick="location.href='/menu/regist'">GET 메뉴 등록 요청함!!</button>
    <hr>
    <h3>POST 방식의 요청 : /menu/regist</h3>
    <form action="/menu/regist" method="post">
        <button type="submit">POST 메뉴 등록 요청함!!</button>
    </form>
    <!-- 이하 /menu/modify, /order/regist, /order/detail/3 등 버튼이 이어진다 -->
</body>
</html>
```

Spring Boot 공식 문서에 따르면 `static` 폴더에 있는 파일은 그대로 브라우저에 보내진다. 그리고 그 안의 `index.html`은 첫 화면(웰컴 페이지)으로 쓰인다. 그래서 `http://localhost:7777`만 입력해도 이 화면이 나온다.

| 폴더 | 들어가는 파일 | 특징 |
|------|---------------|------|
| `resources/static` | 그대로 보여 줄 파일 (`index.html`) | 주소로 바로 열 수 있다 |
| `resources/templates` | 값을 채워서 보여 줄 HTML (`mappingResult.html`) | 컨트롤러를 거쳐야 열린다 |

> 한 줄 요약: 의존성은 `build.gradle`에, 설정은 `application.yaml`에, 첫 화면은 `static/index.html`에 둔다.

---

## 1. 요청은 어떻게 메서드까지 올까?

### 한 문장으로 말하면

회사 안내 데스크를 떠올려 보자. 손님이 "메뉴 등록하러 왔어요"라고 하면, 안내원은 담당자 명단을 보고 맞는 사람에게 손님을 보낸다.

Spring에서는 서블릿이 안내원이고, `@Controller`가 붙은 클래스가 담당자다. 수업 코드의 주석에도 이렇게 적었다.

```java
/* comment.
    Spring Boot App 은 Tomcat 이 내장되어 있다.
    지금까지 사용자의 요청이 있으면 요청을 처리 할 Servlet 을 만들었다고 한다면,
    Servlet 은 Http 요청을 받는 즉시 @Controller 어노테이션이 달린 클래스에 요청을 위임한다.
 */
```

이 안내원 서블릿의 이름은 `DispatcherServlet`이다. 실습 중 콘솔에도 `DispatcherServlet : Initializing Servlet 'dispatcherServlet'`라는 로그가 찍혔다. 첫 요청이 들어올 때 이 서블릿이 준비된다는 뜻이다.

비유에는 한계가 있다. 안내원은 손님 말을 듣고 눈치껏 판단하지만, `DispatcherServlet`은 **주소와 요청 방식(GET/POST)이 정확히 맞는 메서드**만 찾는다. 글자 하나만 달라도 담당자를 못 찾는다.

### 그림으로 보기

```mermaid
flowchart LR
    A[브라우저] --> B[내장 톰캣]
    B --> C[서블릿]
    C --> D[컨트롤러]
    D --> E[템플릿]
    E --> A
```

요청은 톰캣과 서블릿을 거쳐 컨트롤러 메서드에 닿고, 메서드가 고른 HTML 화면이 브라우저로 돌아간다.

### 직접 해보기 — @RequestMapping

`MethodController` 클래스를 만들었다.

```java
@Controller
public class MethodController {

    // 사용자가 버튼을 누르는 순간 요청함 (서블릿이 요청 매핑함)
    @RequestMapping("/menu/regist")
    public String registMenu(Model model) { //Model => Request 의 영역(req)
        /* comment. model 객체
            백엔드 서버에서 발생한 값을 담을 수 있는
            Request 객체이다. key-value 형태로 값을 담을 수 있다.
         */
        System.out.println("동작하니?");

        model.addAttribute("message","GET 방식의 메뉴 등록 핸들러 메서드 등록함...");

        /* comment.
            @Controller 계층의 마지막 임무는
            사용자에게 어떤 응답을 해줄 것인지를 결정하는 것이다.
            메소드의 반환타입을 String 으로 한 후, 문자열을 return 하면 resources/templates 가 자동으로 접두사,
            .html 이 접미사로 설정된다.
         */
        return "mappingResult";
    }
}
```

한 줄씩 보면 이렇다.

1. `@Controller` — "이 클래스는 요청을 받는 담당자다"라는 표시다.
2. `@RequestMapping("/menu/regist")` — "`/menu/regist`로 오는 요청은 이 메서드가 받는다"는 표시다. 이렇게 주소를 메서드에 연결하는 것을 **요청 매핑**이라고 부른다.
3. 요청을 받아 일하는 메서드를 **핸들러 메서드**라고 부른다. 핸들러(handler)는 "처리하는 것"이라는 뜻이다.
4. `model.addAttribute("message", ...)` — 화면에 보낼 값을 `"message"`라는 이름으로 담는다.
5. `return "mappingResult";` — 보여 줄 화면 이름을 돌려준다.

`index.html`에서 "GET 메뉴 등록 요청함!!" 버튼을 누르면 콘솔에 `동작하니?`가 찍힌다.

### return한 글자는 어떻게 HTML 파일이 될까?

`return "mappingResult";`는 글자를 돌려주는 것처럼 보인다. 그런데 Spring은 이 글자를 **화면 파일의 이름(뷰 이름)** 으로 읽는다. 뷰(view)는 사용자에게 보여 줄 화면을 부르는 말이다.

Thymeleaf를 쓰는 Spring Boot는 뷰 이름 앞뒤에 정해진 글자를 붙인다.

```text
resources/templates/  +  mappingResult  +  .html
     (접두사)              (return한 값)      (접미사)
```

그래서 `templates/mappingResult.html` 파일을 찾아서 보여 준다. 우편 주소에서 "OO시 OO구"까지는 늘 같으니 동 이름만 적는 것과 비슷하다.

`templates/mappingResult.html`은 이렇게 만들었다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<!--
    th 는 타임리프 라는 템플릿엔진의 문법이다.
    해당 문법은 chap6 번에서 진행한다!
-->
<h3 th:text="${message}"></h3>
</body>
</html>
```

`th:text="${message}"`는 "Model에 `message`라는 이름으로 담긴 값을 여기에 글자로 넣어라"는 뜻이다. 그래서 화면에 "GET 방식의 메뉴 등록 핸들러 메서드 등록함..."이 나온다. 

> 한 줄 요약: `@RequestMapping`으로 주소를 메서드에 연결하고, `String`을 return하면 `templates/이름.html` 화면이 나간다.

---

## 2. GET과 POST는 어떻게 나눠 받을까?

### 왜 필요할까

같은 `/menu/regist` 주소라도, 버튼으로 이동하는 GET 요청과 양식(form)으로 보내는 POST 요청은 하는 일이 다를 수 있다. 그런데 앞의 `@RequestMapping("/menu/regist")`는 방식을 가리지 않는다.

Spring 공식 문서에서도 `@RequestMapping`에 요청 방식을 적지 않으면 모든 HTTP 방식과 맞는다고 설명한다. 수업 주석으로는 이렇게 적었다.

```java
// @RequestMapping : Servlet -> service() : get/post/delete 전부 받아듦임.
```

서블릿 글에서 본 `service()`가 GET이든 POST든 다 받았던 것과 비슷하다.

### 방법 1 — method 속성 적기

POST만 받고 싶으면 `method`를 적는다.

```java
@RequestMapping(value="/menu/regist", method = RequestMethod.POST)
public String postRegistMenu(Model model) { //Model => Request 의 영역(req)

    model.addAttribute("message","POST 방식의 메뉴 등록 핸들러 메서드 등록함...");

    return "mappingResult";
}
```

이렇게 하면 동작은 한다. 하지만 매번 `value=`, `method = RequestMethod.POST`를 적어야 해서 귀찮다.

### 방법 2 — @GetMapping, @PostMapping

더 짧게 쓰는 방법이 있다.

```java
//@RequestMapping 은 GET/POST 방식 모두 빨아먹음. 따라서 적을게 많다.
// 같은 url 이름으로 받는 방식을 다르게 하고 싶으면 @GetMapping 이나 @PostMapping 으로 다르게 받아주면 됨.

@GetMapping("/menu/modify")
public String getModifyMenu(Model model) {

    model.addAttribute("message","GET 방식의 메뉴 수정 핸들러 메서드 등록함...");

    return "mappingResult";
}

@PostMapping("/menu/modify")
public String postModifyMenu(Model model) {

    model.addAttribute("message","POST 방식의 메뉴 수정 핸들러 메서드 등록함...");

    return "mappingResult";
}
```

`@GetMapping`은 서블릿의 `doGet`, `@PostMapping`은 `doPost`와 같은 역할이다. 공식 문서에서도 대부분의 핸들러 메서드는 이렇게 방식이 정해진 어노테이션을 쓰라고 권한다.

| 어노테이션 | 받는 요청 | 서블릿에서는 |
|------------|-----------|--------------|
| `@RequestMapping("/주소")` | 모든 방식 | `service()` |
| `@GetMapping("/주소")` | GET만 | `doGet()` |
| `@PostMapping("/주소")` | POST만 | `doPost()` |

여기서 하나 짚고 가자. 원본 코드에는 `@PostMapping` 옆에도 `//DoGET 메서드와 동일`이라는 주석이 복사돼 있었다. `@PostMapping`은 `doPost`와 같은 역할이라 위 코드에서는 그 주석을 뺐다.

> 한 줄 요약: `@RequestMapping`은 모든 방식을 받는다. 방식별로 나누려면 `@GetMapping`, `@PostMapping`을 쓴다.

---

## 3. 주소 앞부분이 반복되면 어떻게 줄일까?

### 왜 필요할까

주문 기능을 만들다 보면 주소가 이렇게 된다.

```text
/order/regist
/order/modify
/order/delete
/order/detail/3
```

메서드마다 `/order`를 반복해서 적어야 한다.

### 한 문장으로 말하면

아파트 동 호수를 생각해 보자. "101동 1호, 101동 2호…"를 매번 쓰지 않고, 101동 입구에 "101동"이라고 한 번 붙여 두면 안에서는 호수만 말하면 된다.

**클래스에 `@RequestMapping`을 붙이면** 그 안의 모든 메서드 주소 앞에 같은 앞부분이 붙는다.

### 직접 해보기

```java
@Controller
@RequestMapping("/order/*")
public class ClassController {

    @GetMapping("/regist")
    public String registOrder(Model model) {

        model.addAttribute("message","GET 방식의 주문 등록 핸들러 메서드 동작.");

        return "mappingResult";
    }
}
```

`@GetMapping("/regist")`만 적었지만 `/order/regist` 요청을 받는다. 메서드마다 `/order`를 쓰지 않아도 된다.

비유에는 한계가 있다. 아파트 입구 표지판은 보기 좋으라고 붙인 것이지만, 클래스의 `@RequestMapping`은 실제 주소에 합쳐진다. 클래스 쪽 앞부분을 바꾸면 안의 메서드 주소가 전부 바뀐다.

수업 코드에서는 `"/order/*"`처럼 끝에 `*`를 붙였다. 공식 문서의 예시는 `@RequestMapping("/persons")`처럼 `*` 없이 앞부분만 적는다. 둘 다 `/order/regist`를 받는 데는 문제가 없었지만, 공식 문서 모양을 따르면 `"/order"`로 써도 된다.

> 한 줄 요약: 반복되는 주소 앞부분은 클래스 위 `@RequestMapping`에 한 번만 적는다.

---

## 4. 주소에 들어 있는 값은 어떻게 받을까? — @PathVariable

### 왜 필요할까

3번 주문의 상세 화면 주소가 `/order/detail/3`이라고 해 보자. 이걸 그대로 매핑하면 이렇다.

```java
@GetMapping("/detail/3")
```

주문이 100개면 메서드도 100개 만들어야 한다. 주소에서 바뀌는 부분은 숫자뿐인데 말이다.

### 한 문장으로 말하면

택배 송장의 빈칸을 떠올려 보자. "받는 사람: ____"처럼 빈칸을 뚫어 두면 누구 이름이든 들어갈 수 있다.

주소에도 `{orderNo}`처럼 중괄호로 빈칸을 뚫을 수 있다. 그 빈칸에 들어온 값을 메서드 매개변수로 꺼내는 것이 **`@PathVariable`** 이다. 이렇게 주소를 타고 넘어오는 값을 **경로 변수(path variable)** 라고 부른다.

### 직접 해보기

```java
/* comment.
    요청 경로 : /order/detail/3 번 이라는 요청이 날라오고 있음.
    3 : pathVariable 이라고 불리우며
    요청 url 을 타고 서버로 넘어오는 값을 의미한다.
 */
@GetMapping("/detail/{orderNo}")
public String pathVariable(Model model, @PathVariable("orderNo") int no) {

    model.addAttribute("message",no + "번 주문 상세조회!!!!");
    return "mappingResult";
}
```

`index.html`의 "GET 방식의 3번 주문 상세 요청함!!" 버튼은 `/order/detail/3`으로 요청을 보낸다. 그러면 `{orderNo}` 자리의 `3`이 매개변수 `no`에 들어간다.

`int no`로 받은 것도 눈여겨보자. 주소에 실려 온 `3`은 원래 글자다. 공식 문서에 따르면 경로 변수는 매개변수 타입(`int`, `long` 등)에 맞게 자동으로 바뀐다. 그래서 `Integer.parseInt`를 쓰지 않았다.

### 이름은 꼭 같아야 할까?

여기서 많이들 헷갈린다. 규칙은 두 가지다.

| 쓰는 방법 | 예 | 조건 |
|-----------|----|------|
| 이름을 생략 | `@PathVariable int orderNo` | 매개변수 이름이 `{orderNo}`와 **똑같아야** 한다 |
| 이름을 적음 | `@PathVariable("orderNo") int no` | 매개변수 이름은 마음대로 지어도 된다 |

수업에서는 처음에 `orderNo`로 똑같이 맞춰 받았다. 그다음 `no`라는 짧은 이름을 쓰고 싶어서 괄호 안에 `"orderNo"`를 적었다. 위 코드가 그 결과다.

> 한 줄 요약: 주소의 `{빈칸}` 값은 `@PathVariable`로 받는다. 매개변수 이름이 다르면 괄호에 빈칸 이름을 적는다.

---

## 5. 반환 타입이 void면 어떤 화면이 나갈까?

여기부터는 `chap02-handler-method` 프로젝트다. 컨트롤러 클래스 이름은 `RequestController`이고, 클래스 위에 `@RequestMapping("/request/*")`를 붙였다.

### 한 문장으로 말하면

식당에서 "늘 먹던 걸로요"라고 하면 메뉴 이름을 말하지 않아도 음식이 나온다. 반환 타입이 `void`인 메서드도 화면 이름을 말하지 않는다. 그러면 Spring이 **요청 주소를 그대로 화면 이름으로 쓴다.**

### 직접 해보기

```java
@Controller
@RequestMapping("/request/*")
public class RequestController {

    @GetMapping("regist")       //핸들러 메서드 이게 반환타입이 void 면 요청경로가 view 경로로 바뀜
    public void regist() {}
}
```

`/request/regist`로 GET 요청이 오면 이 메서드가 실행된다. 돌려주는 값이 없으니 Spring은 요청 주소 `request/regist`를 뷰 이름으로 쓴다. 그래서 `templates/request/regist.html`이 화면에 나온다.

Spring 공식 문서에서도 반환 타입이 `void`이면 HTML을 보여 주는 컨트롤러에서는 기본 뷰 이름을 고르는 뜻이 된다고 설명한다.

수업 노트에는 같은 흐름을 `modify`로 정리했다.

```text
1. [사용자]
   - 웹 화면에서 <button onclick="location.href='/request/modify'"> 클릭

2. [웹 브라우저]
   - "서버야, 나 /request/modify 화면으로 이동할게! (GET 요청 전송)"

3. [Spring 서버 (컨트롤러)]
   - 브라우저가 보낸 `/request/modify` 요청을 "받아들임(들어옴)"
   - @GetMapping("modify") 메서드가 작동함!

4. [Spring 서버 -> 웹 브라우저]
   - "응, request/modify.html 파일 줄 테니까 이 화면 보여줘"
```

비유에는 한계가 있다. 식당은 "늘 먹던 것"을 기억해 주지만, Spring은 기억하지 않는다. 주소와 같은 이름의 HTML 파일이 `templates`에 **실제로 있어야** 한다. 없으면 에러가 난다.

| 반환 타입 | 어떤 화면이 나가나 | 예 |
|-----------|-------------------|----|
| `String` | return한 글자가 화면 이름 | `return "request/printResult";` → `request/printResult.html` |
| `void` | 요청 주소가 화면 이름 | `/request/regist` 요청 → `request/regist.html` |

> 한 줄 요약: `void`면 요청 주소가 곧 화면 이름이다. 그 이름의 HTML 파일이 `templates`에 있어야 한다.

---

## 6. 사용자가 보낸 값은 어떻게 꺼낼까? — WebRequest

### 직접 해보기

`regist.html`의 양식에서 메뉴 이름, 가격, 카테고리 코드를 입력하고 POST로 보낸다. 컨트롤러에서는 이렇게 받았다.

```java
@PostMapping("regist")
public String registMenu(Model model, WebRequest request) {     //HttpServletRequest 작성하면 XX
    // WebRequest 는 Servlet 환경의 HttpServletRequest 의 역할을 한다.
    // 사용자의 요청 정보가 해당 객체에 들어가게 된다.

    String menuName = request.getParameter("name");   //이 안에는 key 값을 넣어줘야함.
    // Http 는 모든게 다 문자열로 들어가게 되는데, int 변수에 담으려고 하니까 오류가 남. 따라서 파싱 해야됨
    int menuPrice = Integer.parseInt(request.getParameter("price"));
    int categoryCode = Integer.parseInt(request.getParameter("categoryCode"));

    // service(menuName, menuPrice, categoryCode); 실행된다고 가정하기(디비가 왔다 갔다)

    String message = menuName + " 을(를) 신규 메뉴 목록 " + categoryCode + "번 카테고리에 " + menuPrice
            + " 원으로 등록 했습니다!";

    model.addAttribute("message",message);
    return "request/printResult";
}
```

`WebRequest`는 사용자의 요청 정보가 담긴 객체다. 서블릿의 `HttpServletRequest`와 같은 역할을 한다. 꺼내는 방법도 서블릿 때와 같다. `getParameter("name")`처럼 입력칸의 `name` 속성 값을 넣는다.

숫자는 `Integer.parseInt`로 바꿨다. HTTP로 넘어오는 값은 전부 글자이기 때문이다. 이렇게 글자를 숫자처럼 다른 타입으로 바꾸는 것을 **파싱(parsing)** 또는 형변환이라고 부른다.

결과 화면 `printResult.html`에서는 `th:text="${message}"`로 메시지를 보여 준다. 수업 노트의 예시는 이렇다.

```html
<!-- printResult.html 예시 -->
<h1 th:text="${message}">여기에 메시지가 출력됩니다</h1>
```

### 노트끼리 서로 다른 부분

이 코드의 주석에는 `//HttpServletRequest 작성하면 XX`라고 적었다. "`HttpServletRequest`를 쓰면 안 된다"는 뜻으로 읽힌다.

그런데 노트 뒤쪽 정리에는 "`HttpServletRequest`를 매개변수로 써도 아무 문제 없다(오류 안 남)"고 적었다. 두 내용이 서로 다르다.

Spring 공식 문서의 핸들러 메서드 매개변수 목록을 보면 `HttpServletRequest`도 받을 수 있는 타입에 들어 있다. 그래서 뒤쪽 정리가 맞다. "XX"는 "쓰면 에러가 난다"가 아니라 "Spring에서는 굳이 쓰지 않는다"로 이해하면 된다. 이 내용은 아래 "헷갈렸던 점"에서 다시 다룬다.

> 한 줄 요약: `WebRequest`는 Spring판 요청 객체다. 값은 `getParameter`로 꺼내고, 숫자는 직접 파싱해야 한다.

---

## 7. 꺼내고 바꾸는 일을 줄일 수 있을까? — @RequestParam

### 왜 필요할까

`WebRequest` 방식은 입력칸마다 두 단계를 거친다.

1. `request.getParameter("price")`로 **꺼낸다.**
2. `Integer.parseInt(...)`로 **바꾼다.**

입력칸이 많아지면 이 두 줄이 계속 늘어난다.

### 한 문장으로 말하면

택배를 직접 뜯어서 물건을 꺼내고 조립하는 대신, "조립까지 해서 문 앞에 놔 주세요"라고 맡기는 것과 비슷하다.

**`@RequestParam`** 을 매개변수 앞에 붙이면 Spring이 그 값을 꺼내서 타입까지 바꿔 넣어 준다. 공식 문서에서도 매개변수 타입이 `String`이 아니면 형변환이 자동으로 된다고 설명한다.

### 직접 해보기

`modify.html`에서 수정할 메뉴 이름과 가격을 보내고, 컨트롤러에서 이렇게 받았다.

```java
@GetMapping("modify")       //핸들러 메서드 이게 반환타입이 void 면 요청경로가 view 경로로 바뀜
public void modify() {

}

@PostMapping("modify")
public String modifyMenu(Model model,
                         @RequestParam String modifyName,
                         @RequestParam int modifyPrice)
{
    System.out.println("modifyName = " + modifyName);
    System.out.println("modifyPrice = " + modifyPrice);

    return "request/printResult";
}
```

`getParameter`도 `parseInt`도 없다. 매개변수 `int modifyPrice`에 이미 숫자가 들어 있다. 콘솔에 두 값이 제대로 찍히는지 확인했다.

| | `WebRequest` | `@RequestParam` |
|--|--------------|-----------------|
| 값 꺼내기 | `request.getParameter("price")` 직접 | Spring이 대신 |
| 숫자로 바꾸기 | `Integer.parseInt(...)` 직접 | Spring이 대신 |
| 코드 위치 | 메서드 본문 | 매개변수 자리 |

### 이름이 맞지 않으면 어떻게 될까?

여기서 가장 많이 막힌다. 수업 코드 주석에도 크게 적었다.

```java
/* comment.
    단, 가장 주의해야 할 것
    - View 쪽에서 input 타입의 name 속성에 작성해둔 값과 변수명을 일치시키지 않으면 400 Bad Request 가 발생한다.
 */
```

`@RequestParam String modifyName`처럼 이름을 생략하면, Spring은 매개변수 이름 `modifyName`을 입력칸 이름으로 쓴다. 그래서 HTML의 `<input name="modifyName">`과 글자 하나까지 같아야 한다.

이름이 다르면 Spring은 그 값을 못 찾는다. 공식 문서에 따르면 `@RequestParam`은 기본으로 **꼭 있어야 하는 값**이다. 꼭 있어야 하는 값이 없으니 요청이 잘못됐다는 400 에러를 돌려준다. 값이 없어도 되게 하려면 `required = false`를 적는다.

참고로 이름 생략이 되는 것은 Spring Boot Gradle 플러그인 덕분이다. 공식 문서에 따르면 이 플러그인은 컴파일할 때 `-parameters` 옵션을 켠다. 이 옵션이 있어야 실행 중에도 매개변수 이름을 알 수 있다.

### 변수 이름을 다르게 쓰고 싶다면?

`@PathVariable` 때와 같다. 괄호 안에 입력칸 이름을 적으면 변수 이름은 마음대로 지을 수 있다.

```java
@PostMapping("modify")
public String modifyMenu(Model model,
                         @RequestParam String modifyName,   // @RequestParam 에는 무조건 key 작성(name 에 적혀있는 값)
                         @RequestParam("modifyPrice") int price)
{
    System.out.println("modifyName = " + modifyName);
    System.out.println("modifyPrice = " + price);

    return "request/printResult";
}
```

입력칸 이름은 `modifyPrice`이고, 자바에서는 `price`라는 별명으로 쓴다. 이름을 바꿨으면 아래 `println`도 `price`로 고쳐야 한다. 수업 중에 `modifyPrice`를 그대로 두었다가 빨간 줄(컴파일 에러)이 뜬 적이 있다.

> 한 줄 요약: `@RequestParam`은 꺼내기와 형변환을 대신 해 준다. 입력칸 `name`과 이름이 다르면 400 에러가 나니, 다르게 쓰려면 괄호에 `name`을 적는다.

---

## 8. 값이 많으면 하나로 묶어 받을 수 있을까? — @ModelAttribute

### 왜 필요할까

`@RequestParam`도 값마다 한 줄씩 매개변수를 늘려야 한다.

```java
@RequestParam("name") String menuName,
@RequestParam("price") int menuPrice,
@RequestParam("categoryCode") int categoryCode
```

값이 서너 개면 괜찮다. 그런데 회원가입처럼 입력칸이 열 개를 넘으면 매개변수 목록이 끝없이 길어진다. 수업에서는 "사용자가 입력한 값을 **하나의 객체로** 받고 싶다"는 목표로 넘어갔다.

### 한 문장으로 말하면

이사할 때 물건을 하나씩 들고 옮기지 않고, 상자 하나에 담아 한 번에 옮기는 것과 비슷하다.

**`@ModelAttribute`** 는 입력값들을 클래스 하나에 담아서 받는다. 이때 값을 담는 용도로만 만든 클래스를 **DTO(Data Transfer Object)** 라고 부른다. DTO는 [JDBC 글]({{ site.baseurl }}{% post_url 2026-10-15-java-jdbc-basics %})에서도 데이터를 옮기는 상자로 썼다.

비유에는 한계가 있다. 이삿짐 상자에는 아무 물건이나 넣을 수 있지만, DTO에는 **필드 이름과 입력칸 이름이 같은 값만** 들어간다. 이름이 다르면 그 칸은 빈 채로 온다.

### 직접 해보기 — DTO 만들기

`MenuDTO` 클래스를 만들었다.

```java
import lombok.*;

@NoArgsConstructor      //기본 생성자
@AllArgsConstructor     //모든 필드를 초기화 하는 생성자
@Getter
@Setter
@ToString
public class MenuDTO {
    private String name;
    private int price;
    private int categoryCode;
    private String orderableStatus;
}
```

필드 네 개만 적었는데, 위의 어노테이션이 나머지 코드를 만들어 준다. 이건 Lombok 의존성을 추가했기 때문에 가능하다.

| 어노테이션 | 만들어 주는 것 |
|------------|----------------|
| `@NoArgsConstructor` | 매개변수가 0개인 기본 생성자 |
| `@AllArgsConstructor` | 모든 필드를 한 번에 채우는 생성자 |
| `@Getter`, `@Setter` | 필드마다 `getName()`, `setName()` 같은 메서드 |
| `@ToString` | 객체를 출력하면 필드 값이 보이게 하는 `toString()` |

노트에는 "롬복 의존성을 **주입**받았기 때문에"라고 적었다. Spring에서 "의존성 주입"은 객체를 넣어 주는 다른 개념이라 헷갈릴 수 있다. 여기서는 "Lombok 라이브러리를 프로젝트에 **추가**했기 때문에"가 정확하다.

### 직접 해보기 — 검색 화면과 결과 화면

먼저 검색 양식을 보여 주는 GET 메서드와, 검색 값을 받는 POST 메서드를 만들었다. 양식 화면 `search.html`은 수업 자료에서 가져왔다.

```java
@GetMapping("search")
public void search() {

}

@PostMapping("search")      //search 라는 요청이 들어왔을 때 핸들링 하는 메소드임.
public String searchMenu(Model model, @ModelAttribute MenuDTO menu) {
    System.out.println("menu = " + menu);

    model.addAttribute("menu", menu);

    return "request/searchResult";
}
```

`@ModelAttribute MenuDTO menu` 한 줄로 이름, 가격, 카테고리 코드, 판매 상태가 모두 `menu` 객체에 담긴다. `System.out.println`으로 찍으면 `@ToString` 덕분에 필드 값이 다 보인다.

결과 화면 `searchResult.html`은 이렇게 만들었다.

```html
<body>
    <h1>메뉴 검색 결과!!</h1>
    <h3 th:text="${menu}"></h3>         <!--메뉴 전부가 나왔음-->
    <h3 th:text="${menu.getName()}"></h3>
    <h3 th:text="${menu.getPrice()}"></h3>
    <h3 th:text="${menu.getCategoryCode()}"></h3>
    <h3 th:text="${menu.getOrderableStatus()}"></h3>
</body>
```

`${menu}`는 객체 전체를, `${menu.getName()}`은 그 안의 값 하나를 보여 준다. 객체에 담아 보냈으니 화면에서도 getter로 하나씩 꺼내 쓸 수 있다.

### Model에 안 담아도 화면에서 쓸 수 있을까?

쓸 수 있다. 수업 코드 주석은 이렇다.

```java
/* comment.
    ModelAttribute
    - 클래스 자료형을 활용해서 사용자의 입력 값들을 하나의 객체로 묶을 수 있다.
    (매개변수가 많아질 때 좋음)
    --------------
    Model 객체를 활용하지 않아도 forward 되는 페이지에서 값들을 활용할 수 있다.
    ex) @ModelAttribute MenuDTO menu
    MenuDTO -> menuDTO 이름으로 사용될 수 있다!!!!!!!
 */
@PostMapping("search")      //search 라는 요청이 들어왔을 때 핸들링 하는 메소드임.
public String searchMenu(@ModelAttribute MenuDTO menu) {
    System.out.println("menu = " + menu);

    return "request/searchResult";
}
```

`@ModelAttribute`로 받은 객체는 Spring이 **자동으로 Model에도 담아 준다.** 그래서 `model.addAttribute`를 지워도 된다. forward는 서버 안에서 요청을 다음 화면으로 넘기는 것이다. 지금은 "컨트롤러가 고른 화면"이라고 생각하면 된다.

이때 Model에 담기는 이름은 **클래스 이름의 첫 글자를 소문자로 바꾼 것**이다. `MenuDTO`라면 `menuDTO`가 된다. 그래서 화면에서는 이렇게 쓴다.

```html
<h3 th:text="${menuDTO.getName()}"></h3>
```

여기서 많이들 헷갈린다. 매개변수 이름이 `menu`라고 해서 `${menu}`로 꺼낼 수 있는 게 아니다. 이름은 매개변수가 아니라 **클래스 이름**에서 온다.

`menu`라는 이름으로 쓰고 싶으면 괄호에 이름을 적는다.

```java
@PostMapping("search")      //search 라는 요청이 들어왔을 때 핸들링 하는 메소드임.
public String searchMenu(@ModelAttribute("menu") MenuDTO menu) {
    System.out.println("menu = " + menu);

    return "request/searchResult";
}
```

이제 화면에서 `${menu.getName()}`으로 꺼낼 수 있다.

| 쓰는 방법 | 화면에서 꺼내는 이름 |
|-----------|----------------------|
| `@ModelAttribute MenuDTO menu` | `${menuDTO}` |
| `@ModelAttribute("menu") MenuDTO menu` | `${menu}` |
| `model.addAttribute("menu", menu)` 직접 | `${menu}` |

> 한 줄 요약: `@ModelAttribute`는 입력값을 DTO 하나로 묶어 받고, Model에도 자동으로 담는다. 이름은 기본이 `menuDTO`이고, 바꾸려면 괄호에 적는다.

---

## 헷갈렸던 점

### 1. 왜 return message가 아니라 return "request/printResult"일까?

HTML 화면을 보여 주는 방식에서는 두 가지가 나뉘어 있다.

- **어떤 화면을 보여 줄까?** → `return`에 적는다.
- **그 화면에 어떤 값을 채울까?** → `Model`에 담는다.

`return "request/printResult";`는 "`templates/request/printResult.html`로 화면을 그려라"라는 뜻이다.

만약 `return message;`라고 쓰면 어떻게 될까? Spring은 `message`에 담긴 글자, 예를 들어 "아메리카노 을(를) 신규 메뉴 목록…"을 **화면 파일 이름으로 오해**한다. 그런 이름의 HTML 파일을 찾다가 못 찾고 에러를 낸다.

### 2. Model은 왜 써야 할까?

`Model`은 컨트롤러가 만든 값을 화면으로 옮기는 **배달 가방**이다.

1. 컨트롤러에서 `model.addAttribute("message", message);` — 가방에 `"message"`라는 이름표를 붙여 값을 넣는다.
2. 화면에서 `${message}` — 그 이름표로 가방 속 값을 꺼낸다.

주석에 적은 "Model => Request의 영역"도 같은 이야기다. 순수 서블릿에서는 화면에 값을 보낼 때 이렇게 썼다.

```java
// 순수 서블릿 방식
request.setAttribute("message", "GET방식의 메뉴 등록 핸들러 메서드 등록함...");
```

Spring MVC에서는 서블릿의 요청 객체에 직접 기대지 않고 `Model`을 쓴다.

```java
// Spring MVC 방식
model.addAttribute("message", "GET방식의 메뉴 등록 핸들러 메서드 등록함...");
```

두 코드는 같은 일을 한다. 값을 이름표와 함께 담아 두면, 그 요청에 대한 화면을 그릴 때 꺼내 쓸 수 있다.

### 3. 같은 주소에 왜 GET과 POST 메서드를 둘 다 만들까?

`/request/search`에는 메서드가 두 개 있었다. 하나는 화면을 보여 주는 요청이고, 다른 하나는 제출한 데이터를 처리하는 요청이다.

| 요청 방식 | 메서드 | 하는 일 |
|-----------|--------|---------|
| GET | `public void search()` | 검색어를 입력할 **양식 화면을 보여 준다** |
| POST | `public String searchMenu(...)` | 입력한 검색어를 받아 **결과 화면으로 보낸다** |

실제 흐름은 이렇다.

1. 사용자가 주소창에 `/request/search`를 입력한다. GET 요청이다.
2. `@GetMapping("search")` 메서드가 실행된다. 반환 타입이 `void`라서 `request/search.html` 화면이 나온다.
3. 사용자가 양식에 "아메리카노"를 적고 검색 버튼을 누른다. `<form method="post">`라서 POST 요청이다.
4. `@PostMapping("search")` 메서드가 실행된다. 입력값을 받아 결과 화면 `request/searchResult.html`로 보낸다.

노트에는 4번에서 "DB를 조회한다"고 적었다. 실제 서비스라면 그렇게 하겠지만, 이번 실습 코드에는 DB가 없다. 받은 값을 콘솔에 찍고 화면에 보여 주기만 했다.

한 줄로 줄이면, GET은 "입력할 양식을 주세요"이고 POST는 "내가 입력한 값을 가져갈 테니 처리해 주세요"다.

### 4. HttpServletRequest는 왜 안 쓸까?

노트에서 서로 다르게 적었던 부분이다.

- 6번 코드 주석: `//HttpServletRequest 작성하면 XX`
- 뒤쪽 정리: "`HttpServletRequest`를 매개변수로 써도 아무 문제 없다"

공식 문서를 확인하니 `HttpServletRequest`도 핸들러 메서드 매개변수로 받을 수 있다. 쓴다고 에러가 나지는 않는다.

그런데도 잘 쓰지 않는 이유가 있다. Spring의 장점은 `getParameter`로 꺼내고 `parseInt`로 바꾸는 귀찮은 일을 **대신 해 준다**는 것이다. `HttpServletRequest`나 `WebRequest`를 쓰면 그 일을 다시 내가 해야 한다.

| 매개변수 | 꺼내기 | 형변환 | 정리 |
|----------|--------|--------|------|
| `HttpServletRequest` | 직접 | 직접 | 서블릿 방식 그대로. 써도 된다 |
| `WebRequest` | 직접 | 직접 | 서블릿에 직접 기대지 않도록 Spring이 감싼 객체 |
| `@RequestParam` | Spring | Spring | 값이 적을 때 |
| `@ModelAttribute` + DTO | Spring | Spring | 값이 많을 때 |

노트에는 `@ModelAttribute` 없이 DTO를 매개변수로 받는 코드도 있었다.

```java
@PostMapping("regist")
public String registMenu(Model model, MenuDTO menu){
    // menu.getName(), menu.getPrice(), menu.getCategoryCode() 형태로 바로 사용 가능
    return "request/printResult";
}
```

공식 문서에 따르면 `@ModelAttribute`는 생략할 수 있다. `int`나 `String` 같은 단순한 값이 아닌 매개변수는 `@ModelAttribute`가 붙은 것처럼 처리된다. 다만 처음 배울 때는 붙여 두는 편이 코드를 읽기 쉽다.

> 한 줄 요약: `HttpServletRequest`는 써도 된다. 다만 꺼내기와 형변환을 Spring에 맡기려고 `@RequestParam`이나 DTO를 쓴다.

---

## 더 학습하면 좋은 개념

- **DispatcherServlet의 동작 순서** — 요청을 받은 서블릿이 어떻게 맞는 컨트롤러 메서드를 찾고, 화면 이름을 HTML 파일로 바꾸는지 알면 이번에 배운 어노테이션이 왜 동작하는지 보인다.
- **Thymeleaf 기본 문법(`th:text`, `th:each`)** — 이번에는 `th:text`로 값 하나만 보여 줬다. 목록을 반복해서 보여 주려면 다른 문법이 필요하고, 수업 chap6에서 이어진다.
- **IoC 컨테이너와 의존성 주입(DI)** — `@Component`, `@Controller`가 붙은 클래스를 Spring이 직접 만들어 보관한다고만 짚고 넘어갔다. 컨트롤러가 서비스나 DB 코드를 쓰려면 이 개념이 꼭 필요하다.
- **@ResponseBody와 @RestController** — 이번 글은 HTML 화면을 돌려줬다. 화면 대신 데이터(JSON)만 돌려주는 방법을 알면 `void`나 `String` 반환이 왜 다르게 동작하는지도 이해된다.
- **요청 값 검증(Validation)** — 지금은 가격 칸에 글자를 넣어도 막을 방법이 없다. DTO 필드에 규칙을 걸어 잘못된 입력을 걸러 내는 방법으로 이어진다.

## 참고 자료

- [Spring Framework Reference — Mapping Requests](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-requestmapping.html)
- [Spring Framework Reference — @RequestParam](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/requestparam.html)
- [Spring Framework Reference — @ModelAttribute](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/modelattrib-method-args.html)
- [Spring Framework Reference — Method Arguments](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/arguments.html)
- [Spring Framework Reference — Return Values](https://docs.spring.io/spring-framework/reference/web/webmvc/mvc-controller/ann-methods/return-types.html)
- [Spring Boot Reference — Servlet Web Applications](https://docs.spring.io/spring-boot/reference/web/servlet.html)
- [Spring Boot Gradle Plugin — Reacting to Other Plugins](https://docs.spring.io/spring-boot/gradle-plugin/reacting.html)
- [Spring Boot Reference — Common Application Properties](https://docs.spring.io/spring-boot/appendix/application-properties/index.html)
