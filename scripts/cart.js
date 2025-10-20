document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();


  document.querySelectorAll('.cart-plus').forEach(button => {
    button.addEventListener('click', () => {
      const qtySpan = button.previousElementSibling;
      let qty = parseInt(qtySpan.textContent);
      qtySpan.textContent = qty + 1;
      updateCartCount();
    });
  });

  document.querySelectorAll('.cart-minus').forEach(button => {
    button.addEventListener('click', () => {
      const qtySpan = button.nextElementSibling;
      let qty = parseInt(qtySpan.textContent);
      if (qty > 1) {
        qtySpan.textContent = qty - 1;
        updateCartCount();
      }
    });
  });

  document.querySelectorAll('.cart-remove').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.cart-item');
      item.remove();
      updateCartCount();
    });
  });

  document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();
    alert('Checkout complete!');
  });
});

function updateCartCount() {
  const items = document.querySelectorAll('.cart-item');
  document.getElementById('cart-count').textContent = items.length;
}
document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.accordion-toggle');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const content = toggle.nextElementSibling;
      content.classList.toggle('show');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const addSound = document.getElementById('add-sound');
  const removeSound = document.getElementById('remove-sound');

  document.querySelectorAll('.cart-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      if (addSound) addSound.play();
    });
  });

  document.querySelectorAll('.cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      if (removeSound) removeSound.play();
    });
  });
});
