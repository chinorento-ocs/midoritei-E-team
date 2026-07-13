(function(){
    console.warn('PHP endpoints disabled for order_caccel_count.js');
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const tableNumber = document.querySelector('.table-number');
    const itemsContainer = document.getElementById('itemsContainer');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const orderIds = params.getAll('orderId');
    const menuIds = params.getAll('menuId');
    const items = params.getAll('item');
    const counts = params.getAll('count');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    const selectedItems = items.map((item, index) => {
        const count = parseInt(counts[index] || '1', 10) || 1; // 元の注文数（上限）
        const orderId = orderIds[index];
        const menuId = menuIds[index];
        return { item, count, orderId, menuId };
    });

    if(selectedItems.length === 0){
        itemsContainer.innerHTML = '<p>選択された商品がありません。</p>';
    } else {
        selectedItems.forEach(({ item, count, orderId, menuId }, index) => {
            const row = document.createElement('div');
            row.className = 'count-item';
            row.dataset.index = String(index);
            row.dataset.orderId = orderId;
            row.dataset.menuId = menuId;
            row.dataset.max = String(count); // 上限をデータ属性に保持
            row.innerHTML = `
                <div class="count-item-name">${item}</div>
                <div class="count-control">
                    <button type="button" class="count-btn btn-decrease">−</button>
                    <span class="count-value">1</span>
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
        let value = parseInt(valueEl.textContent || '1', 10);
        const max = parseInt(itemRow.dataset.max || '1', 10) || 1;
        if(target.classList.contains('btn-increase')){
            value = Math.min(max, value + 1);
        } else if(target.classList.contains('btn-decrease')){
            value = Math.max(1, value - 1);
        }
        valueEl.textContent = value.toString();
    });

    btnBack.addEventListener('click', ()=>{
        window.history.back();
    });

    btnConfirm.addEventListener('click', async ()=>{
        // サーバーは無効なので、ここではサンプル成功として扱います
        const rows = document.querySelectorAll('.count-item');
        if (rows.length === 0) return;
        // バリデーション: キャンセル数が元の注文数を超えていないか確認
        for(const row of rows){
            const valEl = row.querySelector('.count-value');
            const val = parseInt(valEl.textContent || '0', 10) || 0;
            const max = parseInt(row.dataset.max || '0', 10) || 0;
            if(val < 1 || val > max){
                alert('キャンセル数が不正です。元の注文数以下にしてください。');
                return;
            }
        }

        console.warn('PHP endpoints disabled: cancelItem skipped');
        alert('キャンセル数を（サンプルで）確定しました。');
        window.location.href = '../menu/menu.html';
    });
})();
