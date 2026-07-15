(function(){
  var deleteBtn = document.getElementById('deleteBtn');
  if(!deleteBtn) return;
  var modal = document.getElementById('confirmDeleteModal');
  var cancel = document.getElementById('cancelDeleteBtn');
  var ok = document.getElementById('okDeleteBtn');
  var deleteList = document.getElementById('deleteList');
  var searchInput = document.querySelector('.search-field .input-text');
  var searchBtn = document.querySelector('.search-button');
  var allProducts = [];

  function show(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; deleteBtn.focus(); }

  function renderProducts(products){
    if(!deleteList) return;
    deleteList.innerHTML = '';

    if(!products.length){
      var empty = document.createElement('div');
      empty.textContent = '登録済みの商品がありません';
      deleteList.appendChild(empty);
      return;
    }

    products.forEach(function(product){
      var label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginBottom = '8px';

      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'product';
      checkbox.value = product.menuId;

      var text = document.createTextNode(' ' + (product.menuName || '') + ' ' + (product.categoryName || '') + ' ' + (product.unitPrice || ''));
      label.appendChild(checkbox);
      label.appendChild(text);
      deleteList.appendChild(label);
    });
  }

  function filterProducts(keyword){
    var normalized = (keyword || '').toLowerCase();
    var filtered = allProducts.filter(function(product){
      var haystack = [product.menuName, product.categoryName, product.unitPrice].join(' ').toLowerCase();
      return haystack.indexOf(normalized) !== -1;
    });
    renderProducts(filtered);
  }

  function loadProducts(){
    // static デフォルト定義
    var staticDefaults = [
      { menuId: '1', menuName: 'かわ', categoryName: '', unitPrice: '150' },
      { menuId: '2', menuName: 'レバー', categoryName: '', unitPrice: '150' },
      { menuId: '3', menuName: '枝豆', categoryName: '', unitPrice: '300' },
      { menuId: '4', menuName: 'だし巻き卵', categoryName: '', unitPrice: '500' },
      { menuId: '5', menuName: 'プリン', categoryName: '', unitPrice: '450' },
      { menuId: '6', menuName: '生ビール（中）', categoryName: '', unitPrice: '600' },
      { menuId: '7', menuName: 'ハイボール', categoryName: '', unitPrice: '600' },
      { menuId: '8', menuName: '焼酎ソーダ割り', categoryName: '', unitPrice: '500' },
      { menuId: '9', menuName: '日本酒（冷酒）', categoryName: '', unitPrice: '700' },
      { menuId: '10', menuName: 'チューハイ', categoryName: '', unitPrice: '550' },
      { menuId: '11', menuName: 'ウーロン茶', categoryName: '', unitPrice: '400' },
      { menuId: '12', menuName: '唐揚げ', categoryName: '', unitPrice: '450' },
      { menuId: '13', menuName: 'チーズボール', categoryName: '', unitPrice: '400' },
      { menuId: '14', menuName: '冷奴', categoryName: '', unitPrice: '350' },
      { menuId: '15', menuName: 'ポテトサラダ', categoryName: '', unitPrice: '380' },
      { menuId: '16', menuName: 'キュウリの浅漬け', categoryName: '', unitPrice: '280' },
      { menuId: '17', menuName: 'ナッツミックス', categoryName: '', unitPrice: '320' },
      { menuId: '18', menuName: 'はつ塩', categoryName: '', unitPrice: '150' },
      { menuId: '19', menuName: 'ねぎま塩', categoryName: '', unitPrice: '160' },
      { menuId: '20', menuName: 'もも塩', categoryName: '', unitPrice: '140' },
      { menuId: '21', menuName: 'ぼんじり塩', categoryName: '', unitPrice: '170' },
      { menuId: '22', menuName: 'なんこつ塩', categoryName: '', unitPrice: '140' },
      { menuId: '23', menuName: '砂肝塩', categoryName: '', unitPrice: '150' }
    ];
    try{
      var stored = JSON.parse(localStorage.getItem('menu_items') || '[]');
      allProducts = staticDefaults.slice();
      if(Array.isArray(stored) && stored.length){
        stored.forEach(function(it){
          var id = String(it.menuId || it.id || '');
          var idx = allProducts.findIndex(function(s){ return String(s.menuId) === id; });
          var obj = { menuId: id || String(Date.now()), menuName: it.menuName||'', categoryName: it.categoryName||'', unitPrice: it.unitPrice||'' };
          if(idx >= 0) allProducts[idx] = obj; else allProducts.push(obj);
        });
      }
    }catch(e){ allProducts = staticDefaults.slice(); }
    filterProducts(searchInput ? searchInput.value : '');
  }

  deleteBtn.addEventListener('click', function(e){
    e.preventDefault();
    // チェックがあるか確認
    var anyChecked = deleteList.querySelector('input[name="product"]:checked');
    if(!anyChecked){
      alert('削除する商品を選択してください。');
      return;
    }
    show();
  });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', function(e){
    e.preventDefault();
    // 選択された商品を localStorage の menu_items から削除
    try{
      var checked = Array.prototype.slice.call(deleteList.querySelectorAll('input[name="product"]:checked')) || [];
      if(checked.length){
        var ids = checked.map(function(ch){ return String(ch.value); });
        var items = [];
        try{ items = JSON.parse(localStorage.getItem('menu_items') || '[]'); }catch(e){ items = []; }
        var filtered = items.filter(function(it){ return ids.indexOf(String(it.menuId || it.id || '')) === -1; });
        localStorage.setItem('menu_items', JSON.stringify(filtered));
      }
    }catch(err){ console.error('failed to remove menu_items', err); }

    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    // 発行して管理画面内の一覧を更新
    try{ window.dispatchEvent(new CustomEvent('menu_items_changed',{ detail: { action: 'delete', ids: ids } })); }catch(e){}
    // メニュー画面へ遷移
    window.location.href = '../menu/menu.html';
  });

  if(searchBtn){ searchBtn.addEventListener('click', function(){ filterProducts(searchInput ? searchInput.value : ''); }); }
  if(searchInput){
    searchInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){ e.preventDefault(); filterProducts(searchInput.value); }
    });
  }

  loadProducts();
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false'){ hide(); } });
})();
