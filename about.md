---
layout: default
title: About
permalink: /about/
---

<style>
/* =========================
   About Page
   ========================= */

.about-wrap {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
  padding: 5rem 1.5rem 7rem;
  overflow: hidden;
}

/* Background decoration */
.about-wrap::before {
  content: "";
  position: absolute;
  top: 40px;
  left: 50%;
  width: 700px;
  height: 700px;
  transform: translateX(-50%);
  background:
    radial-gradient(
      circle at center,
      rgba(106, 90, 255, 0.08) 0%,
      rgba(106, 90, 255, 0.035) 35%,
      transparent 68%
    );
  pointer-events: none;
  z-index: 0;
}

.about-wrap::after {
  content: "";
  position: absolute;
  top: 90px;
  left: 0;
  right: 0;
  height: 520px;
  background-image:
    linear-gradient(rgba(106, 90, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(106, 90, 255, 0.035) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(
    to bottom,
    rgba(0,0,0,0.8),
    transparent 90%
  );
  pointer-events: none;
  z-index: 0;
}

.about-inner {
  position: relative;
  z-index: 1;
}


/* =========================
   Hero
   ========================= */

.about-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.15fr 1fr;
  align-items: center;
  gap: 2rem;
  min-height: 390px;
  margin-bottom: 4rem;
}

.about-side-card {
  padding: 1.4rem;
  border: 1px solid rgba(106, 90, 255, 0.12);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow:
    0 15px 45px rgba(55, 45, 120, 0.06),
    inset 0 1px 0 rgba(255,255,255,0.8);
  backdrop-filter: blur(14px);
}

.about-side-card.left {
  transform: rotate(-2deg);
}

.about-side-card.right {
  transform: rotate(2deg);
}

.about-side-card:hover {
  transform: translateY(-5px) rotate(0deg);
  transition: transform 0.25s ease;
}

.about-code {
  background: #171622;
  color: #d9d5ff;
  border-radius: 15px;
  padding: 1.2rem;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  line-height: 1.8;
  text-align: left;
  overflow: hidden;
}

.about-code .comment {
  color: #77748b;
}

.about-code .purple {
  color: #a99cff;
}

.about-code .white {
  color: #f3f2ff;
}

.about-check-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #9b98aa;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.9rem;
}

.about-check {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.78rem;
  color: #33313d;
  margin: 0.65rem 0;
}

.about-check-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eeeaff;
  color: #5c4cff;
  font-size: 0.65rem;
  font-weight: 700;
}


/* Center profile */

.about-profile {
  text-align: center;
}

.about-avatar {
  position: relative;
  width: 82px;
  height: 82px;
  margin: 0 auto 1.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    145deg,
    #7667ff 0%,
    #5a48ef 100%
  );

  color: white;
  font-size: 1.7rem;
  font-weight: 700;

  box-shadow:
    0 12px 30px rgba(88, 70, 240, 0.28),
    0 0 0 8px rgba(106, 90, 255, 0.05);
}

.about-avatar::after {
  content: "";
  position: absolute;
  width: 10px;
  height: 10px;
  right: 2px;
  bottom: 7px;
  border-radius: 50%;
  background: #8e82ff;
  border: 3px solid #fff;
}

.about-greeting {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
  padding: 0.38rem 0.8rem;
  border: 1px solid rgba(106, 90, 255, 0.15);
  border-radius: 999px;
  background: rgba(106, 90, 255, 0.045);
  color: #6758df;
  font-size: 0.68rem;
  letter-spacing: 0.08em;
}

.about-name {
  margin: 0;
  color: #15141b;
  font-size: 2.45rem;
  font-weight: 750;
  letter-spacing: -0.055em;
}

.about-role {
  margin: 0.7rem 0 0;
  color: #756f91;
  font-size: 0.82rem;
  font-weight: 500;
}

.about-intro {
  max-width: 430px;
  margin: 1.5rem auto 0;
  color: #4b4855;
  font-size: 0.93rem;
  line-height: 1.85;
}

.about-intro strong {
  color: #5544dc;
  font-weight: 600;
}


/* =========================
   Section
   ========================= */

.about-section {
  margin-top: 4rem;
}

.about-section-heading {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 1.25rem;
}

.about-section-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6b5aff;
  box-shadow: 0 0 0 5px rgba(107, 90, 255, 0.08);
}

.about-section-title {
  margin: 0;
  color: #25232d;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.about-section-subtitle {
  margin: 0 0 1.3rem;
  color: #a09daa;
  font-size: 0.72rem;
}


/* =========================
   Tech Stack
   ========================= */

.about-stack {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.8rem;
}

.about-tech {
  position: relative;
  min-height: 125px;
  padding: 1.1rem;
  border: 1px solid #eeeef4;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 8px 25px rgba(40, 35, 80, 0.035);
  overflow: hidden;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.about-tech:hover {
  transform: translateY(-5px);
  border-color: rgba(106, 90, 255, 0.18);
  box-shadow: 0 15px 35px rgba(75, 60, 180, 0.09);
}

.about-tech::after {
  content: "";
  position: absolute;
  width: 70px;
  height: 70px;
  right: -28px;
  bottom: -28px;
  border-radius: 50%;
  background: rgba(106, 90, 255, 0.045);
}

.about-tech-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.8rem;

  background: #f5f3ff;
  color: #6352e8;
  font-size: 0.72rem;
  font-weight: 800;
}

.about-tech-name {
  margin: 0;
  color: #282631;
  font-size: 0.82rem;
  font-weight: 700;
}

.about-tech-desc {
  margin: 0.3rem 0 0;
  color: #aaa7b2;
  font-size: 0.65rem;
}


/* =========================
   Info Cards
   ========================= */

.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.about-info-card {
  position: relative;
  min-height: 190px;
  padding: 1.5rem;
  border: 1px solid #ededf3;
  border-radius: 22px;
  background: linear-gradient(
    145deg,
    rgba(255,255,255,0.98),
    rgba(249,248,255,0.92)
  );
  box-shadow: 0 10px 35px rgba(45, 40, 90, 0.035);
  overflow: hidden;
}

.about-info-card::before {
  content: "";
  position: absolute;
  width: 130px;
  height: 130px;
  right: -45px;
  top: -45px;
  border-radius: 50%;
  background: rgba(106, 90, 255, 0.055);
}

.about-info-label {
  color: #aaa6b3;
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  margin-bottom: 0.65rem;
}

.about-info-title {
  margin: 0;
  color: #2b2933;
  font-size: 1.05rem;
  font-weight: 700;
}

.about-info-text {
  margin: 0.65rem 0 0;
  color: #66626e;
  font-size: 0.8rem;
  line-height: 1.75;
}


/* Interest tags */

.about-interest-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1rem;
}

.about-interest {
  padding: 0.42rem 0.75rem;
  border-radius: 999px;
  background: #f3f1ff;
  color: #5e4fe0;
  font-size: 0.68rem;
  font-weight: 600;
}


/* =========================
   Learning Timeline
   ========================= */

.about-timeline {
  position: relative;
  margin-top: 1rem;
  padding-left: 1.2rem;
}

.about-timeline::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 5px;
  bottom: 5px;
  width: 1px;
  background: #e5e2f6;
}

.about-timeline-item {
  position: relative;
  padding: 0 0 1.25rem 1.1rem;
}

.about-timeline-item:last-child {
  padding-bottom: 0;
}

.about-timeline-item::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7566f5;
  box-shadow: 0 0 0 4px #f1efff;
}

.about-timeline-title {
  margin: 0;
  color: #36333f;
  font-size: 0.78rem;
  font-weight: 700;
}

.about-timeline-text {
  margin: 0.25rem 0 0;
  color: #9a96a2;
  font-size: 0.68rem;
}


/* =========================
   Links
   ========================= */

.about-github {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.3rem;
  border: 1px solid #eae8f5;
  border-radius: 18px;
  background: #fff;
  color: #282631;
  text-decoration: none;
  box-shadow: 0 8px 28px rgba(50, 45, 100, 0.04);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.about-github:hover {
  transform: translateY(-3px);
  border-color: #dcd7ff;
  box-shadow: 0 14px 35px rgba(80, 65, 180, 0.09);
}

.about-github-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.about-github-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f4fa;
  color: #25232d;
}

.about-github-name {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
}

.about-github-desc {
  margin: 0.2rem 0 0;
  color: #a19da8;
  font-size: 0.65rem;
}

.about-arrow {
  color: #7060ed;
  font-size: 1rem;
}


/* =========================
   Bottom Quote
   ========================= */

.about-quote {
  position: relative;
  margin-top: 5rem;
  padding: 2.5rem 1rem;
  text-align: center;
}

.about-quote::before {
  content: "</>";
  display: block;
  margin-bottom: 0.9rem;
  color: #b3aaff;
  font-family: ui-monospace, monospace;
  font-size: 0.9rem;
  font-weight: 700;
}

.about-quote-text {
  margin: 0;
  color: #6b61a3;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.about-quote-line {
  width: 45px;
  height: 1px;
  margin: 1rem auto 0;
  background: #b9b1f6;
}


/* =========================
   Responsive
   ========================= */

@media (max-width: 850px) {

  .about-hero {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    min-height: auto;
  }

  .about-profile {
    order: -1;
  }

  .about-side-card.left,
  .about-side-card.right {
    transform: none;
  }

  .about-side-card {
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
  }

  .about-stack {
    grid-template-columns: repeat(3, 1fr);
  }

}

@media (max-width: 600px) {

  .about-wrap {
    padding: 3.5rem 1.15rem 5rem;
  }

  .about-name {
    font-size: 2rem;
  }

  .about-intro {
    font-size: 0.88rem;
  }

  .about-stack {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .about-tech {
    min-height: 110px;
  }

}

@media (max-width: 390px) {

  .about-stack {
    grid-template-columns: 1fr 1fr;
    gap: 0.55rem;
  }

  .about-tech {
    padding: 0.9rem;
  }

}
</style>


<div class="about-wrap">
  <div class="about-inner">


    <!-- =========================
         HERO
         ========================= -->

    <section class="about-hero">


      <!-- Left Code Card -->

      <div class="about-side-card left">

        <div class="about-code">
          <div class="comment">// about me</div>
          <br>

          <span class="purple">const</span>
          <span class="white"> zoohi = {</span>
          <br>

          &nbsp;&nbsp;name:
          <span class="purple"> "정주희"</span>,
          <br>

          &nbsp;&nbsp;role:
          <span class="purple"> "developer"</span>,
          <br>

          &nbsp;&nbsp;state:
          <span class="purple"> "learning..."</span>,
          <br>

          &nbsp;&nbsp;goal:
          <span class="purple"> "keep growing"</span>
          <br>

          <span class="white">};</span>
        </div>

      </div>


      <!-- Center Profile -->

      <div class="about-profile">

        <div class="about-greeting">
          HELLO, I'M
        </div>

        <div class="about-avatar">
          정
        </div>

        <h1 class="about-name">
          정주희
        </h1>

        <p class="about-role">
          부트캠프 수강생 · 개발 학습 기록
        </p>

        <p class="about-intro">
          배운 것을 적용하는 과정을 좋아합니다.<br>
          <strong>배운 것과 막힌 것</strong>을 기록하며<br>
          조금씩 더 발전하는 중입니다.
        </p>

      </div>


      <!-- Right Checklist -->

      <div class="about-side-card right">

        <div class="about-check-title">
          Currently
        </div>

        <div class="about-check">
          <span class="about-check-icon">✓</span>
          개발 기초 다지기
        </div>

        <div class="about-check">
          <span class="about-check-icon">✓</span>
          프로젝트 경험 쌓기
        </div>

        <div class="about-check">
          <span class="about-check-icon">✓</span>
          좋은 코드 고민하기
        </div>

        <div class="about-check">
          <span class="about-check-icon">✓</span>
          배운 것 기록하기
        </div>

        <div class="about-check">
          <span class="about-check-icon">✓</span>
          꾸준히 성장하기
        </div>

      </div>

    </section>



    <!-- =========================
         TECH STACK
         ========================= -->

    <section class="about-section">

      <div class="about-section-heading">
        <span class="about-section-dot"></span>
        <h2 class="about-section-title">
          Tech Stack & Learning
        </h2>
      </div>

      <p class="about-section-subtitle">
        지금 배우고 있고, 앞으로 더 깊게 알아가고 싶은 것들
      </p>


      <div class="about-stack">

        <div class="about-tech">
          <div class="about-tech-icon">HTML</div>
          <p class="about-tech-name">HTML</p>
          <p class="about-tech-desc">Web Structure</p>
        </div>

        <div class="about-tech">
          <div class="about-tech-icon">CSS</div>
          <p class="about-tech-name">CSS</p>
          <p class="about-tech-desc">Web Styling</p>
        </div>

        <div class="about-tech">
          <div class="about-tech-icon">JS</div>
          <p class="about-tech-name">JavaScript</p>
          <p class="about-tech-desc">Interaction</p>
        </div>

        <div class="about-tech">
          <div class="about-tech-icon">DB</div>
          <p class="about-tech-name">SQL</p>
          <p class="about-tech-desc">Data & Query</p>
        </div>

        <div class="about-tech">
          <div class="about-tech-icon">JAVA</div>
          <p class="about-tech-name">Java</p>
          <p class="about-tech-desc">Backend Basics</p>
        </div>

      </div>

    </section>



    <!-- =========================
         INFO
         ========================= -->

    <section class="about-section">

      <div class="about-grid">


        <!-- Interest -->

        <div class="about-info-card">

          <div class="about-info-label">
            INTEREST
          </div>

          <h3 class="about-info-title">
            요즘 관심 있는 것
          </h3>

          <p class="about-info-text">
            단순히 동작하는 코드보다
            이해하기 쉽고 유지하기 좋은 코드를
            만드는 방법에 관심이 있습니다.
          </p>

          <div class="about-interest-list">
            <span class="about-interest">UX/UI</span>
            <span class="about-interest">Clean Code</span>
            <span class="about-interest">Database</span>
            <span class="about-interest">Performance</span>
            <span class="about-interest">Problem Solving</span>
          </div>

        </div>


        <!-- Timeline -->

        <div class="about-info-card">

          <div class="about-info-label">
            LEARNING
          </div>

          <h3 class="about-info-title">
            지금 하고 있는 것
          </h3>

          <div class="about-timeline">

            <div class="about-timeline-item">
              <p class="about-timeline-title">
                부트캠프 수강
              </p>
              <p class="about-timeline-text">
                실력 있는 개발자로 한 걸음 더
              </p>
            </div>

            <div class="about-timeline-item">
              <p class="about-timeline-title">
                프로젝트 경험 쌓기
              </p>
              <p class="about-timeline-text">
                직접 만들고 부딪혀보기
              </p>
            </div>

            <div class="about-timeline-item">
              <p class="about-timeline-title">
                기술 블로그 작성
              </p>
              <p class="about-timeline-text">
                배운 것을 정리하고 다시 이해하기
              </p>
            </div>

          </div>

        </div>

      </div>

    </section>



    <!-- =========================
         BLOG PHILOSOPHY
         ========================= -->

    <section class="about-section">

      <div class="about-info-card">

        <div class="about-info-label">
          THIS BLOG
        </div>

        <h3 class="about-info-title">
          이 블로그에서는
        </h3>

        <p class="about-info-text">
          공부하면서 새롭게 알게 된 개념부터
          해결하기 어려웠던 문제,
          시행착오와 고민까지 기록합니다.
          <br>
          완성된 지식보다 <strong>성장하는 과정</strong>을 남기는 것이 목표입니다.
        </p>

      </div>

    </section>



    <!-- =========================
         GITHUB
         ========================= -->

    <section class="about-section">

      <div class="about-section-heading">
        <span class="about-section-dot"></span>

        <h2 class="about-section-title">
          Links
        </h2>
      </div>


      <a
        class="about-github"
        href="https://github.com/JHee0209"
        target="_blank"
        rel="noopener"
      >

        <div class="about-github-left">

          <div class="about-github-icon">

            <svg
              viewBox="0 0 24 24"
              width="19"
              height="19"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>
            </svg>

          </div>

          <div>
            <p class="about-github-name">
              JHee0209
            </p>

            <p class="about-github-desc">
              GitHub · Projects & Code
            </p>
          </div>

        </div>

        <span class="about-arrow">
          →
        </span>

      </a>

    </section>



    <!-- =========================
         QUOTE
         ========================= -->

    <div class="about-quote">

      <p class="about-quote-text">
        오늘의 작은 배움이, 내일의 큰 성장이 되기를.
      </p>

      <div class="about-quote-line"></div>

    </div>


  </div>
</div>