(function(){
  var form = document.getElementById('addForm');
  if(!form) return;
  var modal = document.getElementById('confirmAddModal');
  var cancel = document.getElementById('cancelAddBtn');
  var ok = document.getElementById('okAddBtn');
  
  function show(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; form.querySelector('[type=submit]').focus(); }
  
  form.addEventListener('submit', function(e){ e.preventDefault(); show(); });
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
