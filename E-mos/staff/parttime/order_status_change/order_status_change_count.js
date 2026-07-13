(function(){
    console.warn('PHP endpoints disabled for order_status_change_count.js');
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const tableNumber = document.querySelector('.table-number');
    const itemsContainer = document.getElementById('itemsContainer');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const orderIds = params.getAll('orderId');
    const menuIds = params.getAll('menuId');
    const items = params.getAll('item');
    const orderCounts = params.getAll('orderCount');
    const servedCounts = params.getAll('servedCount');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    const selectedItems = items.map((item, index) => {
        const orderCount = parseInt(orderCounts[index] || '1', 10) || 1;
        const servedCount = parseInt(servedCounts[index] || '0', 10) || 0;
        const orderId = orderIds[index];
        const menuId = menuIds[index];
        return { item, orderCount, servedCount, orderId, menuId };
    });

    if(selectedItems.length === 0){
        itemsContainer.innerHTML = '<p>選択された商品がありません。</p>';
    } else {
        selectedItems.forEach(({ item, orderCount, servedCount, orderId, menuId }, index) => {
            const row = document.createElement('div');
            row.className = 'count-item';
            row.dataset.index = String(index);
            row.dataset.orderId = orderId;
            row.dataset.menuId = menuId;
            row.dataset.orderCount = orderCount;
            row.dataset.servedCount = servedCount;
            row.innerHTML = `
                <div class="count-item-name">${item}</div>
                <div class="count-control">
                    <button type="button" class="count-btn btn-decrease">−</button>
                    <span class="count-value">${Math.max(1, servedCount)}</span>
                    <button type="button" class="count-btn btn-increase">＋</button>
                </div>
            `;
            itemsContainer.appendChild(row);
        });
    }

    itemsContainer.addEventListener('click', event => {
        const target = event.target;
        if(!target.classList.contains('count-btn')) return;

        const itemRow = target.closest('.count-item');
        const valueEl = itemRow.querySelector('.count-value');
        const orderCount = parseInt(itemRow.dataset.orderCount, 10) || 1;
        let value = parseInt(valueEl.textContent || '0', 10);

        if(target.classList.contains('btn-increase')){
            value = Math.min(value + 1, orderCount);
        } else if(target.classList.contains('btn-decrease')){
            value = Math.max(1, value - 1);
        }
        valueEl.textContent = value.toString();
    });

    btnBack.addEventListener('click', ()=>{
        window.history.back();
    });

    btnConfirm.addEventListener('click', async ()=>{
        // サーバーは無効のため、サンプル成功として扱います
        const rows = document.querySelectorAll('.count-item');
        if (rows.length === 0) return;
        console.warn('PHP endpoints disabled: updateServed skipped');
        alert('配膳数を（サンプルで）確定しました。');
        // テーブル単位で配膳数を保存
        try{
            if(table){
                const key = `served_${table}`;
                const existingRaw = localStorage.getItem(key);
                const existing = existingRaw ? JSON.parse(existingRaw) : {};
                const merged = { ...(existing || {}) };
                rows.forEach(row => {
                    const menuId = row.dataset.menuId;
                    const valEl = row.querySelector('.count-value');
                    const val = parseInt(valEl.textContent || '0', 10) || 0;
                    if(menuId) merged[menuId] = val;
                });
                localStorage.setItem(key, JSON.stringify(merged));
            }
        }catch(e){ console.error('failed to save served data', e); }

        window.location.href = '../menu/menu.html';
    });
})();
