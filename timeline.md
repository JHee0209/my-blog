---
layout: default
title: 전체 학습 흐름
permalink: /timeline/
---

<style>
/* =========================================================
   Timeline 페이지 전용 스타일
   ========================================================= */
.timeline-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 1.5rem 6rem;
}

.timeline-page-head {
  margin-bottom: 2rem;
}

.timeline-page-head h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.03em;
}

.timeline-page-head p {
  color: #6d6979;
  font-size: 0.95rem;
  margin: 0;
}

/* =========================================================
   타임라인 카드 및 레일 공통 스타일 (홈 화면과 동일)
   ========================================================= */
.card {
  background: #fff;
  border: 1px solid #eeedf5;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.sec-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.3rem;
}

.sec-dot {
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6b5aff;
  box-shadow: 0 0 0 4px rgba(107, 90, 255, 0.12);
}

.sec-head h2 {
  margin: 0;
  color: #1a1a2e;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

/* 주차별 목록 레이아웃 */
.tl-weeks {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tl-week-head {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.tl-week-no {
  color: #8d8999;
  font-size: 0.9rem;
  font-weight: 700;
}

.tl-week.is-now .tl-week-no {
  color: #5b4ae0;
}

.tl-week-range {
  color: #c0bcca;
  font-size: 0.8rem;
}

.tl-week.is-now .tl-week-range {
  color: #a9a5b5;
}

/* 레일 선 및 점 */
.tl-rail {
  position: relative;
  height: 2px;
  margin: 0 0.3rem 1.2rem;
  background: #efedf6;
}

.tl-week.is-now .tl-rail {
  background: #e6e2f8;
}

.tl-rail-dot {
  position: absolute;
  top: -4px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #fff;
  border: 2px solid #ddd8ef;
}

.tl-week.is-now .tl-rail-dot {
  background: #6b5aff;
  border-color: #6b5aff;
}

/* 게시글 아이템 리스트 (3열 격자 구조) */
.tl-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.tl-item {
  text-decoration: none;
  display: block;
  background: #faf9fc;
  padding: 0.8rem 0.9rem;
  border-radius: 10px;
  border: 1px solid #f0eff7;
  transition: transform 0.18s, border-color 0.18s, background 0.18s;
}

.tl-item:hover {
  transform: translateY(-2px);
  border-color: #ded7ff;
  background: #fff;
}

.tl-item-date {
  display: block;
  color: #a9a5b5;
  font-size: 0.76rem;
  font-weight: 600;
}

.tl-week.is-now .tl-item-date {
  color: #5b4ae0;
}

.tl-item-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 0.3rem;
  color: #4b4855;
  font-size: 0.85rem;
  line-height: 1.5;
  transition: color 0.18s;
}

.tl-item:hover .tl-item-title {
  color: #5b4ae0;
  font-weight: 600;
}

.tl-more {
  margin-top: 0.8rem;
  color: #9a96a8;
  font-size: 0.78rem;
  font-weight: 600;
}

/* 반응형 모바일 대응 */
@media (max-width: 620px) {
  .tl-items {
    grid-template-columns: 1fr;
  }
  .tl-rail {
    display: none;
  }
}
</style>

<div class="timeline-page">
  <div class="timeline-page-head">
    <h1>🗺️ 전체 학습 흐름</h1>
    <p>부트캠프 시작부터 지금까지 작성한 주차별 전체 기록입니다.</p>
  </div>

  <!-- 전체 주차(weeks=99), 주차당 최대 10개(per_week=10)까지 제한 없이 출력 -->
  {% include timeline.html title="전체 학습 로드맵" weeks=99 per_week=10 %}
</div>