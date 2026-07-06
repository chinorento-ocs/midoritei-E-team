(function(){
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
        const count = parseInt(counts[index] || '1', 10) || 1;
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
            row.innerHTML = `
                <div class="count-item-name">${item}</div>
                <div class="count-control">
                    <button type="button" class="count-btn btn-decrease">−</button>
                    <span class="count-value">${count}</span>
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
        if(target.classList.contains('btn-increase')){
            value += 1;
        } else if(target.classList.contains('btn-decrease')){
            value = Math.max(1, value - 1);
        }
        valueEl.textContent = value.toString();
    });

    btnBack.addEventListener('click', ()=>{
        window.history.back();
    });

    btnConfirm.addEventListener('click', async ()=>{
        // キャンセル数を確定して、全件DBに記録
        try {
            const rows = document.querySelectorAll('.count-item');
            let allSuccess = true;

            for (const row of rows) {
                const orderId = row.dataset.orderId;
                const menuId = row.dataset.menuId;
                const cancelQty = parseInt(row.querySelector('.count-value').textContent, 10) || 1;

                const response = await fetch('../../php/orders.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `action=cancelItem&orderId=${encodeURIComponent(orderId)}&menuId=${encodeURIComponent(menuId)}&cancelQty=${encodeURIComponent(cancelQty)}`
                });

                const result = await response.json();
                if (!result.success) {
                    allSuccess = false;
                    console.error('キャンセル失敗:', result.error);
                }
            }

            if (allSuccess) {
                alert('キャンセル数を確定しました。');
                window.location.href = '../menu/menu.html';
            } else {
                alert('一部のキャンセル処理に失敗しました。');
            }
        } catch (error) {
            console.error('キャンセル処理エラー:', error);
            alert('エラーが発生しました。');
        }
    });
})();
