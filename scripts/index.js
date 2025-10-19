class EventHandlers {
    constructor() {
        this.currentLanguage = 'en';
        this.currentFilter = 'all';
        this.currentStep = 1;
        this.backgrounds = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
        ];
        this.currentBgIndex = 0;
        this.specialOffers = [
            "Today's Special: Get 20% OFF on all burgers!",
            "Hot Deal: Buy one Donerhub, get one FREE!",
            "Special: Free CodeCoffee with any order over $10!",
            "Limited: 30% OFF on all shakes this hour!",
            "Exclusive: MVP-Burger at half price for next 30 minutes!"
        ];
        
        this.translations = {
            en: {
                'about.title': 'About Us',
                'about.description': 'At Asxana.hub, we believe that food is more than just a meal — it is an experience. Our mission is to bring you delicious, fresh, and high-quality dishes that make every bite enjoyable.',
                'menu.title': 'Best Foods',
                'background.title': 'Background',
                'feedback.title': 'Feedback Form',
                'feedback.name': 'Your Name',
                'feedback.email': 'Email',
                'feedback.message': 'Your Message',
                'clock.title': 'Current Date & Time',
                'keyboard.hint': 'Press keys 1-3 to change background, F1 for help',
                'offers.title': 'Special Offers',
                'reviews.title': 'Reviews'
            },
            ru: {
                'about.title': 'О Нас',
                'about.description': 'В Asxana.hub мы считаем, что еда - это не просто прием пищи, это опыт. Наша миссия - предложить вам вкусные, свежие и качественные блюда, которые делают каждый укус приятным.',
                'menu.title': 'Лучшие Блюда',
                'background.title': 'Фон',
                'feedback.title': 'Форма Обратной Связи',
                'feedback.name': 'Ваше Имя',
                'feedback.email': 'Email',
                'feedback.message': 'Ваше Сообщение',
                'clock.title': 'Текущие Дата и Время',
                'keyboard.hint': 'Нажмите клавиши 1-3 для смены фона, F1 для помощи',
                'offers.title': 'Специальные Предложения',
                'reviews.title': 'Отзывы'
            },
            kz: {
                'about.title': 'Біз Туралы',
                'about.description': 'Asxana.hub-та біз тамақтың тек тамақ емес, тәжірибе екеніне сенеміз. Біздің миссиямыз - әр түсіруді ләззатты ететін дәмді, жаңа және жоғары сапалы тағамдарды ұсыну.',
                'menu.title': 'Үздік Тағамдар',
                'background.title': 'Фон',
                'feedback.title': 'Кері Байланыс Формасы',
                'feedback.name': 'Атыңыз',
                'feedback.email': 'Email',
                'feedback.message': 'Хабарламаңыз',
                'clock.title': 'Ағымдағы Күн мен Уақыт',
                'keyboard.hint': 'Фонды өзгерту үшін 1-3 пернелерін басыңыз, көмек үшін F1',
                'offers.title': 'Арнайы Ұсыныстар',
                'reviews.title': 'Пікірлер'
            }
        };

        this.init();
    }

    init() {
        this.initButtonEvents();
        this.initKeyboardEvents();
        this.initFormHandlers();
        this.initFilterSystem();
        this.initLanguageSwitcher();
        this.initClock();
    }

    initButtonEvents() {
        const changeBgBtn = document.getElementById('changeBgBtn');
        if (changeBgBtn) {
            changeBgBtn.addEventListener('click', (e) => {
                this.handleBackgroundChange(e);
            });
        }

        const specialOfferBtn = document.getElementById('specialOfferBtn');
        if (specialOfferBtn) {
            specialOfferBtn.addEventListener('click', (e) => {
                this.handleSpecialOffer(e);
            });
        }

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-order-btn')) {
                this.handleQuickOrder(e);
            }
        });
    }

    initKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardEvents(e);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.showHelpDialog();
            }
        });
    }

    initFormHandlers() {
        const form = document.getElementById('multiStepForm');
        if (form) {
            form.addEventListener('click', (e) => {
                if (e.target.classList.contains('next-step')) {
                    e.preventDefault();
                    this.nextFormStep();
                }
                
                if (e.target.classList.contains('prev-step')) {
                    e.preventDefault();
                    this.prevFormStep();
                }
            });

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e);
            });
        }
    }

    initFilterSystem() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilterChange(e);
            });
        });
    }

    initLanguageSwitcher() {
        const languageSwitch = document.getElementById('languageSwitch');
        if (languageSwitch) {
            languageSwitch.addEventListener('change', (e) => {
                this.handleLanguageChange(e);
            });
        }
    }

    initClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    handleBackgroundChange(e) {
        this.currentBgIndex = (this.currentBgIndex + 1) % this.backgrounds.length;
        document.body.style.background = this.backgrounds[this.currentBgIndex];
        
        e.target.textContent = `Background ${this.currentBgIndex + 1}`;
        setTimeout(() => {
            e.target.textContent = 'Change Background';
        }, 1000);
    }

    handleSpecialOffer(e) {
        const randomOffer = this.specialOffers[Math.floor(Math.random() * this.specialOffers.length)];
        const offerDisplay = document.getElementById('offerDisplay');
        
        if (offerDisplay) {
            offerDisplay.innerHTML = `
                <div class="offer-content">
                    <h4>✨ Special Offer! ✨</h4>
                    <p>${randomOffer}</p>
                    <small>Offer valid for limited time only</small>
                </div>
            `;
            
            e.target.style.transform = 'scale(1.1)';
            setTimeout(() => {
                e.target.style.transform = 'scale(1)';
            }, 300);
        }
    }

    handleQuickOrder(e) {
        const itemName = e.target.getAttribute('data-item');
        const notification = this.showNotification(`${itemName} added to cart!`, 'success');
        
        // Add to cart logic would go here
        console.log(`Quick order: ${itemName}`);
        
        // Visual feedback
        e.target.textContent = '✓ Added!';
        e.target.style.background = '#28a745';
        setTimeout(() => {
            e.target.textContent = 'Quick Order';
            e.target.style.background = '';
        }, 2000);
    }

    handleKeyboardEvents(e) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                this.changeBackgroundByIndex(0);
                break;
            case '2':
                e.preventDefault();
                this.changeBackgroundByIndex(1);
                break;
            case '3':
                e.preventDefault();
                this.changeBackgroundByIndex(2);
                break;
            case 'Escape':
                this.closeAllModals();
                break;
            default:
                this.showKeyPressInfo(e.key);
        }
    }

    handleFilterChange(e) {
        const filter = e.target.getAttribute('data-filter');
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        e.target.classList.add('active');
        
        this.filterFoodItems(filter);
    }

    handleLanguageChange(e) {
        const language = e.target.value;
        this.currentLanguage = language;
        this.translatePage(language);
    }

    filterFoodItems(filter) {
        const foodItems = document.querySelectorAll('.food-item');
        
        foodItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            switch(filter) {
                case 'all':
                    item.classList.remove('hidden');
                    break;
                case 'popular':
                    item.classList.toggle('hidden', category !== 'popular');
                    break;
                case 'new':
                    item.classList.toggle('hidden', category !== 'new');
                    break;
                default:
                    item.classList.remove('hidden');
            }
        });
    }

    nextFormStep() {
        if (this.validateStep(this.currentStep)) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }

    prevFormStep() {
        this.currentStep--;
        this.showStep(this.currentStep);
    }

    showStep(step) {
        document.querySelectorAll('.form-step').forEach(formStep => {
            formStep.classList.remove('active');
        });
        
        const currentStep = document.querySelector(`[data-step="${step}"]`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
    }

    validateStep(step) {
        switch(step) {
            case 1:
                const name = document.getElementById('userName').value;
                if (!name.trim()) {
                    this.showNotification('Please enter your name', 'error');
                    return false;
                }
                return true;
                
            case 2:
                const email = document.getElementById('userEmail').value;
                if (!this.isValidEmail(email)) {
                    this.showNotification('Please enter a valid email', 'error');
                    return false;
                }
                return true;
                
            default:
                return true;
        }
    }

    async handleFormSubmission(e) {
        const formData = {
            name: document.getElementById('userName').value,
            email: document.getElementById('userEmail').value,
            message: document.getElementById('userMessage').value,
            timestamp: new Date().toISOString()
        };

        // Simulate API call with callback
        this.submitFormWithCallback(formData, (response) => {
            this.handleFormResponse(response);
        });
    }

    submitFormWithCallback(formData, callback) {
        setTimeout(() => {
            const response = {
                success: true,
                message: 'Thank you for your feedback! We will get back to you soon.',
                data: formData
            };
            callback(response);
        }, 1500);
    }

    handleFormResponse(response) {
        const formResult = document.getElementById('formResult');
        if (formResult) {
            if (response.success) {
                formResult.className = 'form-result success';
                formResult.innerHTML = `
                    <h4>Success!</h4>
                    <p>${response.message}</p>
                    <small>We appreciate your feedback</small>
                `;
                
                document.getElementById('multiStepForm').reset();
                this.currentStep = 1;
                this.showStep(1);
            }
        }
    }

    changeBackgroundByIndex(index) {
        if (index < this.backgrounds.length) {
            this.currentBgIndex = index;
            document.body.style.background = this.backgrounds[index];
            this.showNotification(`Background changed to theme ${index + 1}`, 'info');
        }
    }

    showKeyPressInfo(key) {
        const keyboardInfo = document.getElementById('keyboardInfo');
        if (keyboardInfo && key.length === 1) {
            keyboardInfo.innerHTML = `<p>Last key pressed: <kbd>${key}</kbd></p>`;
        }
    }

    showHelpDialog() {
        const helpMessage = `
            <div style="position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); 
                       background:white; padding:20px; border-radius:10px; box-shadow:0 0 20px rgba(0,0,0,0.3); z-index:1000;">
                <h3>🎮 Keyboard Shortcuts</h3>
                <ul>
                    <li><kbd>1-3</kbd> - Change background theme</li>
                    <li><kbd>F1</kbd> - Show this help</li>
                    <li><kbd>ESC</kbd> - Close modals</li>
                </ul>
                <button onclick="this.parentElement.remove()">Close</button>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', helpMessage);
    }

    closeAllModals() {
        document.querySelectorAll('[style*="position:fixed"]').forEach(modal => {
            if (modal.innerHTML.includes('Keyboard Shortcuts')) {
                modal.remove();
            }
        });
    }

    translatePage(language) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (this.translations[language] && this.translations[language][key]) {
                element.textContent = this.translations[language][key];
            }
        });
    }

    updateClock() {
        const clock = document.getElementById('clock');
        if (clock) {
            const now = new Date();
            clock.textContent = now.toLocaleString();
        }
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.custom-notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `custom-notification ${type}`;
        notification.innerHTML = `
            <div style="position:fixed; top:20px; right:20px; background:${
                type === 'error' ? '#f8d7da' : type === 'success' ? '#d4edda' : '#d1ecf1'
            }; color:${
                type === 'error' ? '#721c24' : type === 'success' ? '#155724' : '#0c5460'
            }; padding:15px 20px; border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.15); z-index:1000;">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.eventHandlers = new EventHandlers();
});