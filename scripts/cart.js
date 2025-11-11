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

    // small helper to escape HTML in templates
    function escapeHtml(unsafe) {
      if (!unsafe) return '';
      return String(unsafe).replace(/[&<>\"]/g, function (c) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]);
      });
    }

// Cart Functionality: render from localStorage and keep it authoritative
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  // Card type selection
  document.querySelectorAll('.card-type button').forEach(button => {
    button.addEventListener('click', function() {
      document.querySelectorAll('.card-type button').forEach(btn => {
        btn.classList.remove('active');
      });
      this.classList.add('active');
    });
  });

  // Checkout form
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // simple validation kept as before
      const name = document.getElementById('name').value;
      const cardNumber = document.getElementById('card-number').value;
      const date = document.getElementById('date').value;
      const cvv = document.getElementById('cvv').value;
      let isValid = true;
      if (name.trim().length < 2) { document.getElementById('name').style.borderColor = 'red'; isValid = false;} else { document.getElementById('name').style.borderColor = ''; }
      if (!cardNumber.match(/^\d{4} \d{4} \d{4} \d{4}$/)) { document.getElementById('card-number').style.borderColor = 'red'; isValid = false; } else { document.getElementById('card-number').style.borderColor = ''; }
      if (!date.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) { document.getElementById('date').style.borderColor = 'red'; isValid = false; } else { document.getElementById('date').style.borderColor = ''; }
      if (!cvv.match(/^\d{3,4}$/)) { document.getElementById('cvv').style.borderColor = 'red'; isValid = false; } else { document.getElementById('cvv').style.borderColor = ''; }

      if (!isValid) return;
      const btn = document.querySelector('.btn-checkout');
      btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      setTimeout(() => { btn.disabled = false; btn.innerHTML = 'Checkout'; alert('Checkout complete! Thank you for your order.'); clearCart(); renderCart(); }, 1200);
    });
  }
});

function getCart() {
  return JSON.parse(localStorage.getItem('asxanaCart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('asxanaCart', JSON.stringify(cart));
}

function clearCart() {
  localStorage.removeItem('asxanaCart');
}

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const cartCountEl = document.getElementById('cart-count');
  const totalEl = document.getElementById('cart-total');
  if (!container) return;
  container.innerHTML = '';

  if (!cart.length) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>Add some delicious items from our menu</p>
      </div>`;
    if (cartCountEl) cartCountEl.textContent = '0';
    if (totalEl) totalEl.textContent = '$0.00';
    return;
  }

  let total = 0;
  let totalQty = 0;
  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.dataset.id = item.id || item.name;
    itemEl.dataset.price = item.price;

    itemEl.innerHTML = `
      <div class="item-info">
        <img src="${item.image || 'https://via.placeholder.com/300x200?text=Food'}" alt="${escapeHtml(item.name)}" class="item-image">
        <div class="item-details">
          <h3>${escapeHtml(item.name)}</h3>
          <div class="item-description">${escapeHtml(item.description || '')}</div>
          <div class="item-price">$${Number(item.price).toFixed(2)}</div>
        </div>
      </div>
      <div class="item-controls">
        <button class="quantity-btn cart-minus" type="button" aria-label="Decrease"><i class="fas fa-minus"></i></button>
        <span class="quantity-display cart-qty">${item.quantity}</span>
        <button class="quantity-btn cart-plus" type="button" aria-label="Increase"><i class="fas fa-plus"></i></button>
        <button class="remove-btn cart-remove" type="button" aria-label="Remove"><i class="fas fa-times"></i></button>
      </div>
    `;

    container.appendChild(itemEl);

    total += Number(item.price) * (item.quantity || 1);
    totalQty += (item.quantity || 1);
  });

  if (cartCountEl) cartCountEl.textContent = totalQty;
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

  // attach handlers
  container.querySelectorAll('.cart-plus').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemEl = this.closest('.cart-item');
      const id = itemEl.dataset.id;
      changeQuantity(id, 1);
    });
  });
  container.querySelectorAll('.cart-minus').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemEl = this.closest('.cart-item');
      const id = itemEl.dataset.id;
      changeQuantity(id, -1);
    });
  });
  container.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const itemEl = this.closest('.cart-item');
      const id = itemEl.dataset.id;
      removeItem(id);
    });
  });
}

function changeQuantity(id, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => (i.id || i.name) == id);
  if (idx === -1) return;
  cart[idx].quantity = Math.max(1, (cart[idx].quantity || 1) + delta);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(i => (i.id || i.name) != id);
  saveCart(cart);
  const removeSound = document.getElementById('remove-sound');
  if (removeSound) removeSound.play();
  renderCart();
}

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