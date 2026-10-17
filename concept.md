---
layout: category
title: Concepts
category: 개념
permalink: /concept/
---

<style>
.category-container {
  max-width: 1100px;
  margin: 3.5rem auto 6rem;
  padding: 0 1.5rem;
}

.category-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.category-header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  margin-bottom: 0.6rem;
  color: #1a1a2e;
  letter-spacing: -0.03em;
}

.category-header p {
  font-size: 1rem;
  color: #6d6979;
}

/* 태그 필터 */
.tag-filter-wrap {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 2.5rem;
}

.filter-btn {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid #e6e6ef;
  background: #f6f6f9;
  color: #6b6b7b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #fff;
  border-color: #4a3aff;
  color: #4a3aff;
}

.filter-btn.active {
  background: #4a3aff;
  border-color: #4a3aff;
  color: #fff;
}

/* 게시글 수 카운트 */
.post-count {
  font-size: 0.88rem;
  color: #8d8999;
  margin-bottom: 1.5rem;
}

.post-count strong {
  color: #4a3aff;
}

/* =========================================================
   게시글 배치 UI (Hero 대표글 + Grid 리스트)
   ========================================================= */
.posts-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 400px;
}

/* 최신글 Hero 카드 */
.hero-post-card {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: linear-gradient(135deg, #ffffff 0%, #f9f8ff 100%);
  border: 1px solid #e2ddff;
  border-radius: 18px;
  padding: 2.2rem;
  text-decoration: none;
  box-shadow: 0 10px 30px rgba(74, 58, 255, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.hero-post-card:hover {
  transform: translateY(-4px);
  border-color: #a89cff;
  box-shadow: 0 18px 40px rgba(74, 58, 255, 0.12);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.65rem;
  background: #4a3aff;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 999px;
  margin-bottom: 1rem;
  align-self: flex-start;
}

.hero-post-card h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 1rem;
  line-height: 1.35;
}

.hero-post-card .excerpt {
  color: #6d6979;
  font-size: 0.95rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.hero-meta-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.hero-date {
  font-size: 0.82rem;
  color: #a9a5b5;
  font-weight: 600;
}

/* 일반 게시글 2열 그리드 */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.post-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #eeedf5;
  border-radius: 14px;
  padding: 1.6rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  border-color: #d1c9ff;
  box-shadow: 0 12px 28px rgba(74, 58, 255, 0.08);
}

.post-card .date {
  font-size: 0.78rem;
  color: #a9a5b5;
  font-weight: 600;
  margin-bottom: 0.6rem;
}

.post-card h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 0.8rem;
  line-height: 1.45;
  word-break: keep-all;
}

.post-card .excerpt {
  font-size: 0.88rem;
  color: #6d6979;
  line-height: 1.65;
  margin-bottom: 1.2rem;
  flex-grow: 1;
}

.post-card .tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: auto;
}

.post-card .tags span {
  font-size: 0.75rem;
  color: #4a3aff;
  background: #f0eeff;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
}

/* 페이지네이션 스타일 (1, 2, 3, 4, 5...) */
.pagination-container {
  display: flex;
  gap: 0.4rem;
  justify-content: center;
  align-items: center;
  margin-top: 3.5rem;
}

.page-btn {
  min-width: 38px;
  height: 38px;
  padding: 0 0.6rem;
  border: 1px solid #eeedf5;
  background: #fff;
  color: #4b4855;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.page-btn:hover {
  background: #f6f6f9;
  border-color: #d1c9ff;
  color: #4a3aff;
}

.page-btn.active {
  background: #4a3aff;
  color: #ffffff;
  border-color: #4a3aff;
}

.no-posts {
  text-align: center;
  padding: 5rem 1rem;
  color: #9a9aa8;
  font-size: 1rem;
}

@media (max-width: 820px) {
  .hero-post-card { grid-template-columns: 1fr; gap: 1rem; }
  .posts-grid { grid-template-columns: 1fr; }
}
</style>

<div class="category-container">
  <div class="category-header">
    <h1>📚 Concepts</h1>
    <p>탄탄하게 다져나가는 핵심 기술 개념 정리 노트입니다.</p>
  </div>

  <!-- 카테고리 게시글 추출 -->
  {% assign category_posts = site.posts | where_exp: "item", "item.categories contains 'Concepts' or item.categories contains '개념'" %}

  <!-- 태그 목록 추출 -->
  {% assign category_tags = "" | split: "" %}
  {% for post in category_posts %}
    {% for tag in post.tags %}
      {% unless category_tags contains tag %}
        {% assign category_tags = category_tags | push: tag %}
      {% endunless %}
    {% endfor %}
  {% endfor %}

  <!-- 태그 필터 버튼 -->
  {% if category_tags.size > 0 %}
  <div class="tag-filter-wrap" id="tagFilterWrap">
    <button class="filter-btn active" data-tag="all">전체보기</button>
    {% for tag in category_tags %}
      <button class="filter-btn" data-tag="{{ tag }}">#{{ tag }}</button>
    {% endfor %}
  </div>
  {% endif %}

  <div class="post-count">
    총 <strong id="visibleCount">{{ category_posts.size }}</strong>개의 개념 정리 글
  </div>

  {% if category_posts.size > 0 %}
  <div class="posts-wrapper" id="postsWrapper">
    {% for post in category_posts %}
      <article class="post-card-item" data-tags="{{ post.tags | join: ' ' }}">
        <a href="{{ post.url | relative_url }}" class="post-card">
          <div class="date">{{ post.date | date: "%Y년 %m월 %d일" }}</div>
          <h3>{{ post.title }}</h3>
          <p class="excerpt">{{ post.content | strip_html | strip_newlines | truncate: 110 }}</p>
          {% if post.tags.size > 0 %}
          <div class="tags">
            {% for tag in post.tags %}
              <span>#{{ tag }}</span>
            {% endfor %}
          </div>
          {% endif %}
        </a>
      </article>
    {% endfor %}
  </div>

  <!-- 페이지네이션 컨트롤러 -->
  <div class="pagination-container" id="pagination"></div>

  {% else %}
  <div class="no-posts">아직 등록된 개념 정리 글이 없습니다.</div>
  {% endif %}
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const postsPerPage = 6; // 한 페이지당 표시할 글 개수
  let currentPage = 1;
  let currentTag = "all";

  const allPosts = Array.from(document.querySelectorAll(".post-card-item"));
  const wrapper = document.getElementById("postsWrapper");
  const paginationEl = document.getElementById("pagination");
  const countEl = document.getElementById("visibleCount");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function render() {
    // 1. 태그 필터링
    const filtered = allPosts.filter(post => {
      if (currentTag === "all") return true;
      const tags = (post.getAttribute("data-tags") || "").split(" ");
      return tags.includes(currentTag);
    });

    if (countEl) countEl.textContent = filtered.length;

    // 2. 페이지네이션 계산
    const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    // 감추기/보이기
    allPosts.forEach(p => p.style.display = "none");
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    const currentBatch = filtered.slice(start, end);

    currentBatch.forEach(p => p.style.display = "block");

    // 3. 페이지네이션 버튼 UI 생성 (1, 2, 3...)
    paginationEl.innerHTML = "";
    if (totalPages > 1) {
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.addEventListener("click", () => {
          currentPage = i;
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        paginationEl.appendChild(btn);
      }
    }
  }

  // 필터 버튼 클릭 이벤트
  filterBtns.forEach(btn => {
    btn.addEventListener("click", function() {
      filterBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      currentTag = this.getAttribute("data-tag");
      currentPage = 1;
      render();
    });
  });

  render();
});
</script>