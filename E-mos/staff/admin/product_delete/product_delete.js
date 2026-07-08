(function(){
  var deleteBtn = document.getElementById('deleteBtn');
  if(!deleteBtn) return;
  var modal = document.getElementById('confirmDeleteModal');
  var cancel = document.getElementById('cancelDeleteBtn');
  var ok = document.getElementById('okDeleteBtn');
  var deleteList = document.getElementById('deleteList');
  
  function show(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; deleteBtn.focus(); }
  
  function validate(){
    var checkboxes = deleteList ? deleteList.querySelectorAll('input[type="checkbox"]') : document.querySelectorAll('input[type="checkbox"]');
    var checked = Array.from(checkboxes).some(function(cb){ return cb.checked; });
    var deleteError = document.getElementById('deleteError');
    
    if(!checked){ deleteError.style.display='block'; return false; }
    else { deleteError.style.display='none'; }
    
    return true;
  }

  function getSelectedProductIds(){
    var checkboxes = deleteList ? deleteList.querySelectorAll('input[type="checkbox"]:checked') : document.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(function(cb){ return cb.value; });
  }
  
  deleteBtn.addEventListener('click', function(e){ e.preventDefault(); if(validate()){ show(); } });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', async function(e){
    e.preventDefault();
    var selectedIds = getSelectedProductIds();
    var payload = new FormData();
    payload.set('action', 'delete');
    payload.set('productIds', JSON.stringify(selectedIds));

    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';

    try {
      var response = await fetch('../../../php/menus.php', {
        method: 'POST',
        body: payload
      });
      var result = await response.json();

      if (response.ok && result.success) {
        window.location.href = '../menu/menu.html';
      } else {
        alert(result.message || '削除に失敗しました。');
      }
    } catch (error) {
      alert('削除に失敗しました。');
    }
  });
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false'){ hide(); } });
})();
