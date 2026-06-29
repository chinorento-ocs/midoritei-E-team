(function(){
    const btnQr = document.getElementById('btnQr');
    const btnTableNumber = document.getElementById('btnTableNumber');
    const btnBackMenu = document.getElementById('btnBackMenu');

    btnQr.addEventListener('click', ()=>{
        window.location.href = 'qr_make.html';
    });

    btnTableNumber.addEventListener('click', ()=>{
        window.location.href = 'tablenumber_change.html';
    });

    btnBackMenu.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });
})();
