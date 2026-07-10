(function(){
    console.warn('PHP endpoints disabled for order_cancel.js');
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const inputTable = document.getElementById('tableInput');

    btnBack.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });

    btnConfirm.addEventListener('click', ()=>{
        const tableNumber = inputTable.value.trim();
        if(!tableNumber){
            alert('テーブル番号を入力してください。');
            inputTable.focus();
            return;
        }
        window.location.href = `order_caccel_select.html?table=${encodeURIComponent(tableNumber)}`;
    });
})();
