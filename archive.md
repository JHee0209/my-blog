---
layout: default
title: 전체 글
permalink: /archive/
---

<style>
.ar-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 1.5rem 6rem;
  text-align: left;
}

.ar-head {
  display: flex;
  align-items: baseline;
  gap: 0.7rem;
  margin-bottom: 3rem;
}
.ar-head h1 {
  margin: 0;
  color: #15141b;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: -0.03em;
}
.ar-head .ar-count {
  color: #9a96a8;
  font-size: 0.85rem;
}
.ar-head .ar-count strong {
  color: #5b4ae0;
  font-weight: 600;
}

.ar-month {
  margin-bottom: 2.6rem;
}

.ar-month-label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  color: #1a1a2e;
  font-size: 0.95rem;
  font-weight: 700;
}
.ar-month-label::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #f0eff7;
}
.ar-month-label span {
  color: #b4b0c0;
  font-size: 0.76rem;
  font-weight: 400;
}

.ar-item {
  display: flex;
  align-items: flex-start;
  gap: 1.1rem;
  padding: 0.95rem 0.9rem;
  border-radius: 12px;
  text-decoration: none;
  transition: background 0.18s;
}
.ar-item:hover { background: #faf9ff; }

.ar-date {
  flex: none;
  width: 44px;
  padding-top: 0.15rem;
  color: #b4b0c0;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.ar-body { flex: 1; min-width: 0; }

.ar-title {
  display: block;
  color: #1a1a2e;
  font-size: 0.98rem;
  font-weight: 600;
  line-height: 1.55;
  letter-spacing: -0.015em;
  transition: color 0.18s;
}
.ar-item:hover .ar-title { color: #5b4ae0; }

.ar-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.5rem;
}

.ar-cat {
  padding: 0.18rem 0.55rem;
  border-radius: 999px;
  background: #f1eeff;
  color: #5b4ae0;
  font-size: 0.7rem;
  font-weight: 600;
}
.ar-cat.is-trouble {
  background: #ffecea;
  color: #d93a2b;
}

.ar-tag {
  color: #a79ff0;
  font-size: 0.74rem;
}

.ar-empty {
  padding: 4rem 1rem;
  text-align: center;
  color: #b4b0c0;
  font-size: 0.9rem;
}

@media (max-width: 600px) {
  .ar-wrap { padding: 2.8rem 1.15rem 4rem; }
  .ar-head { flex-direction: column; gap: 0.35rem; margin-bottom: 2rem; }
  .ar-head h1 { font-size: 1.55rem; }
  .ar-item { gap: 0.8rem; padding: 0.85rem 0.6rem; }
  .ar-date { width: 38px; font-size: 0.72rem; }
}
</style>

<div class="ar-wrap">

  <div class="ar-head">
    <h1>{{ page.title }}</h1>
    <span class="ar-count">모두 <strong>{{ site.posts.size }}</strong>편</span>
  </div>

  {% if site.posts.size == 0 %}
    <p class="ar-empty">아직 작성한 글이 없습니다.</p>
  {% else %}

    {% assign by_month = site.posts | group_by_exp: "p", "p.date | date: '%Y-%m'" %}
    {% for month in by_month %}
      <section class="ar-month">

        <div class="ar-month-label">
          {{ month.name | append: "-01" | date: "%Y년 %m월" }}
          <span>{{ month.items.size }}편</span>
        </div>

        {% for post in month.items %}
        <a class="ar-item" href="{{ post.url | relative_url }}">

          <span class="ar-date">{{ post.date | date: "%m.%d" }}</span>

          <span class="ar-body">
            <span class="ar-title">{{ post.title }}</span>

            {% if post.categories.size > 0 or post.tags.size > 0 %}
            <span class="ar-meta">
              {% assign cat = post.categories.first %}
              {% if cat %}
                <span class="ar-cat{% if cat == '트러블슈팅' or cat == 'Troubleshooting' %} is-trouble{% endif %}">{{ cat }}</span>
              {% endif %}
              {% for tag in post.tags limit: 4 %}
                <span class="ar-tag">#{{ tag }}</span>
              {% endfor %}
            </span>
            {% endif %}
          </span>

        </a>
        {% endfor %}

      </section>
    {% endfor %}

  {% endif %}

</div>