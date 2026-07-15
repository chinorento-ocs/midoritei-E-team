(function(){
  var form = document.getElementById('addForm');
  if(!form) return;
  var modal = document.getElementById('confirmAddModal');
  var cancel = document.getElementById('cancelAddBtn');
  var ok = document.getElementById('okAddBtn');
  
  function show(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; form.querySelector('[type=submit]').focus(); }
  
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = form.elements['name'] ? (form.elements['name'].value || '').trim() : '';
    var category = form.elements['category'] ? (form.elements['category'].value || '').trim() : '';
    var price = form.elements['price'] ? (form.elements['price'].value || '').trim() : '';

    if(!name){ alert('商品名を入力してください。'); form.elements['name'] && form.elements['name'].focus(); return; }
    if(!category){ alert('カテゴリーを入力してください。'); form.elements['category'] && form.elements['category'].focus(); return; }
    if(!price){ alert('値段を入力してください。'); form.elements['price'] && form.elements['price'].focus(); return; }

    show();
  });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', function(e){
    e.preventDefault();
    // フォーム内容を localStorage の menu_items に保存（画像はDataURLで保存）
    try{
      var name = form.elements['name'] ? (form.elements['name'].value || '').trim() : '';
      var category = form.elements['category'] ? (form.elements['category'].value || '').trim() : '';
      var price = form.elements['price'] ? (form.elements['price'].value || '').trim() : '';
      var note = form.elements['note'] ? (form.elements['note'].value || '').trim() : '';
      var photoInput = form.elements['photo'];

      var menuItems = [];
      try{ menuItems = JSON.parse(localStorage.getItem('menu_items') || '[]'); }catch(e){ menuItems = []; }

      var newItem = {
        menuId: String(Date.now()),
        menuName: name,
        categoryName: category,
        unitPrice: price,
        menuDescription: note
      };

      function finishSave(){
        try{
          menuItems.push(newItem);
          localStorage.setItem('menu_items', JSON.stringify(menuItems));
          try{ window.dispatchEvent(new CustomEvent('menu_items_changed',{ detail: { action: 'add', item: newItem } })); }catch(e){}
        }catch(err){ console.error('failed to save new menu item', err); }

        modal.setAttribute('aria-hidden','true');
        document.body.style.overflow='';
        window.location.href = '../menu/menu.html';
      }

      if(photoInput && photoInput.files && photoInput.files[0]){
        var file = photoInput.files[0];
        var reader = new FileReader();
        reader.onload = function(evt){
          try{ newItem.photoDataUrl = evt.target.result; }catch(e){}
          finishSave();
        };
        reader.onerror = function(){
          console.error('failed to read image file');
          finishSave();
        };
        reader.readAsDataURL(file);
      } else {
        finishSave();
      }
    }catch(err){ console.error('failed to save new menu item', err); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; window.location.href = '../menu/menu.html'; }
  });
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false'){ hide(); } });
})();
