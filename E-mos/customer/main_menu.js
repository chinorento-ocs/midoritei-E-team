document.addEventListener("DOMContentLoaded", function () {

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 制限時間 / ラストオーダー設定
  // - 制限時間は「現在時刻」からの経過で設定（分）
  // - ラストオーダーは制限時間の30分前に表示されます
  const DURATION_MINUTES = 90; // 制限時間（分）
  const LAST_ORDER_BEFORE_END_MINUTES = 30; // ラストオーダーは制限時間の何分前か
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ここで終了時刻（制限時間）を決定（ページ読み込み時点からの相対時間）
  const END_TIME = new Date();
  END_TIME.setMinutes(END_TIME.getMinutes() + DURATION_MINUTES);

  const currentTimeEl       = document.getElementById("currentTime");
  const lastOrderTimeEl     = document.getElementById("lastOrderTime");
  const lastOrderRemainingEl = document.getElementById("lastOrderRemaining");

  // ラストオーダー時刻を "HH:MM" 形式で表示（制限時間の30分前）
  if (lastOrderTimeEl) {
    const lo = new Date(END_TIME.getTime() - LAST_ORDER_BEFORE_END_MINUTES * 60 * 1000);
    const hh = String(lo.getHours()).padStart(2, "0");
    const mm = String(lo.getMinutes()).padStart(2, "0");
    lastOrderTimeEl.textContent = `${hh}:${mm}`;
  }

  function updateClock() {
    const now   = new Date();

    // 終了時間までの残り秒（90分から減っていくカウントダウン表示）
    const remainingSec = Math.max(0, Math.floor((END_TIME.getTime() - now.getTime()) / 1000));

    if (currentTimeEl) {
      if (remainingSec <= 0) {
        currentTimeEl.textContent = "0分";
      } else {
        const remainingMin = Math.ceil(remainingSec / 60);
        currentTimeEl.textContent = `${remainingMin}分`;
      }
    }

    // ラストオーダー時刻（END_TIME - LAST_ORDER_BEFORE_END_MINUTES）までの残り秒
    const diffSec = Math.floor((END_TIME.getTime() - LAST_ORDER_BEFORE_END_MINUTES * 60 * 1000 - now.getTime()) / 1000);

    if (lastOrderRemainingEl) {
      // クラスをリセット
      lastOrderRemainingEl.className = "time-bar__remaining";

      if (diffSec <= 0) {
        // 終了済み
        lastOrderRemainingEl.textContent = "受付終了";
        lastOrderRemainingEl.classList.add("time-bar__remaining--over");
      } else {
        const diffMin = Math.ceil(diffSec / 60);
        const dispH   = Math.floor(diffMin / 60);
        const dispM   = diffMin % 60;
        const text    = dispH > 0 ? `あと ${dispH}時間${dispM}分` : `あと ${dispM}分`;
        lastOrderRemainingEl.textContent = text;

        if (diffMin <= 10) {
          lastOrderRemainingEl.classList.add("time-bar__remaining--soon");
        } else if (diffMin <= 30) {
          lastOrderRemainingEl.classList.add("time-bar__remaining--warn");
        } else {
          lastOrderRemainingEl.classList.add("time-bar__remaining--ok");
        }
      }
    }
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ─────────────────────────────────────────
  const categoryButtons = document.querySelectorAll(".category-nav .category");
  const sectionTitle = document.querySelector(".section-title");
  const bottomNavButtons = document.querySelectorAll(".bottom-nav button");
  let menuCards = document.querySelectorAll(".menu-card");
  const menuModal = document.querySelector(".menu-modal");
  const modalOverlay = document.querySelector(".menu-modal__overlay");
  const cartDrawer = document.querySelector(".cart-drawer");
  const cartOverlay = document.querySelector(".cart-drawer__overlay");
  const cartCloseButton = document.querySelector(".cart-drawer__button--secondary");
  const cartConfirmButton = document.querySelector(".cart-drawer__button--primary");
  const cartList = document.querySelector(".cart-drawer__list");
  const cartEmptyText = document.querySelector(".cart-drawer__empty");
  const cartBadge = document.querySelector("#cartBadge");
  const orderHistoryKey = "orderHistory";
  const modalBackButton = document.querySelector(".menu-modal__button--secondary");
  const modalConfirmButton = document.querySelector(".menu-modal__button--primary");
  const modalTitle = document.querySelector(".menu-modal__title");
  const modalImage = document.querySelector(".menu-modal__image");
  const quantityInput = document.querySelector(".quantity-input");
  const decreaseButton = document.querySelector("[data-action='decrease']");
  const increaseButton = document.querySelector("[data-action='increase']");

  let cartItems = [];
  let currentModalCard = null;
  let soldOutMenuIds = new Set();

  const menuIdByTitle = {
    "かわ": "1",
    "レバー": "2",
    "枝豆": "3",
    "だし巻き卵": "4",
    "プリン": "5",
    "生ビール（中）": "6",
    "ハイボール": "7",
    "焼酎ソーダ割り": "8",
    "日本酒（冷酒）": "9",
    "チューハイ": "10",
    "ウーロン茶": "11",
    "唐揚げ": "12",
    "チーズボール": "13",
    "冷奴": "14",
    "ポテトサラダ": "15",
    "キュウリの浅漬け": "16",
    "ナッツミックス": "17",
    "はつ塩": "18",
    "ねぎま塩": "19",
    "もも塩": "20",
    "ぼんじり塩": "21",
    "なんこつ塩": "22",
    "砂肝塩": "23"
  };

  function readStoredArray(key) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed.map(function (value) {
        return String(value);
      }) : [];
    } catch (error) {
      return [];
    }
  }

  function assignMenuIds() {
    menuCards.forEach(function (card) {
      const title = card.querySelector("h2")?.textContent?.trim() || "";
      const menuId = menuIdByTitle[title];
      if (menuId) {
        card.dataset.menuId = menuId;
      }
    });
  }

  function createMenuCard(item){
    var article = document.createElement('article');
    article.className = 'menu-card';
    article.dataset.generated = '1';
    if(item.unitPrice){ article.dataset.price = item.unitPrice; }
    if(item.categoryName){ article.dataset.category = item.categoryName; }
    if(item.menuId){ article.dataset.menuId = String(item.menuId); }

    var imgDiv = document.createElement('div');
    imgDiv.className = 'menu-card__image';
    if(item.photoDataUrl){
      var img = document.createElement('img');
      img.src = item.photoDataUrl;
      img.alt = item.menuName || '商品';
      imgDiv.appendChild(img);
    } else {
      imgDiv.textContent = item.menuName || '商品';
    }

    var bodyDiv = document.createElement('div');
    bodyDiv.className = 'menu-card__body';

    var h2 = document.createElement('h2');
    h2.textContent = item.menuName || '';
    bodyDiv.appendChild(h2);

    if(item.menuDescription){
      var p = document.createElement('p');
      p.textContent = item.menuDescription;
      bodyDiv.appendChild(p);
    }

    if(item.unitPrice){
      var priceP = document.createElement('p');
      priceP.className = 'menu-price';
      priceP.textContent = formatPrice(item.unitPrice);
      bodyDiv.appendChild(priceP);
    }

    article.appendChild(imgDiv);
    article.appendChild(bodyDiv);
    return article;
  }

  function loadStoredMenuItems(){
    try{
      var stored = JSON.parse(localStorage.getItem('menu_items') || '[]');
      if(!Array.isArray(stored) || stored.length===0) return;
      var grid = document.querySelector('.menu-grid');
      if(!grid) return;
      stored.forEach(function(item){
        // まず、既存の静的カードがあるか探す（data-menu-id で一致）
        var matched = grid.querySelector('.menu-card[data-menu-id="' + CSS.escape(String(item.menuId)) + '"]');
        if(matched){
          // 元データを保存していなければ保存
          if(!matched.dataset.originalTitle){
            var origTitle = matched.querySelector('h2') ? matched.querySelector('h2').textContent.trim() : '';
            var origDesc = matched.querySelector('.menu-card__body p') ? matched.querySelector('.menu-card__body p').textContent.trim() : '';
            var origPriceEl = matched.querySelector('.menu-price');
            var origPrice = origPriceEl ? origPriceEl.textContent.trim() : '';
            var imgEl = matched.querySelector('.menu-card__image img');
            var origImg = imgEl ? imgEl.src : '';
            matched.dataset.originalTitle = origTitle;
            matched.dataset.originalDescription = origDesc;
            matched.dataset.originalPrice = origPrice;
            matched.dataset.originalImage = origImg;
            matched.dataset.originalCategory = matched.dataset.category || '';
          }

          // 上書き：タイトル、説明、価格、画像、カテゴリ
          if(item.menuName){ var h2 = matched.querySelector('h2'); if(h2) h2.textContent = item.menuName; }
          if(item.menuDescription){
            var p = matched.querySelector('.menu-card__body p');
            if(p) p.textContent = item.menuDescription;
            else { var np = document.createElement('p'); np.textContent = item.menuDescription; matched.querySelector('.menu-card__body').appendChild(np); }
          }
          if(item.unitPrice){
            var priceP = matched.querySelector('.menu-price');
            if(priceP) priceP.textContent = formatPrice(item.unitPrice);
            else { var pp = document.createElement('p'); pp.className='menu-price'; pp.textContent = formatPrice(item.unitPrice); matched.querySelector('.menu-card__body').appendChild(pp); }
          }
          if(item.photoDataUrl){
            var imgWrap = matched.querySelector('.menu-card__image');
            if(imgWrap){ imgWrap.innerHTML = ''; var img = document.createElement('img'); img.src = item.photoDataUrl; img.alt = item.menuName || '商品'; imgWrap.appendChild(img); }
          }
          if(item.categoryName){ matched.dataset.category = item.categoryName; }
          // mark as generated override
          matched.dataset.generated = '1';
        } else {
          // 静的カードが無ければ動的に追加
          var card = createMenuCard(item);
          var category = item.categoryName || '';
          if(category){
            var same = grid.querySelectorAll('.menu-card[data-category="' + CSS.escape(category) + '"]');
            if(same && same.length){
              var last = same[same.length-1];
              last.parentNode.insertBefore(card, last.nextSibling);
              return;
            }
          }
          grid.appendChild(card);
        }
      });
      // stored に無い静的カードはオリジナルを復元
      try{
        var ids = stored.map(function(it){ return String(it.menuId || it.id || ''); });
        var allCards = grid.querySelectorAll('.menu-card[data-menu-id]');
        allCards.forEach(function(card){
          var mid = String(card.dataset.menuId || '');
          if(card.dataset.originalTitle && ids.indexOf(mid) === -1){
            // restore
            var h2 = card.querySelector('h2'); if(h2) h2.textContent = card.dataset.originalTitle || '';
            var body = card.querySelector('.menu-card__body');
            if(body){
              // restore description
              var p = body.querySelector('p');
              if(p) p.textContent = card.dataset.originalDescription || '';
              // restore price
              var origPrice = card.dataset.originalPrice || '';
              var priceEl = body.querySelector('.menu-price');
              if(priceEl) priceEl.textContent = origPrice;
            }
            // restore image
            var imgWrap = card.querySelector('.menu-card__image');
            if(imgWrap){
              if(card.dataset.originalImage){ imgWrap.innerHTML = ''; var img = document.createElement('img'); img.src = card.dataset.originalImage; imgWrap.appendChild(img); }
              else { /* leave as-is */ }
            }
            // restore category
            if(card.dataset.originalCategory) card.dataset.category = card.dataset.originalCategory;
            delete card.dataset.generated;
          }
        });
      }catch(e){/* ignore */}
    }catch(e){ console.error('failed to load menu_items', e); }
  }

  function refreshStoredMenuItems(){
    try{
      var grid = document.querySelector('.menu-grid');
      if(!grid) return;
      // 以前追加した動的カードを削除
      var dyn = grid.querySelectorAll('.menu-card[data-generated="1"]');
      dyn.forEach(function(n){ n.parentNode && n.parentNode.removeChild(n); });
      // 再読み込み
      loadStoredMenuItems();
      // 再バインド
      menuCards = document.querySelectorAll('.menu-card');
      assignMenuIds();
      syncSoldOutState();
      bindMenuCardClicks();
    }catch(e){ console.error('failed to refresh stored menu items', e); }
  }

  function isSoldOutCard(card) {
    const menuId = card?.dataset?.menuId || "";
    return menuId !== "" && soldOutMenuIds.has(menuId);
  }

  function applySoldOutState() {
    menuCards.forEach(function (card) {
      const isSoldOut = isSoldOutCard(card);
      card.classList.toggle("is-soldout", isSoldOut);
      card.setAttribute("aria-disabled", String(isSoldOut));
      card.dataset.soldOut = isSoldOut ? "true" : "false";
    });
  }

  function syncSoldOutState() {
    soldOutMenuIds = new Set(readStoredArray("soldout_items"));
    applySoldOutState();
  }

  function getPartyCount() {
    const storedValue = sessionStorage.getItem("partySize") || localStorage.getItem("partySize") || "1";
    const stored = Number(storedValue);
    if (!Number.isFinite(stored) || stored <= 0) {
      return 1;
    }
    return Math.min(40, Math.floor(stored));
  }

  function getMaxOrderQuantity() {
    const partyCount = getPartyCount();
    return partyCount >= 4 ? 20 : Math.min(20, partyCount * 5);
  }

  const maxOrderQuantity = getMaxOrderQuantity();

  function getCartTotalQuantity() {
    return cartItems.reduce(function (sum, item) {
      return sum + Number(item.quantity || 0);
    }, 0);
  }

  // バッジ表示（カート確認ボタンの赤丸）を最新の合計個数に更新
  function updateCartBadge() {
    if (!cartBadge) {
      return;
    }
    const total = getCartTotalQuantity();
    if (total > 0) {
      cartBadge.textContent = total > 99 ? "99+" : String(total);
      cartBadge.classList.remove("hidden");
    } else {
      cartBadge.classList.add("hidden");
    }
  }

  // SessionStorage からカート情報を復元（タブ/セッション単位で管理）
  function loadCartFromStorage() {
    const stored = sessionStorage.getItem("cartItems");
    if (stored) {
      try {
        cartItems = JSON.parse(stored);
      } catch (e) {
        cartItems = [];
      }
    }
  }

  // SessionStorage にカート情報を保存し、バッジ表示も同期させる
  function saveCartToStorage() {
    sessionStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartBadge();
  }

  // ページ読み込み時にカートを復元
  loadCartFromStorage();
  updateCartBadge();
  // まずローカルに保存された商品をレンダリングしてから再取得する
  loadStoredMenuItems();
  // 再取得して静的ノードと動的ノード両方を対象にする
  menuCards = document.querySelectorAll('.menu-card');
  assignMenuIds();
  syncSoldOutState();

  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.left = "50%";
    toast.style.bottom = "86px";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "rgba(79, 42, 0, 0.9)";
    toast.style.color = "#fff";
    toast.style.padding = "12px 18px";
    toast.style.borderRadius = "999px";
    toast.style.fontSize = "0.95rem";
    toast.style.zIndex = "1000";
    toast.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.style.transition = "opacity 0.25s ease";
      toast.style.opacity = "0";
      setTimeout(function () {
        document.body.removeChild(toast);
      }, 250);
    }, 1400);
  }

  function updateQuantityControls() {
    if (!quantityInput || !decreaseButton || !increaseButton || !modalConfirmButton) {
      return;
    }

    const max = getMaxOrderQuantity();
    const totalQuantity = getCartTotalQuantity();
    const remaining = Math.max(0, max - totalQuantity);
    const currentValue = Number(quantityInput.value || "0");
    const initialValue = currentValue > 0 ? currentValue : 0;
    const safeValue = Math.min(initialValue, remaining);

    quantityInput.value = String(safeValue);
    quantityInput.max = String(remaining);

    const isAtMax = safeValue >= remaining;
    const isAtMin = safeValue <= 0;
    decreaseButton.disabled = isAtMin;
    increaseButton.disabled = isAtMax;
    modalConfirmButton.disabled = remaining <= 0 || isAtMin;
  }

  function openMenuModal(card) {
    if (!menuModal || !card) {
      return;
    }

    if (card.classList.contains("is-soldout")) {
      showToast("この商品は売り切れです。");
      return;
    }

    currentModalCard = card;
    const title = card.querySelector("h2")?.textContent.trim() || "メニュー";
    const imageLabel = card.querySelector(".menu-card__image")?.textContent.trim() || "商品";
    modalTitle.textContent = title;
    modalImage.textContent = imageLabel;
    if (quantityInput) {
      quantityInput.value = "0";
    }
    updateQuantityControls();
    menuModal.classList.remove("hidden");
  }

  function closeMenuModal() {
    if (!menuModal) {
      return;
    }
    if (quantityInput) {
      quantityInput.value = "0";
    }
    updateQuantityControls();
    menuModal.classList.add("hidden");
  }

  function filterMenuByCategory(category) {
    menuCards.forEach(function (card) {
      if (category === "おすすめ") {
        card.style.display = "flex";
        return;
      }
      const cardCategory = card.dataset.category || "";
      card.style.display = cardCategory === category ? "flex" : "none";
    });
  }

  function formatPrice(amount) {
    if (amount == null) {
      return "";
    }
    return "¥" + Number(amount).toLocaleString() + "（税込）";
  }

  function getStoredOrderHistory() {
    try {
      return JSON.parse(sessionStorage.getItem(orderHistoryKey) || "[]");
    } catch (error) {
      return [];
    }
  }

  function saveConfirmedOrder(items) {
    const history = getStoredOrderHistory();
    history.unshift({
      id: Date.now(),
      createdAt: new Date().toISOString(),
      items: items.map(function (item) {
        return {
          title: item.title,
          price: Number(item.price || 0),
          quantity: Number(item.quantity || 0)
        };
      })
    });
    sessionStorage.setItem(orderHistoryKey, JSON.stringify(history));
  }

  function renderCartItems() {
    if (!cartList || !cartEmptyText) {
      return;
    }

    cartList.innerHTML = "";

    if (cartItems.length === 0) {
      cartEmptyText.style.display = "block";
      cartList.style.display = "none";
      return;
    }

    cartEmptyText.style.display = "none";
    cartList.style.display = "grid";

    cartItems.forEach(function (item) {
      const listItem = document.createElement("li");
      listItem.className = "cart-drawer__item";

      const content = document.createElement("div");
      const titleEl = document.createElement("div");
      titleEl.className = "cart-drawer__item-title";
      titleEl.textContent = item.title;

      const controls = document.createElement("div");
      controls.className = "cart-drawer__item-controls";

      const decreaseBtn = document.createElement("button");
      decreaseBtn.type = "button";
      decreaseBtn.className = "cart-drawer__qty-button";
      decreaseBtn.dataset.action = "decrease";
      decreaseBtn.dataset.title = item.title;
      decreaseBtn.textContent = "−";

      const quantityText = document.createElement("span");
      quantityText.className = "cart-drawer__item-quantity";
      quantityText.textContent = `${item.quantity}個`;

      const increaseBtn = document.createElement("button");
      increaseBtn.type = "button";
      increaseBtn.className = "cart-drawer__qty-button";
      increaseBtn.dataset.action = "increase";
      increaseBtn.dataset.title = item.title;
      increaseBtn.textContent = "+";

      controls.appendChild(decreaseBtn);
      controls.appendChild(quantityText);
      controls.appendChild(increaseBtn);

      content.appendChild(titleEl);
      content.appendChild(controls);

      listItem.appendChild(content);
      cartList.appendChild(listItem);

      decreaseBtn.addEventListener("click", function () {
        updateCartItemQuantity(item.title, item.quantity - 1);
      });
      increaseBtn.addEventListener("click", function () {
        updateCartItemQuantity(item.title, item.quantity + 1);
      });
    });
  }

  function updateCartItemQuantity(title, quantity) {
    if (!title) {
      return;
    }

    const existing = cartItems.find(function (item) {
      return item.title === title;
    });

    if (!existing) {
      return;
    }

    if (quantity <= 0) {
      cartItems = cartItems.filter(function (item) {
        return item.title !== title;
      });
    } else {
      const totalQuantity = getCartTotalQuantity();
      const nextTotal = totalQuantity - existing.quantity + quantity;

      if (nextTotal > maxOrderQuantity) {
        showToast(`人数に応じて最大${maxOrderQuantity}個までです。`);
        return;
      }

      existing.quantity = quantity;
    }

    renderCartItems();
    saveCartToStorage();
  }

  function addToCartItem(title, price, quantity) {
    if (!title || quantity <= 0) {
      return;
    }

    const totalQuantity = getCartTotalQuantity();

    if (totalQuantity + quantity > maxOrderQuantity) {
      showToast(`人数に応じて最大${maxOrderQuantity}個までです。`);
      return;
    }

    const existing = cartItems.find(function (item) {
      return item.title === title;
    });

    if (existing) {
      existing.quantity += quantity;
    } else {
      cartItems.push({ title: title, price: price, quantity: quantity });
    }

    saveCartToStorage();
  }

  function openCartDrawer() {
    if (!cartDrawer) {
      return;
    }
    renderCartItems();
    document.body.classList.add("no-scroll");
    cartDrawer.classList.remove("hidden");
    setTimeout(function () {
      cartDrawer.classList.add("open");
    }, 10);
  }

  function closeCartDrawer() {
    if (!cartDrawer) {
      return;
    }
    cartDrawer.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }

  function bindMenuCardClicks(){
    menuCards.forEach(function (card) {
      // remove previous listener by cloning node
      var clone = card.cloneNode(true);
      card.parentNode.replaceChild(clone, card);
      clone.addEventListener("click", function () {
        if (clone.classList.contains("is-soldout")) {
          showToast("この商品は売り切れです。");
          return;
        }
        openMenuModal(clone);
      });
    });
  }
  bindMenuCardClicks();

  decreaseButton?.addEventListener("click", function () {
    const value = Number(quantityInput.value || "0");
    if (value > 0) {
      quantityInput.value = String(value - 1);
    }
    updateQuantityControls();
  });

  increaseButton?.addEventListener("click", function () {
    const value = Number(quantityInput.value || "0");
    const max = getMaxOrderQuantity();
    if (value < max) {
      quantityInput.value = String(value + 1);
    }
    updateQuantityControls();
  });

  modalBackButton?.addEventListener("click", closeMenuModal);
  modalConfirmButton?.addEventListener("click", function () {
    if (currentModalCard && currentModalCard.classList.contains("is-soldout")) {
      showToast("この商品は売り切れです。");
      closeMenuModal();
      return;
    }

    const count = Number(quantityInput.value || "0");
    const price = currentModalCard ? Number(currentModalCard.dataset.price || 0) : 0;
    const max = getMaxOrderQuantity();
    const totalQuantity = getCartTotalQuantity();
    const remaining = Math.max(0, max - totalQuantity);

    if (remaining <= 0) {
      quantityInput.value = "0";
      updateQuantityControls();
      showToast(`人数に応じて最大${max}個までです。`);
      return;
    }

    const safeCount = Math.min(Math.max(1, count), remaining);

    if (totalQuantity + safeCount > max) {
      quantityInput.value = "0";
      updateQuantityControls();
      showToast(`人数に応じて最大${max}個までです。`);
      return;
    }

    addToCartItem(modalTitle.textContent, price, safeCount);
    showToast(`${modalTitle.textContent}を${safeCount}個カートに追加しました。`);
    closeMenuModal();
  });

  cartCloseButton?.addEventListener("click", closeCartDrawer);
  cartConfirmButton?.addEventListener("click", function () {
    if (cartItems.length > 0) {
      saveConfirmedOrder(cartItems);
    }
    if (cartItems.length === 0) {
      showToast("カートの中身が入っていません。");
      return;
    }
    cartItems = [];
    saveCartToStorage();
    renderCartItems();
    showToast("注文を確定しました。");
    closeCartDrawer();
  });

  categoryButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      if (button.classList.contains("active")) {
        return;
      }

      categoryButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });
      button.classList.add("active");

      const categoryName = button.textContent.trim();
      sectionTitle.textContent = categoryName;
      filterMenuByCategory(categoryName);
    });
  });

  function callStaff() {
    const currentTableNumber = sessionStorage.getItem("tableNumber") || localStorage.getItem("tableNumber") || "1";
    const pendingCalls = new Set(readStoredArray("pending_staff_calls"));
    const handledSeats = new Set(readStoredArray("handled_seats"));

    pendingCalls.add(String(currentTableNumber));
    handledSeats.delete(String(currentTableNumber));

    localStorage.setItem("pending_staff_calls", JSON.stringify(Array.from(pendingCalls)));
    localStorage.setItem("handled_seats", JSON.stringify(Array.from(handledSeats)));

    console.log("staff call saved", {
      tableNumber: String(currentTableNumber),
      pendingCalls: Array.from(pendingCalls),
      handledSeats: Array.from(handledSeats)
    });

    localStorage.setItem("last_staff_call", JSON.stringify({
      tableNumber: String(currentTableNumber),
      at: new Date().toISOString()
    }));

    window.dispatchEvent(new Event("staff-call-updated"));
    showToast("店員を呼び出しました。少しお待ちください。");
    window.location.href = "call_cash.html";
  }

  bottomNavButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      if (index === 0) {
        callStaff();
      } else if (index === 1) {
        window.location.href = "order_history.html";
      } else {
        openCartDrawer();
      }
    });
  });

  window.addEventListener("storage", function () {
    // storage イベントは別タブからの変更で発火
    syncSoldOutState();
    refreshStoredMenuItems();
  });
  // カスタムイベントで同ウィンドウ内の変更も反映
  window.addEventListener('menu_items_changed', function(){
    syncSoldOutState();
    refreshStoredMenuItems();
  });
});



