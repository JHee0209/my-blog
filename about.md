---
layout: default
title: About
permalink: /about/
---

<style>
/* =========================
   About Page - Redesign
   ========================= */

@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

.about-wrap {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 1.5rem 7rem;
  overflow: hidden;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
  color: #333;
}

/* Background decoration (Dot grid & Glows) */
.about-wrap::before {
  content: "";
  position: absolute;
  top: -100px;
  left: -100px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(106, 90, 255, 0.15) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}
.about-wrap::after {
  content: "";
  position: absolute;
  bottom: -100px;
  right: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(144, 130, 255, 0.1) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

.about-bg-dots {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(#e0dcfc 1.5px, transparent 1.5px);
  background-size: 30px 30px;
  opacity: 0.6;
  z-index: 0;
  pointer-events: none;
}

.about-inner {
  position: relative;
  z-index: 1;
}

/* =========================
   Hero Section
   ========================= */
.about-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 4rem;
}

/* Center Profile */
.about-profile {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about-greeting {
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  background: #f0eeff;
  color: #6a5aff;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.about-name {
  margin: 0;
  color: #1a1a1a;
  font-size: 3rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.about-role {
  margin: 0.8rem 0 1.5rem;
  color: #5c4cff;
  font-size: 1rem;
  font-weight: 600;
}

.about-intro {
  color: #4a4a4a;
  font-size: 1.05rem;
  line-height: 1.6;
  font-weight: 500;
  position: relative;
}
.about-intro::before, .about-intro::after {
  content: '"';
  font-size: 1.5rem;
  font-weight: 900;
  color: #c0b8ff;
  vertical-align: middle;
}
.about-divider {
  width: 40px;
  height: 2px;
  background: #d4d0f5;
  margin: 1.5rem auto;
}

/* Floating Cards Common */
.floating-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(90, 80, 200, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease;
}
.floating-card:hover {
  transform: translateY(-5px);
}

/* Left Code Card */
.about-side-card.left {
  transform: rotate(-3deg);
  background: #232136;
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 4px rgba(106, 90, 255, 0.1);
  color: #e0def4;
}
.about-side-card.left:hover {
  transform: rotate(0deg) translateY(-5px);
}
.window-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 1rem;
}
.window-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.window-dot.red { background: #eb6f92; }
.window-dot.yellow { background: #f6c177; }
.window-dot.green { background: #9ccfd8; }

.about-code {
  font-family: ui-monospace, SFMono-Regular, Consolas, monospace;
  font-size: 0.85rem;
  line-height: 1.7;
}
.about-code .purple { color: #c4a7e7; }
.about-code .green { color: #9ccfd8; }

/* Right Checklist */
.about-side-card.right {
  transform: rotate(3deg);
}
.about-side-card.right:hover {
  transform: rotate(0deg) translateY(-5px);
}
.about-check {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  color: #555;
  margin: 0.7rem 0;
  font-weight: 500;
}
.check-icon {
  width: 20px;
  height: 20px;
  background: #8c82f0;
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

/* =========================
   Core Values Section
   ========================= */
.core-values {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 4rem;
}
.value-card {
  flex: 1;
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(90, 80, 200, 0.06);
  border: 1px solid #f0eeff;
}
.value-icon {
  width: 50px;
  height: 50px;
  background: #f0eeff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
}
.value-title {
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #222;
}
.value-desc {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
}

/* =========================
   Tech Stack Section
   ========================= */
.tech-stack-container {
  border: 1.5px dashed #c0b8ff;
  border-radius: 50px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 4rem;
  background: rgba(255, 255, 255, 0.4);
}
.tech-stack-title {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}
.tech-badges {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}
.tech-badge {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: #fff;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  box-shadow: 0 5px 15px rgba(90, 80, 200, 0.08);
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}
.tech-badge img {
  width: 20px;
  height: 20px;
}

/* =========================
   Bottom 3 Grid Cards
   ========================= */
.about-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.about-info-card {
  background: #f8f9fe;
  border: 1px solid #eef0fa;
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 10px 30px rgba(90, 80, 200, 0.04);
  position: relative;
}
.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.05rem;
  margin-bottom: 1.2rem;
}
.card-header span {
  font-size: 1.2rem;
}

/* Tags */
.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.tag {
  background: #eef0fa;
  color: #444;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}
.handwritten {
  margin-top: 1.5rem;
  color: #777;
  font-size: 0.85rem;
  font-style: italic;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

/* Timeline */
.timeline {
  border-left: 2px solid #e0dcfc;
  padding-left: 1rem;
  margin-left: 0.5rem;
}
.timeline-item {
  position: relative;
  margin-bottom: 1.2rem;
}
.timeline-item:last-child { margin-bottom: 0; }
.timeline-item::before {
  content: "";
  position: absolute;
  left: -1.35rem;
  top: 0.2rem;
  width: 10px;
  height: 10px;
  background: #c0b8ff;
  border-radius: 50%;
  border: 2px solid #fff;
}
.timeline-item.active::before {
  background: #6a5aff;
  box-shadow: 0 0 0 3px rgba(106, 90, 255, 0.2);
}
.timeline-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
  color: #222;
}
.timeline-desc {
  font-size: 0.75rem;
  color: #777;
}

/* Checklist bottom */
.blog-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.blog-list li {
  font-size: 0.85rem;
  color: #555;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.blog-list li::before {
  content: "✔";
  color: #6a5aff;
  font-weight: bold;
}

/* =========================
   GitHub Links & Quote
   ========================= */
.about-github {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-radius: 20px;
  background: #fff;
  border: 1px solid #eef0fa;
  color: #282631;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(90, 80, 200, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  margin-bottom: 3rem;
}
.about-github:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(80, 65, 180, 0.1);
}
.about-github-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.about-github-icon {
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f4fa;
  color: #25232d;
}
.about-github-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}
.about-github-desc {
  margin: 0.2rem 0 0;
  color: #a19da8;
  font-size: 0.75rem;
}
.about-arrow {
  color: #7060ed;
  font-size: 1.2rem;
}

.about-quote {
  text-align: center;
  color: #5c4cff;
  font-weight: 600;
  font-size: 1rem;
}

/* =========================
   Responsive
   ========================= */
@media (max-width: 992px) {
  .about-hero { flex-direction: column; text-align: center; }
  .about-side-card.left, .about-side-card.right { transform: rotate(0); width: 100%; max-width: 400px; }
  .core-values { flex-direction: column; }
  .about-grid { grid-template-columns: 1fr; }
}
</style>

<div class="about-wrap">
  <div class="about-bg-dots"></div>
  <div class="about-inner">

    <section class="about-hero">
      
      <div class="floating-card about-side-card left">
        <div class="window-dots">
          <div class="window-dot red"></div>
          <div class="window-dot yellow"></div>
          <div class="window-dot green"></div>
        </div>
        <div class="about-code">
          <span class="purple">const</span> zoohi = {<br>
          &nbsp;&nbsp;role: <span class="green">"junior developer"</span>,<br>
          &nbsp;&nbsp;goal: <span class="green">"keep learning"</span>,<br>
          &nbsp;&nbsp;state: <span class="green">"in progress..."</span><br>
          };
        </div>
      </div>

      <div class="about-profile">
        <div class="about-greeting">Hello, I'm</div>
        <h1 class="about-name">정주희 👋🏻</h1>
        <p class="about-role">부트캠프 수강생 · 개발 학습 기록</p>
        <p class="about-intro">배우는 것을 좋아하고,<br>조금씩 더 나은 개발자가 되고 싶은 사람입니다.</p>
        <div class="about-divider"></div>
      </div>

      <div class="floating-card about-side-card right">
        <div class="about-check"><div class="check-icon">✓</div> Read docs</div>
        <div class="about-check"><div class="check-icon">✓</div> Build projects</div>
        <div class="about-check"><div class="check-icon">✓</div> Solve problems</div>
        <div class="about-check"><div class="check-icon">✓</div> Write blog</div>
        <div class="about-check"><div class="check-icon">✓</div> Grow :)</div>
      </div>

    </section>

    <section class="core-values">
      <div class="value-card">
        <div class="value-icon">🚀</div>
        <div class="value-title">지속적으로 배우는 개발자</div>
        <div class="value-desc">새로운 기술을 탐구하고,<br>하나씩 내 것으로 만들어갑니다.</div>
      </div>
      <div class="value-card">
        <div class="value-icon">📝</div>
        <div class="value-title">기록하는 개발자</div>
        <div class="value-desc">배운 것을 정리하고 공유하며<br>함께 성장하고 싶습니다.</div>
      </div>
      <div class="value-card">
        <div class="value-icon">🧩</div>
        <div class="value-title">문제를 해결하는 개발자</div>
        <div class="value-desc">작은 문제부터 차근차근<br>깊이 있게 이해하려고 노력합니다.</div>
      </div>
    </section>

    <section class="tech-stack-container">
      <div class="tech-stack-title">✨ Tech Stack & Learning</div>
      <div class="tech-badges">
        <div class="tech-badge"><span>🟧</span> HTML</div>
        <div class="tech-badge"><span>🟦</span> CSS</div>
        <div class="tech-badge"><span>🟨</span> JavaScript</div>
        <div class="tech-badge"><span>🛢️</span> SQL</div>
        <div class="tech-badge"><span>☕</span> Java</div>
      </div>
    </section>

    <section class="about-grid">
      
      <div class="about-info-card">
        <div class="card-header"><span>🌱</span> 관심 있는 분야</div>
        <div class="interest-tags">
          <span class="tag">Web Frontend</span>
          <span class="tag">Clean Code</span>
          <span class="tag">UX/UI</span>
          <span class="tag">Performance</span>
          <span class="tag">Database</span>
          <span class="tag">CS</span>
        </div>
        <div class="handwritten">
          ❝ 꾸준히 경험의 폭을 넓혀가는 중이에요! ↪
        </div>
      </div>

      <div class="about-info-card">
        <div class="card-header"><span>📍</span> 현재 진행 중</div>
        <div class="timeline">
          <div class="timeline-item active">
            <div class="timeline-title">부트캠프 수강</div>
            <div class="timeline-desc">실력 있는 개발자로 한 걸음 더</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-title">프로젝트 경험 쌓기</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-title">기술 블로그 꾸준히 작성하기</div>
          </div>
          <div class="timeline-item">
            <div class="timeline-title">좋은 코드 많이 읽고 배우기</div>
          </div>
        </div>
      </div>

      <div class="about-info-card">
        <div class="card-header"><span>💡</span> 이 블로그에서는...</div>
        <ul class="blog-list">
          <li>개념을 쉽게 정리한 글</li>
          <li>문제 해결 과정과 삽질 기록</li>
          <li>개발에 대한 고민과 인사이트</li>
          <li>작은 개인 프로젝트 기록</li>
        </ul>
      </div>

    </section>

    <a class="about-github" href="https://github.com/JHee0209" target="_blank" rel="noopener">
      <div class="about-github-left">
        <div class="about-github-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>
          </svg>
        </div>
        <div>
          <p class="about-github-name">JHee0209</p>
          <p class="about-github-desc">GitHub · Projects & Code</p>
        </div>
      </div>
      <span class="about-arrow">→</span>
    </a>

    <div class="about-quote">
      “ 오늘의 작은 배움이, 내일의 큰 성장이 되기를. ” 🤍
    </div>

  </div>
</div>