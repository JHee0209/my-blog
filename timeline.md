---
layout: default
title: Timeline
permalink: /timeline/
---

<div class="timeline-page-container">
  <div class="page-header">
    <h1>🗺️ 전체 학습 로드맵</h1>
    <p>부트캠프 시작일부터 현재까지의 주차별 학습 및 문제 해결 기록입니다.</p>
  </div>

  <!-- 메인 홈에 있는 학습 흐름 컴포넌트를 전체 주차(weeks: 99)로 불러와서 표시 -->
  {% include timeline.html title="주차별 학습 목록" weeks=99 per_week=10 %}
</div>

<style>
.timeline-page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #111827;
}

.page-header p {
  font-size: 1rem;
  color: #6b7280;
}
</style>