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

      var text = document.createTextNode(' ' + (product.menuName || '') + ' / ' + (product.categoryName || '') + ' / ' + (product.unitPrice || ''));
      label.appendChild(radio);
      label.appendChild(text);
      selectList.appendChild(label);
    });
  }

  function loadProducts(){
    // main_menu.html のメニュー項目を反映
    allProducts = [
      { menuId: '1', menuName: 'かわ', categoryName: '', unitPrice: '' },
      { menuId: '2', menuName: 'レバー', categoryName: '', unitPrice: '' },
      { menuId: '3', menuName: '枝豆', categoryName: '', unitPrice: '' },
      { menuId: '4', menuName: 'だし巻き卵', categoryName: '', unitPrice: '' },
      { menuId: '5', menuName: 'プリン', categoryName: '', unitPrice: '' },
      { menuId: '6', menuName: '生ビール（中）', categoryName: '', unitPrice: '' },
      { menuId: '7', menuName: 'ハイボール', categoryName: '', unitPrice: '' },
      { menuId: '8', menuName: '焼酎ソーダ割り', categoryName: '', unitPrice: '' },
      { menuId: '9', menuName: '日本酒（冷酒）', categoryName: '', unitPrice: '' },
      { menuId: '10', menuName: 'チューハイ', categoryName: '', unitPrice: '' },
      { menuId: '11', menuName: 'ウーロン茶', categoryName: '', unitPrice: '' },
      { menuId: '12', menuName: '唐揚げ', categoryName: '', unitPrice: '' },
      { menuId: '13', menuName: 'チーズボール', categoryName: '', unitPrice: '' },
      { menuId: '14', menuName: '冷奴', categoryName: '', unitPrice: '' },
      { menuId: '15', menuName: 'ポテトサラダ', categoryName: '', unitPrice: '' },
      { menuId: '16', menuName: 'キュウリの浅漬け', categoryName: '', unitPrice: '' },
      { menuId: '17', menuName: 'ナッツミックス', categoryName: '', unitPrice: '' },
      { menuId: '18', menuName: 'はつ塩', categoryName: '', unitPrice: '' },
      { menuId: '19', menuName: 'ねぎま塩', categoryName: '', unitPrice: '' },
      { menuId: '20', menuName: 'もも塩', categoryName: '', unitPrice: '' },
      { menuId: '21', menuName: 'ぼんじり塩', categoryName: '', unitPrice: '' },
      { menuId: '22', menuName: 'なんこつ塩', categoryName: '', unitPrice: '' },
      { menuId: '23', menuName: '砂肝塩', categoryName: '', unitPrice: '' }
    ];
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
      var selectedProduct = allProducts[0];

      if(sel){
        selectedProduct = allProducts.find(function(product){ return String(product.menuId) === String(sel.value); }) || allProducts[0];
      }

      var text = selectedProduct ? (selectedProduct.menuName || '') : '';
      sessionStorage.setItem('product_edit_selected', text);
      sessionStorage.setItem('product_edit_id', selectedProduct ? selectedProduct.menuId : '');
      sessionStorage.setItem('product_edit_product', JSON.stringify(selectedProduct));
      window.location.href = 'product_edit_review.html';
    });
  }

  loadProducts();
})();
