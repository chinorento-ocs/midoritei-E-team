(function(){
  var toReview = document.getElementById('toReview');
  var selectList = document.getElementById('selectList');
  if(toReview){
    toReview.addEventListener('click', function(){
      var sel = selectList.querySelector('input[name="sel"]:checked');
      if(!sel){ alert('項目を選択してください'); return; }
      var text = sel.parentNode.textContent.trim();
      sessionStorage.setItem('product_edit_selected', text);
      sessionStorage.setItem('product_edit_id', sel.value);
      window.location.href = 'product_edit_review.html';
    });
  }
})();
