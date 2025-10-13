document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('auth-form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorMsg = document.getElementById('error-msg');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    let errors = [];

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      errors.push('Invalid email format.');
    }

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters.');
    }

    if (errors.length > 0) {
      errorMsg.innerHTML = errors.join('<br>');
    } else {
      errorMsg.innerHTML = '';
      alert('Login successful!');
    }
  });
});