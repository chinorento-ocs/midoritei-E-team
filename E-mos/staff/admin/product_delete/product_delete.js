(function(){
  var deleteBtn = document.getElementById('deleteBtn');
  if(!deleteBtn) return;
  var modal = document.getElementById('confirmDeleteModal');
  var cancel = document.getElementById('cancelDeleteBtn');
  var ok = document.getElementById('okDeleteBtn');
  var deleteList = document.getElementById('deleteList');
  var deleteError = document.getElementById('deleteError');
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

  function validate(){
    var checkboxes = deleteList ? deleteList.querySelectorAll('input[type="checkbox"]') : document.querySelectorAll('input[type="checkbox"]');
    var checked = Array.from(checkboxes).some(function(cb){ return cb.checked; });

    if(!checked){
      if(deleteError) deleteError.style.display = 'block';
      return false;
    }
    if(deleteError) deleteError.style.display = 'none';
    return true;
  }

  function getSelectedProductIds(){
    var checkboxes = deleteList ? deleteList.querySelectorAll('input[type="checkbox"]:checked') : document.querySelectorAll('input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(function(cb){ return cb.value; });
  }

  async function loadProducts(){
    try {
      var response = await fetch('../../../php/menus.php');
      var products = await response.json();
      if(Array.isArray(products)){
        allProducts = products;
        filterProducts(searchInput ? searchInput.value : '');
      } else {
        alert('商品情報の読み込みに失敗しました。');
      }
    } catch (error) {
      alert('商品情報の読み込みに失敗しました。');
    }
  }

  deleteBtn.addEventListener('click', function(e){ e.preventDefault(); if(validate()){ show(); } });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', async function(e){
    e.preventDefault();
    var selectedIds = getSelectedProductIds();
    var payload = new FormData();
    payload.set('action', 'delete');
    payload.set('productIds', JSON.stringify(selectedIds));

    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';

    try {
      var response = await fetch('../../../php/menus.php', {
        method: 'POST',
        body: payload
      });
      var result = await response.json();

      if (response.ok && result.success) {
        window.location.href = '../menu/menu.html';
      } else {
        alert(result.message || '削除に失敗しました。');
      }
    } catch (error) {
      alert('削除に失敗しました。');
    }
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
