(function(){
  var toReview = document.getElementById('toReview');
  var selectList = document.getElementById('selectList');
  var searchInput = document.getElementById('searchInput');
  var searchBtn = document.getElementById('searchBtn');
  var allProducts = [];

  function renderProducts(keyword){
    if(!selectList) return;

    var normalized = (keyword || '').toLowerCase();
    var filtered = allProducts.filter(function(product){
      var haystack = [product.menuName, product.categoryName, product.unitPrice].join(' ').toLowerCase();
      return haystack.indexOf(normalized) !== -1;
    });

    selectList.innerHTML = '';

    if(!filtered.length){
      var empty = document.createElement('div');
      empty.textContent = '商品が登録されていません';
      selectList.appendChild(empty);
      return;
    }

    filtered.forEach(function(product){
      var label = document.createElement('label');
      label.style.display = 'block';
      label.style.marginBottom = '8px';

      var radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'sel';
      radio.value = product.menuId;

      var labelText = product.menuName || '';
      if(product.categoryName){
        labelText += ' / ' + product.categoryName;
      }
      if(product.unitPrice){
        labelText += ' / ' + product.unitPrice;
      }
      var text = document.createTextNode(' ' + labelText);
      label.appendChild(radio);
      label.appendChild(text);
      selectList.appendChild(label);
    });
  }

  function loadProducts(){
    // ベースの静的メニュー（既存HTMLと同じIDスキーム）
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

    // マージ: staticDefaults をベースに localStorage.menu_items の上書き・追加を反映
    try{
      var stored = JSON.parse(localStorage.getItem('menu_items') || '[]');
      allProducts = staticDefaults.slice();
      if(Array.isArray(stored) && stored.length){
        stored.forEach(function(it){
          var id = String(it.menuId || it.id || '');
          var idx = allProducts.findIndex(function(s){ return String(s.menuId) === id; });
          var obj = { menuId: id || String(Date.now()), menuName: it.menuName || '', categoryName: it.categoryName || '', unitPrice: it.unitPrice || '' };
          if(idx >= 0){ allProducts[idx] = obj; }
          else { allProducts.push(obj); }
        });
      }
    }catch(e){ allProducts = staticDefaults.slice(); }

    renderProducts(searchInput ? searchInput.value : '');
  }

  if(searchBtn){ searchBtn.addEventListener('click', function(){ renderProducts(searchInput ? searchInput.value : ''); }); }
  if(searchInput){
    searchInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter'){ e.preventDefault(); renderProducts(searchInput.value); }
    });
  }

  if(toReview){
    toReview.addEventListener('click', function(){
      var sel = selectList.querySelector('input[name="sel"]:checked');

      if(!sel){
        alert('商品を選択してください。');
        return;
      }

      var selectedProduct = allProducts.find(function(product){ return String(product.menuId) === String(sel.value); }) || null;

      var text = selectedProduct ? (selectedProduct.menuName || '') : '';
      sessionStorage.setItem('product_edit_selected', text);
      sessionStorage.setItem('product_edit_id', selectedProduct ? selectedProduct.menuId : '');
      sessionStorage.setItem('product_edit_product', JSON.stringify(selectedProduct));
      window.location.href = 'product_edit_review.html';
    });
  }

  // 他ウィンドウ／同ウィンドウで menu_items が変更されたら再読み込み
  window.addEventListener('menu_items_changed', function(){ loadProducts(); });
  window.addEventListener('storage', function(e){ if(e.key === 'menu_items'){ loadProducts(); } });

  loadProducts();
})();
