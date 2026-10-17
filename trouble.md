---
layout: category
title: Trouble Shooting
category: 트러블슈팅
permalink: /trouble/
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
  border: 1px solid #ffe1df;
  background: #fff8f8;
  color: #d93a2b;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: #ffecea;
  border-color: #d93a2b;
}

.filter-btn.active {
  background: #d93a2b;
  border-color: #d93a2b;
  color: #fff;
}

.post-count {
  font-size: 0.88rem;
  color: #8d8999;
  margin-bottom: 1.5rem;
}

.post-count strong {
  color: #d93a2b;
}

/* 2열 그리드 배치 */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  min-height: 400px;
}

.post-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #fee8e6;
  border-radius: 14px;
  padding: 1.6rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  border-color: #fca59d;
  box-shadow: 0 12px 28px rgba(217, 58, 43, 0.08);
}

.post-card .date-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.post-card .date {
  font-size: 0.78rem;
  color: #a9a5b5;
  font-weight: 600;
}

.post-card .trouble-pill {
  font-size: 0.7rem;
  font-weight: 700;
  color: #d93a2b;
  background: #ffecea;
  padding: 0.18rem 0.55rem;
  border-radius: 6px;
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
  color: #d93a2b;
  background: #ffecea;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
}

/* 페이지네이션 버튼 */
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
  border: 1px solid #fee8e6;
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
  background: #fff8f8;
  border-color: #fca59d;
  color: #d93a2b;
}

.page-btn.active {
  background: #d93a2b;
  color: #ffffff;
  border-color: #d93a2b;
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
    <h1>🛠️ Troubleshooting</h1>
    <p>개발 과정에서 직면한 오류 및 문제 해결 기록입니다.</p>
  </div>

  {% assign category_posts = site.posts | where_exp: "item", "item.categories contains 'Troubleshooting' or item.categories contains '트러블슈팅'" %}

  {% assign category_tags = "" | split: "" %}
  {% for post in category_posts %}
    {% for tag in post.tags %}
      {% unless category_tags contains tag %}
        {% assign category_tags = category_tags | push: tag %}
      {% endunless %}
    {% endfor %}
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
    총 <strong id="visibleCount">{{ category_posts.size }}</strong>개의 트러블슈팅 기록
  </div>

  {% if category_posts.size > 0 %}
  <div class="posts-grid" id="postsGrid">
    {% for post in category_posts %}
      <article class="post-card-item" data-tags="{{ post.tags | join: ' ' }}">
        <a href="{{ post.url | relative_url }}" class="post-card">
          <div class="date-row">
            <span class="date">{{ post.date | date: "%Y년 %m월 %d일" }}</span>
            <span class="trouble-pill">Trouble</span>
          </div>
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
  <div class="no-posts">아직 등록된 트러블슈팅 기록이 없습니다.</div>
  {% endif %}
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const postsPerPage = 6; // 한 페이지당 표시할 글 개수
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