// profile-save.js
(function () {
  const AUTH_KEY = 'currentUser'; // project uses 'currentUser'
  const USERS_KEY = 'users';

  // --- helpers ---
  function getUsers() {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const map = {};
        parsed.forEach(u => { if (u && u.email) map[String(u.email).toLowerCase()] = u; });
        return map;
      }
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch (e) {
      console.warn('Failed to parse users from storage', e);
    }
    return {};
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users || {}));
    } catch (e) {
      console.error('Failed to save users to storage', e);
    }
  }

  function getLoggedInEmail() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'string') return parsed.toLowerCase();
      if (parsed && parsed.email) return String(parsed.email).toLowerCase();
      if (parsed && parsed.email === undefined && parsed.name && parsed.email === undefined) return null;
      return null;
    } catch (e) {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? String(raw).toLowerCase() : null;
    }
  }

  function setLoggedInUser(name, email) {
    if (!email) return;
    const payload = { name: name || '', email: String(email).toLowerCase() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(payload));
  }

  function clearLoggedIn() { localStorage.removeItem(AUTH_KEY); }

  function $(id) { return document.getElementById(id); }

  const idMap = {
    name: 'username',
    email: 'email',
    phone: 'phone',
    addrStreet: 'addr_street',
    addrBuilding: 'addr_building',
    addrApartment: 'addr_apartment',
    password: 'password',
    confirm: 'confirm',
    saveBtn: 'saveBtn',
    logoutBtn: 'logoutBtn',
    msgBox: 'formMessage'
  };

  document.addEventListener('DOMContentLoaded', () => {
    const loggedEmail = getLoggedInEmail();
    if (!loggedEmail) {
      window.location.href = 'auth.html';
      return;
    }

    const users = getUsers();
    const profile = users[loggedEmail] || {};

    const nameEl = $(idMap.name);
    const emailEl = $(idMap.email);
    const phoneEl = $(idMap.phone);
    const streetEl = $(idMap.addrStreet);
    const buildingEl = $(idMap.addrBuilding);
    const aptEl = $(idMap.addrApartment);
    const passwordEl = $(idMap.password);
    const confirmEl = $(idMap.confirm);
    const saveBtn = $(idMap.saveBtn);
    const logoutBtn = $(idMap.logoutBtn);
    const msgBox = $(idMap.msgBox);

    if (nameEl && profile.name) nameEl.value = profile.name;
    if (emailEl && profile.email) emailEl.value = profile.email;
    if (phoneEl && profile.phone) phoneEl.value = profile.phone;
    if (streetEl && profile.address && profile.address.street) streetEl.value = profile.address.street;
    if (buildingEl && profile.address && profile.address.building) buildingEl.value = profile.address.building;
    if (aptEl && profile.address && profile.address.apartment) aptEl.value = profile.address.apartment;

    function showMessage(text, type = 'success') {
      if (!msgBox) return;
      msgBox.innerHTML = `<div class="${type === 'success' ? 'text-success' : 'text-danger'}">${text}</div>`;
    }

    function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim()); }

    if (saveBtn) {
      saveBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = nameEl ? nameEl.value.trim() : '';
        const emailRaw = emailEl ? emailEl.value.trim() : '';
        const email = emailRaw.toLowerCase();
        const phone = phoneEl ? phoneEl.value.trim() : '';
        const street = streetEl ? streetEl.value.trim() : '';
        const building = buildingEl ? buildingEl.value.trim() : '';
        const apartment = aptEl ? aptEl.value.trim() : '';
        const password = passwordEl ? passwordEl.value : '';
        const confirm = confirmEl ? confirmEl.value : '';

        if (!name) { showMessage('Please enter your name', 'error'); if (nameEl) nameEl.focus(); return; }
        if (!validEmail(email)) { showMessage('Please enter a valid email address', 'error'); if (emailEl) emailEl.focus(); return; }
        if (!street) { showMessage('Please enter street for delivery address', 'error'); if (streetEl) streetEl.focus(); return; }
        if (password || confirm) {
          if (password.length < 6) { showMessage('Password should be at least 6 characters', 'error'); if (passwordEl) passwordEl.focus(); return; }
          if (password !== confirm) { showMessage('Passwords do not match', 'error'); if (confirmEl) confirmEl.focus(); return; }
        }

        try {
          const allUsers = getUsers();
          const oldEmail = loggedEmail;
          const userObj = {
            name,
            email,
            phone,
            address: { street, building, apartment },
            updatedAt: new Date().toISOString()
          };
          if (password) userObj.password = password; // demo only

          if (oldEmail !== email) {
            if (allUsers[oldEmail]) delete allUsers[oldEmail];
          }
          allUsers[email] = userObj;
          saveUsers(allUsers);
          setLoggedInUser(name, email);
          showMessage('Profile saved successfully', 'success');
          if (passwordEl) passwordEl.value = '';
          if (confirmEl) confirmEl.value = '';
        } catch (err) {
          console.error(err);
          showMessage('Failed to save profile. See console for details', 'error');
        }
      });
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearLoggedIn();
        window.location.href = 'auth.html';
      });
    }
  });

})();
