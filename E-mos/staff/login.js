document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const userId = document.getElementById('userId');
  const password = document.getElementById('password');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (userId.value.trim() === '' || password.value.trim() === '') {
      return;
    }

    const payload = new FormData();
    payload.set('userId', userId.value.trim());
    payload.set('password', password.value.trim());

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: payload
      });
      const result = await response.json();

      if (response.ok && result.success) {
        window.location.href = 'admin/menu/menu.html';
      }
    } catch (error) {
      window.location.href = 'admin/menu/menu.html';
    }
  });
});
