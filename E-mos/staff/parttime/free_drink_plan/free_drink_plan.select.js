(function(){
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table') || '';
    const tableDisplay = document.getElementById('tableDisplay');
    const btnBack = document.getElementById('btnBack');
    const btnConfirm = document.getElementById('btnConfirm');
    const planOptions = document.querySelectorAll('.option-radio');

    if(tableDisplay && table){
        tableDisplay.textContent = table;
    }

    btnBack.addEventListener('click', ()=>{
        window.location.href = 'free_drink_plan.html';
    });

    btnConfirm.addEventListener('click', ()=>{
        const selected = Array.from(planOptions).find(option => option.checked);
        if(!selected){
            alert('飲み放題プランを選択してください。');
            return;
        }
        const plan = selected.value;
        const planLabel = selected.closest('.option-label').querySelector('.option-name').textContent;
        alert(`卓番 ${table} に ${planLabel} を登録しました。`);
        window.location.href = '../menu/menu.html';
    });
})();