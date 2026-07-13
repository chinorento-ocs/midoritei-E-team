(function(){
    console.warn('PHP endpoints disabled for order_all_count.js');
    const params = new URLSearchParams(window.location.search);
    const tableNumber = document.querySelector('.table-number');
    const itemsContainer = document.getElementById('itemsContainer');
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');

    const table = params.get('table');
    const orderIds = params.getAll('orderId');
    const menuIds = params.getAll('menuId');
    const items = params.getAll('item');
    const orderCounts = params.getAll('orderCount');
    const servedCounts = params.getAll('servedCount');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    const selected = items.map((item, index) => ({
        orderId: orderIds[index],
        menuId: menuIds[index],
        item,
        orderCount: Math.max(parseInt(orderCounts[index] || '1', 10) || 1, 1),
        servedCount: Math.min(Math.max(parseInt(servedCounts[index] || '0', 10) || 0, 0), Math.max(parseInt(orderCounts[index] || '1', 10) || 1, 1))
    })).filter(entry => entry.item);

    const state = selected.map(entry => ({ ...entry }));

    const createItemRow = (entry, index) => {
        const row = document.createElement('div');
        row.className = 'count-item';
        row.dataset.index = String(index);
        row.dataset.orderId = entry.orderId;
        row.dataset.menuId = entry.menuId;

        const name = document.createElement('div');
        name.className = 'count-item-name';
        name.textContent = entry.item;

        const control = document.createElement('div');
        control.className = 'count-control';

        const minus = document.createElement('button');
        minus.type = 'button';
        minus.className = 'count-btn';
        minus.textContent = '-';
        minus.addEventListener('click', () => {
            if(state[index].servedCount > 0){
                state[index].servedCount -= 1;
                value.textContent = state[index].servedCount;
            }
        });

        const value = document.createElement('div');
        value.className = 'count-value';
        value.textContent = entry.servedCount;

        const plus = document.createElement('button');
        plus.type = 'button';
        plus.className = 'count-btn';
        plus.textContent = '+';
        plus.addEventListener('click', () => {
            if(state[index].servedCount < state[index].orderCount){
                state[index].servedCount += 1;
                value.textContent = state[index].servedCount;
            }
        });

        const limitLabel = document.createElement('div');
        limitLabel.className = 'count-limit';
        limitLabel.textContent = `最大 ${entry.orderCount}`;

        control.appendChild(minus);
        control.appendChild(value);
        control.appendChild(plus);
        row.appendChild(name);
        row.appendChild(control);
        row.appendChild(limitLabel);
        return row;
    };

    if(itemsContainer){
        if(state.length === 0){
            itemsContainer.textContent = '選択した商品がありません。戻って商品を選択してください。';
        } else {
            state.forEach((entry, index) => {
                itemsContainer.appendChild(createItemRow(entry, index));
            });
        }
    }

    btnBack?.addEventListener('click', ()=>{
        let url = 'order_all_list.html';
        const query = new URLSearchParams();
        if(table){
            query.append('table', table);
        }
        if(query.toString()) url += `?${query.toString()}`;
        window.location.href = url;
    });

    btnConfirm?.addEventListener('click', async ()=>{
        if(state.length === 0) return;

        // サーバーは無効のため、ここではサンプル成功処理として扱います
        console.warn('PHP endpoints disabled: updateServed skipped');
        alert('配膳数を（サンプルで）確定しました。');
        // テーブル単位で配膳数を保存
        try{
            if(table){
                const key = `served_${table}`;
                const existingRaw = localStorage.getItem(key);
                const existing = existingRaw ? JSON.parse(existingRaw) : {};
                const merged = { ...(existing || {}) };
                state.forEach(entry => {
                    if(entry.menuId) merged[entry.menuId] = Number(entry.servedCount || 0);
                });
                localStorage.setItem(key, JSON.stringify(merged));
            }
        }catch(e){ console.error('failed to save served data', e); }

        let url = 'order_all_list.html';
        const query = new URLSearchParams();
        if(table){
            query.append('table', table);
        }
        if(query.toString()) url += `?${query.toString()}`;
        window.location.href = url;
    });
})();