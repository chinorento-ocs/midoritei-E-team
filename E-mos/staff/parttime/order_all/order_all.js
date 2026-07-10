(function(){
    const btnBack = document.getElementById('btnBack');
    const orderGrid = document.querySelector('.order-grid');

    btnBack.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });

    // サンプルデータで卓リストを表示します（サーバーは無効）
    async function loadActiveSeat() {
        const sample = [ { seatId: 6 }, { seatId: 1 }, { seatId: 2 }, { seatId: 3 } ];
        orderGrid.innerHTML = '';
        sample.forEach(row => {
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
    }

    // 画面読み込み時に卓を取得
    loadActiveSeat();
})();
