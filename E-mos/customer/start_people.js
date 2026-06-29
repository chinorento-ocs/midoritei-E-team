const adultMinus = document.getElementById('adultMinus');
const adultPlus = document.getElementById('adultPlus');
const childMinus = document.getElementById('childMinus');
const childPlus = document.getElementById('childPlus');
const adultCount = document.getElementById('adultCount');
const childCount = document.getElementById('childCount');
const totalBox = document.getElementById('totalBox');
const helperText = document.getElementById('helperText');
const confirmBtn = document.getElementById('confirmBtn');

let adults = 0;
let children = 0;
const maxTotal = 40;

function updateUI() {
  adults = Math.max(0, adults);
  children = Math.max(0, children);

  const total = adults + children;
  const canConfirm = total > 0 && adults > 0;

  adultCount.textContent = adults;
  childCount.textContent = children;
  totalBox.textContent = `合計 ${total}人`;

  if (total === 0) {
    helperText.textContent = '人数が入力されていません';
  } else if (adults === 0) {
    helperText.textContent = '大人が1人以上必要です';
  } else {
    helperText.textContent = '';
  }

  confirmBtn.disabled = !canConfirm;

  adultMinus.disabled = adults <= 0;
  childMinus.disabled = children <= 0;
  adultPlus.disabled = total >= maxTotal;
  childPlus.disabled = total >= maxTotal;
}

adultMinus.addEventListener('click', () => {
  if (adults > 0) adults -= 1;
  updateUI();
});

adultPlus.addEventListener('click', () => {
  if (adults + children < maxTotal) adults += 1;
  updateUI();
});

childMinus.addEventListener('click', () => {
  if (children > 0) children -= 1;
  updateUI();
});

childPlus.addEventListener('click', () => {
  if (adults + children < maxTotal) children += 1;
  updateUI();
});

confirmBtn.addEventListener('click', () => {
  if (adults + children === 0) {
    helperText.textContent = '人数が入力されていません';
    return;
  }

  if (adults === 0) {
    helperText.textContent = '大人が1人以上必要です';
    return;
  }

  localStorage.setItem('partySize', String(adults + children));
  window.location.href = 'main_menu.html';
});

updateUI();
