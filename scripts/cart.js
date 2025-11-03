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

    // Cart Functionality
    document.addEventListener('DOMContentLoaded', () => {
      updateCartCount();
      updateCartTotal();

      // Card type selection
      document.querySelectorAll('.card-type button').forEach(button => {
        button.addEventListener('click', function() {
          document.querySelectorAll('.card-type button').forEach(btn => {
            btn.classList.remove('active');
          });
          this.classList.add('active');
        });
      });

      // Quantity increase
      document.querySelectorAll('.cart-plus').forEach(button => {
        button.addEventListener('click', function() {
          const qtySpan = this.previousElementSibling;
          let qty = parseInt(qtySpan.textContent);
          qtySpan.textContent = qty + 1;
          updateCartCount();
          updateCartTotal();
          
          // Play add sound if available
          const addSound = document.getElementById('add-sound');
          if (addSound) addSound.play();
        });
      });

      // Quantity decrease
      document.querySelectorAll('.cart-minus').forEach(button => {
        button.addEventListener('click', function() {
          const qtySpan = this.nextElementSibling;
          let qty = parseInt(qtySpan.textContent);
          if (qty > 1) {
            qtySpan.textContent = qty - 1;
            updateCartCount();
            updateCartTotal();
          }
        });
      });

      // Remove item
      document.querySelectorAll('.cart-remove').forEach(button => {
        button.addEventListener('click', function() {
          const item = this.closest('.cart-item');
          item.style.opacity = '0';
          item.style.transform = 'translateX(20px)';
          
          setTimeout(() => {
            item.remove();
            updateCartCount();
            updateCartTotal();
            
            // Play remove sound if available
            const removeSound = document.getElementById('remove-sound');
            if (removeSound) removeSound.play();
          }, 300);
        });
      });

      // Form submission
      document.getElementById('checkout-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Form validation
        const name = document.getElementById('name').value;
        const cardNumber = document.getElementById('card-number').value;
        const date = document.getElementById('date').value;
        const cvv = document.getElementById('cvv').value;
        
        let isValid = true;
        
        // Name validation
        if (name.trim().length < 2) {
          document.getElementById('name').style.borderColor = 'red';
          isValid = false;
        } else {
          document.getElementById('name').style.borderColor = '';
        }
        
        // Card number validation (simple)
        if (!cardNumber.match(/^\d{4} \d{4} \d{4} \d{4}$/)) {
          document.getElementById('card-number').style.borderColor = 'red';
          isValid = false;
        } else {
          document.getElementById('card-number').style.borderColor = '';
        }
        
        // Date validation
        if (!date.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
          document.getElementById('date').style.borderColor = 'red';
          isValid = false;
        } else {
          document.getElementById('date').style.borderColor = '';
        }
        
        // CVV validation
        if (!cvv.match(/^\d{3,4}$/)) {
          document.getElementById('cvv').style.borderColor = 'red';
          isValid = false;
        } else {
          document.getElementById('cvv').style.borderColor = '';
        }
        
        if (isValid) {
          const btn = document.querySelector('.btn-checkout');
          btn.disabled = true;
          btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
          
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = 'Checkout';
            alert('Checkout complete! Thank you for your order.');
          }, 2000);
        }
      });
    });

    function updateCartCount() {
      const items = document.querySelectorAll('.cart-item');
      document.getElementById('cart-count').textContent = items.length;
      
      // Show empty cart message if no items
      if (items.length === 0) {
        const cartSection = document.querySelector('.cart-items');
        cartSection.innerHTML = `
          <div class="empty-cart">
            <i class="fas fa-shopping-cart"></i>
            <h3>Your cart is empty</h3>
            <p>Add some delicious items from our menu</p>
          </div>
        `;
      }
    }

    function updateCartTotal() {
      let total = 0;
      document.querySelectorAll('.cart-item').forEach(item => {
        const price = parseFloat(item.dataset.price);
        const quantity = parseInt(item.querySelector('.cart-qty').textContent);
        total += price * quantity;
      });
      document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    }

    // // Progress bar on scroll
    // $(window).on("scroll", function() {
    //   let scrollTop = $(window).scrollTop();
    //   let docHeight = $(document).height() - $(window).height();
    //   let scrollPercent = (scrollTop / docHeight) * 100;

    //   $("#progress-bar").css("width", scrollPercent + "%");
    // });