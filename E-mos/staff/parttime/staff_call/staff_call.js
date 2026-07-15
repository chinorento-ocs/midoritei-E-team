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
        // 実運用ではサーバーから使用中卓を取得しますが、
        // オフライン時はデフォルトの卓一覧を表示してローカルで試験できます。
        const sampleSeats = ['1','2','3','4','5','6','7','8','9','10','11','12'];
        tableList.innerHTML = '';
        let appended = 0;
        sampleSeats.forEach(seatId => {
            if (removedSeatIds.has(String(seatId))) return;
            const button = document.createElement('button');
            button.className = 'table-btn';
            button.type = 'button';
            button.dataset.seatId = String(seatId);
            button.textContent = `${seatId}番卓`;
            button.addEventListener('click', callStaff);
            tableList.appendChild(button);
            appended++;
        });

        if (appended === 0) {
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
