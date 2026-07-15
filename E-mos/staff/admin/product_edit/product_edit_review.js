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

  // session に product がない場合、localStorage の menu_items から探す
  if(!product){
    try{
      var idFor = sessionStorage.getItem('product_edit_id') || '';
      if(idFor){
        var stored = JSON.parse(localStorage.getItem('menu_items') || '[]');
        if(Array.isArray(stored) && stored.length){
          var f = stored.find(function(it){ return String(it.menuId || it.id || '') === String(idFor); });
          if(f) product = f;
        }
      }
    }catch(e){ /* ignore */ }
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
