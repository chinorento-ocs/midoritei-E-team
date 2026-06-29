(function(){
    const btnBack = document.getElementById('btnBack');
    btnBack.addEventListener('click', ()=>{
        window.location.href = '../menu/menu.html';
    });

    const cards = document.querySelectorAll('.order-card[data-target]');
    cards.forEach(card => {
        card.addEventListener('click', ()=>{
            const target = card.dataset.target;
            const table = card.dataset.table;
            if(!target) return;
            if(table) {
                window.location.href = `${target}?table=${encodeURIComponent(table)}`;
            } else {
                window.location.href = target;
            }
        });
    });
})();
