(function(){
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const tableNumber = document.querySelector('.table-number');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
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
            const item = row.dataset.item;
            const countText = row.dataset.orderCount || row.querySelector('.item-count')?.textContent?.trim() || '1';
            const count = parseInt(countText.toString().replace(/[^0-9]/g, ''), 10) || 1;
            return item ? { item, count } : null;
        }).filter(Boolean);

        if(selectedItems.length === 0){
            alert('選択された商品が見つかりませんでした。');
            return;
        }

        const query = new URLSearchParams();
        if(table) query.append('table', table);
        selectedItems.forEach(({ item, count }) => {
            query.append('item', item);
            query.append('count', count);
        });

        window.location.href = `order_caccel_count.html?${query.toString()}`;
    });
})();
