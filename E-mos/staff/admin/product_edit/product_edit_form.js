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

  // セッションに product_edit_product が無ければ localStorage の menu_items から取得
  if(!editProduct){
    try{
      var idForEdit = sessionStorage.getItem('product_edit_id') || '';
      if(idForEdit){
        var stored = JSON.parse(localStorage.getItem('menu_items') || '[]');
        if(Array.isArray(stored) && stored.length){
          var found = stored.find(function(it){ return String(it.menuId || it.id || '') === String(idForEdit); });
          if(found) editProduct = found;
        }
      }
    }catch(e){ /* ignore */ }
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
    // 編集内容を localStorage の menu_items に反映
    try{
      var id = sessionStorage.getItem('product_edit_id') || '';
      var nameVal = editName ? (editName.value || '').trim() : '';
      var catVal = editCategory ? (editCategory.value || '').trim() : '';
      var priceVal = editPrice ? (editPrice.value || '').trim() : '';
      var noteVal = editNote ? (editNote.value || '').trim() : '';
      var photoInput = document.getElementById('editPhoto');

      function finishUpdate(updatedPhoto){
        try{
          var items = [];
          try{ items = JSON.parse(localStorage.getItem('menu_items') || '[]'); }catch(e){ items = []; }
          var found = false;
          items = items.map(function(it){
            if(String(it.menuId || it.id || '') === String(id)){
              found = true;
              it.menuName = nameVal || it.menuName;
              it.categoryName = catVal || it.categoryName;
              it.unitPrice = priceVal || it.unitPrice;
              it.menuDescription = noteVal || it.menuDescription;
              if(updatedPhoto){ it.photoDataUrl = updatedPhoto; }
              return it;
            }
            return it;
          });
          if(!found){
            // 見つからなければ新規追加
            var newItem = { menuId: id || String(Date.now()), menuName: nameVal, categoryName: catVal, unitPrice: priceVal, menuDescription: noteVal };
            if(updatedPhoto) newItem.photoDataUrl = updatedPhoto;
            items.push(newItem);
          }
          localStorage.setItem('menu_items', JSON.stringify(items));
        }catch(err){ console.error('failed to update menu_items', err); }

        sessionStorage.removeItem('product_edit_selected');
          sessionStorage.removeItem('product_edit_after');
          sessionStorage.removeItem('product_edit_id');
          sessionStorage.removeItem('product_edit_product');
          // admin内で即時反映するためにカスタムイベントを発行し、モーダルを閉じる
          try{ window.dispatchEvent(new CustomEvent('menu_items_changed',{ detail: { action: 'edit', id: id } })); }catch(e){}
          if(modal){ hideModal(); }
          alert('商品情報を更新しました。');
          window.location.href = '../menu/menu.html';
      }

      if(photoInput && photoInput.files && photoInput.files[0]){
        var file = photoInput.files[0];
        var reader = new FileReader();
        reader.onload = function(evt){ finishUpdate(evt.target.result); };
        reader.onerror = function(){ console.error('failed reading photo'); finishUpdate(null); };
        reader.readAsDataURL(file);
      } else {
        finishUpdate(null);
      }
    }catch(err){ console.error(err); sessionStorage.removeItem('product_edit_selected'); sessionStorage.removeItem('product_edit_after'); sessionStorage.removeItem('product_edit_id'); sessionStorage.removeItem('product_edit_product'); window.location.href='../menu/menu.html'; }
  });
  if(modal) modal.querySelector('.modal-backdrop').addEventListener('click', hideModal);
  window.addEventListener('pageshow', function(){ hideModal(); });

})();
