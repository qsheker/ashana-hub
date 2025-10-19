document.addEventListener('DOMContentLoaded', function() {
    initDescriptionButtons();
    initOrderButtons();
});

function initDescriptionButtons() {
    const descriptionButtons = document.querySelectorAll('.open-description');
    
    descriptionButtons.forEach(button => {
        button.addEventListener('click', function() {
            toggleDescription(this);
        });
    });
}

function toggleDescription(button) {
    const foodItem = button.closest('.food-item');
    const description = foodItem.querySelector('.full-description');
    
    closeAllDescriptionsExcept(description);
    
    description.classList.toggle('open');
    
    if (description.classList.contains('open')) {
        button.textContent = 'Close';
        button.classList.add('open');
    } else {
        button.textContent = 'Open';
        button.classList.remove('open');
    }
}

function closeAllDescriptionsExcept(exceptDescription) {
    const allDescriptions = document.querySelectorAll('.full-description');
    const allButtons = document.querySelectorAll('.open-description');
    
    allDescriptions.forEach(desc => {
        if (desc !== exceptDescription) {
            desc.classList.remove('open');
        }
    });
    
    allButtons.forEach(btn => {
        const btnDescription = btn.closest('.food-item').querySelector('.full-description');
        if (btnDescription !== exceptDescription) {
            btn.textContent = 'Open';
            btn.classList.remove('open');
        }
    });
}

function initOrderButtons() {
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const foodItem = this.closest('.food-item');
            const itemName = foodItem.querySelector('h3').textContent.split(' -')[0];
            const itemPrice = foodItem.querySelector('.price i').textContent;
            
            addToCart(itemName, itemPrice);
        });
    });
}

function addToCart(itemName, itemPrice) {
    const price = parseFloat(itemPrice.replace('$', ''));
    
    showNotification(`${itemName} added to cart! - ${itemPrice}`, 'success');
    
    console.log(`Added to cart: ${itemName} - ${itemPrice}`);
    
    const cartItem = {
        name: itemName,
        price: price,
        quantity: 1,
        timestamp: new Date().toISOString()
    };
    
    let cart = JSON.parse(localStorage.getItem('asxanaCart')) || [];
    cart.push(cartItem);
    localStorage.setItem('asxanaCart', JSON.stringify(cart));
}

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
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAllDescriptionsExcept(null);
    }
});