(function(){
  var editName = document.getElementById('editName');
  var editCategory = document.getElementById('editCategory');
  var editPrice = document.getElementById('editPrice');
  var editNote = document.getElementById('editNote');
  var back = document.getElementById('backToReview');
  var submitBtn = document.getElementById('submitBtn');
  var modal = document.getElementById('confirmEditModal');
  var cancel = document.getElementById('cancelEditBtn');
  var ok = document.getElementById('okEditBtn');

  var after = sessionStorage.getItem('product_edit_after') || sessionStorage.getItem('product_edit_selected') || '';
  var editProduct = null;
  try {
    editProduct = JSON.parse(sessionStorage.getItem('product_edit_product') || 'null');
  } catch (error) {
    editProduct = null;
  }

  if(editName) editName.value = after || (editProduct && editProduct.menuName ? editProduct.menuName : '');
  if(editCategory) editCategory.value = editProduct && editProduct.categoryName ? editProduct.categoryName : '';
  if(editPrice) editPrice.value = editProduct && editProduct.unitPrice ? editProduct.unitPrice : '';
  if(editNote) editNote.value = editProduct && editProduct.menuDescription ? editProduct.menuDescription : '';

  if(back) back.addEventListener('click', function(){ window.location.href='product_edit_review.html'; });

  function showModal(){ if(modal){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel && cancel.focus(); } }
  function hideModal(){ if(modal){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; } }

  if(submitBtn){
    submitBtn.addEventListener('click', function(e){
      e.preventDefault();
      var nameVal = editName ? (editName.value || '').trim() : '';
      var catVal = editCategory ? (editCategory.value || '').trim() : '';
      var priceVal = editPrice ? (editPrice.value || '').trim() : '';

      if(!nameVal){ alert('商品名を入力してください。'); editName && editName.focus(); return; }
      if(!catVal){ alert('カテゴリーを入力してください。'); editCategory && editCategory.focus(); return; }
      if(!priceVal){ alert('値段を入力してください。'); editPrice && editPrice.focus(); return; }

      showModal();
    });
  }
  if(cancel) cancel.addEventListener('click', function(e){ e.preventDefault(); hideModal(); });
  if(ok) ok.addEventListener('click', function(e){
    e.preventDefault();
    sessionStorage.removeItem('product_edit_selected');
    sessionStorage.removeItem('product_edit_after');
    sessionStorage.removeItem('product_edit_id');
    sessionStorage.removeItem('product_edit_product');
    window.location.href='../menu/menu.html';
  });
  if(modal) modal.querySelector('.modal-backdrop').addEventListener('click', hideModal);
  window.addEventListener('pageshow', function(){ hideModal(); });

})();
