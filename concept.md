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

.post-count {
  font-size: 0.88rem;
  color: #8d8999;
  margin-bottom: 1.5rem;
}

.post-count strong {
  color: #4a3aff;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  min-height: 300px;
}

.post-card-item {
  display: block;
}

.post-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #eeedf5;
  border-radius: 14px;
  padding: 1.6rem;
  text-decoration: none;
  height: 100%;
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
  .posts-grid { grid-template-columns: 1fr; }
}
</style>

<div class="category-container">
  <div class="category-header">
    <h1>📚 Concepts</h1>
    <p>탄탄하게 다져나가는 핵심 기술 개념 정리 노트입니다.</p>
  </div>

  <!-- 안전한 Liquid 카테고리 추출 및 태그 수집 -->
  {% assign category_posts = "" | split: "" %}
  {% assign category_tags = "" | split: "" %}

  {% for post in site.posts %}
    {% if post.categories contains 'Concepts' or post.categories contains '개념' %}
      {% assign category_posts = category_posts | push: post %}
      {% for tag in post.tags %}
        {% unless category_tags contains tag %}
          {% assign category_tags = category_tags | push: tag %}
        {% endunless %}
      {% endfor %}
    {% endif %}
  {% endfor %}

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
  <div class="posts-grid" id="postsGrid">
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

  <div class="pagination-container" id="pagination"></div>

  {% else %}
  <div class="no-posts">아직 등록된 개념 정리 글이 없습니다.</div>
  {% endif %}
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const postsPerPage = 6;
  let currentPage = 1;
  let currentTag = "all";

  const allPosts = Array.from(document.querySelectorAll(".post-card-item"));
  const paginationEl = document.getElementById("pagination");
  const countEl = document.getElementById("visibleCount");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function render() {
    const filtered = allPosts.filter(post => {
      if (currentTag === "all") return true;
      const tags = (post.getAttribute("data-tags") || "").split(" ");
      return tags.includes(currentTag);
    });

    if (countEl) countEl.textContent = filtered.length;

    const totalPages = Math.ceil(filtered.length / postsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;

    allPosts.forEach(p => p.style.display = "none");
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    filtered.slice(start, end).forEach(p => p.style.display = "block");

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