(function(){
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const tableNumber = document.querySelector('.table-number');
    const itemsContainer = document.getElementById('itemsContainer');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const items = params.getAll('item');
    const counts = params.getAll('count');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    const selectedItems = items.map((item, index) => {
        const count = parseInt(counts[index] || '1', 10) || 1;
        return { item, count };
    });

    if(selectedItems.length === 0){
        itemsContainer.innerHTML = '<p>選択された商品がありません。</p>';
    } else {
        selectedItems.forEach(({ item, count }) => {
            const row = document.createElement('div');
            row.className = 'count-item';
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

    btnConfirm.addEventListener('click', ()=>{
        alert('キャンセル数を確定しました。');
        window.location.href = '../menu/menu.html';
    });
})();
