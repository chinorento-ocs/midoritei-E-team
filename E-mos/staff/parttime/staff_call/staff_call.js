(function(){
    console.warn('PHP endpoints disabled for staff_call.js');
    const tableList = document.querySelector('.table-list');
    const btnBack = document.getElementById('btnBackMenu');
    let removedSeatIds = new Set(); // 一度対応して消した卓IDを追跡

    // 以前に対応済みの卓情報を localStorage から復元
    (function restoreRemovedSeats(){
        try{
            const stored = localStorage.getItem('handled_seats');
            const arr = stored ? JSON.parse(stored) : [];
            if(Array.isArray(arr)) arr.forEach(id => removedSeatIds.add(String(id)));
        }catch(e){
            console.error('failed to restore handled_seats', e);
        }
    })();

    // 卓情報を取得してボタンを動的に生成
    async function loadSeatIds() {
        // 実運用ではサーバー側から使用中卓情報を取得するため、
        // 初期表示でダミーの1〜5番卓は生成しません。
        const sampleSeats = [];
        if (sampleSeats.length > 0) {
            tableList.innerHTML = '';
            sampleSeats.forEach(seatId => {
                if (removedSeatIds.has(seatId)) return;
                const button = document.createElement('button');
                button.className = 'table-btn';
                button.type = 'button';
                button.dataset.seatId = seatId;
                button.textContent = `${seatId}番卓`;
                button.addEventListener('click', callStaff);
                tableList.appendChild(button);
            });
        } else {
            tableList.innerHTML = '<p>使用中の卓がありません</p>';
        }
    }

    // 店員呼び出し処理
    async function callStaff(event) {
        const seatId = event.target.dataset.seatId;
        // サーバーは無効なので、押したらそのボタンを消して完了とします（メニューへ戻らない）
        const btn = event.target.closest('button');
        console.warn('PHP endpoints disabled: callStaff skipped for', seatId);
        if (btn) {
            alert(`${seatId}番卓の呼び出しに対応しました`);
            btn.remove();
            if (seatId) {
                removedSeatIds.add(String(seatId));
                try{
                    localStorage.setItem('handled_seats', JSON.stringify(Array.from(removedSeatIds)));
                }catch(e){ console.error('failed to save handled_seats', e); }
            }
        } else {
            alert(`${seatId}番卓の呼び出しに対応しました`);
        }
    }

    // 戻るボタン
    btnBack.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });

    // 画面読み込み時に卓情報を取得
    loadSeatIds();

})();
