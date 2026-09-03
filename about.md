---
layout: default
title: About
permalink: /about/
---

<style>
/* =========================================================
   About Page
   ========================================================= */

.ab-page {
  position: relative;
  min-height: 100vh;
  padding: 4.5rem 1.5rem 5rem;
  overflow: hidden;
}

/* ---- 배경: 컨테이너를 뚫고 화면 폭 전체 ---- */

.ab-bg {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100vw;
  height: 100%;
  min-height: 100vh;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(900px 520px at 12% 8%, rgba(126, 110, 255, 0.13), transparent 62%),
    radial-gradient(760px 480px at 88% 4%, rgba(150, 130, 255, 0.11), transparent 60%),
    radial-gradient(880px 560px at 78% 96%, rgba(120, 100, 255, 0.13), transparent 62%),
    linear-gradient(175deg, #f6f5ff 0%, #f9f8ff 42%, #f4f2ff 100%);
}

.ab-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(rgba(106, 90, 255, 0.10) 1px, transparent 1px);
  background-size: 22px 22px;
  mask-image: radial-gradient(70% 60% at 50% 30%, transparent 30%, #000 100%);
  -webkit-mask-image: radial-gradient(70% 60% at 50% 30%, transparent 30%, #000 100%);
  opacity: 0.6;
}

.ab-inner {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
}

/* ---- 등장 애니메이션 ---- */

.ab-rise {
  opacity: 0;
  transform: translateY(18px);
  animation: abRise 0.75s cubic-bezier(0.22, 0.68, 0.24, 1) forwards;
}

@keyframes abRise {
  to { opacity: 1; transform: translateY(0); }
}

.d1 { animation-delay: 0.05s; }
.d2 { animation-delay: 0.15s; }
.d3 { animation-delay: 0.25s; }
.d4 { animation-delay: 0.35s; }
.d5 { animation-delay: 0.45s; }
.d6 { animation-delay: 0.55s; }
.d7 { animation-delay: 0.65s; }

/* =========================================================
   Hero
   ========================================================= */

.ab-hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1.25fr 1fr;
  align-items: center;
  gap: 1.5rem;
  min-height: 420px;
  margin-bottom: 4rem;
}

/* 궤도 */

.ab-orbit {
  position: absolute;
  left: 50%;
  top: 52%;
  width: 660px;
  height: 280px;
  transform: translate(-50%, -50%) rotate(-9deg);
  border: 1px solid rgba(106, 90, 255, 0.16);
  border-radius: 50%;
  pointer-events: none;
  animation: abSpin 46s linear infinite;
}

.ab-orbit::before,
.ab-orbit::after {
  content: "";
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a396ff;
  box-shadow: 0 0 0 4px rgba(163, 150, 255, 0.16);
}

.ab-orbit::before { left: 4%;  top: 34%; }
.ab-orbit::after  { right: 6%; bottom: 30%; }

@keyframes abSpin {
  from { transform: translate(-50%, -50%) rotate(-9deg); }
  to   { transform: translate(-50%, -50%) rotate(351deg); }
}

/* ---- 가운데 프로필 ---- */

.ab-center {
  position: relative;
  z-index: 2;
  text-align: center;
}

.ab-hi {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.1rem;
  padding: 0.4rem 0.95rem;
  border: 1px solid rgba(106, 90, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  color: #6758df;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
}

.ab-name {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
  color: #15141b;
  font-size: 2.9rem;
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 1.15;
}

.ab-wave {
  display: inline-block;
  font-size: 1.9rem;
  transform-origin: 70% 80%;
  animation: abWave 2.8s ease-in-out infinite;
}

@keyframes abWave {
  0%, 60%, 100% { transform: rotate(0deg); }
  68% { transform: rotate(14deg); }
  76% { transform: rotate(-8deg); }
  84% { transform: rotate(12deg); }
  92% { transform: rotate(-4deg); }
}

.ab-role {
  margin: 0.85rem 0 0;
  color: #6355d6;
  font-size: 0.92rem;
  font-weight: 600;
}

.ab-intro {
  max-width: 430px;
  margin: 1.6rem auto 0;
  color: #423f52;
  font-size: 0.98rem;
  line-height: 1.9;
  font-weight: 500;
}

.ab-intro .mk {
  color: #b6adff;
  font-size: 1.1rem;
  vertical-align: -0.1em;
}

.ab-rule {
  width: 42px;
  height: 2px;
  margin: 1.5rem auto 0;
  border-radius: 2px;
  background: #c6bfff;
}

/* ---- 좌우 카드 ---- */

.ab-side {
  position: relative;
  z-index: 3;
}

.ab-code-card {
  position: relative;
  z-index: 1;
  border-radius: 16px;
  background: #191826;
  box-shadow:
    0 22px 50px rgba(50, 40, 120, 0.22),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
  overflow: hidden;
  transform: rotate(-2.5deg);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  animation: abFloatA 7s ease-in-out infinite;
}

.ab-code-card:hover {
  transform: rotate(0deg) translateY(-6px);
  box-shadow: 0 28px 60px rgba(50, 40, 120, 0.28);
}

.ab-code-bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 255, 255, 0.04);
}

.ab-code-bar i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  display: block;
}
.ab-code-bar i:nth-child(1) { background: #ff5f57; }
.ab-code-bar i:nth-child(2) { background: #febc2e; }
.ab-code-bar i:nth-child(3) { background: #28c840; }

.ab-code {
  padding: 1.1rem 1.2rem 1.3rem;
  color: #d9d5ff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.7rem;
  line-height: 1.95;
  text-align: left;
  white-space: pre;
}

.ab-code .cm { color: #6f6b87; }
.ab-code .kw { color: #a99cff; }
.ab-code .st { color: #8ce0c0; }
.ab-code .wh { color: #f3f2ff; }

/* 떠다니는 배지 */

.ab-chip {
  position: absolute;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(106, 90, 255, 0.14);
  box-shadow: 0 12px 28px rgba(60, 50, 130, 0.12);
  backdrop-filter: blur(10px);
  color: #6352e8;
  font-family: ui-monospace, monospace;
  font-weight: 700;
}

/* 코드 배지: 코드 카드 앞쪽(왼쪽 위) */
.ab-chip.code {
  width: 54px;
  height: 54px;
  top: -22px;
  right: -20px;
  font-size: 0.88rem;
  transform: rotate(8deg);
  animation: abFloatB 5.5s ease-in-out infinite;
}

/* 노트북 배지: 체크리스트 카드 쪽 */
.ab-chip.laptop {
  width: 52px;
  height: 52px;
  bottom: -20px;
  left: -18px;
  transform: rotate(6deg);
  animation: abFloatB 6.5s ease-in-out infinite 0.6s;
}

.ab-chip.laptop svg { width: 22px; height: 22px; }

@keyframes abFloatA {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -9px; }
}

@keyframes abFloatB {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}

/* 체크리스트 카드 */

.ab-check-card {
  position: relative;
  z-index: 1;
  padding: 1.4rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow:
    0 18px 45px rgba(60, 50, 130, 0.09),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  transform: rotate(2.5deg);
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  animation: abFloatA 7.5s ease-in-out infinite 0.8s;
}

.ab-check-card:hover {
  transform: rotate(0deg) translateY(-6px);
  box-shadow: 0 26px 55px rgba(60, 50, 130, 0.14);
}

.ab-check {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin: 0.7rem 0;
  color: #3a3747;
  font-size: 0.82rem;
  font-weight: 500;
}

.ab-check:first-child { margin-top: 0; }
.ab-check:last-child { margin-bottom: 0; }

.ab-tick {
  flex: none;
  width: 19px;
  height: 19px;
  border-radius: 6px;
  background: #6b5aff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(107, 90, 255, 0.32);
}

.ab-tick svg { width: 11px; height: 11px; }

/* =========================================================
   특성 카드 3개
   ========================================================= */

.ab-traits {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
  margin-bottom: 3.2rem;
}

.ab-trait {
  padding: 1.7rem 1.4rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.6);
  box-shadow:
    0 14px 38px rgba(60, 50, 130, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  transition: transform 0.28s ease, box-shadow 0.28s ease;
}

.ab-trait:hover {
  transform: translateY(-6px);
  box-shadow: 0 22px 48px rgba(60, 50, 130, 0.12);
}

.ab-trait-icon {
  width: 46px;
  height: 46px;
  margin: 0 auto 1rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #ece8ff, #ddd6ff);
  color: #5b4ae0;
}

.ab-trait-icon svg { width: 21px; height: 21px; }

.ab-trait h3 {
  margin: 0 0 0.55rem;
  color: #23212c;
  font-size: 0.92rem;
  font-weight: 700;
}

.ab-trait p {
  margin: 0;
  color: #6d6979;
  font-size: 0.78rem;
  line-height: 1.75;
}

/* =========================================================
   Tech Stack
   ========================================================= */

.ab-stack-wrap {
  position: relative;
  padding: 1.6rem 1.5rem 1.7rem;
  margin-bottom: 3.2rem;
  border: 1.5px dashed rgba(122, 106, 255, 0.32);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.4);
  text-align: center;
}

.ab-stack-title {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 1.3rem;
  color: #2b2836;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.ab-stack-title svg {
  width: 16px;
  height: 16px;
  color: #7f6dff;
}

.ab-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.7rem;
}

.ab-tech {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.6rem 1.1rem 0.6rem 0.75rem;
  border: 1px solid #eceaf6;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(50, 42, 110, 0.06);
  color: #262430;
  font-size: 0.84rem;
  font-weight: 600;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.ab-tech:hover {
  transform: translateY(-4px);
  border-color: rgba(106, 90, 255, 0.28);
  box-shadow: 0 14px 30px rgba(75, 60, 180, 0.12);
}

.ab-tech-badge {
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.ab-tech-badge.html { background: #e8652a; }
.ab-tech-badge.css  { background: #2a72e8; }
.ab-tech-badge.js   { background: #e8c227; color: #2b2600; }
.ab-tech-badge.sql  { background: #3f8fbe; }
.ab-tech-badge.java { background: #d8443a; }

/* =========================================================
   정보 카드 3개
   ========================================================= */

.ab-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
}

.ab-card {
  position: relative;
  padding: 1.5rem 1.5rem 1.6rem;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.66);
  box-shadow:
    0 14px 38px rgba(60, 50, 130, 0.07),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  overflow: hidden;
  transition: transform 0.28s ease, box-shadow 0.28s ease;
}

.ab-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 22px 48px rgba(60, 50, 130, 0.12);
}

.ab-card::before {
  content: "";
  position: absolute;
  width: 130px;
  height: 130px;
  right: -48px;
  top: -48px;
  border-radius: 50%;
  background: rgba(106, 90, 255, 0.05);
}

.ab-card-head {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.1rem;
}

.ab-card-head svg {
  width: 17px;
  height: 17px;
  color: #6b5aff;
  flex: none;
}

.ab-card-head h3 {
  margin: 0;
  color: #23212c;
  font-size: 0.9rem;
  font-weight: 700;
}

/* 관심 분야 */

.ab-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.ab-tag {
  padding: 0.42rem 0.85rem;
  border-radius: 999px;
  background: #f1eeff;
  color: #5b4ae0;
  font-size: 0.74rem;
  font-weight: 600;
  transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.ab-tag:hover {
  background: #6b5aff;
  color: #fff;
  transform: translateY(-2px);
}

.ab-note {
  margin: 1.1rem 0 0;
  color: #a49fb4;
  font-size: 0.72rem;
  font-style: italic;
}

/* 진행 중 타임라인 */

.ab-steps {
  position: relative;
  padding-left: 1.1rem;
}

.ab-steps::before {
  content: "";
  position: absolute;
  left: 4px;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: #e2ddf8;
}

.ab-step {
  position: relative;
  padding: 0 0 1rem 0.95rem;
}

.ab-step:last-child { padding-bottom: 0; }

.ab-step::before {
  content: "";
  position: absolute;
  left: -1px;
  top: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #cdc6f2;
}

.ab-step.now::before {
  background: #6b5aff;
  box-shadow: 0 0 0 4px rgba(107, 90, 255, 0.16);
}

.ab-step .ab-step-title {
  margin: 0;
  color: #37343f;
  font-size: 0.8rem;
  font-weight: 600;
}

.ab-step .ab-step-desc {
  display: block;
  margin-top: 0.22rem;
  color: #9b97a6;
  font-size: 0.71rem;
  font-weight: 400;
}

/* 이 블로그에서는 */

.ab-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.ab-list > div {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
  color: #4b4855;
  font-size: 0.79rem;
  line-height: 1.6;
}

.ab-list svg {
  flex: none;
  width: 14px;
  height: 14px;
  margin-top: 0.18rem;
  color: #7565f2;
}

/* =========================================================
   GitHub
   ========================================================= */

.ab-github {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.1rem;
  padding: 1.1rem 1.35rem;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 12px 34px rgba(60, 50, 130, 0.07);
  backdrop-filter: blur(12px);
  text-decoration: none;
  transition: transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease;
}

.ab-github:hover {
  transform: translateY(-4px);
  border-color: #ddd7ff;
  box-shadow: 0 20px 44px rgba(80, 65, 180, 0.13);
}

.ab-gh-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.ab-gh-icon {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #24222e;
  color: #fff;
}

.ab-gh-icon svg { width: 19px; height: 19px; }

.ab-gh-text {
  display: flex;
  flex-direction: column;
}

.ab-gh-name {
  color: #23212c;
  font-size: 0.84rem;
  font-weight: 700;
  line-height: 1.3;
}

.ab-gh-desc {
  margin-top: 0.2rem;
  color: #9d99a8;
  font-size: 0.7rem;
  font-weight: 400;
  line-height: 1.3;
}

.ab-gh-arrow {
  flex: none;
  color: #6b5aff;
  font-size: 1.05rem;
  transition: transform 0.24s ease;
}

.ab-github:hover .ab-gh-arrow { transform: translateX(4px); }

/* =========================================================
   맨 아래 문장
   ========================================================= */

.ab-quote {
  margin-top: 3.4rem;
  text-align: center;
}

.ab-quote p {
  display: inline-block;
  margin: 0;
  padding-bottom: 0.3rem;
  color: #5d5490;
  font-size: 0.88rem;
  font-weight: 500;
  background: linear-gradient(transparent 62%, rgba(151, 134, 255, 0.28) 62%);
}

/* =========================================================
   Responsive
   ========================================================= */

@media (max-width: 900px) {
  .ab-hero {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    min-height: auto;
  }
  .ab-center { order: -1; }
  .ab-orbit { display: none; }
  .ab-code-card,
  .ab-check-card {
    max-width: 460px;
    margin: 0 auto;
    transform: none;
    animation: none;
  }
  .ab-chip.code { right: 0; top: -20px; }
  .ab-chip.laptop { left: 0; bottom: -18px; }
  .ab-traits,
  .ab-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .ab-page { padding: 3rem 1.15rem 4rem; }
  .ab-name { font-size: 2.05rem; }
  .ab-wave { font-size: 1.5rem; }
  .ab-intro { font-size: 0.9rem; }
  .ab-stack-wrap { border-radius: 20px; padding: 1.3rem 1rem 1.4rem; }
  .ab-chip.code,
  .ab-chip.laptop { width: 44px; height: 44px; }
}

@media (prefers-reduced-motion: reduce) {
  .ab-rise { opacity: 1; transform: none; animation: none; }
  .ab-orbit,
  .ab-wave,
  .ab-code-card,
  .ab-check-card,
  .ab-chip { animation: none; }
}
</style>


<div class="ab-page">

  <div class="ab-bg" aria-hidden="true"></div>

  <div class="ab-inner">

    <!-- ============ HERO ============ -->

    <section class="ab-hero">

      <div class="ab-orbit" aria-hidden="true"></div>

      <!-- 왼쪽: 코드 카드 -->
      <div class="ab-side ab-rise d2">

        <span class="ab-chip code" aria-hidden="true">&lt;/&gt;</span>

        <div class="ab-code-card">
          <div class="ab-code-bar" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="ab-code"><span class="cm">// about me</span>
<span class="kw">const</span> <span class="wh">zoohi</span> = {
  name:  <span class="st">"정주희"</span>,
  role:  <span class="st">"developer"</span>,
  goal:  <span class="st">"keep learning"</span>,
  state: <span class="st">"in progress..."</span>
<span class="wh">};</span></div>
        </div>

      </div>

      <!-- 가운데: 프로필 -->
      <div class="ab-center ab-rise d1">

        <span class="ab-hi">HELLO, I'M</span>

        <h1 class="ab-name">
          정주희
          <span class="ab-wave" aria-hidden="true">👋</span>
        </h1>

        <p class="ab-role">부트캠프 수강생 · 개발 학습 기록</p>

        <p class="ab-intro">
          <span class="mk">&ldquo;</span>
          배워서 적용하는 것을 좋아하고,<br>
          조금씩 더 나은 개발자가 되고 싶은 사람입니다.
          <span class="mk">&rdquo;</span>
        </p>

        <div class="ab-rule"></div>

      </div>

      <!-- 오른쪽: 체크리스트 -->
      <div class="ab-side ab-rise d3">

        <span class="ab-chip laptop" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <rect x="4" y="5" width="16" height="11" rx="2"></rect>
            <path d="M2 19.5h20"></path>
          </svg>
        </span>

        <div class="ab-check-card">

          <div class="ab-check">
            <span class="ab-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg></span>
            Read docs
          </div>

          <div class="ab-check">
            <span class="ab-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg></span>
            Build projects
          </div>

          <div class="ab-check">
            <span class="ab-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg></span>
            Solve problems
          </div>

          <div class="ab-check">
            <span class="ab-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg></span>
            Write blog
          </div>

          <div class="ab-check">
            <span class="ab-tick"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg></span>
            Grow :)
          </div>

        </div>

      </div>

    </section>


    <!-- ============ 특성 3개 ============ -->

    <section class="ab-traits">

      <div class="ab-trait ab-rise d4">
        <div class="ab-trait-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 15c-1 2-1 4-1 4s2 0 4-1"></path>
            <path d="M9 15l-3-3c1-6 6-9 12-9 0 6-3 11-9 12z"></path>
            <circle cx="14.5" cy="8.5" r="1.6"></circle>
          </svg>
        </div>
        <h3>지속적으로 배우는</h3>
        <p>새로운 기술을 탐구하고,<br>하나씩 내 것으로 만들어갑니다.</p>
      </div>

      <div class="ab-trait ab-rise d5">
        <div class="ab-trait-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 20h16"></path>
            <path d="M14.5 4.5l4 4L9 18H5v-4z"></path>
          </svg>
        </div>
        <h3>기록하는</h3>
        <p>배운 것을 정리하고 공유하며<br>함께 성장하고 싶습니다.</p>
      </div>

      <div class="ab-trait ab-rise d6">
        <div class="ab-trait-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 4h4v2.5a1.5 1.5 0 0 0 3 0V4h3v4h-2.5a1.5 1.5 0 0 0 0 3H20v4h-2.5a1.5 1.5 0 0 0 0 3H20v0h-4v-2.5a1.5 1.5 0 0 0-3 0V20H9v-4H6.5a1.5 1.5 0 0 1 0-3H9V9H6.5a1.5 1.5 0 0 1 0-3H9z"></path>
          </svg>
        </div>
        <h3>문제를 해결하는</h3>
        <p>작은 문제부터 차근차근<br>깊이 있게 이해하려고 노력합니다.</p>
      </div>

    </section>


    <!-- ============ Tech Stack ============ -->

    <section class="ab-stack-wrap ab-rise d5">

      <h2 class="ab-stack-title">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l1.9 5.6L19.5 9l-4.4 3.5 1.5 5.7L12 15l-4.6 3.2 1.5-5.7L4.5 9l5.6-1.4z"></path>
        </svg>
        Tech Stack &amp; Learning
      </h2>

      <div class="ab-stack">
        <span class="ab-tech"><span class="ab-tech-badge html">HTML</span>HTML</span>
        <span class="ab-tech"><span class="ab-tech-badge css">CSS</span>CSS</span>
        <span class="ab-tech"><span class="ab-tech-badge js">JS</span>JavaScript</span>
        <span class="ab-tech"><span class="ab-tech-badge sql">SQL</span>SQL</span>
        <span class="ab-tech"><span class="ab-tech-badge java">JAVA</span>Java</span>
      </div>

    </section>


    <!-- ============ 정보 카드 3개 ============ -->

    <section class="ab-grid">

      <!-- 관심 있는 분야 -->
      <div class="ab-card ab-rise d5">

        <div class="ab-card-head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21c0-5 2-9 8-11-1 6-4 9-8 11z"></path>
            <path d="M12 21c0-4-1-7-6-9 1 5 3 7 6 9z"></path>
            <path d="M12 21v-4"></path>
          </svg>
          <h3>관심 있는 분야</h3>
        </div>

        <div class="ab-tags">
          <span class="ab-tag">Web Frontend</span>
          <span class="ab-tag">UX/UI</span>
          <span class="ab-tag">Performance</span>
          <span class="ab-tag">Database</span>
          <span class="ab-tag">CS</span>
        </div>

        <p class="ab-note">꾸준히 경험의 폭을 넓혀가는 중이에요.</p>

      </div>

      <!-- 현재 진행 중 -->
      <div class="ab-card ab-rise d6">

        <div class="ab-card-head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"></path>
            <circle cx="12" cy="10" r="2.5"></circle>
          </svg>
          <h3>현재 진행 중</h3>
        </div>

        <div class="ab-steps">

          <div class="ab-step now">
            <span class="ab-step-title">부트캠프 수강</span>
            <span class="ab-step-desc">실력 있는 개발자로 한 걸음 더</span>
          </div>

          <div class="ab-step">
            <span class="ab-step-title">프로젝트 경험 쌓기</span>
            <span class="ab-step-desc">직접 만들고 부딪혀보기</span>
          </div>

          <div class="ab-step">
            <span class="ab-step-title">기술 블로그 꾸준히 작성하기</span>
            <span class="ab-step-desc">배운 것을 정리하고 다시 이해하기</span>
          </div>

        </div>

      </div>

      <!-- 이 블로그에서는 -->
      <div class="ab-card ab-rise d7">

        <div class="ab-card-head">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18h6"></path>
            <path d="M10 21h4"></path>
            <path d="M12 3a6 6 0 0 1 3.5 10.9c-.3.3-.5.7-.5 1.1H9c0-.4-.2-.8-.5-1.1A6 6 0 0 1 12 3z"></path>
          </svg>
          <h3>이 블로그에서는&hellip;</h3>
        </div>

        <div class="ab-list">
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg>
            문제에 대한 정의
          </div>
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg>
            개념을 쉽게 정리한 글
          </div>
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"></path></svg>
            문제 해결 과정 기록
          </div>
        </div>

      </div>

    </section>


    <!-- ============ GitHub ============ -->

    <a class="ab-github ab-rise d7" href="https://github.com/JHee0209" target="_blank" rel="noopener">

      <span class="ab-gh-left">
        <span class="ab-gh-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z"/>
          </svg>
        </span>
        <span class="ab-gh-text">
          <span class="ab-gh-name">JHee0209</span>
          <span class="ab-gh-desc">GitHub · Projects &amp; Code</span>
        </span>
      </span>

      <span class="ab-gh-arrow">&rarr;</span>

    </a>


    <!-- ============ 맨 아래 문장 ============ -->

    <div class="ab-quote ab-rise d7">
      <p>&ldquo; 오늘의 작은 배움이, 내일의 큰 성장이 되기를. 💞&rdquo;</p>
    </div>

  </div>
</div>