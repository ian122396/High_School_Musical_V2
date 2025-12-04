const titleEl = document.getElementById('login-title');
const subtitleEl = document.getElementById('login-subtitle');
const messageEl = document.getElementById('login-message');
const usernameInput = document.getElementById('input-username');
const passwordInput = document.getElementById('input-password');
const form = document.getElementById('login-form');

const redirectMap = {
  admin: '/admin.html',
  sales: '/sales.html',
};

const resetUI = () => {
  messageEl.textContent = '';
  passwordInput.value = '';
  if (!usernameInput.value) {
    usernameInput.focus();
  } else {
    passwordInput.focus();
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username) {
    messageEl.textContent = '请输入用户名';
    messageEl.style.color = '#ed553b';
    return;
  }
  if (!password) {
    messageEl.textContent = '请输入密码';
    messageEl.style.color = '#ed553b';
    return;
  }
  messageEl.textContent = '正在登录...';
  messageEl.style.color = '#20639b';
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.error || '登录失败');
    }
    const { role } = await response.json();
    const redirectTarget = redirectMap[role] || '/';
    window.location.href = redirectTarget;
  } catch (error) {
    messageEl.textContent = error.message;
    messageEl.style.color = '#ed553b';
  }
});

resetUI();
