(function(){
    console.warn('PHP endpoints disabled for staff_call.js');
    const tableList = document.querySelector('.table-list');
    const btnBack = document.getElementById('btnBackMenu');
    let pollingInterval = null;
    let displayedCallIds = new Set(); // 既に表示済みの呼び出しを追跡

    // 卓情報を取得してボタンを動的に生成
    async function loadSeatIds() {
        try {
            const response = await fetch('../../php/staff_call_api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'action=getSeatIds'
            });

            const result = await response.json();
            if (result.success && result.data.length > 0) {
                // 既存のボタンをクリア
                tableList.innerHTML = '';

                // 卓ボタンを動的に生成
                result.data.forEach(seatId => {
                    const button = document.createElement('button');
                    button.className = 'table-btn';
                    button.type = 'button';
                    button.dataset.seatId = seatId;
                    button.textContent = seatId;
                    button.addEventListener('click', callStaff);
                    tableList.appendChild(button);
                });
            } else {
                tableList.innerHTML = '<p>使用中の卓がありません</p>';
            }
        } catch (error) {
            console.error('卓情報の取得に失敗しました:', error);
            tableList.innerHTML = '<p>エラーが発生しました</p>';
        }
    }

    // 定期的に保留中の店員呼び出しを取得
    async function pollCallStaff() {
        try {
            const response = await fetch('../../php/staff_call_api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'action=getCallStaffList'
            });

            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                // 保留中の呼び出しを処理
                result.data.forEach(callData => {
                    const callId = callData.callstaffId;
                    const seatId = callData.seatId;

                    // 初めて表示する呼び出しなら、新しいボタンを追加
                    if (!displayedCallIds.has(callId)) {
                        displayedCallIds.add(callId);
                        addCallButton(seatId, callId);
                    }
                });
            }
        } catch (error) {
            console.error('呼び出し情報の取得に失敗しました:', error);
        }
    }

    // 呼び出し専用のボタンを追加
    function addCallButton(seatId, callId) {
        const button = document.createElement('button');
        button.className = 'table-btn';
        button.type = 'button';
        button.dataset.seatId = seatId;
        button.dataset.callId = callId;
        button.textContent = `🔔 ${seatId}`;
        button.style.backgroundColor = '#ffeb3b';
        button.style.fontWeight = 'bold';
        button.addEventListener('click', () => {
            alert(`卓${seatId}からの呼び出しに対応しました`);
            button.remove();
            displayedCallIds.delete(callId);
        });
        tableList.insertBefore(button, tableList.firstChild);
    }

    // 店員呼び出し処理
    async function callStaff(event) {
        const seatId = event.target.dataset.seatId;

        try {
            const response = await fetch('../../php/staff_call_api.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `action=callStaff&seatId=${encodeURIComponent(seatId)}`
            });

            const result = await response.json();
            if (result.success) {
                alert(`${seatId} の店員呼び出しを記録しました`);
                // メニュー画面に戻る
                window.location.href = '../menu/menu.html';
            } else {
                alert('エラー: ' + (result.error || '店員呼び出しに失敗しました'));
            }
        } catch (error) {
            console.error('店員呼び出しに失敗しました:', error);
            alert('エラーが発生しました');
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
