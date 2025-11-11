(function () {
  'use strict';

  // Scroll progress (uses jQuery already loaded in page)
  $(window).on('scroll', function () {
    const windowHeight = $(window).height();
    const documentHeight = $(document).height();
    const scrollTop = $(window).scrollTop();
    const progress = (scrollTop / (documentHeight - windowHeight)) * 100 || 0;
    $('#scroll-progress').css('width', progress + '%');
  });

  // THEME
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
  function applyThemeFromStorage() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
      document.body.classList.add('dark-mode');
      if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
    } else {
      document.body.classList.remove('dark-mode');
      if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
      }
    }
  }
  function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    applyThemeFromStorage();
  }
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  applyThemeFromStorage();

  // AUTH and per-user loading
  function loadCurrentUserPack() {
    const curRaw = localStorage.getItem('currentUser');
    if (!curRaw) {
      // No signed-in user
      return null;
    }
    try {
      const parsed = JSON.parse(curRaw);
      // If parsed is object containing email, try to load user's stored profile
      if (parsed && typeof parsed === 'object') {
        const email = parsed.email || null;
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        if (email && users[email]) return { email, data: users[email] };
        // parsed might already be full data
        if (parsed.name || parsed.email) return { email: email || parsed.email || null, data: parsed };
      }
    } catch (err) {
      // curRaw may be plain email
      const maybeEmail = curRaw;
      const users = JSON.parse(localStorage.getItem('users') || '{}');
      if (maybeEmail && users[maybeEmail]) return { email: maybeEmail, data: users[maybeEmail] };
      // if plain email and no stored user, return a minimal pack
      if (maybeEmail) return { email: maybeEmail, data: { email: maybeEmail } };
    }
    return null;
  }

  const userPack = loadCurrentUserPack();
  if (!userPack) {
    // no user found -> redirect to auth
    window.location.href = 'auth.html';
    return;
  }

  let currentUserEmail = userPack.email || (userPack.data && userPack.data.email) || null;
  let currentUser = userPack.data || {};

  // Logout — clear session (currentUser) but keep saved users map so settings persist across logins
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    // Keep `users` map intact so saved settings remain
    window.location.href = 'auth.html';
  });

  // Fill form
  const usernameEl = document.getElementById('username');
  const phoneEl = document.getElementById('phone');
  const addrStreetEl = document.getElementById('addr_street');
  const addrBuildingEl = document.getElementById('addr_building');
  const addrAptEl = document.getElementById('addr_apartment');
  const emailEl = document.getElementById('email');
  const passwordEl = document.getElementById('password');
  const confirmEl = document.getElementById('confirm');
  const saveBtn = document.getElementById('saveBtn');
  const spinner = document.getElementById('spinner');
  const msgBox = document.getElementById('formMessage');

  if (currentUser) {
    if (usernameEl && currentUser.name) usernameEl.value = currentUser.name;
    if (phoneEl && currentUser.phone) phoneEl.value = currentUser.phone;
    if (emailEl && currentUser.email) emailEl.value = currentUser.email;
    if (currentUser.address) {
      if (addrStreetEl && currentUser.address.street) addrStreetEl.value = currentUser.address.street;
      if (addrBuildingEl && currentUser.address.building) addrBuildingEl.value = currentUser.address.building;
      if (addrAptEl && currentUser.address.apartment) addrAptEl.value = currentUser.address.apartment;
    }
    const heroName = document.querySelector('.hero-title span');
    if (heroName && currentUser.name) heroName.textContent = currentUser.name;
  }

  // Password toggle
  function toggleInputVisibility(btn, input) {
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      const i = btn.querySelector('i');
      if (i) i.classList.toggle('fa-eye');
      if (i) i.classList.toggle('fa-eye-slash');
    });
  }
  toggleInputVisibility(document.getElementById('togglePassword'), passwordEl);
  toggleInputVisibility(document.getElementById('toggleConfirm'), confirmEl);

  // Password strength
  const pwStrengthBar = document.getElementById('pwStrengthBar');
  const pwStrengthText = document.getElementById('pwStrengthText');
  function evaluatePassword(pw) {
    let score = 0;
    if (!pw) return { score: 0, label: 'Empty' };
    if (pw.length >= 8) score += 25;
    if (pw.length >= 12) score += 10;
    if (/[a-z]/.test(pw)) score += 15;
    if (/[A-Z]/.test(pw)) score += 15;
    if (/[0-9]/.test(pw)) score += 15;
    if (/[^A-Za-z0-9]/.test(pw)) score += 20;
    score = Math.min(100, score);
    let label = 'Weak';
    if (score > 75) label = 'Strong';
    else if (score > 45) label = 'Medium';
    return { score, label };
  }
  if (passwordEl) {
    passwordEl.addEventListener('input', () => {
      const val = passwordEl.value || '';
      const { score, label } = evaluatePassword(val);
      if (pwStrengthBar) {
        pwStrengthBar.style.width = score + '%';
        if (score > 75) pwStrengthBar.style.background = 'linear-gradient(90deg,#4cd964,#7bd389)';
        else if (score > 45) pwStrengthBar.style.background = 'linear-gradient(90deg,#ffd54f,#ff8a65)';
        else pwStrengthBar.style.background = 'linear-gradient(90deg,#ff6b6b,#ffb86b)';
      }
      if (pwStrengthText) pwStrengthText.textContent = label;
      passwordEl.classList.remove('is-invalid');
    });
  }

  // Validation helpers
  function setInvalid(el, msg) {
    if (!el) return;
    el.classList.add('is-invalid');
    const fb = el.parentElement.querySelector('.invalid-feedback');
    if (fb && msg) fb.textContent = msg;
  }
  function clearInvalid(el) {
    if (!el) return;
    el.classList.remove('is-invalid');
  }
  function validUsername(v) {
    return /^[A-Za-z0-9 _-]{3,30}$/.test((v || '').trim());
  }
  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim());
  }
  function validPhone(v) {
    if (!v) return false;
    const cleaned = v.replace(/[^+0-9]/g, '');
    return /^\+?[1-9]\d{1,14}$/.test(cleaned);
  }

  // Submit
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      [usernameEl, phoneEl, addrStreetEl, emailEl, passwordEl, confirmEl].forEach(clearInvalid);
      if (msgBox) msgBox.textContent = '';

      const username = usernameEl ? usernameEl.value.trim() : '';
      const phone = phoneEl ? phoneEl.value.trim() : '';
      const street = addrStreetEl ? addrStreetEl.value.trim() : '';
      const building = addrBuildingEl ? addrBuildingEl.value.trim() : '';
      const apartment = addrAptEl ? addrAptEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const password = passwordEl ? passwordEl.value : '';
      const confirm = confirmEl ? confirmEl.value : '';

      if (!validUsername(username)) {
        setInvalid(usernameEl, 'Username 3-30 chars (letters, numbers, space, - or _).');
        valid = false;
      }
      if (!validPhone(phone)) {
        setInvalid(phoneEl, 'Phone must be in international E.164 format (e.g. +12025550123).');
        valid = false;
      }
      if (!street) {
        setInvalid(addrStreetEl, 'Street is required');
        valid = false;
      }
      if (!validEmail(email)) {
        setInvalid(emailEl, 'Enter a valid email');
        valid = false;
      }

      if (password || confirm) {
        const { score } = evaluatePassword(password);
        if (password.length < 8 || score < 50) {
          setInvalid(passwordEl, 'Password is too weak (min 8 chars, add numbers/symbols).');
          valid = false;
        }
        if (password !== confirm) {
          setInvalid(confirmEl, 'Passwords do not match');
          valid = false;
        }
      }

      if (!valid) {
        if (msgBox) msgBox.innerHTML = '<div class="text-danger">Please fix the highlighted errors.</div>';
        return;
      }

      const cleanedPhone = phone.replace(/[^+0-9]/g, '');
      const emailKey = email || (username ? username.replace(/\s+/g, '_').toLowerCase() : ('user_' + Date.now()));
      const userData = {
        name: username,
        phone: cleanedPhone,
        email: emailKey,
        address: { street, building, apartment },
        updatedAt: new Date().toISOString()
      };
      if (password) userData.password = btoa(password); // demo only

      if (spinner) spinner.hidden = false;
      if (saveBtn) saveBtn.disabled = true;

      setTimeout(() => {
        try {
          const users = JSON.parse(localStorage.getItem('users') || '{}');
          users[emailKey] = userData;
          localStorage.setItem('users', JSON.stringify(users));
          // update currentUser to this user's data for compatibility
          localStorage.setItem('currentUser', JSON.stringify(userData));
          currentUserEmail = emailKey;
          currentUser = userData;
          if (msgBox) msgBox.innerHTML = '<div class="text-success">Settings saved successfully.</div>';
          const heroName = document.querySelector('.hero-title span');
          if (heroName) heroName.textContent = username;
        } catch (err) {
          if (msgBox) msgBox.innerHTML = '<div class="text-danger">Failed to save. Please try again.</div>';
        }
        if (spinner) spinner.hidden = true;
        if (saveBtn) saveBtn.disabled = false;
      }, 800);
    });
  }

  // FAQ: accordion + live search
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      item.classList.toggle('open');
    });
  });
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const kw = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const q = item.querySelector('.faq-q');
        const a = item.querySelector('.faq-a');
        const text = ((q.textContent || '') + ' ' + (a.textContent || '')).toLowerCase();
        item.style.display = text.includes(kw) ? '' : 'none';
        q.innerHTML = q.textContent;
        if (kw && q.textContent.toLowerCase().includes(kw)) {
          const re = new RegExp('(' + kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
          q.innerHTML = q.textContent.replace(re, '<mark class="highlight">$1</mark>');
        }
      });
    });
  }

  // Popup handling
  const popupOverlay = document.getElementById('popupOverlay');
  const closePopupBtn = document.getElementById('closePopupBtn');
  const popupForm = document.getElementById('popupForm');
  if (closePopupBtn && popupOverlay) closePopupBtn.addEventListener('click', () => popupOverlay.classList.remove('show'));
  if (popupOverlay) popupOverlay.addEventListener('click', (e) => { if (e.target === popupOverlay) popupOverlay.classList.remove('show'); });
  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('popupEmail');
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        if (email) email.classList.add('is-invalid');
        return;
      }
      if (email) email.classList.remove('is-invalid');
      alert('Subscribed!');
      popupOverlay.classList.remove('show');
      popupForm.reset();
    });
  }

})();
