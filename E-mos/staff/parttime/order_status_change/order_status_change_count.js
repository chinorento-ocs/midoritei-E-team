(function(){
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const tableNumber = document.querySelector('.table-number');
    const itemsContainer = document.getElementById('itemsContainer');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const items = params.getAll('item');
    const orderCounts = params.getAll('orderCount');
    const servedCounts = params.getAll('servedCount');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    const selectedItems = items.map((item, index) => {
        const orderCount = parseInt(orderCounts[index] || '1', 10) || 1;
        const servedCount = parseInt(servedCounts[index] || '0', 10) || 0;
        return { item, orderCount, servedCount };
    });

    if(selectedItems.length === 0){
        itemsContainer.innerHTML = '<p>選択された商品がありません。</p>';
    } else {
        selectedItems.forEach(({ item, orderCount, servedCount }) => {
            const row = document.createElement('div');
            row.className = 'count-item';
            row.dataset.item = item;
            row.dataset.orderCount = orderCount;
            row.dataset.servedCount = servedCount;
            row.innerHTML = `
                <div class="count-item-name">${item}</div>
                <div class="count-control">
                    <button type="button" class="count-btn btn-decrease">−</button>
                    <span class="count-value">${servedCount}</span>
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
            value = Math.max(0, value - 1);
        }
        valueEl.textContent = value.toString();
    });

    btnBack.addEventListener('click', ()=>{
        window.history.back();
    });

    btnConfirm.addEventListener('click', ()=>{
        alert('配膳数を確定しました。');
        window.location.href = '../menu/menu.html';
    });
})();
