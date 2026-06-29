(function(){
    const buttons = document.querySelectorAll('.table-btn');
    const btnBack = document.getElementById('btnBackMenu');

    buttons.forEach(button => {
        button.addEventListener('click', ()=>{
            button.classList.add('hidden');
        });
    });

    btnBack.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });
})();
