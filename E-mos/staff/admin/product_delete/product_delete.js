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
