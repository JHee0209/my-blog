---
layout: default
title: About
permalink: /about/
---

<style>
.about-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem 7rem;
}

.about-card {
  max-width: 460px;
  margin: 0 auto;
  text-align: center;
}

.about-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(140deg, #6b5aff, #4a3aff);
  color: #fff;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.3rem;
  box-shadow: 0 6px 18px rgba(74, 58, 255, 0.22);
}

.about-name {
  font-size: 1.55rem;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.01em;
  margin: 0;
}

.about-role {
  font-size: 0.78rem;
  color: #b4b4c0;
  letter-spacing: 0.02em;
  margin: 0.55rem 0 0;
}

.about-bio {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.85;
  margin: 1.4rem 0 0;
}

.about-links-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #b4b4c0;
  letter-spacing: 0.08em;
  margin: 2.4rem 0 0.9rem;
}

.about-links {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  justify-content: center;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.82rem;
  color: #4a3aff;
  background: #f7f6ff;
  border: 1px solid #ebe8ff;
  border-radius: 999px;
  padding: 0.45rem 1rem;
  text-decoration: none;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease,
              transform 0.18s ease, box-shadow 0.18s ease;
}

.about-link:hover,
.about-link:focus-visible {
  background: #4a3aff;
  border-color: #4a3aff;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 58, 255, 0.25);
  outline: none;
}

.about-link svg {
  flex: none;
  width: 14px;
  height: 14px;
}

.about-tags {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  justify-content: center;
}

.about-tag {
  font-size: 0.8rem;
  color: #4a3aff;
  border: 1px solid rgba(74, 58, 255, 0.18);
  background: rgba(74, 58, 255, 0.05);
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
}

@media (max-width: 600px) {
  .about-wrap { padding: 3.5rem 1.25rem 5rem; }
  .about-name { font-size: 1.35rem; }
  .about-bio { font-size: 0.9rem; }
}
</style>

<div class="about-wrap">
  <div class="about-card">

    <div class="about-avatar">정</div>

    <h1 class="about-name">정주희</h1>
    <p class="about-role">부트캠프 수강생 · 개발 학습 기록</p>

    <p class="about-bio">
      부트캠프에서 개발을 배우는 중입니다.<br>
      배운 것과 막힌 것을 여기에 남깁니다.
    </p>

    <div class="about-links-label">배운 것</div>

    <div class="about-tags">
      <span class="about-tag">HTML</span>
      <span class="about-tag">CSS</span>
      <span class="about-tag">JavaScript</span>
      <span class="about-tag">SQL</span>
      <span class="about-tag">Java</span>
    </div>



    <div class="about-links-label">링크</div>

    <div class="about-links">
      <a class="about-link" href="https://github.com/JHee0209" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>
        </svg>
        JHee0209
      </a>

      <!-- <a class="about-link" href="https://www.instagram.com/zoohi.020/" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
        </svg>
        @zoohi.020
      </a>

      <a class="about-link" href="https://blog.naver.com/zoohihi" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2"></rect>
          <path d="M9 16V8l6 8V8"></path>
        </svg>
        zoohihi
      </a> -->
    </div>

  </div>
</div>