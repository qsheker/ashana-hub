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

        // Discount Data
        const discounts = [
            {
                id: 1,
                title: "Family Feast Deal",
                description: "Perfect for family dinners. Includes 2 large pizzas, garlic bread, and a 1.5L drink.",
                originalPrice: 45.99,
                discountedPrice: 34.99,
                discount: "24% OFF",
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                timeRemaining: "2 days left"
            },
            {
                id: 2,
                title: "Weekend Breakfast Special",
                description: "Start your weekend right with our breakfast combo. Pancakes, eggs, bacon and coffee.",
                originalPrice: 18.50,
                discountedPrice: 12.99,
                discount: "30% OFF",
                image: "https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                timeRemaining: "3 days left"
            },
            {
                id: 3,
                title: "Burger Combo",
                description: "Two juicy burgers with fries and drinks. Perfect for lunch with a friend.",
                originalPrice: 22.00,
                discountedPrice: 16.50,
                discount: "25% OFF",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                timeRemaining: "1 day left"
            },
            {
                id: 4,
                title: "Pasta Night Special",
                description: "Enjoy our chef's special pasta with garlic bread and a house salad.",
                originalPrice: 24.99,
                discountedPrice: 18.75,
                discount: "25% OFF",
                image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                timeRemaining: "5 days left"
            },
            {
                id: 5,
                title: "Dessert Delight",
                description: "Indulge in our signature desserts. Chocolate lava cake, cheesecake, and ice cream.",
                originalPrice: 15.99,
                discountedPrice: 10.99,
                discount: "31% OFF",
                image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                timeRemaining: "4 days left"
            },
            {
                id: 6,
                title: "Healthy Lunch Bowl",
                description: "Fresh, nutritious bowl with quinoa, roasted vegetables, avocado and protein of choice.",
                originalPrice: 16.50,
                discountedPrice: 12.50,
                discount: "24% OFF",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                timeRemaining: "6 days left"
            }
        ];

        // Generate Discount Cards
        function generateDiscountCards() {
            const discountGrid = document.getElementById('discountGrid');
            discountGrid.innerHTML = '';
            
            discounts.forEach(discount => {
                const discountCard = document.createElement('div');
                discountCard.className = 'discount-card';
                discountCard.innerHTML = `
                    <div class="discount-badge pulse">${discount.discount}</div>
                    <img src="${discount.image}" alt="${discount.title}" class="discount-image">
                    <div class="discount-content">
                        <h3 class="discount-title">${discount.title}</h3>
                        <p class="discount-description">${discount.description}</p>
                        <div class="discount-price">
                            <span class="original-price">$${discount.originalPrice.toFixed(2)}</span>
                            <span class="discounted-price">$${discount.discountedPrice.toFixed(2)}</span>
                        </div>
                        <div class="discount-actions">
                            <button class="btn-add-to-cart" data-id="${discount.id}">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                            <span class="time-remaining">${discount.timeRemaining}</span>
                        </div>
                    </div>
                `;
                discountGrid.appendChild(discountCard);
            });
            
            // Add event listeners to Add to Cart buttons
            document.querySelectorAll('.btn-add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const discountId = this.getAttribute('data-id');
                    const discount = discounts.find(d => d.id == discountId);
                    if (!discount) return;

                    // Add to cart using discounted price
                    addToCartFromDiscount(discount, 1);

                    // Show styled notification (reuse menu style)
                    showNotification(`${discount.title} added to cart`, 'success');

                    // Visual feedback
                    this.innerHTML = '<i class="fas fa-check"></i> Added!';
                    this.style.backgroundColor = 'var(--success-color)';

                    setTimeout(() => {
                        this.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                        this.style.backgroundColor = '';
                    }, 1200);

                    console.log(`Added discount item ${discount.title} (discounted $${discount.discountedPrice}) to cart`);
                });
            });
        }

        // Add a discount item into the cart stored in localStorage (asxanaCart)
        function addToCartFromDiscount(discountItem, qty = 1) {
            try {
                const key = 'asxanaCart';
                const raw = localStorage.getItem(key) || '[]';
                const cart = JSON.parse(raw);
                const idKey = discountItem.id || discountItem.title;
                const idx = cart.findIndex(i => (i.id || i.name) == idKey);
                const itemToSave = {
                    id: discountItem.id,
                    name: discountItem.title,
                    description: discountItem.description,
                    image: discountItem.image,
                    // store discounted price
                    price: Number(discountItem.discountedPrice),
                    quantity: qty
                };
                if (idx >= 0) {
                    // increase quantity
                    cart[idx].quantity = (cart[idx].quantity || 1) + qty;
                    // ensure price stored is the discounted price
                    cart[idx].price = Number(discountItem.discountedPrice);
                } else {
                    cart.push(itemToSave);
                }
                localStorage.setItem(key, JSON.stringify(cart));

                // Optionally update a cart counter in the UI if present
                const cartCount = document.getElementById('cart-count');
                if (cartCount) {
                    const totalQty = cart.reduce((s, it) => s + (it.quantity || 0), 0);
                    cartCount.textContent = totalQty;
                }
            } catch (err) {
                console.error('Failed to add discount item to cart', err);
            }
        }

        // Reuse the styled slide-in notification used in menu.js
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#28a745' : '#007bff'};
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 1000;
                font-family: 'Montserrat', sans-serif;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                transform: translateX(100%);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(notification);
            setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 100);
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
            }, 2200);
        }

        // Animated counters
        function animateCounters() {
            const counters = document.querySelectorAll('.count-up');
            const speed = 200;
            
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const increment = target / speed;
                
                if (count < target) {
                    counter.innerText = Math.ceil(count + increment);
                    setTimeout(() => animateCounters(), 1);
                } else {
                    counter.innerText = target;
                }
            });
        }

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            generateDiscountCards();
        });