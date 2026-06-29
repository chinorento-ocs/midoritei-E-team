(function(){
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const tableNumber = document.querySelector('.table-number');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    // 配膳数が 0 のチェックボックスを disabled に設定
    document.querySelectorAll('.order-row').forEach(row => {
        const servedCount = parseInt(row.dataset.servedCount || '0', 10);
        const checkbox = row.querySelector('.order-check');
        if(servedCount === 0 && checkbox){
            checkbox.disabled = true;
            checkbox.checked = false;
        }
    });

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
            const item = row.dataset.item;
            const orderCount = row.dataset.orderCount || '1';
            const servedCount = row.dataset.servedCount || '0';
            return item ? { item, orderCount, servedCount } : null;
        }).filter(Boolean);

        if(selectedItems.length === 0){
            alert('選択された商品が見つかりませんでした。');
            return;
        }

        const query = new URLSearchParams();
        if(table) query.append('table', table);
        selectedItems.forEach(({ item, orderCount, servedCount }) => {
            query.append('item', item);
            query.append('orderCount', orderCount);
            query.append('servedCount', servedCount);
        });

        window.location.href = `order_status_change_count.html?${query.toString()}`;
    });
})();
