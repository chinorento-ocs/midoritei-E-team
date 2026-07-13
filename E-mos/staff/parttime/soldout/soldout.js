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

    function loadProducts() {
        // main_menu.html のメニュー項目を反映
        mockProducts = [
            { id: '1', name: 'かわ' },
            { id: '2', name: 'レバー' },
            { id: '3', name: '枝豆' },
            { id: '4', name: 'だし巻き卵' },
            { id: '5', name: 'プリン' },
            { id: '6', name: '生ビール（中）' },
            { id: '7', name: 'ハイボール' },
            { id: '8', name: '焼酎ソーダ割り' },
            { id: '9', name: '日本酒（冷酒）' },
            { id: '10', name: 'チューハイ' },
            { id: '11', name: 'ウーロン茶' },
            { id: '12', name: '唐揚げ' },
            { id: '13', name: 'チーズボール' },
            { id: '14', name: '冷奴' },
            { id: '15', name: 'ポテトサラダ' },
            { id: '16', name: 'キュウリの浅漬け' },
            { id: '17', name: 'ナッツミックス' },
            { id: '18', name: 'はつ塩' },
            { id: '19', name: 'ねぎま塩' },
            { id: '20', name: 'もも塩' },
            { id: '21', name: 'ぼんじり塩' },
            { id: '22', name: 'なんこつ塩' },
            { id: '23', name: '砂肝塩' }
        ];
        searchResults = [...mockProducts];
        renderResults();
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
