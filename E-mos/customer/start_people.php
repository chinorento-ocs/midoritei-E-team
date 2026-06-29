<?php
  $pageTitle = '人数選択';
?>
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><?php echo htmlspecialchars($pageTitle, ENT_QUOTES, 'UTF-8'); ?></title>
  <link rel="stylesheet" href="start_people.css" />
</head>
<body>
  <main class="page">
    <section class="hero">
      <h1>みどり亭へようこそ</h1>
    </section>

    <section class="content">
      <article class="panel">
        <div class="top-row">
          <strong>人数を選択してください</strong>
        </div>

        <div class="row">
          <div class="label">大人</div>
          <div class="counter" aria-label="大人の人数">
            <button class="round-btn" id="adultMinus" type="button" aria-label="大人を減らす">−</button>
            <div class="number-display" id="adultCount">0</div>
            <button class="round-btn" id="adultPlus" type="button" aria-label="大人を増やす">＋</button>
          </div>
        </div>

        <div class="row">
          <div class="label">子供</div>
          <div class="counter" aria-label="子供の人数">
            <button class="round-btn" id="childMinus" type="button" aria-label="子供を減らす">−</button>
            <div class="number-display" id="childCount">0</div>
            <button class="round-btn" id="childPlus" type="button" aria-label="子供を増やす">＋</button>
          </div>
        </div>

        <div class="total-box" id="totalBox">合計 0人</div>
        <p class="helper-text" id="helperText" aria-live="polite">人数が入力されていません</p>

        <div class="confirm-wrap">
          <button class="confirm-btn" id="confirmBtn" type="button">人数を確定</button>
        </div>
      </article>
    </section>
  </main>

  <script src="start_people.js"></script>
</body>
</html>
