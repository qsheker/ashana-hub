// Theme Toggle Functionality
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or default to light mode
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });

     
        // Form Submission
        $('#loginForm').on('submit', function(e) {
            e.preventDefault();
            const btn = $('#submitBtn');
            btn.prop('disabled', true);
            btn.html('<i class="fas fa-spinner fa-spin"></i> Please wait...');
            
            // Form validation
            const email = $('#Email').val();
            const password = $('#Password').val();
            let isValid = true;
            
            // Email validation
            if (!email.match(/^\S+@\S+\.\S+$/)) {
                $('#Email').css('border-color', 'red');
                isValid = false;
            } else {
                $('#Email').css('border-color', '');
            }
            
            // Password validation
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
                }, 1000);
                return;
            }
            
            // Simulate form submission
            setTimeout(() => {
                btn.prop('disabled', false);
                btn.html('Sign in');
                alert('Login successful!');
            }, 2000);
        });

        // Password visibility toggle
        document.getElementById('togglePassword').addEventListener('click', function() {
            const passwordField = document.getElementById('Password');
            const icon = this.querySelector('i');
            
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

        // Remember me functionality
        document.addEventListener('DOMContentLoaded', () => {
            const emailInput = document.getElementById('Email');
            const rememberCheckbox = document.getElementById('Remember');

            if (localStorage.getItem('rememberedEmail')) {
                emailInput.value = localStorage.getItem('rememberedEmail');
                rememberCheckbox.checked = true;
            }

            rememberCheckbox.addEventListener('change', () => {
                if (rememberCheckbox.checked) {
                    localStorage.setItem('rememberedEmail', emailInput.value);
                } else {
                    localStorage.removeItem('rememberedEmail');
                }
            });
        });

        // Dynamic greeting
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