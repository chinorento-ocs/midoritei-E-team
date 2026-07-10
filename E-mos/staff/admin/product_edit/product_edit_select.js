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

      var text = document.createTextNode(' ' + (product.menuName || '') + ' / ' + (product.categoryName || '') + ' / ￥' + (product.unitPrice || ''));
      label.appendChild(radio);
      label.appendChild(text);
      selectList.appendChild(label);
    });
  }

  function loadProducts(){
    allProducts = [
      { menuId: '1', menuName: 'かわ', categoryName: '焼き鳥', unitPrice: '500' },
      { menuId: '2', menuName: 'もも', categoryName: '焼き鳥', unitPrice: '500' }
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
