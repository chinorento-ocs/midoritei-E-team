(function(){
  var gear = document.getElementById('gearBtn');
  var modal = document.getElementById('confirmModal');
  var cancel = document.getElementById('cancelBtn');
  var ok = document.getElementById('okBtn');
  function show(){ modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; cancel.focus(); }
  function hide(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; gear.focus(); }
  gear.addEventListener('click', function(e){ e.preventDefault(); show(); });
  cancel.addEventListener('click', function(e){ e.preventDefault(); hide(); });
  ok.addEventListener('click', function(e){ e.preventDefault(); window.location.href = '../../login.html'; });
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false'){ hide(); } });
})();
