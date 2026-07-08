(function(){
    const input = document.getElementById('tableInput');
    const btnBack = document.getElementById('btnBack');
    const btnSave = document.getElementById('btnSave');
    const confirmModal = document.getElementById('confirmModal');
    const btnCancel = document.getElementById('btnCancel');
    const btnConfirm = document.getElementById('btnConfirm');

    function openConfirmation(){
        const current = document.getElementById('currentTableInput').value.trim();
        const value = input.value.trim();
        if(!current){
            alert('変更前のテーブル番号を入力してください。');
            document.getElementById('currentTableInput').focus();
            return;
        }
        if(!value){
            alert('変更後のテーブル番号を入力してください。');
            input.focus();
            return;
        }
        confirmModal.classList.remove('hidden');
    }

    function changeTableNumber(){
        const current = document.getElementById('currentTableInput').value.trim();
        const value = input.value.trim();
        confirmModal.classList.add('hidden');
        alert(`${current} を ${value} に変更しました。`);
        window.location.href = '../menu/menu.html';
    }

    btnSave.addEventListener('click', openConfirmation);
    btnCancel.addEventListener('click', ()=> confirmModal.classList.add('hidden'));
    btnConfirm.addEventListener('click', changeTableNumber);

    btnBack.addEventListener('click', ()=>{
        window.location.href = 'table_menu.html';
    });

    input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            openConfirmation();
        }
    });
})();