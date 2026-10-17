---
layout: post
title: "JDBCTemplate, DTO, properties는 각각 뭘 할까"
date: 2026-10-17 13:20:00 +0900
categories: [개념]
tags: [Java, JDBC, DTO]
snippet: |
  driver=com.mysql.cj.jdbc.Driver
  url=jdbc:mysql://localhost/employeedb
  user=****
  password=****
---

JDBC 프로그램에는 properties 파일, `JDBCTemplate`, DTO가 함께 나오는데, 이 글은 세 가지가 각각 무슨 일을 맡는지 비교한다.

## 이게 없으면 뭐가 불편할까

앞 글의 `Application01` 코드는 `getConnection()`을 부르기만 하면 DB에 연결됐다. 그런데 이 세 가지가 없다고 생각해 보자.

DB 주소, 아이디, 비밀번호를 DB를 쓰는 모든 코드에 직접 적어야 한다. DB 주소가 바뀌면 그 코드를 전부 찾아서 고쳐야 한다. 연결을 만들고 닫는 코드도 파일마다 똑같이 복사해 붙여야 한다.

게다가 직원 한 명의 정보는 이름, 급여, 부서 코드 등 14가지다. 이걸 낱개로 하나씩 들고 다니면 코드가 금세 복잡해진다.

세 가지는 이 불편함을 하나씩 맡아서 줄여 준다.

## 한 문장으로 말하면

식당 예약에 비유해 보자.

- **properties 파일**은 식당 주소와 전화번호를 적어 둔 메모다.
- **`JDBCTemplate`** 은 메모를 보고 전화를 걸어 예약하고, 식사가 끝나면 자리를 정리해 주는 비서다.
- **DTO**는 음식을 담아 오는 도시락 상자다. 상자에는 칸이 나뉘어 있어서 직원 한 명의 정보를 칸마다 담을 수 있다.

비유에는 한계가 있다. 비서는 알아서 움직이지만 `JDBCTemplate`은 우리가 `getConnection()`을 부를 때만 일한다.

정확한 이름을 붙이면 이렇다.

| 이름 | 정체 | 하는 일 |
|------|------|---------|
| properties 파일 | 문자열 `key=value`를 한 줄씩 적어 둔 설정 파일 | DB 접속 정보를 코드 밖에 보관한다 |
| `JDBCTemplate` | 수업에서 직접 만든 클래스 | 연결을 만들고(`getConnection`), 다 쓴 것을 닫는다(`close`) |
| DTO(Data Transfer Object) | 값을 담는 용도로 만든 클래스 | 직원 한 명의 정보를 한 덩어리로 묶는다 |

> 한 줄 요약: properties는 정보를 적어 두고, `JDBCTemplate`은 그 정보로 연결을 만들고, DTO는 읽어 온 값을 담는다.

## 그림으로 보기

```mermaid
flowchart LR
    A[properties] -->|접속정보| B[JDBCTemplate]
    B -->|Connection| C[실행코드]
    C -->|결과 담기| D[DTO]
```

접속 정보는 properties에서 `JDBCTemplate`으로, 연결은 `JDBCTemplate`에서 실행 코드로, 읽은 결과는 실행 코드에서 DTO로 흘러간다.

## 직접 해보기

세 파일을 하나씩 살펴보자.

**1. properties 파일**

```properties
driver=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://localhost/employeedb
user=****
password=****
```

`driver`는 MySQL과 대화하는 드라이버 클래스의 이름이고, `url`은 DB의 주소다. 아이디와 비밀번호는 가렸다. 공식 문서에서는 `Properties`를 키와 값이 모두 문자열인 설정 모음이라고 설명한다. 한 줄에 `=`로 키와 값을 나눠 적고, `#`으로 시작하는 줄은 주석이다.

**2. JDBCTemplate이 properties를 읽는 부분**

```java
String driver = prop.getProperty("driver");
String url = prop.getProperty("url");
String user = prop.getProperty("user");
String password = prop.getProperty("password");

Class.forName(driver);

conn = DriverManager.getConnection(
        url, user, password
);
```

`JDBCTemplate`은 `FileReader`로 properties 파일을 읽어서 `prop`에 담는다. 그다음 `prop.getProperty("url")`처럼 이름표로 값을 꺼낸다. `Class.forName(driver)`는 드라이버 클래스를 불러오는 줄이다. MySQL Connector/J 공식 문서의 예시에도 같은 방식이 나온다.

마지막으로 `DriverManager.getConnection`이 이 값들로 DB와 연결을 만든다.

**3. 다 쓴 뒤 닫는 부분**

```java
public static void close(Statement stmt) {
    try {
        if (stmt!=null && !stmt.isClosed()) {
            stmt.close();
        }
    } catch (SQLException e) {
        throw new RuntimeException(e);
    }
}
```

`close`는 `Connection`, `Statement`, `ResultSet` 세 가지가 같은 모양으로 있다. 값이 없거나(`null`) 이미 닫혀 있으면 아무것도 하지 않고, 열려 있을 때만 닫는다.

**4. DTO**

직원 전체 조회 코드(`Application06`)에서 DTO를 채우는 부분이다. 칸이 많아서 세 칸만 남기고 줄였다.

```java
List<EmployeeDTO> empList = new ArrayList<>();

while (rset.next()) {
    EmployeeDTO emp = new EmployeeDTO();   // 빈 상자를 만든다

    emp.setEmpId(rset.getString("EMP_ID"));
    emp.setEmpName(rset.getString("EMP_NAME"));
    emp.setEmpSalary(rset.getInt("SALARY"));
    // 나머지 칸도 같은 방식으로 채운다

    empList.add(emp);                      // 채운 상자를 목록에 담는다
}
```

`ResultSet`의 결과 표에서 한 줄을 읽을 때마다 새 상자(DTO) 하나를 만든다. 그 줄의 값을 칸마다 Setter로 넣고, 다 채운 상자를 목록에 담는다. 이 목록은 앞서 본 `ArrayList`다. 반복이 끝나면 직원 한 명이 DTO 하나인 목록이 남는다.

`EmployeeDTO` 안에는 칸 14개(필드)가 있다. `empId`, `empName`, `empSalary`처럼 직원 한 명의 정보를 한 칸씩 담는다. 수업에서 만든 파일의 주석에는 DTO의 기본 구성 요소 다섯 가지가 적혀 있다.

| 구성 요소 | 쉽게 말하면 |
|-----------|-------------|
| 필드 | 값을 담는 칸 |
| 기본 생성자 | 빈 상자를 만든다 (`new EmployeeDTO()`) |
| 모든 필드를 초기화하는 생성자 | 상자를 만들면서 14칸을 한 번에 채운다 |
| Getter, Setter | 칸의 값을 꺼내는 메서드(get)와 바꾸는 메서드(set) |
| `toString` | 상자 안의 내용을 글자로 보여 준다 |

필드는 `private`이라서 클래스 밖에서 직접 건드릴 수 없다. 그래서 Getter와 Setter가 값을 넣고 꺼내는 통로가 된다.

## 헷갈렸던 점

**1. JDBCTemplate은 Spring의 JdbcTemplate과 다른 것이다.**

철자가 `JDBCTemplate`(대문자 DBC)과 `JdbcTemplate`(소문자 dbc)로 거의 같다. 하지만 이 글의 `JDBCTemplate`은 수업에서 `com.wanted.common` 패키지에 직접 만든 클래스다. 안에는 `getConnection()`과 `close()` 같은 메서드밖에 없다.

**2. 접속 정보는 왜 코드 안이 아니라 파일에 적을까?**

코드 안에 적으면 DB 주소나 비밀번호가 바뀔 때마다 코드를 고쳐야 한다. properties 파일에 적어 두면 파일 한 곳만 고치면 된다. `JDBCTemplate`이 연결을 만들 때마다 이 파일을 읽기 때문이다.

**3. 세 가지는 서로를 대신하지 못한다.**

비슷해 보여도 맡은 일이 다르다. 정리하면 이렇다.

| 질문 | 답 |
|------|----|
| DB 주소를 바꾸고 싶다 | properties 파일을 고친다 |
| 연결을 만들거나 닫는 방법을 바꾸고 싶다 | `JDBCTemplate`을 고친다 |
| 직원 정보에 칸을 하나 늘리고 싶다 | DTO를 고친다 |

**4. 보너스가 비어 있는 직원은 어떻게 담을까?**

보너스를 받지 않는 직원의 칸은 DB에서 비어 있다(`NULL`). 이 칸을 `rset.getFloat("BONUS")`로 읽으면 `NULL`이 `0`으로 바뀐다. "보너스 0원"과 "보너스 없음"을 구분할 수 없게 된다.

`Application07`은 `rset.getObject("BONUS", Float.class)`로 읽어서 `null`을 그대로 담았다. `float`(소문자)는 숫자만 담는 칸이라 비울 수 없지만, `Float`(대문자)는 객체라서 비울 수 있기 때문이다.

이 문제를 겪고 푼 과정은 [DB의 NULL이 0.0으로 읽힐 때 해결하기]({{ site.baseurl }}{% post_url 2026-10-17-java-jdbc-getfloat-null %})에 따로 정리했다.

**5. 비밀번호가 콘솔에 찍힌다.**

`JDBCTemplate`에는 `System.out.println("prop = " + prop)`가 있다. 이 줄은 properties의 모든 값을 출력하니 비밀번호도 같이 찍힌다. 연결이 잘 되는지 확인하는 용도라면, 확인이 끝난 뒤 지우는 편이 안전하다.

## 더 학습하면 좋은 개념

- **Spring의 JdbcTemplate** — 이름이 비슷하지만 다른 도구다. 나중에 만나면 이 글의 `JDBCTemplate`과 구분해야 한다.
- **PreparedStatement** — 값을 SQL에 직접 붙이지 않고 나중에 끼워 넣는 방식이다. DTO에 담은 값을 DB에 저장할 때 쓰게 된다.
- **try-with-resources** — `close()`를 직접 부르는 대신 자바가 자동으로 닫아 주는 문법이다. `JDBCTemplate`의 `close` 메서드들이 하는 일을 문법으로 대신해 준다.
- **캡슐화(encapsulation)** — 필드를 `private`으로 감추고 Getter와 Setter로만 다루는 이유다. DTO를 만들 때마다 이 규칙을 쓴다.

## 참고 자료

- [Properties (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Properties.html)
- [java.sql 패키지 (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html)
- [ResultSet (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/ResultSet.html)
- [MySQL Connector/J: DriverManager로 연결하기](https://dev.mysql.com/doc/connector-j/en/connector-j-usagenotes-connect-drivermanager.html)
