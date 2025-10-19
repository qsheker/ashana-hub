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


const randomFacts = [
  {
    content: "Food is not just nutrition, it's an art that brings people together.",
    author: "Chef Asxana",
    category: "philosophy"
  },
  {
    content: "The best dishes are created with love and attention to detail.",
    author: "Culinary Wisdom",
    category: "cooking"
  },
  {
    content: "Donerhub was created after 3 months of sauce experiments!",
    author: "AsxanaHub History",
    category: "fact"
  },
  {
    content: "Our CodeCoffee contains 20% more caffeine than regular coffee.",
    author: "Barista Ali",
    category: "secret"
  },
  {
    content: "Vibeshake was originally called 'Mood Cocktail'.",
    author: "Naming Facts",
    category: "history"
  },
  {
    content: "MVP-Burger got its name after helping close an important business deal.",
    author: "AsxanaHub Legend",
    category: "history"
  },
  {
    content: "The secret ingredient in Startup Fries is a pinch of innovation!",
    author: "Innovator Chef",
    category: "secret"
  },
  {
    content: "Cherry Cheesecake is baked for exactly 4 hours 20 minutes - the magical time for perfect flavor.",
    author: "Pastry Chef Maria",
    category: "technique"
  },
  {
    content: "Every cup of CodeCoffee comes with a random programming fact.",
    author: "Tradition",
    category: "feature"
  },
  {
    content: "Our kitchen uses only seasonal products from local farmers.",
    author: "Eco Policy",
    category: "quality"
  },
  {
    content: "The packaging design is inspired by minimalism and functionality.",
    author: "Designer Aigerim",
    category: "design"
  },
  {
    content: "The music in the kitchen is selected to match the type of dish being prepared.",
    author: "Atmosphere",
    category: "detail"
  }
];

class RandomFacts {
  constructor() {
    this.facts = randomFacts;
    this.lastFactIndex = -1;
    this.init();
  }

  init() {
    const button = document.getElementById('randomFactBtn');
    const factContainer = document.getElementById('randomFact');
    
    if (button && factContainer) {
      button.addEventListener('click', () => this.showRandomFact());
      
      setTimeout(() => {
        this.showRandomFact();
      }, 2000);
    }
  }

  getRandomFact() {
    let randomIndex;
    
    do {
      randomIndex = Math.floor(Math.random() * this.facts.length);
    } while (randomIndex === this.lastFactIndex && this.facts.length > 1);
    
    this.lastFactIndex = randomIndex;
    return this.facts[randomIndex];
  }

  async showRandomFact() {
    const button = document.getElementById('randomFactBtn');
    const factContainer = document.getElementById('randomFact');
    
    if (!button || !factContainer) return;

    button.classList.add('loading', 'pulse');
    button.innerHTML = 'Loading...';

    await this.delay(800);

    const fact = this.getRandomFact();
    

    factContainer.innerHTML = `
      <div class="random-fact-content">
        ${fact.content}
      </div>
      <div class="random-fact-author">— ${fact.author}</div>
      <div class="random-fact-category">#${fact.category}</div>
    `;

    factContainer.classList.add('show');

    button.classList.remove('loading', 'pulse');
    button.innerHTML = 'Show another fact';
    this.autoHideFact();
  }

  autoHideFact() {
    setTimeout(() => {
      const factContainer = document.getElementById('randomFact');
      if (factContainer) {
        factContainer.classList.remove('show');
      }
    }, 10000);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  addFact(content, author = "AsxanaHub", category = "факт") {
    this.facts.push({ content, author, category });
  }

  getFactsCount() {
    return this.facts.length;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  window.randomFactsApp = new RandomFacts();
  
  window.showRandomFact = function() {
    if (window.randomFactsApp) {
      window.randomFactsApp.showRandomFact();
    }
  };
});

const FactUtils = {
  getFactByCategory(category) {
    const filteredFacts = randomFacts.filter(fact => 
      fact.category.toLowerCase() === category.toLowerCase()
    );
    return filteredFacts.length > 0 
      ? filteredFacts[Math.floor(Math.random() * filteredFacts.length)]
      : null;
  },

  getCategories() {
    return [...new Set(randomFacts.map(fact => fact.category))];
  },

  searchFacts(keyword) {
    return randomFacts.filter(fact => 
      fact.content.toLowerCase().includes(keyword.toLowerCase()) ||
      fact.author.toLowerCase().includes(keyword.toLowerCase())
    );
  }
};