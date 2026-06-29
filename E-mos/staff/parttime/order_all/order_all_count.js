(function(){
    const params = new URLSearchParams(window.location.search);
    const tableNumber = document.querySelector('.table-number');
    const itemsContainer = document.getElementById('itemsContainer');
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');

    const table = params.get('table');
    const items = params.getAll('item');
    const orderCounts = params.getAll('orderCount');
    const servedCounts = params.getAll('servedCount');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    const selected = items.map((item, index) => ({
        item,
        orderCount: Math.max(parseInt(orderCounts[index] || '1', 10) || 1, 1),
        servedCount: Math.min(Math.max(parseInt(servedCounts[index] || '0', 10) || 0, 0), Math.max(parseInt(orderCounts[index] || '1', 10) || 1, 1))
    })).filter(entry => entry.item);

    const state = selected.map(entry => ({ ...entry }));

    const createItemRow = (entry, index) => {
        const row = document.createElement('div');
        row.className = 'count-item';
        row.dataset.index = String(index);

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
                info.textContent = `注文数 ${state[index].orderCount} / 配膳数 ${state[index].servedCount}`;
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
                info.textContent = `注文数 ${state[index].orderCount} / 配膳数 ${state[index].servedCount}`;
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

    btnConfirm?.addEventListener('click', ()=>{
        if(state.length === 0) return;
        let url = 'order_all_list.html';
        const query = new URLSearchParams();
        state.forEach(({ item, orderCount, servedCount }) => {
            query.append('item', item);
            query.append('orderCount', String(orderCount));
            query.append('servedCount', String(servedCount));
        });
        if(table){
            query.append('table', table);
        }
        url += `?${query.toString()}`;
        window.location.href = url;
    });
})();