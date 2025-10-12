document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();

  document.querySelectorAll('.increase').forEach(button => {
    button.addEventListener('click', () => {
      const countSpan = button.previousElementSibling;
      let count = parseInt(countSpan.textContent);
      countSpan.textContent = count + 1;
      updateCartCount();
    });
  });

  document.querySelectorAll('.decrease').forEach(button => {
    button.addEventListener('click', () => {
      const countSpan = button.nextElementSibling;
      let count = parseInt(countSpan.textContent);
      if (count > 1) {
        countSpan.textContent = count - 1;
        updateCartCount();
      }
    });
  });

  document.querySelectorAll('.remove-btn').forEach(button => {
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