(function(){
  var toReview = document.getElementById('toReview');
  var selectList = document.getElementById('selectList');
  if(toReview){
    toReview.addEventListener('click', function(){
      var sel = selectList.querySelector('input[name="sel"]:checked');
      if(!sel){ alert('項目を選択してください'); return; }
      // store selected text
      var text = sel.parentNode.textContent.trim();
      sessionStorage.setItem('product_edit_selected', text);
      window.location.href = 'product_edit_review.html';
    });
  }
})();
