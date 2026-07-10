(function(){
    console.warn('PHP endpoints disabled for free_drink_plan.js');
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const inputTable = document.getElementById('tableNumberInput');

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
        window.location.href = `free_drink_plan.select.html?table=${encodeURIComponent(tableNumber)}`;
    });
})();