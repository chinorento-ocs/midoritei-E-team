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

  var editProductId = sessionStorage.getItem('product_edit_id') || '';
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
  if(ok) ok.addEventListener('click', async function(e){
    e.preventDefault();
    var payload = new FormData();
    payload.set('action', 'update');
    payload.set('product', JSON.stringify({
      id: editProductId,
      name: editName ? editName.value.trim() : '',
      category: editCategory ? editCategory.value.trim() : '',
      price: editPrice ? editPrice.value.trim() : '',
      note: editNote ? editNote.value.trim() : '',
      taxRate: '0.1'
    }));

    try {
      var response = await fetch('../../../php/menus.php', {
        method: 'POST',
        body: payload
      });
      var result = await response.json();

      if (response.ok && result.success) {
        sessionStorage.removeItem('product_edit_selected');
        sessionStorage.removeItem('product_edit_after');
        sessionStorage.removeItem('product_edit_id');
        sessionStorage.removeItem('product_edit_product');
        window.location.href='../menu/menu.html';
      } else {
        alert(result.message || '更新に失敗しました。');
      }
    } catch (error) {
      alert('更新に失敗しました。');
    }
  });
  if(modal) modal.querySelector('.modal-backdrop').addEventListener('click', hideModal);
  window.addEventListener('pageshow', function(){ hideModal(); });

})();
