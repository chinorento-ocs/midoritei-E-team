(function(){
  var beforeBox = document.getElementById('beforeBox');
  var afterInput = document.getElementById('afterInput');
  var toEdit = document.getElementById('toEdit');
  var back = document.getElementById('backToSelect');

  var sel = sessionStorage.getItem('product_edit_selected');
  var product = null;
  try {
    product = JSON.parse(sessionStorage.getItem('product_edit_product') || 'null');
  } catch (error) {
    product = null;
  }

  if(!sel){ window.location.href = 'product_edit_select.html'; }

  var displayName = product && product.menuName ? product.menuName : (sel || '--');
  if(beforeBox) beforeBox.textContent = displayName || '--';
  if(afterInput) afterInput.value = displayName || '';

  if(back) back.addEventListener('click', function(){ window.location.href='product_edit_select.html'; });
  if(toEdit) toEdit.addEventListener('click', function(){
    var value = afterInput ? afterInput.value.trim() : displayName;
    sessionStorage.setItem('product_edit_after', value);
    window.location.href='product_edit_form.html';
  });

})();
