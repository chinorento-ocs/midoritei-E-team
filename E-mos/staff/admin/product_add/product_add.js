(function(){
  var form = document.getElementById('addForm');
  if(!form) return;
  var modal = document.getElementById('confirmAddModal');
  var cancel = document.getElementById('cancelAddBtn');
  var ok = document.getElementById('okAddBtn');
  
  function show(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; form.querySelector('[type=submit]').focus(); }
  
  function validate(){
    var nameField = form.querySelector('[name="name"]');
    var categoryField = form.querySelector('[name="category"]');
    var priceField = form.querySelector('[name="price"]');
    var nameError = document.getElementById('nameError');
    var categoryError = document.getElementById('categoryError');
    var priceError = document.getElementById('priceError');
    
    var name = nameField.value.trim();
    var category = categoryField.value.trim();
    var price = priceField.value.trim();
    
    var hasError = false;
    
    if(!name){ nameError.style.display='block'; hasError = true; }
    else { nameError.style.display='none'; }
    
    if(!category){ categoryError.style.display='block'; hasError = true; }
    else { categoryError.style.display='none'; }
    
    if(!price){ priceError.style.display='block'; hasError = true; }
    else { priceError.style.display='none'; }
    
    return !hasError;
  }

  function buildProductPayload(){
    var formData = new FormData(form);
    var product = {
      name: (formData.get('name') || '').toString().trim(),
      category: (formData.get('category') || '').toString().trim(),
      price: (formData.get('price') || '').toString().trim(),
      note: (formData.get('note') || '').toString().trim(),
      photo: (formData.get('photo') || '').toString().trim()
    };

    formData.set('product', JSON.stringify(product));
    return formData;
  }
  
  form.addEventListener('submit', function(e){ e.preventDefault(); if(validate()){ show(); } });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', async function(e){
    e.preventDefault();
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';

    var payload = buildProductPayload();

    try {
      var response = await fetch(form.action, {
        method: form.method,
        body: payload
      });
      var result = await response.json();

      if (response.ok && result.success) {
        window.location.href = '../menu/menu.html';
      }
    } catch (error) {
      window.location.href = '../menu/menu.html';
    }
  });
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false'){ hide(); } });
})();
