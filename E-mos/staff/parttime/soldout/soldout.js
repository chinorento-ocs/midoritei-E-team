(function(){
    let mockProducts = [];
    let searchResults = [];
    let selectedItems = new Set();

    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchResultsDiv = document.getElementById('searchResults');
    const btnBack = document.getElementById('btnBack');
    const btnChange = document.getElementById('btnChange');
    const confirmModal = document.getElementById('confirmModal');
    const btnCancel = document.getElementById('btnCancel');
    const btnConfirm = document.getElementById('btnConfirm');

    // 検索処理
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        
        if (!query) {
            searchResultsDiv.innerHTML = '';
            searchResults = [];
            return;
        }

        searchResults = mockProducts.filter(product => 
            product.name.toLowerCase().includes(query)
        );

        renderResults();
    }

    // 結果を表示
    function renderResults() {
        searchResultsDiv.innerHTML = '';

        if (searchResults.length === 0) {
            searchResultsDiv.innerHTML = '<p style="padding:16px;color:#999;">該当する商品がありません</p>';
            return;
        }

        const container = document.createElement('div');
        container.className = 'soldout-list';

        searchResults.forEach(product => {
            const label = document.createElement('label');
            label.className = 'soldout-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'soldout-checkbox';
            checkbox.value = product.id;
            checkbox.checked = selectedItems.has(product.id);
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    selectedItems.add(product.id);
                } else {
                    selectedItems.delete(product.id);
                }
            });

            const nameSpan = document.createElement('span');
            nameSpan.className = 'soldout-name';
            nameSpan.textContent = product.name;

            label.appendChild(checkbox);
            label.appendChild(nameSpan);
            container.appendChild(label);
        });

        searchResultsDiv.appendChild(container);
    }

    async function loadProducts() {
        try {
            const response = await fetch('../../php/menus.php');
            if (!response.ok) {
                throw new Error('商品データの取得に失敗しました');
            }

            const data = await response.json();
            mockProducts = Array.isArray(data) ? data : [];
            searchResults = [...mockProducts];
            renderResults();
        } catch (error) {
            console.error(error);
            searchResultsDiv.innerHTML = '<p style="padding:16px;color:#999;">商品データを取得できませんでした</p>';
        }
    }

    // 初期表示 - 全商品を表示
    function initDisplay() {
        loadProducts();
    }

    // 検索ボタンクリック
    searchBtn.addEventListener('click', performSearch);

    // Enterキーで検索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 戻るボタン
    btnBack.addEventListener('click', function() {
        window.location.href = '../menu/menu.html';
    });

    function openConfirmModal() {
        confirmModal.classList.remove('hidden');
        confirmModal.setAttribute('aria-hidden', 'false');
    }

    function closeConfirmModal() {
        confirmModal.classList.add('hidden');
        confirmModal.setAttribute('aria-hidden', 'true');
    }

    // 変更ボタン - モーダル表示
    btnChange.addEventListener('click', function() {
        if (selectedItems.size === 0) {
            alert('変更する商品を選択してください');
            return;
        }
        openConfirmModal();
    });

    // キャンセルボタン
    btnCancel.addEventListener('click', function() {
        closeConfirmModal();
    });

    // モーダルの背景クリックでも閉じる
    confirmModal.addEventListener('click', function(e) {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });

    // 確認ボタン
    btnConfirm.addEventListener('click', function() {
        // 実際の処理はサーバーに送信
        const selectedIds = Array.from(selectedItems);
        console.log('売り切れを変更:', selectedIds);
        
        // 変更完了後、メニューに戻る
        window.location.href = '../menu/menu.html';
    });

    // Escキーでモーダルを閉じる
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !confirmModal.classList.contains('hidden')) {
            closeConfirmModal();
        }
    });

    // 初期化処理
    initDisplay();
})();
