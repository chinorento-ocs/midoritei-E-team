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
});
