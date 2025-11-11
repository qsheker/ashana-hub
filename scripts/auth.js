// Helper auth utilities (localStorage)
const authKey = 'currentUser';
const usersKey = 'users';

// Normalize users storage to an object map keyed by lowercased email.
// For backwards compatibility this will accept either an array or an object
// and always return an object: { 'email@domain': userObj }
function getUsers() {
    try {
        const raw = localStorage.getItem(usersKey);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            // convert array -> map
            const map = {};
            parsed.forEach(u => {
                try {
                    if (u && u.email) map[u.email.toLowerCase()] = u;
                } catch (e) { /* ignore malformed user */ }
            });
            return map;
        }
        if (parsed && typeof parsed === 'object') return parsed;
        return {};
    } catch (e) {
        return {};
    }
}

// Save as object map keyed by lowercased email
function saveUsers(users) {
    try {
        localStorage.setItem(usersKey, JSON.stringify(users || {}));
    } catch (e) {
        // ignore
    }
}

function setCurrentUser(user) {
    localStorage.setItem(authKey, JSON.stringify(user));
}

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem(authKey));
    } catch (e) {
        return null;
    }
}

function logout() {
    localStorage.removeItem(authKey);
}

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (themeIcon && currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            localStorage.setItem('theme', 'light');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
    });
}

// Redirect if already logged in: prevent opening auth/register pages when logged in
(function enforceAuthRedirects() {
    const cur = getCurrentUser();
    const path = window.location.pathname.toLowerCase();
    if (cur) {
        // If on login or register page, redirect to profile
        if (path.endsWith('/auth.html') || path.endsWith('/register.html') || path.endsWith('\\auth.html') || path.endsWith('\\register.html')) {
            window.location.href = 'profile.html';
        }
    } else {
        // If not logged in and on profile.html, redirect to auth
        if (path.endsWith('/profile.html') || path.endsWith('\\profile.html') || path.endsWith('profile.html')) {
            window.location.href = 'auth.html';
        }
    }
})();

// Password visibility toggle (works on pages that have #togglePassword)
const toggleBtn = document.getElementById('togglePassword');
if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
        const passwordField = document.getElementById('Password');
        const icon = this.querySelector('i');
        if (!passwordField) return;
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordField.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

// Remember me functionality
document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('Email');
    const rememberCheckbox = document.getElementById('Remember');

    if (emailInput && localStorage.getItem('rememberedEmail')) {
        emailInput.value = localStorage.getItem('rememberedEmail');
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }

    if (rememberCheckbox && emailInput) {
        rememberCheckbox.addEventListener('change', () => {
            if (rememberCheckbox.checked) {
                localStorage.setItem('rememberedEmail', emailInput.value);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
        });
        // keep remembered email updated when typing
        emailInput.addEventListener('input', () => {
            if (rememberCheckbox.checked) localStorage.setItem('rememberedEmail', emailInput.value);
        });
    }
});

// Dynamic greeting insertion (unchanged)
document.addEventListener('DOMContentLoaded', () => {
    const hours = new Date().getHours();
    const greeting = document.createElement('div');
    greeting.className = 'greeting';

    switch (true) {
        case (hours < 12):
            greeting.textContent = "Good morning! Ready for breakfast?";
            greeting.style.backgroundColor = '#FFF9C4';
            greeting.style.color = '#333';
            break;
        case (hours < 18):
            greeting.textContent = "Good afternoon! Feeling hungry?";
            greeting.style.backgroundColor = '#BBDEFB';
            greeting.style.color = '#333';
            break;
        default:
            greeting.textContent = "Good evening! Late dinner time?";
            greeting.style.backgroundColor = '#D7CCC8';
            greeting.style.color = '#333';
            break;
    }

    // Adjust greeting colors for dark mode
    if (document.body.classList.contains('dark-mode')) {
        greeting.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    }

    const main = document.querySelector('main');
    if (main) main.prepend(greeting);
});

// Login form submission: verify against stored users
$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        const btn = $('#submitBtn');
        btn.prop('disabled', true);
        btn.html('<i class="fas fa-spinner fa-spin"></i> Please wait...');

        const email = $('#Email').val().trim();
        const password = $('#Password').val();

        let isValid = true;
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            $('#Email').css('border-color', 'red');
            isValid = false;
        } else {
            $('#Email').css('border-color', '');
        }
        if (password.length < 6) {
            $('#Password').css('border-color', 'red');
            isValid = false;
        } else {
            $('#Password').css('border-color', '');
        }
        if (!isValid) {
            setTimeout(() => {
                btn.prop('disabled', false);
                btn.html('Sign in');
            }, 800);
            return;
        }

    const users = getUsers();
    const user = users[email.toLowerCase()] || null;
        setTimeout(() => {
            btn.prop('disabled', false);
            btn.html('Sign in');
            const msgEl = $('#formMessage');
            msgEl.text('');
            if (user) {
                if (user.password === password) {
                    setCurrentUser({ name: user.name, email: user.email });
                    // redirect to profile
                    window.location.href = 'profile.html';
                } else {
                    msgEl.removeClass('text-success').addClass('text-danger');
                    msgEl.text('Incorrect password. Please try again.');
                    $('#Password').focus();
                }
            } else {
                msgEl.removeClass('text-success').addClass('text-danger');
                msgEl.text('No account found with this email. Please register.');
                $('#Email').focus();
            }
        }, 800);
    });

    // Registration form submission (if present on page)
    $('#registerForm').on('submit', function (e) {
        e.preventDefault();
        const btn = $('#submitBtn');
        btn.prop('disabled', true);
        btn.html('<i class="fas fa-spinner fa-spin"></i> Creating...');

        const name = $('#FullName').val().trim();
        const email = $('#Email').val().trim();
        const password = $('#Password').val();
        const confirm = $('#ConfirmPassword').val();

        const msgEl = $('#formMessage');
        msgEl.text('');

        // Validate and show the first error inline
        if (!name) {
            $('#FullName').css('border-color', 'red');
            msgEl.text('Full name is required.');
            $('#FullName').focus();
            btn.prop('disabled', false); btn.html('Sign up');
            return;
        } else { $('#FullName').css('border-color', ''); }
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            $('#Email').css('border-color', 'red');
            msgEl.text('Please enter a valid email address.');
            $('#Email').focus();
            btn.prop('disabled', false); btn.html('Sign up');
            return;
        } else { $('#Email').css('border-color', ''); }
        if (password.length < 6) {
            $('#Password').css('border-color', 'red');
            msgEl.text('Password must be at least 6 characters.');
            $('#Password').focus();
            btn.prop('disabled', false); btn.html('Sign up');
            return;
        } else { $('#Password').css('border-color', ''); }
        if (password !== confirm) {
            $('#ConfirmPassword').css('border-color', 'red');
            msgEl.text('Passwords do not match.');
            $('#ConfirmPassword').focus();
            btn.prop('disabled', false); btn.html('Sign up');
            return;
        } else { $('#ConfirmPassword').css('border-color', ''); }

        const users = getUsers();
        if (users[email.toLowerCase()]) {
            const msgEl2 = $('#formMessage');
            msgEl2.removeClass('text-success').addClass('text-danger');
            msgEl2.text('An account with this email already exists. Try logging in.');
            btn.prop('disabled', false); btn.html('Sign up');
            $('#Email').focus();
            return;
        }

        const newUser = { name, email, password };
        users[email.toLowerCase()] = newUser;
        saveUsers(users);
        setCurrentUser({ name, email });
        setTimeout(() => {
            // redirect to profile
            window.location.href = 'profile.html';
        }, 600);
    });
});