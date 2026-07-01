# DK 夏日抽鞋占卜 ✦ 今日鞋籤

一個放在 GitHub Pages 的互動小遊戲：洗牌、憑直覺抽一張牌，每一雙 DK 鞋都帶著一句專屬的運勢小語，並可一鍵前往商品頁購買。

## 玩法
1. 進入頁面 → 點「抽一張今日鞋籤」
2. 從扇形蓋牌中憑直覺選一張
3. 翻牌揭曉：鞋款照片 + 運勢主題 + 運勢小語 + 幸運提示
4. 可「前往購買這雙鞋」、「再抽一次」或「分享」

## 嵌入 91app（iframe）
把下面這段貼進 91app 頁面的「HTML 自訂區塊」即可（`height` 建議 700–760px）：

```html
<iframe
  src="https://rhk9003.github.io/dk-shoe-fortune/?v=6"
  style="width:100%;max-width:560px;height:720px;border:0;display:block;margin:0 auto;"
  loading="lazy"
  title="DK 夏日抽鞋占卜"></iframe>
```

想先看嵌入效果，開 `embed-example.html` 即可。「前往購買」預設開新分頁；若想直接在同一視窗跳到商品頁，把 `index.html` 裡 `id="buy-btn"` 的 `target="_blank"` 改成 `target="_top"`。

## 檔案結構
| 檔案 | 說明 |
| --- | --- |
| `index.html` | 頁面結構 |
| `styles.css` | 視覺樣式（夏夜占卜風、翻牌動畫） |
| `app.js` | 遊戲邏輯（洗牌、抽牌、翻牌、分享） |
| `cards.js` | 21 張鞋牌資料（`window.CARDS`：鞋款、運勢、售價、商品連結、圖片） |
| `images/` | 21 張鞋款主圖（檔名為商品序號 `<id>.jpg`） |

## 如何新增 / 修改鞋款
編輯 `cards.js` 內的 `window.CARDS` 陣列，每張牌一個物件：

```js
{
  "id": 11288862,                 // 商品序號（同時是圖檔名）
  "name": "柔軟真皮低跟通勤鞋 黑色",  // 顯示名稱
  "category": "DK 氣墊鞋",
  "price": 3680,
  "theme": "事業運",               // 運勢主題
  "fortune": "低調的黑最會發亮……",  // 運勢小語
  "tip": "開工前先整理一次桌面",     // 幸運提示
  "url": "https://www.dk-shoes.com.tw/SalePage/Index/11288862",
  "img": "images/11288862.jpg"
}
```

新增鞋款時，把主圖放進 `images/`，命名為 `<商品序號>.jpg`（建議壓到寬高 ≤ 900px）。

## 本機預覽
```bash
python -m http.server 5178
# 瀏覽 http://localhost:5178
```

---
© DK 高博士健康氣墊鞋 · 本遊戲為娛樂性質，運勢僅供博君一笑。
