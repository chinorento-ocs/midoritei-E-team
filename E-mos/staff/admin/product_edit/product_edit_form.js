(function(){
  var editName = document.getElementById('editName');
  var editCategory = document.getElementById('editCategory');
  var editPrice = document.getElementById('editPrice');
  var back = document.getElementById('backToReview');
  var submitBtn = document.getElementById('submitBtn');
  var modal = document.getElementById('confirmEditModal');
  var cancel = document.getElementById('cancelEditBtn');
  var ok = document.getElementById('okEditBtn');

  // populate
  var after = sessionStorage.getItem('product_edit_after') || sessionStorage.getItem('product_edit_selected') || '';
  if(editName) editName.value = after;

  if(back) back.addEventListener('click', function(){ window.location.href='product_edit_review.html'; });

  function showModal(){ if(modal){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel && cancel.focus(); } }
  function hideModal(){ if(modal){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; } }

  function validate(){
    var nameError = document.getElementById('nameError');
    var categoryError = document.getElementById('categoryError');
    var priceError = document.getElementById('priceError');
    
    var name = editName ? editName.value.trim() : '';
    var category = editCategory ? editCategory.value.trim() : '';
    var price = editPrice ? editPrice.value.trim() : '';
    
    var hasError = false;
    
    if(!name){ nameError.style.display='block'; hasError = true; }
    else { nameError.style.display='none'; }
    
    if(!category){ categoryError.style.display='block'; hasError = true; }
    else { categoryError.style.display='none'; }
    
    if(!price){ priceError.style.display='block'; hasError = true; }
    else { priceError.style.display='none'; }
    
    return !hasError;
  }

  if(submitBtn){ submitBtn.addEventListener('click', function(e){ e.preventDefault(); if(validate()){ showModal(); } }); }
  if(cancel) cancel.addEventListener('click', function(e){ e.preventDefault(); hideModal(); });
  if(ok) ok.addEventListener('click', function(e){ e.preventDefault(); sessionStorage.removeItem('product_edit_selected'); sessionStorage.removeItem('product_edit_after'); window.location.href='../menu/menu.html'; });
  if(modal) modal.querySelector('.modal-backdrop').addEventListener('click', hideModal);
  window.addEventListener('pageshow', function(){ hideModal(); });

})();
