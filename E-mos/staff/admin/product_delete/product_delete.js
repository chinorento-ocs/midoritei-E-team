(function(){
  var deleteBtn = document.getElementById('deleteBtn');
  if(!deleteBtn) return;
  var modal = document.getElementById('confirmDeleteModal');
  var cancel = document.getElementById('cancelDeleteBtn');
  var ok = document.getElementById('okDeleteBtn');
  
  function show(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; deleteBtn.focus(); }
  
  function validate(){
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var checked = Array.from(checkboxes).some(function(cb){ return cb.checked; });
    var deleteError = document.getElementById('deleteError');
    
    if(!checked){ deleteError.style.display='block'; return false; }
    else { deleteError.style.display='none'; }
    
    return true;
  }
  
  deleteBtn.addEventListener('click', function(e){ e.preventDefault(); if(validate()){ show(); } });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', function(e){ e.preventDefault(); window.location.href = '../menu/menu.html'; });
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false'){ hide(); } });
})();
