(function(){
    const btnBack = document.getElementById('btnBack');
    const btnNext = document.getElementById('btnNext');
    const tableNumber = document.querySelector('.table-number');
    const orderList = document.querySelector('.order-list');

    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');

    if(table && tableNumber){
        tableNumber.textContent = `卓番：${table}`;
    }

    // テーブル番号から顧客IDを取得し、その顧客の注文を取得
    async function loadOrders() {
        try {
            // Step 1: 卓番から顧客IDを取得
            const customerResponse = await fetch('../../php/orders.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `action=getCustomerIdBySeat&seatId=${encodeURIComponent(table)}`
            });

            const customerResult = await customerResponse.json();
            if (!customerResult.success) {
                orderList.innerHTML = '<p>顧客情報が見つかりませんでした</p>';
                return;
            }

            const customerId = customerResult.customerId;

            // Step 2: 顧客IDから注文を取得
            const ordersResponse = await fetch('../../php/orders.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `action=getOrdersByCustomer&customerId=${encodeURIComponent(customerId)}`
            });

            const ordersResult = await ordersResponse.json();
            if (!ordersResult.success || ordersResult.data.length === 0) {
                orderList.innerHTML = '<p>注文が見つかりませんでした</p>';
                return;
            }

            // Step 3: DBから取得した注文をHTMLに反映
            orderList.innerHTML = '';
            const groupedByOrderId = {};
            ordersResult.data.forEach(item => {
                const orderId = item.orderId;
                if (!groupedByOrderId[orderId]) {
                    groupedByOrderId[orderId] = [];
                }
                groupedByOrderId[orderId].push(item);
            });

            Object.keys(groupedByOrderId).forEach(orderId => {
                groupedByOrderId[orderId].forEach(item => {
                    const servedCount = item.servedQty || 0;
                    const orderCount = item.orderQty || 1;
                    const isDisabled = servedCount === 0 ? true : false;
                    
                    const row = document.createElement('div');
                    row.className = 'order-row';
                    row.dataset.item = item.menuName;
                    row.dataset.orderId = orderId;
                    row.dataset.menuId = item.menuId;
                    row.dataset.orderCount = orderCount;
                    row.dataset.servedCount = servedCount;
                    
                    row.innerHTML = `
                        <label class="order-checkbox">
                            <input type="checkbox" class="order-check" ${isDisabled ? 'disabled' : ''}>
                        </label>
                        <span class="item-name">${item.menuName}</span>
                        <span class="item-count">${orderCount}</span>
                        <span class="item-served">${servedCount}</span>
                    `;
                    orderList.appendChild(row);
                });
            });
        } catch (error) {
            console.error('注文情報の取得に失敗しました:', error);
            orderList.innerHTML = '<p>エラーが発生しました</p>';
        }
    }

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
            const orderId = row.dataset.orderId;
            const menuId = row.dataset.menuId;
            const item = row.dataset.item;
            const orderCount = row.dataset.orderCount || '1';
            const servedCount = row.dataset.servedCount || '0';
            return { orderId, menuId, item, orderCount, servedCount };
        }).filter(Boolean);

        if(selectedItems.length === 0){
            alert('選択された商品が見つかりませんでした。');
            return;
        }

        const query = new URLSearchParams();
        if(table) query.append('table', table);
        selectedItems.forEach(({ orderId, menuId, item, orderCount, servedCount }) => {
            query.append('orderId', orderId);
            query.append('menuId', menuId);
            query.append('item', item);
            query.append('orderCount', orderCount);
            query.append('servedCount', servedCount);
        });

        window.location.href = `order_status_change_count.html?${query.toString()}`;
    });

    // 画面読み込み時に注文を取得
    loadOrders();
})();
