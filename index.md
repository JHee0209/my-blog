---
layout: home
title: BLOG
entries_layout: grid
---

> 배운 날 바로 적습니다. 미루면 왜 그랬는지를 잊어버려서요.


## Tags

<div class="tag-list">
{% assign tags = site.tags | sort %}
{% for tag in tags %}
  <a href="{{ site.baseurl }}/tags/#{{ tag[0] | slugify }}" class="tag-pill">{{ tag[0] }}</a>
{% endfor %}
</div>


<link rel="stylesheet" href="{{ site.baseurl }}/assets/css/custom.css">