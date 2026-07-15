(function(){
  var form = document.getElementById('addForm');
  if(!form) return;
  var modal = document.getElementById('confirmAddModal');
  var cancel = document.getElementById('cancelAddBtn');
  var ok = document.getElementById('okAddBtn');
  
  function show(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; form.querySelector('[type=submit]').focus(); }
  
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = form.elements['name'] ? (form.elements['name'].value || '').trim() : '';
    var category = form.elements['category'] ? (form.elements['category'].value || '').trim() : '';
    var price = form.elements['price'] ? (form.elements['price'].value || '').trim() : '';

    if(!name){ alert('商品名を入力してください。'); form.elements['name'] && form.elements['name'].focus(); return; }
    if(!category){ alert('カテゴリーを入力してください。'); form.elements['category'] && form.elements['category'].focus(); return; }
    if(!price){ alert('値段を入力してください。'); form.elements['price'] && form.elements['price'].focus(); return; }

    show();
  });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', function(e){
    e.preventDefault();
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    window.location.href = '../menu/menu.html';
  });
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false'){ hide(); } });
})();
