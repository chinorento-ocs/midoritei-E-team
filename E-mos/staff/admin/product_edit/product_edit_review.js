(function(){
  var beforeBox = document.getElementById('beforeBox');
  var afterInput = document.getElementById('afterInput');
  var toEdit = document.getElementById('toEdit');
  var back = document.getElementById('backToSelect');

  // load selection
  var sel = sessionStorage.getItem('product_edit_selected');
  if(!sel){ window.location.href = 'product_edit_select.html'; }
  if(beforeBox) beforeBox.textContent = sel || '--';
  if(afterInput) afterInput.value = sel || '';

  var afterError = document.getElementById('afterError');

  if(back) back.addEventListener('click', function(){ window.location.href='product_edit_select.html'; });
  if(toEdit) toEdit.addEventListener('click', function(){
    var value = afterInput ? afterInput.value.trim() : '';
    if(!value){
      if(afterError) afterError.style.display = 'block';
      if(afterInput) afterInput.focus();
      return;
    }
    if(afterError) afterError.style.display = 'none';
    sessionStorage.setItem('product_edit_after', value);
    window.location.href='product_edit_form.html';
  });

})();
