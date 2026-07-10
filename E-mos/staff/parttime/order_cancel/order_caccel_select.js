(function(){
    console.warn('PHP endpoints disabled for order_caccel_select.js');
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const tableNumber = document.querySelector('.table-number');
    const orderList = document.querySelector('.order-list');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    // サーバーは無効のため、サンプル（例）データで表示します
    async function loadOrders() {
        const sample = [
            { orderId: 'C1', menuId: 'm1', menuName: 'ポテトサラダ', orderQty: 2 },
            { orderId: 'C1', menuId: 'm2', menuName: '鳥めし', orderQty: 1 },
            { orderId: 'C2', menuId: 'm3', menuName: 'キャベツの塩だれ', orderQty: 1 },
            { orderId: 'C3', menuId: 'm4', menuName: 'きゅうりの一本漬け', orderQty: 1 }
        ];

        orderList.innerHTML = '';
        const groupedByOrderId = {};
        sample.forEach(item => {
            const orderId = item.orderId;
            if (!groupedByOrderId[orderId]) groupedByOrderId[orderId] = [];
            groupedByOrderId[orderId].push(item);
        });

        Object.keys(groupedByOrderId).forEach(orderId => {
            groupedByOrderId[orderId].forEach(item => {
                const row = document.createElement('div');
                row.className = 'order-row';
                row.dataset.item = item.menuName;
                row.dataset.orderId = orderId;
                row.dataset.menuId = item.menuId;
                row.dataset.orderCount = item.orderQty || 1;

                row.innerHTML = `
                    <label class="order-checkbox"><input type="checkbox" class="order-check"></label>
                    <span class="item-name">${item.menuName}</span>
                    <span class="item-count">${item.orderQty || 1}点</span>
                `;
                orderList.appendChild(row);
            });
        });
    }

    btnBack.addEventListener('click', ()=>{
        window.location.href = 'order_cancel.html';
    });

    btnNext.addEventListener('click', ()=>{
        const checked = Array.from(document.querySelectorAll('.order-check:checked'));
        if(checked.length === 0){
            alert('キャンセルする商品を選択してください。');
            return;
        }

        const selectedItems = checked.map(input => {
            const row = input.closest('.order-row');
            if(!row) return null;
            const orderId = row.dataset.orderId;
            const menuId = row.dataset.menuId;
            const item = row.dataset.item;
            const count = row.dataset.orderCount || '1';
            return { orderId, menuId, item, count };
        }).filter(Boolean);

        if(selectedItems.length === 0){
            alert('選択された商品が見つかりませんでした。');
            return;
        }

        const query = new URLSearchParams();
        if(table) query.append('table', table);
        selectedItems.forEach(({ orderId, menuId, item, count }) => {
            query.append('orderId', orderId);
            query.append('menuId', menuId);
            query.append('item', item);
            query.append('count', count);
        });

        window.location.href = `order_caccel_count.html?${query.toString()}`;
    });

    // 画面読み込み時に注文を取得
    loadOrders();
})();
