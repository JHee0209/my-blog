---
layout: post
title: "JDBC란? 자바가 DB와 대화하는 방법"
date: 2026-10-17 13:10:00 +0900
categories: [개념]
tags: [Java, JDBC, Database]
snippet: |
  stmt = conn.createStatement();
  rset = stmt.executeQuery(
      "SELECT * FROM TBL_MENU;");
  while (rset.next()) {
      rset.getString("MENU_NAME");
  }
---

JDBC는 자바 프로그램이 데이터베이스(DB)에 연결해서 SQL을 보내고 결과를 받아 오는 방법을 정해 놓은 자바의 약속이다.

## 이게 없으면 뭐가 불편할까

DB는 데이터를 표 모양으로 저장해 두는 창고다. SQL은 그 창고에 "메뉴 목록 다 보여 줘"처럼 말을 거는 언어다.

자바 프로그램이 메뉴 목록을 화면에 보여 주려면, 먼저 이 창고에 연결해야 한다. 그다음 SQL을 보내고, 돌아온 결과를 읽어야 한다.

이 세 가지를 자바 코드로 하려면 "어떻게 연결하고, 어떻게 보내고, 어떻게 받는지"를 정해 둔 규칙이 필요하다. 그 규칙이 JDBC다.

## 한 문장으로 말하면

배달 앱으로 비유해 보자. 손님(자바 프로그램)은 주문 화면(JDBC)에서 메뉴를 고르고, 주방(DB)은 음식을 만들어 돌려준다. 손님은 주방 안에서 무슨 일이 일어나는지 몰라도 된다.

정확하게는 이렇다. JDBC는 **자바에서 DB의 데이터를 읽고 쓰기 위한 API(Application Programming Interface)** 다. API는 프로그램끼리 대화할 때 쓰는 약속된 창구다.

공식 문서에서는 JDBC를 데이터 소스(주로 관계형 DB)에 있는 데이터에 접근하고 처리하기 위한 API라고 설명한다. 또 DB 종류마다 다른 **드라이버(driver)** 를 끼워 넣어 서로 다른 데이터 소스에 접근할 수 있는 틀이 들어 있다고 한다. 드라이버는 실제로 DB와 이야기하는 연결 부품이다.

비유에는 한계가 있다. 배달 앱의 주문 화면은 보통 한 식당만 연결하지만, JDBC는 드라이버를 바꿔 끼우면 다른 DB에도 같은 방식으로 연결할 수 있다.

> 한 줄 요약: JDBC는 자바가 DB와 이야기하는 표준 창구이고, 실제 대화는 드라이버가 맡는다.

## 그림으로 보기

```mermaid
flowchart LR
    A[연결열기] --> B[SQL보내기]
    B --> C[결과읽기]
    C --> D[닫기]
```

JDBC 코드는 대부분 이 네 단계로 이루어진다. 아래 코드에서 각 단계가 어디인지 찾아볼 수 있다.

## 직접 해보기

수업에서 직접 쳐 본 메뉴 전체 조회 코드다. 설명을 위해 주석은 줄였다.

```java
Connection conn = getConnection();
Statement stmt = null;
ResultSet rset = null;

try {
    stmt = conn.createStatement();
    rset = stmt.executeQuery(
        "SELECT * FROM TBL_MENU;");

    while (rset.next()) {
        System.out.println(
            rset.getString("MENU_NAME") + "은/는"
            + rset.getString("MENU_PRICE") + "원 입니다."
        );
    }
} catch (SQLException e) {
    throw new RuntimeException(e);
} finally {
    close(conn);
    close(rset);
    close(stmt);
}
```

실행하면 `TBL_MENU` 표에 있는 메뉴가 한 줄씩 "OO은/는 N원 입니다." 모양으로 출력된다.

네 단계가 코드의 어디에 있는지 표로 짚어 보자.

| 단계 | 코드 | 하는 일 |
|------|------|---------|
| 연결 열기 | `Connection conn = getConnection();` | DB로 가는 통로를 연다 |
| SQL 보내기 | `stmt = conn.createStatement();` `stmt.executeQuery(...)` | 통로로 SQL을 실어 보낸다 |
| 결과 읽기 | `rset.next()`, `rset.getString(...)` | 돌아온 결과 표를 한 줄씩 읽는다 |
| 닫기 | `close(conn)` `close(rset)` `close(stmt)` | 다 쓴 것들을 닫는다 |

`getConnection()`과 `close()`는 `JDBCTemplate`이라는 클래스에서 가져온 메서드다. `JDBCTemplate`은 수업에서 직접 만든 클래스이고, Spring이 제공하는 `JdbcTemplate`과는 다른 것이다.

## 헷갈렸던 점

**1. Connection, Statement, ResultSet이 각각 뭘까?**

세 개가 한꺼번에 나와서 헷갈린다. 하나씩 역할로 외우면 쉽다.

- `Connection`: DB와 이어진 통로다. 공식 문서에서는 특정 DB와의 연결(세션)이라고 설명한다. SQL은 이 연결 안에서 실행된다.
- `Statement`: 통로로 SQL을 보내는 도구다. 공식 문서에서는 기본적인 SQL문을 보내는 데 쓴다고 설명한다.
- `ResultSet`: 돌아온 결과 표다. 공식 문서에서는 쿼리 결과를 가져오는 데 쓴다고 설명한다.

세 개는 모두 인터페이스라서 `new`로 직접 만들 수 없다. `Connection`이 `createStatement()`로 `Statement`를 만들어 주고, `Statement`가 `executeQuery()`로 `ResultSet`을 만들어 준다. 앞에서 뒤로 이어지는 순서다.

**2. 왜 `while (rset.next())`로 읽을까?**

`ResultSet`에 몇 줄이 들어 있는지 미리 알 수 없다. `next()`는 다음 줄이 있으면 `true`, 없으면 `false`를 돌려준다. 그래서 `while`과 함께 쓰면 "줄이 있는 동안 계속 읽기"가 된다.

`ResultSet`은 처음에 **첫 번째 줄의 앞**에 서 있다. 공식 문서에서는 `next()`를 처음 부르면 첫 줄이 현재 줄이 되고, 다시 부르면 둘째 줄이 된다고 설명한다. 더 읽을 줄이 없으면 `false`를 돌려주고, 마지막 줄 뒤에 서게 된다.

출석 부르기와 비슷하다. 명단 맨 위에서 시작해서 한 줄씩 내려가며 이름을 부른다. 다만 기본 `ResultSet`은 앞으로만 갈 수 있고 한 번만 읽을 수 있다. 읽다가 되돌아갈 수 없다는 점이 다르다.

**3. 왜 닫는 코드를 `finally`에 넣을까?**

SQL을 실행하다가 에러가 날 수 있다. 에러가 나면 `catch`로 넘어가고, `try` 안의 나머지 코드는 건너뛴다. 닫는 코드가 `try` 안에 있으면, 에러가 난 날에는 닫히지 않는다.

`finally`는 `try`가 에러로 끝나든 정상으로 끝나든 실행된다. 자바 튜토리얼에서 이렇게 설명한다. 그래서 뒷정리 코드를 여기에 둔다. 공식 문서(`Statement.close`)에서도 다 쓴 자원은 빨리 닫아야 DB 자원을 붙잡고 있지 않는다고 설명한다.

> 한 줄 요약: `finally`에 닫는 코드를 두면, 에러가 나도 연결과 도구가 닫힌다.

**4. 닫는 순서가 중요할까?**

위 코드는 `conn`, `rset`, `stmt` 순서로 닫는다. 수업에서는 순서가 중요하지 않다고 배웠다. 공식 문서를 확인해 보니 이런 내용이 있었다.

- `Statement`를 닫으면 그 `Statement`가 가진 `ResultSet`도 같이 닫힌다.
- 자바 튜토리얼에서는 try-with-resources(자동으로 닫아 주는 문법)가 자원을 **만든 순서의 반대로** 닫는다고 설명한다.
- 문서에서 "`Connection`을 먼저 닫으면 오류가 난다"고 적은 부분은 찾지 못했다.

그래서 순서가 틀렸다고 단정할 수는 없다. 다만 연 순서의 반대(`rset`, `stmt`, `conn`)로 닫는 것이 공식 문서가 보여 주는 기본 방식이다.

이 코드에서 순서가 크게 문제되지 않았던 이유도 있다. `JDBCTemplate`의 `close()`는 값이 `null`이거나 이미 닫혀 있으면 아무것도 하지 않고 건너뛰도록 만들어져 있다. 그래서 같은 것을 두 번 닫으려다 오류가 나는 일을 피한다.

## 더 학습하면 좋은 개념

- **PreparedStatement** — 이 글의 `Statement`는 SQL을 글자 그대로 보낸다. `PreparedStatement`는 값만 나중에 끼워 넣는 방식이라서, SQL에 값을 붙여 넣을 때 생기는 문제를 줄인다. 실제로 DB 작업을 하려면 거의 반드시 쓰게 된다.
- **try-with-resources** — `finally`에서 직접 `close()`를 부르는 대신 자바가 자동으로 닫아 주는 문법이다. 닫는 것을 잊어버리는 실수를 막아 준다.
- **DTO(Data Transfer Object)** — `ResultSet`에서 읽은 값을 하나로 묶어 담는 클래스다. 지금은 읽자마자 출력하지만, 값을 다른 곳으로 넘기려면 필요하다.
- **properties 파일** — DB 주소와 비밀번호 같은 접속 정보를 코드 밖에 따로 적어 두는 파일이다. 정보를 바꿀 때 코드를 고치지 않아도 된다.

## 참고 자료

- [java.sql 패키지 (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html)
- [Statement (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Statement.html)
- [Connection (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Connection.html)
- [The finally Block (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html)
- [The try-with-resources Statement (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)
- [JDBC Basics (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html)
