document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const userId = document.getElementById('userId');
  const password = document.getElementById('password');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // 空チェックだけ
    if (userId.value.trim() === '' || password.value.trim() === '') {
      alert('ユーザーIDとパスワードを入力してください');
      return;
    }

    // 入力されてれば通す（固定で遷移）
    window.location.href = "admin/menu/menu.html";
  });
});
