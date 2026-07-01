/* ===== DK 夏日抽鞋占卜 — 遊戲邏輯 ===== */
(function () {
  "use strict";

  var CARDS = window.CARDS || [];
  var FAN_COUNT = 6;          // 選牌畫面的蓋牌數
  var lastId = null;          // 避免連續抽到同一張

  // --- DOM ---
  var $ = function (id) { return document.getElementById(id); };
  var screens = {
    intro: $("screen-intro"),
    pick: $("screen-pick"),
    result: $("screen-result"),
  };

  // --- 星星背景 ---
  function makeStars() {
    var box = $("stars");
    if (!box) return;
    var n = 60, html = "";
    for (var i = 0; i < n; i++) {
      var s = (Math.random() * 2 + 1).toFixed(1);
      var x = (Math.random() * 100).toFixed(2);
      var y = (Math.random() * 100).toFixed(2);
      var d = (Math.random() * 3 + 2).toFixed(1);
      var delay = (Math.random() * 3).toFixed(1);
      html += '<span class="star" style="width:' + s + 'px;height:' + s +
        'px;left:' + x + '%;top:' + y + '%;--d:' + d + 's;animation-delay:' + delay + 's"></span>';
    }
    box.innerHTML = html;
  }

  // --- 畫面切換 ---
  function goto(name) {
    Object.keys(screens).forEach(function (k) {
      screens[k].classList.toggle("is-active", k === name);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // --- 產生扇形蓋牌 ---
  function dealFan() {
    var fan = $("fan");
    fan.innerHTML = "";
    fan.classList.remove("picking");
    var mid = (FAN_COUNT - 1) / 2;
    for (var i = 0; i < FAN_COUNT; i++) {
      var t = i - mid;                    // -2.5 ~ 2.5
      var angle = t * 11;                 // 旋轉角
      var x = t * 46;                     // 水平散開
      var y = Math.abs(t) * 12;           // 邊緣下沉成弧線
      var el = document.createElement("button");
      el.className = "fcard";
      el.setAttribute("aria-label", "第 " + (i + 1) + " 張蓋牌");
      el.style.setProperty("--t",
        "translateX(" + x + "px) translateY(" + y + "px) rotate(" + angle + "deg)");
      el.style.animationDelay = (i * 0.06) + "s";
      el.addEventListener("click", onPick);
      fan.appendChild(el);
    }
    // 觸發發牌動畫
    fan.classList.remove("dealing");
    void fan.offsetWidth;
    fan.classList.add("dealing");
  }

  // --- 抽到一張隨機鞋籤 ---
  function drawCard() {
    if (CARDS.length === 0) return null;
    var pool = CARDS;
    if (CARDS.length > 1 && lastId != null) {
      pool = CARDS.filter(function (c) { return c.id !== lastId; });
    }
    var card = pool[Math.floor(Math.random() * pool.length)];
    lastId = card.id;
    return card;
  }

  // --- 玩家點牌 ---
  function onPick(e) {
    var fan = $("fan");
    if (fan.classList.contains("picking")) return;
    fan.classList.add("picking");
    var chosen = e.currentTarget;
    chosen.classList.add("chosen");
    var others = fan.querySelectorAll(".fcard");
    others.forEach(function (c) { if (c !== chosen) c.classList.add("fade"); });

    var card = drawCard();
    fillCard(card);            // 先填好牌面（背面朝上，看不到）

    setTimeout(function () { reveal(card); }, 620);
  }

  // --- 填入牌面內容 ---
  function fillCard(card) {
    if (!card) return;
    $("r-theme").textContent = card.theme;
    var img = $("r-img");
    img.src = card.img;
    img.alt = card.name;
    $("r-fortune").textContent = card.fortune;
    $("r-tip").textContent = card.tip;
    $("r-name").textContent = card.name;
    $("buy-btn").href = card.url;
  }

  // --- 揭曉 ---
  function reveal(card) {
    goto("result");
    var cardEl = $("result-card");
    var actions = $("result-actions");
    cardEl.classList.remove("flipped");
    actions.classList.remove("show");
    // 進場後翻牌
    setTimeout(function () { cardEl.classList.add("flipped"); }, 340);
    // 翻完 → 灑金光 + 顯示按鈕
    setTimeout(function () {
      sparkle(cardEl);
      actions.classList.add("show");
    }, 1180);
  }

  // --- 金色閃光粒子 ---
  function sparkle(anchor) {
    var rect = anchor.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 3;
    for (var i = 0; i < 18; i++) {
      var p = document.createElement("span");
      p.className = "spark";
      document.body.appendChild(p);
      var ang = Math.random() * Math.PI * 2;
      var dist = 60 + Math.random() * 120;
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist;
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.background = Math.random() > 0.5 ? "#f4c95d" : "#ff8f7a";
      p.animate(
        [
          { transform: "translate(-50%,-50%) scale(1)", opacity: 1 },
          { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(0)", opacity: 0 },
        ],
        { duration: 700 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }
      ).onfinish = function () { this.effect.target.remove(); };
    }
  }

  // --- 綁定 ---
  function init() {
    makeStars();
    if ($("total-count")) $("total-count").textContent = CARDS.length;
    $("start-btn").addEventListener("click", function () { goto("pick"); dealFan(); });
    $("reshuffle-btn").addEventListener("click", dealFan);
    $("again-btn").addEventListener("click", function () { goto("pick"); dealFan(); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
