---
layout: post
title: "JDBC란? 연결부터 JDBCTemplate, DTO까지"
date: 2026-10-15 20:00:00 +0900
categories: [개념]
tags: [Java, JDBC, DTO]
snippet: |
  stmt = conn.createStatement();
  rset = stmt.executeQuery(
      "SELECT * FROM TBL_MENU;");
  while (rset.next()) {
      rset.getString("MENU_NAME");
  }
---

JDBC는 자바 프로그램이 데이터베이스(DB)에 연결해서 SQL을 보내고 결과를 받아 오는 방법을 정해 놓은 자바의 약속이고, 이 글은 그 기본 사용법과 함께 쓰는 properties, JDBCTemplate, DTO까지 정리한다.

2026년 10월 15일 수업에서 진행한 내용을 정리했다.

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

`getConnection()`과 `close()`는 `JDBCTemplate`이라는 클래스에서 가져온 메서드다. 이 클래스는 아래 "properties, JDBCTemplate, DTO" 섹션에서 자세히 본다.

## 드라이버는 어떻게 프로젝트에 넣을까?

앞에서 실제 대화는 드라이버가 맡는다고 했다. 그래서 드라이버가 프로젝트에 없으면 연결 자체가 안 된다. MySQL용 드라이버의 이름은 **MySQL Connector/J**다.

이렇게 프로젝트가 빌려 쓰는 외부 부품을 **의존성(dependency)** 이라고 부른다. 의존성 목록은 `build.gradle` 파일의 `dependencies` 안에 적는다.

장보기 목록과 비슷하다. 목록에 적어 두면 Gradle이 그 부품을 받아 온다. 다만 장보기와 달리, 목록에 적기만 하면 아직 받아 온 것이 아니다. IntelliJ의 코끼리 버튼(Gradle 새로고침)을 눌러야 반영된다.

수업에서는 Maven 저장소 사이트에서 `mysql-connector-j` 8.4 버전을 찾았다. 거기 적힌 한 줄을 복사해 `dependencies` 안에 붙여 넣었다.

```groovy
// 예시 코드: 실제 줄은 Maven 저장소 사이트에서 복사한다
dependencies {
    implementation 'com.mysql:mysql-connector-j:8.4.0'
}
```

여기서 많이들 놓친다. 새 프로젝트(chap02)를 만들고 `JDBCTemplate`과 properties 파일만 복사해 왔더니, `Application01`을 실행하자 오류가 났다. 새 프로젝트의 `build.gradle`에는 의존성이 없었기 때문이다. 줄을 추가하고 코끼리 버튼을 누르니 연결됐다.

> 한 줄 요약: 드라이버는 `build.gradle`에 적고 새로고침해야 프로젝트에 들어온다. 프로젝트를 새로 만들면 다시 적어야 한다.

## 연결 코드를 매번 써야 할까? — properties, JDBCTemplate, DTO

### 이게 없으면 뭐가 불편할까

앞의 조회 코드는 `getConnection()`을 부르기만 하면 DB에 연결됐다. 그런데 이걸 도와주는 세 가지가 없다고 생각해 보자.

DB 주소, 아이디, 비밀번호를 DB를 쓰는 모든 코드에 직접 적어야 한다. DB 주소가 바뀌면 그 코드를 전부 찾아서 고쳐야 한다. 연결을 만들고 닫는 코드도 파일마다 똑같이 복사해 붙여야 한다.

게다가 직원 한 명의 정보는 이름, 급여, 부서 코드 등 14가지다. 이걸 낱개로 하나씩 들고 다니면 코드가 금세 복잡해진다.

세 가지는 이 불편함을 하나씩 맡아서 줄여 준다.

### 한 문장으로 말하면

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

### 그림으로 보기

```mermaid
flowchart LR
    A[properties] -->|접속정보| B[JDBCTemplate]
    B -->|Connection| C[실행코드]
    C -->|결과 담기| D[DTO]
```

접속 정보는 properties에서 `JDBCTemplate`으로, 연결은 `JDBCTemplate`에서 실행 코드로, 읽은 결과는 실행 코드에서 DTO로 흘러간다.

### 직접 해보기

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

**5. 한 줄만 담을 때 (Application03)**

메뉴 DB에서도 같은 방식으로 `MenuDTO`를 만들었다. 칸은 메뉴 번호, 이름, 가격, 카테고리 번호, 판매 상태 다섯 개다. 이번에는 입력받은 메뉴 이름 하나로 찾기 때문에 결과가 한 줄이다.

```java
MenuDTO menu = null;

if (rset.next()) {
    menu = new MenuDTO();
    menu.setMenuCode(rset.getInt("MENU_CODE"));
    menu.setMenuName(rset.getString("MENU_NAME"));
    menu.setMenuPrice(rset.getInt("MENU_PRICE"));
    menu.setCategoryCode(rset.getInt("CATEGORY_CODE"));
    menu.setOrderableStatus(rset.getString("ORDERABLE_STATUS").charAt(0));
}

System.out.println("menu = " + menu);
```

결과가 한 줄이니 `while` 대신 `if`를 썼다. 목록(`List`)도 필요 없고, 상자 하나면 된다. 찾는 메뉴가 없으면 `if` 안으로 들어가지 않는다. 그래서 `menu`는 `null`로 남고, `menu = null`이 출력된다.

판매 상태(`orderableStatus`)는 `'Y'` 같은 글자 하나라서 `char`로 만들었다. 그런데 `ResultSet`에는 `char`를 바로 꺼내는 메서드가 없다. 그래서 `getString`으로 문자열을 꺼낸 뒤, `charAt(0)`으로 첫 글자만 잘라 담았다.

DB에서 읽은 값을 굳이 객체로 옮기는 이유는, 그래야 자바 코드에서 이어서 쓸 수 있기 때문이다. 출력만 하고 끝나면 값이 사라지지만, 객체에 담아 두면 다른 메서드로 넘기거나 목록에 모을 수 있다.

이 코드는 메뉴 이름을 SQL 문자열에 직접 이어 붙여 조회했다. 그 방식의 문제와 고치는 방법은 아래 PreparedStatement 섹션에서 본다.

> 한 줄 요약: 결과가 여러 줄이면 `while`과 목록, 한 줄이면 `if`와 상자 하나로 담는다.

## 조회와 변경은 무엇이 다를까?

지금까지는 `SELECT`로 읽기만 했다. 그런데 데이터를 추가하거나(`INSERT`), 고치거나(`UPDATE`), 지울(`DELETE`) 때는 다른 메서드를 쓴다.

도서관 사서에 비유해 보자. "이 책 있어요?"라고 물으면 사서는 책 목록을 건네준다. "이 책 반납할게요"라고 하면 "1권 처리됐어요"라는 숫자만 돌아온다. 다만 실제 메서드는 무엇이 바뀌었는지는 알려 주지 않고, 개수만 알려 준다.

| SQL 종류 | 실행 메서드 | 돌려주는 것 |
|----------|-------------|-------------|
| `SELECT` | `executeQuery()` | 결과 표(`ResultSet`) |
| `INSERT`, `UPDATE`, `DELETE` | `executeUpdate()` | 바뀐 행(표의 한 줄)의 개수, `int` |

공식 문서에서는 `executeUpdate()`가 데이터를 바꾸는 SQL이면 영향을 받은 행의 수를 돌려준다고 설명한다. 그래서 `UPDATE`가 두 행을 바꿨다면 `2`가 나온다. `0`이 나오면 조건에 맞는 행이 하나도 없었다는 뜻일 수 있다.

> 한 줄 요약: 읽을 때는 `executeQuery()`로 결과 표를 받고, 바꿀 때는 `executeUpdate()`로 바뀐 줄 수를 받는다.

## 입력받은 값으로 조회하려면? — PreparedStatement

### 왜 필요할까

앞에서 본 `Application03`은 사용자가 입력한 메뉴 이름으로 메뉴를 찾는다. 입력값을 SQL 문자열에 직접 이어 붙였다. 아래는 그 코드에서 줄바꿈만 한 것이다.

```java
rset = stmt.executeQuery(
    "SELECT * FROM TBL_MENU WHERE MENU_NAME= '"
    + menuName + "'");
```

이 방식에는 두 가지 문제가 있다. 첫째, 작은따옴표(`'`)와 큰따옴표(`"`)의 짝을 맞추기가 헷갈린다. 둘째, 입력값이 SQL 문장의 일부가 되어 버린다.

둘째 문제가 더 위험하다. 입력값에 `'`가 섞이면 SQL 문장의 모양이 바뀐다. 이를 악용해 원래 의도와 다른 SQL을 실행시키는 공격을 **SQL 인젝션(SQL injection)** 이라고 부른다.

### 한 문장으로 말하면

`PreparedStatement`는 **빈칸이 뚫린 SQL 양식**이다. SQL을 먼저 만들어 두고, 값은 나중에 빈칸에 끼워 넣는다.

이름 칸이 비어 있는 신청서와 비슷하다. 칸에 무엇을 적든, 그 내용은 "이름"으로만 읽힌다. 신청서 문장 자체가 바뀌지는 않는다. 다만 신청서와 달리, 칸에 맞는 메서드를 골라 넣어야 한다. 숫자는 `setInt`, 글자는 `setString`처럼.

공식 튜토리얼에서는 `PreparedStatement`가 사용자가 넣은 값을 언제나 SQL 문장이 아닌 값으로만 다룬다고 설명한다. 그래서 SQL 인젝션을 막는 것이 가장 큰 장점이라고 한다.

### 직접 해보기

수업 노트에 정리한 예시다. 빈칸은 `?`로 적는다.

```java
String sql = "SELECT * FROM tbl_menu WHERE menu_code = ?";

try (PreparedStatement pstmt = conn.prepareStatement(sql)) {
    pstmt.setInt(1, 10);

    try (ResultSet rs = pstmt.executeQuery()) {
        while (rs.next()) {
            // 조회 결과 처리
        }
    }
}
```

`setInt(1, 10)`은 "첫 번째 `?`에 숫자 10을 넣어라"라는 뜻이다. 여기서 많이들 헷갈린다. `?`의 번호는 0이 아니라 **1부터** 센다.

`pstmt.executeQuery()`의 괄호는 비어 있다. SQL은 `prepareStatement(sql)`로 만들 때 이미 넣었기 때문이다.

앞의 `Application03`을 이 방식으로 바꾸면 이렇게 된다.

```java
// 예시 코드: Application03을 PreparedStatement로 바꿔 본 것
String sql = "SELECT * FROM TBL_MENU WHERE MENU_NAME = ?";
PreparedStatement pstmt = conn.prepareStatement(sql);
pstmt.setString(1, menuName);
rset = pstmt.executeQuery();
```

따옴표를 이어 붙이는 코드가 사라졌다. `PreparedStatement`는 `Statement`를 물려받은 인터페이스라서, `JDBCTemplate`의 `close(Statement stmt)`로 그대로 닫을 수 있다.

> 한 줄 요약: 입력값이 들어가는 SQL은 `?`로 빈칸을 두고 `setXxx`로 값을 끼운다. 번호는 1부터다.

## 닫는 코드를 줄일 수 있을까? — try-with-resources

앞의 코드는 `finally`에서 `close()`를 세 번 불렀다. **try-with-resources**는 이 일을 자바가 대신 해 주는 문법이다. `try` 옆 괄호 안에서 만든 것은 블록이 끝나면 자동으로 닫힌다.

나갈 때 자동으로 꺼지는 센서 조명과 비슷하다. 스위치를 끄는 걸 잊어도 괜찮다. 다만 괄호 안에서 만든 것만 꺼 준다. 괄호 밖에서 만든 것은 여전히 직접 닫아야 한다.

수업 노트에 정리한 연결 확인 예시다. 접속 정보는 가렸다.

```java
String url = "jdbc:mysql://localhost:3306/menudb";
String user = "사용자명";
String password = "비밀번호";

String sql = "SELECT 1";

try (
    Connection conn = DriverManager.getConnection(url, user, password);
    PreparedStatement pstmt = conn.prepareStatement(sql);
    ResultSet rs = pstmt.executeQuery()
) {
    if (rs.next()) {
        System.out.println("조회 결과: " + rs.getInt(1));
    }
} catch (SQLException e) {
    e.printStackTrace();
}
```

`finally`도, `close()`도 없다. 블록이 끝나면 `rs`, `pstmt`, `conn` 순서로 닫힌다. 만든 순서의 반대다. `rs.getInt(1)`은 현재 줄의 첫 번째 열 값을 정수로 읽는다는 뜻이다.

`SELECT 1`은 테이블 없이 숫자 1만 돌려주는 SQL이다. 연결이 되는지만 확인할 때 쓰기 좋다.

> 한 줄 요약: try-with-resources를 쓰면 괄호 안에서 만든 자원이 블록 끝에서 자동으로, 만든 반대 순서로 닫힌다.

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

**5. `conn = null`로 바꾸면 연결이 닫힐까?**

처음 만든 연결 코드(chap01의 `Application01`)에는 `finally`에 이런 줄이 있었다.

```java
} finally {
    conn = null;
    //가비지 컬렉터가 삭제할 수 있도록 null값으로 만들어 준다.
}
```

그때는 `null`로 바꾸면 연결이 정리된다고 생각했다. 하지만 이 줄은 연결을 닫지 않는다. 변수 `conn`이 더 이상 연결을 가리키지 않게 될 뿐이다.

전화로 비유하면, 통화를 끊지 않고 연락처 메모만 지운 것과 같다. 메모가 없어도 전화는 아직 연결되어 있다. 다만 실제 연결은 언젠가 정리될 수도 있다. 그 시점을 내가 정할 수 없다는 점이 문제다.

공식 문서(`Connection.close`)에서는 `close()`가 자동으로 풀려나기를 기다리지 않고 DB와 JDBC 자원을 **바로** 놓아 준다고 설명한다. 그래서 나중에 만든 `JDBCTemplate`에서는 `conn.close()`를 직접 부르도록 바꿨다.

> 한 줄 요약: 연결을 닫으려면 `close()`를 불러야 한다. `null`은 변수만 비운다.

**6. JDBCTemplate은 Spring의 JdbcTemplate과 같은 걸까?**

다른 것이다. 철자가 `JDBCTemplate`(대문자 DBC)과 `JdbcTemplate`(소문자 dbc)로 거의 같다. 하지만 이 글의 `JDBCTemplate`은 수업에서 `com.wanted.common` 패키지에 직접 만든 클래스다. 안에는 `getConnection()`과 `close()` 같은 메서드밖에 없다.

**7. 접속 정보는 왜 코드 안이 아니라 파일에 적을까?**

코드 안에 적으면 DB 주소나 비밀번호가 바뀔 때마다 코드를 고쳐야 한다. properties 파일에 적어 두면 파일 한 곳만 고치면 된다. `JDBCTemplate`이 연결을 만들 때마다 이 파일을 읽기 때문이다.

**8. properties, JDBCTemplate, DTO는 서로를 대신할 수 있을까?**

없다. 비슷해 보여도 맡은 일이 다르다. 정리하면 이렇다.

| 질문 | 답 |
|------|----|
| DB 주소를 바꾸고 싶다 | properties 파일을 고친다 |
| 연결을 만들거나 닫는 방법을 바꾸고 싶다 | `JDBCTemplate`을 고친다 |
| 직원 정보에 칸을 하나 늘리고 싶다 | DTO를 고친다 |

**9. 보너스가 비어 있는 직원은 어떻게 담을까?**

보너스를 받지 않는 직원의 칸은 DB에서 비어 있다(`NULL`). 이 칸을 `rset.getFloat("BONUS")`로 읽으면 `NULL`이 `0`으로 바뀐다. "보너스 0원"과 "보너스 없음"을 구분할 수 없게 된다.

`Application07`은 `rset.getObject("BONUS", Float.class)`로 읽어서 `null`을 그대로 담았다. `float`(소문자)는 숫자만 담는 칸이라 비울 수 없지만, `Float`(대문자)는 객체라서 비울 수 있기 때문이다.

이 문제를 겪고 푼 과정은 [DB의 NULL이 0.0으로 읽힐 때 해결하기]({{ site.baseurl }}{% post_url 2026-10-17-java-jdbc-getfloat-null %})에 따로 정리했다.

**10. 비밀번호가 콘솔에 찍힌다.**

`JDBCTemplate`에는 `System.out.println("prop = " + prop)`가 있다. 이 줄은 properties의 모든 값을 출력하니 비밀번호도 같이 찍힌다. 연결이 잘 되는지 확인하는 용도라면, 확인이 끝난 뒤 지우는 편이 안전하다.

**11. 클래스 이름 없이 `getConnection()`만 써도 되는 이유는?**

`getConnection()`과 `close()`는 `static` 메서드다. `static` 메서드는 원래 `JDBCTemplate.getConnection()`처럼 클래스 이름을 붙여서 부른다. 그런데 수업 코드는 `getConnection()`만 썼다. 맨 위에 이런 줄이 있었기 때문이다.

```java
import static com.wanted.b_template.JDBCTemplate.close;
import static com.wanted.b_template.JDBCTemplate.getConnection;
```

이것을 **static import**라고 부른다. 휴대폰 단축 번호와 비슷하다. 한 번 등록해 두면 전체 번호 대신 짧게 부를 수 있다. 다만 단축 번호가 많아지면 누구 번호인지 헷갈리듯, 코드에서도 이 메서드가 어느 클래스 것인지 알아보기 어려워진다.

공식 문서에서도 static import는 아껴 쓰라고 하고, 한두 클래스의 `static` 멤버를 자주 쓸 때 쓰라고 설명한다. `JDBCTemplate`처럼 DB 코드마다 반복해서 부르는 경우가 여기에 맞는다.

## 더 학습하면 좋은 개념

- **SQL 인젝션** — 입력값이 SQL 문장으로 해석되면 어떤 일이 생기는지 알아 두면, 왜 `PreparedStatement`를 써야 하는지 더 분명해진다.
- **JDBC 트랜잭션(`setAutoCommit`, `commit`, `rollback`)** — `executeUpdate()`로 여러 줄을 바꿀 때, 하나라도 실패하면 전부 되돌려야 할 수 있다. 트랜잭션 자체는 [MySQL 글]({{ site.baseurl }}{% post_url 2026-10-12-mysql-select-view-index-transaction %})에 정리했고, 자바에서 다루는 방법은 따로 배워야 한다.
- **Spring의 JdbcTemplate** — 이름이 비슷하지만 다른 도구다. 나중에 만나면 이 글의 `JDBCTemplate`과 구분해야 한다.
- **캡슐화(encapsulation)** — 필드를 `private`으로 감추고 Getter와 Setter로만 다루는 이유다. DTO를 만들 때마다 이 규칙을 쓴다.
- **MVC 패턴** — 지금은 입력, DB 조회, 출력이 `main` 하나에 다 들어 있다. 이 역할을 나눠 담는 구조가 MVC이고, DTO는 그 사이에서 값을 실어 나르는 역할을 맡는다.

## 참고 자료

- [java.sql 패키지 (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/package-summary.html)
- [Statement (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Statement.html)
- [Connection (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/Connection.html)
- [ResultSet (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/ResultSet.html)
- [PreparedStatement (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/PreparedStatement.html)
- [Properties (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Properties.html)
- [JDBC Basics (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/jdbc/basics/index.html)
- [Using Prepared Statements (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/jdbc/basics/prepared.html)
- [The finally Block (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/essential/exceptions/finally.html)
- [The try-with-resources Statement (The Java Tutorials)](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)
- [Static Import (Java SE 8 Guide)](https://docs.oracle.com/javase/8/docs/technotes/guides/language/static-import.html)
- [MySQL Connector/J: Maven으로 설치하기](https://dev.mysql.com/doc/connector-j/en/connector-j-installing-maven.html)
- [MySQL Connector/J: DriverManager로 연결하기](https://dev.mysql.com/doc/connector-j/en/connector-j-usagenotes-connect-drivermanager.html)
