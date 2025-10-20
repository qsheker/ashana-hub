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
document.addEventListener('DOMContentLoaded', () => {
  const hours = new Date().getHours();

  const greeting = document.createElement('div'); // use div for styling
  greeting.style.padding = '12px 20px';
  greeting.style.margin = '20px auto';
  greeting.style.maxWidth = '400px';
  greeting.style.borderRadius = '8px';
  greeting.style.textAlign = 'center';
  greeting.style.fontSize = '1.1rem';
  greeting.style.fontWeight = '500';
  greeting.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  
switch (true) {
  case (hours < 12):
    greeting.textContent = "Good morning! Ready for breakfast?";
    greeting.style.backgroundColor = '#FFF9C4';
    break;
  case (hours < 18):
    greeting.textContent = "Good afternoon! Feeling hungry?";
    greeting.style.backgroundColor = '#BBDEFB';
    break;
  default:
    greeting.textContent = "Good evening! Late dinner time?";
    greeting.style.backgroundColor = '#D7CCC8';
    break;
}


const main = document.querySelector('main');
  if (main) main.prepend(greeting);
});

const passwordField = document.getElementById('Password');
const toggleBtn = document.createElement('button');
toggleBtn.textContent = 'Show';
toggleBtn.type = 'button';
toggleBtn.addEventListener('click', () => {
  const isPassword = passwordField.type === 'password';
  passwordField.type = isPassword ? 'text' : 'password';
  toggleBtn.textContent = isPassword ? 'Hide' : 'Show';
});
passwordField.parentNode.insertBefore(toggleBtn, passwordField.nextSibling);



const emailInput = document.getElementById('Email');
const rememberCheckbox = document.getElementById('Remember');

if (localStorage.getItem('rememberedEmail')) {
  emailInput.value = localStorage.getItem('rememberedEmail');
  rememberCheckbox.checked = true;
}

remember.addEventListener('change', () => {
  if (rememberCheckbox.checked) {
    localStorage.setItem('rememberedEmail', emailInput.value);
  } else {
    localStorage.removeItem('rememberedEmail');
  }
});
