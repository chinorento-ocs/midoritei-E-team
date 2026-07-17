(function(){
    const input = document.getElementById('tableInput');
    const btnBack = document.getElementById('btnBack');
    const btnIssue = document.getElementById('btnIssue');
    const qrArea = document.getElementById('qrArea');
    const qrImage = document.getElementById('qrImage');

    let tableNumber = null;

    function buildPayload(){ 
        return `${location.origin}/E-mos/customer/start_people.html?table=${encodeURIComponent(tableNumber)}`; 
    } 

    function makeQrUrl(data, size=300){
        const encodedData = encodeURIComponent(data);
        return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedData}`;
    }

    const modal = document.getElementById('confirmationModal');
    const btnCancel = document.getElementById('btnCancel');
    const btnConfirm = document.getElementById('btnConfirm');

    function openConfirmation(){
        const val = input.value.trim();
        if(!val){
            alert('テーブル番号を入力してください。');
            input.focus();
            return;
        }
        modal.classList.remove('hidden');
    }

    function issue(){
        const val = input.value.trim();
        tableNumber = val;
        const payload = buildPayload();
        const url = makeQrUrl(payload, 300);
        qrImage.src = url;
        qrImage.alt = `テーブル${tableNumber}用QRコード`;
        qrArea.classList.remove('hidden');
        modal.classList.add('hidden');
    }

    btnIssue.addEventListener('click', openConfirmation);
    btnCancel.addEventListener('click', ()=> modal.classList.add('hidden'));
    btnConfirm.addEventListener('click', issue);

    input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            e.preventDefault();
            openConfirmation();
        }
    });

    btnBack.addEventListener('click', ()=>{
        window.location.href = 'table_menu.html';
    });

})();