---
layout: default
title: 전체 학습 흐름
permalink: /timeline/
---

<style>
.timeline-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 3rem 1.5rem 6rem;
}
.timeline-page-head {
  margin-bottom: 2.5rem;
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
</style>

<div class="timeline-page">
  <div class="timeline-page-head">
    <h1>🗺️ 전체 학습 흐름</h1>
    <p>부트캠프 시작부터 지금까지 작성한 주차별 전체 기록입니다.</p>
  </div>

  <!-- 전체 주차(weeks=99), 주차당 최대 10개(per_week=10)까지 제한 없이 출력 -->
  {% include timeline.html title="전체 학습 로드맵" weeks=99 per_week=10 %}
</div>