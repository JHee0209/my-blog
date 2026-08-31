(function () {
  "use strict";

  var WEEKS = 27; // 약 6개월

  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function key(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }

  /* ---------- 글 쓴 날 잔디 ---------- */
  function buildHeatmap() {
    var grid = document.getElementById("heatmap");
    var src = document.getElementById("post-dates");
    if (!grid || !src) return;

    var list = [];
    try { list = JSON.parse(src.textContent) || []; } catch (e) { list = []; }

    var counts = {};
    list.forEach(function (d) { if (d) counts[d] = (counts[d] || 0) + 1; });

    var today = new Date();
    today.setHours(0, 0, 0, 0);

    // 이번 주 토요일에서 끝나도록 맞춤
    var end = new Date(today);
    end.setDate(end.getDate() + (6 - end.getDay()));

    var start = new Date(end);
    start.setDate(start.getDate() - (WEEKS * 7 - 1));

    var cells = "";
    var monthLabels = "";
    var lastMonth = -1;

    for (var w = 0; w < WEEKS; w++) {
      var weekStart = new Date(start);
      weekStart.setDate(weekStart.getDate() + w * 7);

      if (weekStart.getMonth() !== lastMonth && weekStart.getDate() <= 7) {
        monthLabels += '<span style="grid-column:' + (w + 1) + '">' + (weekStart.getMonth() + 1) + "월</span>";
        lastMonth = weekStart.getMonth();
      }

      for (var d = 0; d < 7; d++) {
        var cur = new Date(start);
        cur.setDate(cur.getDate() + w * 7 + d);

        if (cur > today) {
          cells += '<i class="hm-cell hm-empty"></i>';
          continue;
        }
        var k = key(cur);
        var c = counts[k] || 0;
        var lv = c === 0 ? 0 : c === 1 ? 1 : c === 2 ? 2 : 3;
        var label = c === 0 ? k + " · 기록 없음" : k + " · 글 " + c + "개";
        cells += '<i class="hm-cell lv' + lv + '" title="' + label + '"></i>';
      }
    }

    grid.innerHTML = cells;
    var months = document.getElementById("heatmap-months");
    if (months) months.innerHTML = monthLabels;

    var scroller = grid.parentNode;
    if (scroller && scroller.classList.contains("hm-scroll")) {
      scroller.scrollLeft = scroller.scrollWidth;
    }
  }

  /* ---------- 누적 방문자 (GoatCounter) ---------- */
  function loadVisits() {
    var el = document.getElementById("visit-count");
    if (!el) return;
    var code = el.getAttribute("data-gc");
    if (!code) return;

    fetch("https://" + code + ".goatcounter.com/counter/TOTAL.json")
      .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); })
      .then(function (d) {
        var v = d.count_unique || d.count;
        el.textContent = v ? String(v) : "–";
      })
      .catch(function () { el.textContent = "–"; });
  }

  /* ---------- 모바일 메뉴 ---------- */
  function initNav() {
    var btn = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!btn || !nav) return;
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------- 코드 블록 복사 버튼 ---------- */
  function initCopy() {
    if (!navigator.clipboard) return;
    document.querySelectorAll(".prose pre").forEach(function (pre) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "복사";
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(pre.innerText.replace(/복사$/, "")).then(function () {
          btn.textContent = "복사됨";
          setTimeout(function () { btn.textContent = "복사"; }, 1500);
        });
      });
      pre.appendChild(btn);
    });
  }

  function ready() {
    buildHeatmap();
    loadVisits();
    initNav();
    initCopy();
  }

  if (document.readyState !== "loading") ready();
  else document.addEventListener("DOMContentLoaded", ready);
})();
