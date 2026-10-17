---
layout: post
title: "DB의 NULL이 0.0으로 읽힐 때 해결하기"
date: 2026-10-17 14:00:00 +0900
categories: [트러블슈팅]
tags: [Java, JDBC, NULL]
snippet: |
  // getFloat는 NULL을 0.0으로 바꾼다
  emp.setEmpBonus(rset.getFloat("BONUS"));
  // getObject는 NULL을 null로 둔다
  emp.setEmpBonus(
      rset.getObject("BONUS", Float.class)
  );
---

DB에서 값이 비어 있는 보너스 칸을 `getFloat`로 읽었더니 `0.0`이 나와서, `getObject`로 바꿔 비어 있는 채로 받은 기록이다.

## 무엇을 하려던 중이었나 (Situation)

수업 하브루타 과제를 하던 중이었다. EmployeeDB의 직원 표(`TBL_EMPLOYEE`)를 조회해서, 결과를 자바 객체에 옮겨 담는 과제였다.

직원 한 명의 정보는 `EmployeeDTO`라는 상자 하나에 담는다. 상자에는 이름, 급여, 보너스 같은 칸이 14개 있다. 상자가 무엇인지는 [역할 비교 글]({{ site.baseurl }}{% post_url 2026-10-17-java-jdbc-template-dto-properties %})에 정리했다.

보너스는 모든 직원이 받는 게 아니다. 받지 않는 직원은 DB에서 보너스 칸이 비어 있다. 이렇게 비어 있는 값을 `NULL`이라고 부른다. 자바에서 "비어 있음"은 `null`(소문자)이라고 쓴다.

시험 점수로 비유하면 쉽다. 점수 칸에 "0점"이라고 적는 것과, 시험을 안 봐서 칸을 비워 두는 것은 다르다. 보너스도 "0원 받음"과 "보너스 없음"은 다른 이야기다.

## 어떤 문제가 났나 (Task)

직원을 출력해 보니, 보너스를 받지 않는 직원의 보너스가 `0.0`으로 나왔다. 에러 메시지는 나지 않았고, 값만 우리가 원한 것과 달랐다.

```java
emp.setEmpBonus(rset.getFloat("BONUS"));
```

우리가 원한 건 `0.0`이 아니라 비어 있는 채로(`null`) 담기는 것이었다. "보너스 없음"과 "보너스 0원"을 구분하고 싶었기 때문이다.

상자의 보너스 칸(`empBonus`)은 `null`을 담을 수 있게 `Float`(대문자)로 만들어 뒀다. 그래서 `null`이 나올 줄 알았는데 그렇지 않았다.

## 해결 과정 (Action)

### 처음 시도한 방법

가장 먼저 `rset.getFloat("BONUS")`로 읽어서 `setEmpBonus`에 넣었다. 다른 칸을 읽던 방식과 같아서 자연스러웠다.

칸을 `null` 허용으로 만들어 뒀으니, `NULL`이 오면 `null`이 담길 줄 알았다. 그런데 `0.0`이 담겼다. 이때는 왜 그런지 몰랐다.

이 방법은 실패였다. 에러가 나지 않아서 출력을 직접 보지 않으면 알아채기 어려운 문제였다.

### 팀원에게 물어본 과정

원인을 모르는 채로 팀원에게 물어봤다. 팀원은 `getObject`로 받으면 `null`로 가져온다고 알려줬다.

그때 우리는 이렇게 이해했다. "`Object`는 `float`보다 더 큰 범위를 담을 수 있으니까 `null`도 담을 수 있는 것 아닐까?" 결과적으로 방법은 맞았지만, 이유는 달랐다. 아래에서 바로잡는다.

팀원이 알려준 대로 바꿔 봤다.

```java
emp.setEmpBonus(rset.getObject("BONUS", Float.class));
```

실행하니 보너스가 없는 직원이 `empBonus=null`로 출력됐다. 해결은 됐다. 하지만 왜 되는지는 팀원도 나도 정확히 몰랐다.

### 왜 되는지 알아본 과정

이 글을 정리하면서 공식 문서와 자료를 찾아봤다.

**1. `getFloat`가 0.0을 주는 이유**

공식 문서(`ResultSet`)에서는 `getFloat`가 값이 `NULL`이면 `0`을 돌려준다고 설명한다. 에러가 아니라 원래 정해진 동작이다.

`getFloat`가 돌려주는 건 `float`(소문자)다. `float`는 숫자만 담는 칸이다. 비워 둘 수 없으니, 비어 있는 값(`NULL`)이 오면 `0`을 대신 채워 준다. 이 `0`이 출력에서는 `0.0`으로 보인다.

**2. `getObject`가 `null`을 주는 이유**

공식 문서에서는 `getObject(열 이름)`이 값이 `NULL`이면 자바의 `null`을 돌려준다고 설명한다. `getString`과 `getDate`도 `NULL`이면 `null`을 돌려준다.

여기서 많이들 헷갈린다. 비어 있을 수 있는 이유는 **담을 수 있는 범위가 커서가 아니다.** `Float`(대문자)는 `float`를 객체로 감싼 것이어서, 담는 숫자의 범위가 같다. 달라지는 건 담는 방식이다.

- `float`(소문자): 칸 안에 숫자가 직접 들어 있다. 칸이 비어 있을 수 없다.
- `Float`(대문자), `Object`: 칸에는 "값이 있는 곳"을 가리키는 표시만 들어 있다. 가리키는 곳이 없으면 `null`이다.

서랍으로 비유해 보자. `float`는 서랍에 물건을 바로 넣어 둔 것이다. `Float`는 서랍에 "물건은 창고 3번 칸에 있음"이라는 쪽지를 넣어 둔 것이다. 쪽지를 비워 두면 "아무것도 가리키지 않음"을 표현할 수 있다. 다만 이 비유는 실제 메모리 구조를 아주 단순하게 그린 것이다.

> 한 줄 요약: `float`는 비울 수 없어서 `NULL`이 `0.0`이 되고, 객체는 비울 수 있어서 `NULL`이 `null`이 된다.

**3. 문서에서 확인하지 못한 부분**

우리가 쓴 `getObject("BONUS", Float.class)`는 `getObject(열 이름)`과 모양이 다르다. 공식 문서에는 이 모양이 `NULL`일 때 무엇을 돌려주는지 적혀 있지 않다. 지원하는 변환 일부는 드라이버 제작사가 정한다고만 나온다. 드라이버는 자바와 MySQL을 이어 주는 연결 부품이다.

MySQL 쪽 버그 기록(#94533)에서 비슷한 사례를 찾았다. 드라이버 8.0.15 버전에서 `getObject`로 `Float` 같은 객체 타입을 받아도 `NULL`이 `null`이 아니라 0으로 온다는 보고였다. 개발자도 처음에는 버그가 아니라고 봤다. 그러다 JDBC 규약에 "객체 타입에 대응하는 값은 자바의 `null`로 돌려준다"는 내용이 있다는 지적을 받고, 고치기로 했다.

고친 버전 번호는 기록에서 확인하지 못했다. 우리 환경에서는 `null`이 나왔으니 고쳐진 버전을 쓰고 있을 가능성이 크다. 다만 우리 드라이버 버전은 아직 확인하지 않았다.

**4. 다른 방법**

공식 문서에는 `wasNull()`이라는 방법도 나온다. `getFloat`로 읽은 직후 `wasNull()`을 부르면, 방금 읽은 값이 `NULL`이었는지 알려준다. 이 방법은 직접 해 보지 않았다.

### 최종 해결

```java
// getFloat는 NULL을 0.0으로 바꾼다
emp.setEmpBonus(rset.getFloat("BONUS"));
// getObject는 NULL을 null로 둔다
emp.setEmpBonus(
    rset.getObject("BONUS", Float.class)
);
```

**왜 `Float.class`까지 써야 할까?**

`getObject`에는 두 가지 모양이 있다.

| 모양 | 돌려주는 타입 |
|------|---------------|
| `getObject("BONUS")` | `Object` |
| `getObject("BONUS", Float.class)` | `Float` |

보너스 칸(`setEmpBonus`)은 `Float`만 받는다. 그런데 `Object`는 "무엇이든 담을 수 있는 상자"라서, 자바는 그 안에 `Float`이 들어 있는지 알 수 없다. 아래는 이해를 돕기 위한 예시 코드다.

```java
emp.setEmpBonus(rset.getObject("BONUS"));   // 컴파일 에러: Object를 Float 자리에 넣을 수 없다
```

`Float.class`는 "이 값을 `Float`로 돌려줘"라고 알려주는 표시다. 이걸 넘기면 돌려주는 타입이 `Float`이 되어서 바로 보너스 칸에 넣을 수 있다. 공식 문서에서는 이 방식이 열의 SQL 타입을 요청한 자바 타입으로 바꿔 주고, 바꿀 수 없으면 `SQLException`을 던진다고 설명한다.

배달 주문서에 "포장은 `Float` 상자로"라고 적어 보내는 것과 비슷하다. 다만 상자에 옮겨 담는 일은 드라이버가 하고, 옮길 수 없으면 주문이 거절(`SQLException`)된다는 점이 다르다.

형변환으로 `(Float) rset.getObject("BONUS")`라고 쓰는 방법도 떠올릴 수 있다. 이 코드는 컴파일은 되지만, 공식 문서에서 `getObject(열 이름)`이 돌려주는 타입은 열의 SQL 타입에 따라 정해진다고 한다. 안에 든 값이 `Float`이 아니면 실행할 때 오류가 난다. 이 방법은 직접 해 보지 않았다.

읽는 방법별로 `NULL`이 어떻게 오는지 정리하면 이렇다.

| 읽는 방법 | 돌려주는 타입 | `NULL`이면 | 공식 문서에 적혀 있나 |
|-----------|---------------|------------|-----------------------|
| `getFloat("BONUS")` | `float` | `0` | 적혀 있다 |
| `getObject("BONUS")` | `Object` | `null` | 적혀 있다 |
| `getObject("BONUS", Float.class)` | `Float` | `null` (우리가 실행해서 확인) | 적혀 있지 않다 |
| `getString`, `getDate` | `String`, `Date` | `null` | 적혀 있다 |

`ENT_YN`을 읽는 코드가 `entYn == null ? 'N' : ...`으로 처리하는 것도 같은 이유다. `getString`은 `NULL`이면 `null`을 돌려주기 때문에 `null` 검사가 통한다.

## 결과 (Result)

보너스가 없는 직원이 `null`로 담기게 됐다. 직원 한 줄을 출력하면 아래처럼 나온다. 개인 정보가 들어 있는 칸은 `...`으로 줄였다.

```
EmployeeDTO{..., empSalary=1550000, empBonus=null, managerId='null', ...}
```

배운 것은 두 가지다.

- 같은 `NULL`이라도 읽는 방법에 따라 `0.0`이 되기도 하고 `null`이 되기도 한다. 에러가 나지 않아서 출력을 직접 봐야 알 수 있다.
- `float`는 비울 수 없고, `Float`와 `Object`는 비울 수 있다. 이 차이가 `NULL`을 어떻게 받을지 정한다.

아직 모르는 것도 있다.

- **우리가 쓰는 드라이버 버전이 몇인지.** 버그 기록의 8.0.15 이후 어느 버전부터 `null`이 정상으로 오는지도 확인하지 못했다.
- **`getObject(열 이름, 타입)`이 다른 DB나 다른 드라이버에서도 `null`을 돌려주는지.** 공식 문서에 적혀 있지 않아서, 이 결과가 모든 환경에서 같다고 말할 수 없다.

## 더 학습하면 좋은 개념

- **기본 자료형과 래퍼 클래스(`float`와 `Float`)** — `Float`는 `float`를 객체로 감싼 클래스다. 왜 비울 수 있는지, 언제 어느 쪽을 쓰는지 알아야 이번 같은 문제를 미리 피할 수 있다.
- **`wasNull()`** — 읽은 값이 정말 0이었는지 `NULL`이었는지 구분하는 공식 방법이다. `getObject`를 쓰지 않는 코드에서도 쓸 수 있다.
- **SQL의 `NULL`** — "값이 0이다"와 "값이 없다"가 다르다는 것을 DB 쪽에서 먼저 이해해야 한다. 조회할 때 `= NULL`이 아니라 `IS NULL`을 쓰는 이유도 여기서 이어진다.
- **라이브러리 버전 확인** — 같은 코드도 드라이버 버전에 따라 결과가 달랐던 기록이 있다. 지금 쓰는 드라이버 버전을 어디서 확인하는지 알아 두면 원인을 찾을 때 도움이 된다.

## 참고 자료

- [ResultSet (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.sql/java/sql/ResultSet.html)
- [MySQL Bug #94533: getObject for boxed primitive types doesn't return null for NULL columns](https://bugs.mysql.com/94533)
