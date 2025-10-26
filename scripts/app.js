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

  // Remove all previous error states
  [username, phone, address, email, pass, confirm].forEach(el => {
    el.classList.remove('is-invalid');
  });

  if (!username.value.trim()) {
    username.classList.add('is-invalid');
    valid = false;
  }
  if (!phone.value.trim()) {
    phone.classList.add('is-invalid');
    valid = false;
  }
  if (!address.value.trim()) {
    address.classList.add('is-invalid');
    valid = false;
  }
  if (!email.value.trim() || !/\S+@\S+\.\S+/.test(email.value)) {
    email.classList.add('is-invalid');
    valid = false;
  }
  if (!pass.value.trim() || pass.value.length < 8) {
    pass.classList.add('is-invalid');
    valid = false;
  }
  if (!confirm.value.trim() || pass.value !== confirm.value) {
    confirm.classList.add('is-invalid');
    valid = false;
  }

  if (valid) {
    alert('Profile saved successfully!');
    e.target.reset();
  }
});


const toggleThemeBtn = document.getElementById('toggleThemeBtn');
function toggleTheme() {
  document.body.classList.toggle('dark');
}
toggleThemeBtn?.addEventListener('click', toggleTheme);

const playSoundBtn = document.getElementById('playSoundBtn');
function playBeep(duration = 150, frequency = 880, type = 'sine') {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  osc.start();
  setTimeout(() => { osc.stop(); ctx.close(); }, duration);
}
playSoundBtn?.addEventListener('click', () => playBeep());

const shakeCardBtn = document.getElementById('shakeCardBtn');
shakeCardBtn.addEventListener('click', () => {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.classList.remove('shake');
    void card.offsetWidth; 
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), 400);
  });
});

const galleryData = [
  { title: 'Cheese Burger', category: 'food',   img: 'https://avatars.mds.yandex.net/i?id=184030df29e312d5f093f764a9a290d19365ae18-5221522-images-thumbs&n=13' },
  { title: 'Latte',         category: 'drinks', img: 'https://avatars.mds.yandex.net/i?id=10e1175120ee35540462a6a7b6e76e453a03b89e-4080417-images-thumbs&n=13'  },
  { title: 'Tiramisu',      category: 'dessert',img: 'https://avatars.mds.yandex.net/i?id=bebf0a69e774bd946de5a6a0d6e59d7a9fc03172-12345336-images-thumbs&n=13' },
  { title: 'Salad',         category: 'food',   img: 'https://avatars.mds.yandex.net/i?id=c200d8f9b7b0a07f1f1336159c93d01d6f7ac14c-5322694-images-thumbs&n=13' },
  { title: 'Tea',           category: 'drinks', img: 'https://avatars.mds.yandex.net/i?id=6d8c2ad6d09a9f8385875e3360762c3df4394e33-5419040-images-thumbs&n=13'   },
  { title: 'Cheesecake',    category: 'dessert',img: 'https://avatars.mds.yandex.net/i?id=8c02df8f8043aa580d6e6fecddc1fe0437746c0b-5595218-images-thumbs&n=13' },
];

const galleryEl = document.getElementById('gallery');
const galleryFilter = document.getElementById('galleryFilter');
const shuffleBtn = document.getElementById('shuffleBtn');

function renderGallery(filter = 'all') {
  
  let list = galleryData;
  switch (filter) {
    case 'food':   list = galleryData.filter(x => x.category === 'food'); break;
    case 'drinks': list = galleryData.filter(x => x.category === 'drinks'); break;
    case 'dessert':list = galleryData.filter(x => x.category === 'dessert'); break;
    default:       list = galleryData;
  }

  galleryEl.innerHTML = list
    .map(item => `
      <div class="col-12 col-sm-6 col-md-4 fade-in">
        <div class="card h-100">
          <img src="${item.img}" class="card-img-top" alt="${item.title}">
          <div class="card-body">
            <h6 class="card-title mb-0">${item.title}</h6>
            <small class="text-muted">${item.category}</small>
          </div>
        </div>
      </div>
    `)
    .join('');
}

galleryFilter?.addEventListener('change', (e) => renderGallery(e.target.value));
shuffleBtn?.addEventListener('click', () => {
  
  galleryData.sort(() => Math.random() - 0.5);
  renderGallery(galleryFilter?.value || 'all');
});

if (galleryEl) renderGallery('all');

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key === 't') toggleTheme();
  if (key === 's') playBeep();
  if (key === 'g') shuffleBtn?.click();
});





