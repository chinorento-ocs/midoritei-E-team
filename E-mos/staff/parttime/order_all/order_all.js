(function(){
    const btnBack = document.getElementById('btnBack');
    const orderGrid = document.querySelector('.order-grid');

    btnBack.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });

    // DBから全使用中の卓を取得
    async function loadActiveSeat() {
        try {
            const response = await fetch('../../php/orders.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'action=getAllActiveSeat'
            });

            const result = await response.json();
            if (!result.success || !result.data || result.data.length === 0) {
                orderGrid.innerHTML = '<p>使用中の卓がありません</p>';
                return;
            }

            // グリッドをクリア
            orderGrid.innerHTML = '';

            // 各卓のカードを作成
            result.data.forEach(row => {
                const seatId = row.seatId;
                const card = document.createElement('button');
                card.className = 'order-card';
                card.type = 'button';
                card.dataset.target = 'order_all_list.html';
                card.dataset.table = seatId;
                card.innerHTML = `
                    <div class="order-label">卓番：${seatId}</div>
                    <div class="order-meta">顧客ID：-</div>
                `;
                card.addEventListener('click', ()=>{
                    window.location.href = `order_all_list.html?table=${encodeURIComponent(seatId)}`;
                });
                orderGrid.appendChild(card);
            });
        } catch (error) {
            console.error('卓情報の取得に失敗しました:', error);
            orderGrid.innerHTML = '<p>エラーが発生しました</p>';
        }
    }

    // 画面読み込み時に卓を取得
    loadActiveSeat();
})();
