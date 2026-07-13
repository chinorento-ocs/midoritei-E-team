document.addEventListener('DOMContentLoaded', () => {
  const historyList = document.querySelector('.history-list');
  const summaryCard = document.querySelector('.summary-card');
  const orderTotal = document.querySelector('.order-total');

  function getStoredOrderHistory() {
    try {
      return JSON.parse(sessionStorage.getItem('orderHistory') || '[]');
    } catch (error) {
      return [];
    }
  }

  function formatCurrency(amount) {
    return `¥${Number(amount).toLocaleString()}`;
  }

  function formatOrderTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '時刻不明';
    }
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function readStoredObject(key) {
    try {
      const value = localStorage.getItem(key);
      if (!value) {
        return {};
      }
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function normalizeText(value) {
    return String(value || '')
      .normalize('NFKC')
      .replace(/\s+/g, '')
      .toLowerCase();
  }

  function extractServedCount(servedData, itemName) {
    const normalizedName = normalizeText(itemName);

    if (!servedData || typeof servedData !== 'object') {
      return 0;
    }

    const entries = Array.isArray(servedData) ? servedData : Object.entries(servedData);

    const matchedEntry = entries.find(([key, value]) => {
      const source = value && typeof value === 'object' ? value : { value };
      const candidates = [
        key,
        source.menuId,
        source.menuName,
        source.name,
        source.title,
        source.label,
        source.itemName,
        source.productName
      ];
      return candidates.some((candidate) => normalizeText(candidate).includes(normalizedName) || normalizedName.includes(normalizeText(candidate)));
    });

    if (!matchedEntry) {
      return 0;
    }

    const [, value] = matchedEntry;
    if (value && typeof value === 'object') {
      return Number(value.servedCount ?? value.count ?? value.qty ?? value.quantity ?? value.value ?? 0);
    }
    return Number(value || 0);
  }

  function renderServedStatus() {
    const tableNumber = sessionStorage.getItem('partySize') || localStorage.getItem('partySize') || '1';
    const servedData = readStoredObject(`served_${tableNumber}`);

    if (!historyList) {
      return;
    }

    const menuItems = historyList.querySelectorAll('.menu-item');
    menuItems.forEach((item) => {
      const name = item.querySelector('.menu-name')?.textContent?.trim() || '';
      const servedCount = extractServedCount(servedData, name);
      const qtyNode = item.querySelector('.menu-qty');
      if (!qtyNode) {
        return;
      }
      const currentQty = Number(qtyNode.textContent.replace(/個/g, '') || 0);
      qtyNode.textContent = servedCount > 0
        ? `${currentQty}個 / 配膳済み ${servedCount}個`
        : `${currentQty}個`;
    });
  }

  function renderHistory() {
    if (!historyList || !summaryCard) {
      return;
    }

    const history = getStoredOrderHistory().filter((order) => {
      return Array.isArray(order.items) && order.items.length > 0;
    });

    if (history.length === 0) {
      summaryCard.innerHTML = '';
      historyList.innerHTML = `
        <p class="info-note">注文確定後に商品がここに表示されます。</p>
      `;
      if (orderTotal) {
        orderTotal.style.display = 'none';
      }
      return;
    }

    const overallTotal = history.reduce((sum, order) => {
      return sum + order.items.reduce((orderSum, item) => {
        return orderSum + Number(item.price || 0) * Number(item.quantity || 0);
      }, 0);
    }, 0);

    summaryCard.innerHTML = `
      <article class="mini-card">
        <div class="mini-label">合計金額</div>
        <div class="mini-value">${formatCurrency(overallTotal)}</div>
      </article>
    `;

    historyList.innerHTML = history.map((order) => {
      return `
        <article class="seat-card">
          <div class="seat-header"></div>
          <ul class="menu-list">
            ${order.items.map((item) => `
              <li class="menu-item">
                <div class="menu-copy">
                  <span class="menu-name">${item.title}</span>
                  <span class="menu-qty">${Number(item.quantity || 0)}個</span>
                  <span class="menu-note">済</span>
                </div>
                <div class="menu-meta">
                  <span class="menu-time">${formatOrderTime(order.createdAt)}</span>
                  <span class="menu-price">${formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}</span>
                </div>
              </li>
            `).join('')}
          </ul>
        </article>
      `;
    }).join('');

    if (orderTotal) {
      orderTotal.style.display = 'none';
    }

    const orderItems = historyList.querySelectorAll('.menu-item');
    orderItems.forEach((item) => {
      const note = item.querySelector('.menu-note');
      if (!note) return;

      item.addEventListener('mouseenter', () => {
        note.style.background = '#ffe9c2';
        note.style.borderColor = '#e5c78d';
      });

      item.addEventListener('mouseleave', () => {
        note.style.background = '#fff3df';
        note.style.borderColor = '#efd6b1';
      });
    });
  }

  renderHistory();
  renderServedStatus();
  window.addEventListener('storage', () => {
    renderHistory();
    renderServedStatus();
  });
});
