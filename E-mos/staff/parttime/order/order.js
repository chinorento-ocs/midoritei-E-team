(function() {
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const tableNumberInput = document.getElementById('tableNumber');

    if (!btnBack || !btnConfirm || !tableNumberInput) {
        return;
    }

    btnBack.addEventListener('click', function() {
        window.location.href = '../menu/menu.html';
    });

    function goToOrderScreen() {
        const table = tableNumberInput.value.trim();
        if (!table) {
            alert('テーブル番号を入力してください。');
            return;
        }

        const normalized = table.replace(/[^0-9]/g, '');
        if (!normalized) {
            alert('テーブル番号には数字を入力してください。');
            return;
        }

        window.location.href = `../../../customer/main_menu.html`;
    }

    btnConfirm.addEventListener('click', function() {
        goToOrderScreen();
    });

    tableNumberInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            goToOrderScreen();
        }
    });
})();
