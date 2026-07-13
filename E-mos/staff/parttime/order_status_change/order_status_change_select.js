(function(){
    console.warn('PHP endpoints disabled for order_status_change_select.js');
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
            { orderId: 'S1', menuId: 'm1', menuName: 'フライドポテト', orderQty: 1, servedQty: 1 },
            { orderId: 'S1', menuId: 'm2', menuName: 'ポテトサラダ', orderQty: 2, servedQty: 0 },
            { orderId: 'S2', menuId: 'm3', menuName: '鶏の唐揚げ', orderQty: 1, servedQty: 1 },
            { orderId: 'S2', menuId: 'm4', menuName: 'だし巻き', orderQty: 1, servedQty: 0 }
        ];
        // テーブル単位で保存された配膳数を読み込む
        let storedServed = {};
        try{
            if(table){
                const key = `served_${table}`;
                const raw = localStorage.getItem(key);
                const obj = raw ? JSON.parse(raw) : null;
                if(obj && typeof obj === 'object') storedServed = obj;
            }
        }catch(e){ console.error('failed to read served data', e); }

        orderList.innerHTML = '';
        const groupedByOrderId = {};
        sample.forEach(item => {
            if(item.menuId && storedServed[item.menuId] != null){
                item.servedQty = parseInt(storedServed[item.menuId], 10) || item.servedQty || 0;
            }
            const orderId = item.orderId;
            if (!groupedByOrderId[orderId]) groupedByOrderId[orderId] = [];
            groupedByOrderId[orderId].push(item);
        });

        Object.keys(groupedByOrderId).forEach(orderId => {
            groupedByOrderId[orderId].forEach(item => {
                const servedCount = item.servedQty || 0;
                const orderCount = item.orderQty || 1;
                const isDisabled = servedCount === 0 ? true : false;

                const row = document.createElement('div');
                row.className = 'order-row';
                row.dataset.item = item.menuName;
                row.dataset.orderId = orderId;
                row.dataset.menuId = item.menuId;
                row.dataset.orderCount = orderCount;
                row.dataset.servedCount = servedCount;

                row.innerHTML = `
                    <label class="order-checkbox">
                        <input type="checkbox" class="order-check" ${isDisabled ? 'disabled' : ''}>
                    </label>
                    <span class="item-name">${item.menuName}</span>
                    <span class="item-count">${orderCount}</span>
                    <span class="item-served">${servedCount}</span>
                `;
                orderList.appendChild(row);
            });
        });
    }

    btnBack.addEventListener('click', ()=>{
        window.location.href = 'order_status_change.html';
    });

    btnNext.addEventListener('click', ()=>{
        const checked = Array.from(document.querySelectorAll('.order-check:checked'));
        if(checked.length === 0){
            alert('配膳状況を変更する商品を選択してください。');
            return;
        }

        const selectedItems = checked.map(input => {
            const row = input.closest('.order-row');
            if(!row) return null;
            const orderId = row.dataset.orderId;
            const menuId = row.dataset.menuId;
            const item = row.dataset.item;
            const orderCount = row.dataset.orderCount || '1';
            const servedCount = row.dataset.servedCount || '0';
            return { orderId, menuId, item, orderCount, servedCount };
        }).filter(Boolean);

        if(selectedItems.length === 0){
            alert('選択された商品が見つかりませんでした。');
            return;
        }

        const query = new URLSearchParams();
        if(table) query.append('table', table);
        selectedItems.forEach(({ orderId, menuId, item, orderCount, servedCount }) => {
            query.append('orderId', orderId);
            query.append('menuId', menuId);
            query.append('item', item);
            query.append('orderCount', orderCount);
            query.append('servedCount', servedCount);
        });

        window.location.href = `order_status_change_count.html?${query.toString()}`;
    });

    // 画面読み込み時に注文を取得
    loadOrders();
})();
