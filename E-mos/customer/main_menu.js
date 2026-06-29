document.addEventListener("DOMContentLoaded", function () {
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
    const stored = Number(localStorage.getItem("partySize") || "1");
    if (!Number.isFinite(stored) || stored <= 0) {
      return 1;
    }
    return Math.min(40, Math.floor(stored));
  }

  function getMaxOrderQuantity() {
    const partyCount = getPartyCount();
    return partyCount >= 4 ? 20 : Math.min(20, partyCount * 5);
  }

  function getCartTotalQuantity() {
    return cartItems.reduce(function (sum, item) {
      return sum + Number(item.quantity || 0);
    }, 0);
  }

  // LocalStorage からカート情報を復元
  function loadCartFromStorage() {
    const stored = localStorage.getItem("cartItems");
    if (stored) {
      try {
        cartItems = JSON.parse(stored);
      } catch (e) {
        cartItems = [];
      }
    }
  }

  // LocalStorage にカート情報を保存
  function saveCartToStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }

  // ページ読み込み時にカートを復元
  loadCartFromStorage();

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
    if (!quantityInput || !decreaseButton || !increaseButton) {
      return;
    }

    const maxOrderQuantity = getMaxOrderQuantity();
    const totalQuantity = getCartTotalQuantity();
    const remainingCapacity = Math.max(0, maxOrderQuantity - totalQuantity);
    const currentValue = Number(quantityInput.value || "0");
    let safeValue = Math.min(Math.max(0, currentValue), remainingCapacity);

    if (safeValue === 0 && remainingCapacity > 0) {
      safeValue = 1;
    }

    quantityInput.value = String(safeValue);
    quantityInput.max = String(remainingCapacity);

    const isAtMax = safeValue >= remainingCapacity;
    const isAtMin = safeValue <= 0;
    decreaseButton.disabled = isAtMin;
    increaseButton.disabled = isAtMax;
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
      quantityInput.value = "1";
    }
    updateQuantityControls();
    menuModal.classList.remove("hidden");
  }

  function closeMenuModal() {
    if (!menuModal) {
      return;
    }
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
      const maxOrderQuantity = getMaxOrderQuantity();

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
    const maxOrderQuantity = getMaxOrderQuantity();

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
    const maxOrderQuantity = getMaxOrderQuantity();
    const totalQuantity = getCartTotalQuantity();
    const remainingCapacity = Math.max(0, maxOrderQuantity - totalQuantity);
    if (value < remainingCapacity) {
      quantityInput.value = String(value + 1);
    }
    updateQuantityControls();
  });

  modalBackButton?.addEventListener("click", closeMenuModal);
  modalConfirmButton?.addEventListener("click", function () {
    const maxOrderQuantity = getMaxOrderQuantity();
    const totalQuantity = getCartTotalQuantity();
    const remainingCapacity = Math.max(0, maxOrderQuantity - totalQuantity);
    const count = Math.min(Number(quantityInput.value || "0"), remainingCapacity);
    const price = currentModalCard ? Number(currentModalCard.dataset.price || 0) : 0;

    if (remainingCapacity <= 0 || count <= 0) {
      quantityInput.value = "0";
      updateQuantityControls();
      showToast(`人数に応じて最大${maxOrderQuantity}個までです。`);
      return;
    }

    addToCartItem(modalTitle.textContent, price, count);
    showToast(`${modalTitle.textContent}を${count}個カートに追加しました。`);
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
