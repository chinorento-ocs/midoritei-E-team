(function(){
    console.warn('PHP endpoints disabled for staff_call.js');
    const tableList = document.querySelector('.table-list');
    const btnBack = document.getElementById('btnBackMenu');
    let pollingInterval = null;
    let displayedCallIds = new Set(); // 既に表示済みの呼び出しを追跡
    let removedCallIds = new Set(); // 一度対応して消した呼び出しIDを追跡

    // 卓情報を取得してボタンを動的に生成
    async function loadSeatIds() {
        // サンプル席データで表示（PHPは無効）
        const sampleSeats = ['1','2','3','4','5'];
        if (sampleSeats.length > 0) {
            tableList.innerHTML = '';
            sampleSeats.forEach(seatId => {
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

    // 定期的に保留中の店員呼び出しを取得
    async function pollCallStaff() {
        // サンプルの保留中呼び出しをチェック（PHPは無効）
        const sampleCalls = [
            { callstaffId: 'C1', seatId: '1' },
            { callstaffId: 'C2', seatId: '3' }
        ];
        sampleCalls.forEach(callData => {
            const callId = callData.callstaffId;
            const seatId = callData.seatId;
            // 一度対応して消した呼び出しは再表示しない
            if (removedCallIds.has(callId)) return;
            if (!displayedCallIds.has(callId)) {
                displayedCallIds.add(callId);
                addCallButton(seatId, callId);
            }
        });
    }

    // 呼び出し専用のボタンを追加
    function addCallButton(seatId, callId) {
        const button = document.createElement('button');
        button.className = 'table-btn';
        button.type = 'button';
        button.dataset.seatId = seatId;
        button.dataset.callId = callId;
        button.textContent = `${seatId}番卓`;
        button.addEventListener('click', () => {
            alert(`${seatId}番卓の呼び出しに対応しました`);
            button.remove();
            displayedCallIds.delete(callId);
            removedCallIds.add(callId);
        });
        tableList.insertBefore(button, tableList.firstChild);
    }

    // 店員呼び出し処理
    async function callStaff(event) {
        const seatId = event.target.dataset.seatId;
        // サーバーは無効なので、押したらそのボタンを消して完了とします（メニューへ戻らない）
        const btn = event.target.closest('button');
        console.warn('PHP endpoints disabled: callStaff skipped for', seatId);
        if (btn) {
            // 表示名が数値の場合は日本語表示にして通知
            alert(`${seatId}番卓の呼び出しに対応しました`);
            btn.remove();
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

    // 定期ポーリングを開始（3秒ごと）
    pollingInterval = setInterval(pollCallStaff, 3000);

    // ページを離れるときはポーリングを停止
    window.addEventListener('beforeunload', () => {
        if (pollingInterval) clearInterval(pollingInterval);
    });
})();
