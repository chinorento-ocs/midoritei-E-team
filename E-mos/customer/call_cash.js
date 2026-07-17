document.addEventListener("DOMContentLoaded", function () {
  const callButton = document.querySelector("button[data-action=call]");
  const payButton = document.querySelector("button[data-action=pay]");
  const callModal = document.querySelector("#callModal");
  const payModal = document.querySelector("#payModal");
  const callModalButton = document.querySelector(".call-modal__button");
  const payModalButton = document.querySelector(".pay-modal__button");
  const seatLabel = document.querySelector(".pay-card__table");
  const callMessage = document.querySelector(".call-modal__message");
  const callSubMessage = document.querySelector(".call-modal__submessage");

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

  function getCurrentTableNumber() {
    return "1";
  }

  function applyHandledSeatState() {
    const handledSeats = new Set(readStoredArray("handled_seats"));
    const currentTable = getCurrentTableNumber();
    const isHandled = handledSeats.has(currentTable);

    if (seatLabel) {
      seatLabel.textContent = isHandled ? `卓番${currentTable}（対応済み）` : `卓番${currentTable}`;
    }

    if (callMessage) {
      callMessage.textContent = "店員がまいります。";
    }

    if (callSubMessage) {
      callSubMessage.textContent = "しばらくお待ちください。";
    }

    if (callButton) {
      callButton.disabled = false;
      callButton.removeAttribute("disabled");
      callButton.style.opacity = "1";
      callButton.style.cursor = "pointer";
    }
  }

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

    setTimeout(() => {
      toast.style.transition = "opacity 0.25s ease";
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 250);
    }, 1600);
  }

  function openCallModal() {
    if (!callModal) return;
    callModal.classList.remove("hidden");
  }

  function closeCallModal() {
    if (!callModal) return;
    callModal.classList.add("hidden");
  }

  function openPayModal() {
    if (!payModal) return;
    payModal.classList.remove("hidden");
  }

  function closePayModal() {
    if (!payModal) return;
    payModal.classList.add("hidden");
  }

  if (callButton) {
    callButton.addEventListener("click", openCallModal);
  }

  if (callModalButton) {
    callModalButton.addEventListener("click", closeCallModal);
  }

  if (payButton) {
    payButton.addEventListener("click", openPayModal);
  }

  if (payModalButton) {
    payModalButton.addEventListener("click", closePayModal);
  }

  applyHandledSeatState();
  window.addEventListener("storage", function () {
    applyHandledSeatState();
  });
});
