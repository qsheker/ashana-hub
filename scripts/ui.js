// scripts/ui.js
// Shared UI utilities demonstrating JS concepts: objects/methods, arrays/loops,
// higher-order functions, WebAudio sounds, and simple animations.

// -------------------- Sound (WebAudio) --------------------
const AudioPlayer = (() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  function beep(duration = 0.08, freq = 880, type = 'sine') {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    o.stop(ctx.currentTime + duration + 0.02);
  }
  function resume() { if (ctx.state === 'suspended') return ctx.resume(); return Promise.resolve(); }
  function suspend() { if (ctx.state === 'running') return ctx.suspend(); return Promise.resolve(); }
  return { beep, resume, suspend };
})();

// -------------------- Data (objects & methods) --------------------
const Team = (() => {
  const members = [
    { id: 1, name: 'Aldiyar', role: 'Founder', fav: 'Kyurdak', email: 'aldiar@ashana.com', img: 'images/team-aldiar.png', bio: 'Aldiyar started Ashana Hub to bring people together over great food.' },
    { id: 2, name: 'Aibek', role: 'Chef', fav: 'Pasta with Chicken', email: 'aibek@ashana.com', img: 'images/team-aibek.png', bio: 'Aibek crafts the menu and ensures every plate is perfect.' },
    { id: 3, name: 'Nurgeldi', role: 'Manager', fav: 'Cheese Pizza', email: 'nurgeldi@ashana.com', img: 'images/team-nurgeldi.png', bio: 'Nurgeldi keeps the restaurant running smoothly.' },
    { id: 4, name: 'Almadi', role: 'Barista', fav: 'Lagman', email: 'almadi@ashana.com', img: 'images/team-almadi.png', bio: 'Almadi is the master of coffee and desserts.' }
  ];

  // add a method to each object
  members.forEach(m => {
    m.contact = function () { return `${this.name} <${this.email}>`; };
    m.short = function () { return `${this.role} • ${this.fav}`; };
  });

  function getAll() { return members.slice(); }
  function filterByRole(role) { return members.filter(m => m.role.toLowerCase() === role.toLowerCase()); }
  function findById(id) { return members.find(m => m.id === id); }

  return { getAll, filterByRole, findById };
})();

// -------------------- Discounts data --------------------
const Discounts = (() => {
  const deals = [
    { id: 'pasta', name: 'Pasta with Chicken', old: 650, now: 490, pct: 25, img: 'images/pasta-with-chicken.jpeg' },
    { id: 'burger', name: 'Ashana Burger', old: 1200, now: 960, pct: 20, img: 'images/ashana-burger.jpg' },
    { id: 'kyurdak', name: 'Kyurdak', old: 1500, now: 1050, pct: 30, img: 'images/kyurdak.jpeg' },
    { id: 'salad', name: 'Chicken Caesar Salad', old: 900, now: 765, pct: 15, img: 'images/chicken-caesar-salad.jpeg' },
    { id: 'pizza', name: 'Cheese Pizza', old: 1100, now: 902, pct: 18, img: 'images/cheese-pizza.png' },
    { id: 'lagman', name: 'Lagman', old: 1300, now: 1014, pct: 22, img: 'images/lagman.jpeg' }
  ];

  function all() { return deals.slice(); }
  function filterByMinPct(minPct) { return deals.filter(d => d.pct >= minPct); }
  function mapPrices(fn) { return deals.map(fn); } // higher-order

  return { all, filterByMinPct, mapPrices };
})();

// -------------------- Rendering helpers --------------------
function create(tag, props = {}, children = []) {
  const el = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  children.forEach(c => el.appendChild(c));
  return el;
}

function renderTeam(containerId = 'memberGrid') {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  const members = Team.getAll();
  members.forEach(m => {
  // lazy-load: keep actual image url in data-src, set placeholder src
  const img = create('img', { 'data-src': m.img, src: 'images/restor.jpg', alt: m.name, class: 'member-photo lazy' });
  img.onerror = () => { img.src = 'images/restor.jpg'; img.classList.add('img-fallback'); };
    const name = create('div', { class: 'member-name', html: `<strong>${m.name}</strong>` });
    const role = create('div', { class: 'member-role', html: m.role });
    const bio = create('div', { class: 'member-bio', html: m.bio });
    const fav = create('div', { class: 'member-fav', html: `Fav: ${m.fav}` });

    const greet = create('button', { class: 'btn sound-btn', type: 'button' }, []);
    greet.textContent = 'Say Hi';
    greet.addEventListener('click', () => {
      AudioPlayer.beep(0.06, 880 + m.id * 40);
      animatePulse(greet);
      alert(`Hello from ${m.contact()}`);
    });

    const card = create('div', { class: 'member-card card' }, []);
    const left = create('div', { class: 'member-left' }, []);
    left.appendChild(img);
    const right = create('div', { class: 'member-right' }, []);
    right.appendChild(name);
    right.appendChild(role);
    right.appendChild(bio);
    right.appendChild(fav);
    right.appendChild(greet);
    card.appendChild(left);
    card.appendChild(right);
    card.addEventListener('mouseenter', () => card.classList.add('hover'));
    card.addEventListener('mouseleave', () => card.classList.remove('hover'));
    container.appendChild(card);
  });
}

function renderDiscounts(containerId = 'discountGrid', list = Discounts.all()) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  list.forEach(d => {
    // lazy-load discount image
    const img = create('img', { 'data-src': d.img, src: 'images/restor.jpg', alt: d.name, class: 'discount-img lazy' });
    img.onerror = () => { img.src = 'images/restor.jpg'; img.classList.add('img-fallback'); };
      const badge = create('div', { class: 'discount-badge', html: `-${d.pct}%` });
    const name = create('div', { class: 'meal-name', html: d.name });
    const desc = create('div', { class: 'meal-desc', html: '' });
    const prices = create('div', { class: 'prices', html: `<span class="old-price">${d.old}₸</span> <span class="new-price">${d.now}₸</span>` });

    const card = create('div', { class: 'discount-card' }, []);
    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(name);
    card.appendChild(desc);
    card.appendChild(prices);
    card.addEventListener('click', () => {
        console.debug('discount clicked', d.id);
        AudioPlayer.beep(0.05, 660 + d.pct);
      animatePulse(card);
    });
    container.appendChild(card);
  });
}

// -------------------- Animations --------------------
function animatePulse(el) {
  el.style.transition = 'transform 180ms ease, box-shadow 180ms ease';
  el.style.transform = 'scale(1.03)';
  el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
  setTimeout(() => {
    el.style.transform = '';
    el.style.boxShadow = '';
  }, 220);
}

// -------------------- Higher-order example --------------------
function applyToDiscounts(fn) {
  // passes each discount to fn and returns mapped array
  return Discounts.all().map(fn);
}

// -------------------- Init --------------------
document.addEventListener('DOMContentLoaded', () => {
  console.info('ui.js loaded');
  renderTeam();
  renderDiscounts();

  // example usage of higher-order function: extract names
  const names = applyToDiscounts(d => d.name);
  // expose to console for demonstration
  console.debug('Discount names:', names);
});
