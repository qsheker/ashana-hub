function updateClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleString();
}
setInterval(updateClock, 1000);
updateClock();

const colors = ['#ffffff', '#f8f9fa', '#e3f2fd', '#ffe6f0', '#e6fff5'];
let idx = 0;
document.getElementById('changeBgBtn')?.addEventListener('click', () => {
  idx = (idx + 1) % colors.length;
  document.body.style.backgroundColor = colors[idx];
});

document.querySelectorAll('#faq .faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.faq-item').classList.toggle('open');
  });
});

const overlay = document.getElementById('popupOverlay');
document.getElementById('openPopupBtn')?.addEventListener('click', () => overlay.classList.add('show'));
document.getElementById('closePopupBtn')?.addEventListener('click', () => overlay.classList.remove('show'));
overlay?.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('show'); });

document.getElementById('popupForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('popupEmail');
  const valid = /\S+@\S+\.\S+/.test(email.value);
  email.classList.toggle('is-invalid', !valid);
  if (valid) {
    alert('Subscribed!');
    overlay.classList.remove('show');
    e.target.reset();
  }
});
function initClock() {
  const container = $('.navbar .container') || $('.navbar');
  if (!container || $('#liveClock')) return;

  const clock = createEl('span', { id: 'liveClock', class: 'small ms-auto text-white-50 d-none d-lg-inline' }, []);
  const collapse = $('.navbar .navbar-collapse');
  if (collapse) {
    collapse.appendChild(createEl('div', { class: 'ms-lg-3 my-2 my-lg-0' }, [clock]));
  } else {
    container.appendChild(clock);
  }

  const fmt = new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  function tick() {
    clock.textContent = fmt.format(new Date());
  }
  tick();
  setInterval(tick, 1000);
}


document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username');
  const phone = document.getElementById('phone');
  const address = document.getElementById('address');
  const email = document.getElementById('email');
  const pass = document.getElementById('password');
  const confirm = document.getElementById('confirm');

  let valid = true;

  [username, phone, address, email, pass, confirm].forEach(el => {
    if (!el.value.trim()) {
      el.classList.add('is-invalid');
      valid = false;
    } else {
      el.classList.remove('is-invalid');
    }
  });

  if (!/\S+@\S+\.\S+/.test(email.value)) { email.classList.add('is-invalid'); valid = false; }
  if (pass.value.length < 8) { pass.classList.add('is-invalid'); valid = false; }
  if (pass.value !== confirm.value) { confirm.classList.add('is-invalid'); valid = false; }

  if (valid) {
    alert('Profile saved successfully!');
    e.target.reset();
  }
});
