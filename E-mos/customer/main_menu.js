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
  const menuCards = document.querySelectorAll(".menu-card");
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
    if (!menuModal) {
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

  menuCards.forEach(function (card) {
    card.addEventListener("click", function () {
      openMenuModal(card);
    });
  });

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

  bottomNavButtons.forEach(function (button, index) {
    button.addEventListener("click", function () {
      if (index === 0) {
        window.location.href = "call_cash.html";
      } else if (index === 1) {
        window.location.href = "order_history.html";
      } else {
        openCartDrawer();
      }
    });
  });
});
