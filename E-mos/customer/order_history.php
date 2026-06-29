<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>注文履歴</title>
  <link rel="stylesheet" href="order_history.css" />
</head>
<body>
  <main class="page">
    <section class="hero">
      <div class="hero-inner">
        <div>
          <div class="hero-accent"></div>
          <div class="eyebrow">Midoritei</div>
          <h1>注文履歴</h1>
        </div>
        <button class="back-btn" type="button">メニューへ戻る</button>
      </div>
    </section>

    <section class="content">
      <article class="panel">
        <div class="summary-card">
          <article class="mini-card">
            <div class="mini-label">本日の注文</div>
            <div class="mini-value">お客様のご注文</div>
          </article>
        </div>

        <div class="history-list">
          <article class="seat-card">
            <div class="seat-header">
              <div class="seat-name">ご注文内容</div>
              <span class="seat-chip">提供済み</span>
            </div>
            <ul class="menu-list">
              <li class="menu-item">
                <div class="menu-copy">
                  <span class="menu-name">焼き鳥盛り合わせ</span>
                  <span class="menu-note">済</span>
                </div>
                <div class="menu-meta">
                  <span class="menu-price">¥1,280</span>
                </div>
              </li>
              <li class="menu-item">
                <div class="menu-copy">
                  <span class="menu-name">唐揚げセット</span>
                  <span class="menu-note">済</span>
                </div>
                <div class="menu-meta">
                  <span class="menu-price">¥980</span>
                </div>
              </li>
            </ul>
          </article>
        </div>
      </article>
    </section>
  </main>
  <script src="order_history.js"></script>
</body>
</html>
