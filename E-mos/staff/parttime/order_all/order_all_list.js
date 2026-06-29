(function(){
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const tableNumber = document.querySelector('.table-number');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    const items = params.getAll('item');
    const orderCounts = params.getAll('orderCount');
    const servedCounts = params.getAll('servedCount');

    if(table && tableNumber) {
        tableNumber.textContent = `卓番：${table}`;
    }

    if(items.length > 0){
        items.forEach((item, index) => {
            const orderCount = orderCounts[index] || '1';
            const servedCount = servedCounts[index] || '0';
            const row = Array.from(document.querySelectorAll('.order-row')).find(row => row.dataset.item === item);
            if(row){
                row.dataset.orderCount = orderCount;
                row.dataset.servedCount = servedCount;
                const orderEl = row.querySelector('.item-count');
                const servedEl = row.querySelector('.item-served');
                if(orderEl){
                    orderEl.textContent = orderCount;
                }
                if(servedEl){
                    servedEl.textContent = servedCount;
                }
                if(parseInt(servedCount, 10) >= parseInt(orderCount, 10)){
                    row.classList.add('completed');
                    row.querySelector('.order-checkbox')?.remove();
                }
            }
        });
    }

    btnBack.addEventListener('click', ()=>{
        window.location.href = 'order_all.html';
    });

    btnNext.addEventListener('click', ()=>{
        const checked = Array.from(document.querySelectorAll('.order-check:checked'));
        if(checked.length === 0){
            alert('個数を変更したい商品を選択してください。');
            return;
        }
        const selectedItems = checked.map(input => {
            const row = input.closest('.order-row');
            if(!row) return null;
            const item = row.dataset.item;
            const count = row.dataset.count || row.querySelector('.item-count')?.textContent?.trim() || '1';
            return item ? { item, count } : null;
        }).filter(Boolean);
        if(selectedItems.length === 0){
            alert('選択された商品が見つかりませんでした。');
            return;
        }
        let targetUrl = 'order_all_count.html';
        const query = new URLSearchParams();
        selectedItems.forEach(({ item, count }) => {
            query.append('item', item);
            query.append('count', count);
        });
        if(table){
            query.append('table', table);
        }
        targetUrl += `?${query.toString()}`;
        window.location.href = targetUrl;
    });
})();
