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

      var text = document.createTextNode(' ' + (product.menuName || '') + ' / ' + (product.categoryName || '') + ' / ￥' + (product.unitPrice || ''));
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
    allProducts = [
      { menuId: '1', menuName: 'かわ', categoryName: '焼き鳥', unitPrice: '500' },
      { menuId: '2', menuName: 'もも', categoryName: '焼き鳥', unitPrice: '500' }
    ];
    filterProducts(searchInput ? searchInput.value : '');
  }

  deleteBtn.addEventListener('click', function(e){ e.preventDefault(); show(); });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', function(e){
    e.preventDefault();
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
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
