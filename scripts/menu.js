document.addEventListener('DOMContentLoaded', function() {
  initOrderButtons();
});
// If script was loaded after DOMContentLoaded fired (dynamic script insertion),
// ensure handlers are initialized immediately.
if (document.readyState !== 'loading') {
  initOrderButtons();
}

/* Descriptions are shown by default in the menu; no toggle buttons needed. */

function initOrderButtons() {
  const orderButtons = document.querySelectorAll('.order-btn');

  orderButtons.forEach(button => {
    // remove previous handlers to avoid duplicates when re-initializing
    button.replaceWith(button.cloneNode(true));
  });

  // re-query after clone
  const freshButtons = document.querySelectorAll('.order-btn');
  freshButtons.forEach(button => {
    button.addEventListener('click', function() {
      const foodItem = this.closest('.food-item');
      const nameEl = foodItem.querySelector('.meal-name');
      const itemName = nameEl ? nameEl.textContent.trim() : foodItem.querySelector('h3').textContent.trim();
      const priceEl = foodItem.querySelector('.price i') || foodItem.querySelector('.price');
      const itemPrice = priceEl ? priceEl.textContent.trim() : '$0.00';

      const imgEl = foodItem.querySelector('img');
      const itemImage = imgEl ? imgEl.src : '';
      addToCart(itemName, itemPrice, itemImage);
    });
  });
}

function addToCart(itemName, itemPrice, itemImage = '') {
  const price = parseFloat(itemPrice.replace('$', '')) || 0;

  let cart = JSON.parse(localStorage.getItem('asxanaCart')) || [];
  // try to find existing item by name (case-insensitive)
  const existing = cart.find(c => c.name.toLowerCase() === itemName.toLowerCase());
  if (existing) {
    existing.quantity = (existing.quantity || 1) + 1;
  } else {
    cart.push({
      id: Date.now().toString(),
      name: itemName,
      price: price,
      quantity: 1,
      image: itemImage
    });
  }
  localStorage.setItem('asxanaCart', JSON.stringify(cart));

  // play sound if available
  const addSound = document.getElementById('add-sound');
  if (addSound) addSound.play();

  showNotification(`${itemName} added to cart! - $${price.toFixed(2)}`, 'success');
  // update cart-count in header if present
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const totalQty = cart.reduce((s, it) => s + (it.quantity || 1), 0);
    cartCountEl.textContent = totalQty;
  }
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

// no key handlers required for descriptions (they are always visible)


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

// ---- Menu API integration and pagination (TheMealDB) ----
// Uses TheMealDB free API to fetch meals and render them with pagination.
const API_SEARCH = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const API_FILTER = 'https://www.themealdb.com/api/json/v1/1/filter.php?c='; // fallback
const PAGE_SIZE = 8;

let allMeals = [];
let currentPage = 1;

function randomPrice() {
  return (Math.random() * 8 + 3).toFixed(2);
}

function shortText(text, len = 100) {
  if (!text) return '';
  return text.length > len ? text.slice(0, len).trim() + '...' : text;
}

async function fetchMeals(query = '') {
  const q = (query || '').trim();
  try {
    const res = await fetch(API_SEARCH + encodeURIComponent(q));
    const data = await res.json();
    if (data && data.meals) {
      allMeals = data.meals.map(m => ({
        id: m.idMeal,
        name: m.strMeal,
        thumb: m.strMealThumb,
        category: m.strCategory,
        area: m.strArea,
        instructions: m.strInstructions,
        price: '$' + randomPrice()
      }));
    } else {
      // fallback: use a few categories to get some items
      const categories = ['Beef', 'Chicken', 'Seafood', 'Vegetarian'];
      let items = [];
      for (const c of categories) {
        try {
          const r = await fetch(API_FILTER + encodeURIComponent(c));
          const d = await r.json();
          if (d && d.meals) items = items.concat(d.meals);
        } catch (e) { /* ignore per-category errors */ }
      }
      allMeals = items.slice(0, 60).map(m => ({
        id: m.idMeal,
        name: m.strMeal,
        thumb: m.strMealThumb,
        category: '',
        area: '',
        instructions: '',
        price: '$' + randomPrice()
      }));
    }
  } catch (e) {
    console.error('Failed to fetch meals', e);
    allMeals = [];
  }
  currentPage = 1;
  renderPage(currentPage);
  renderPagination();
}

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe.replace(/[&<>\"]+/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]);
  });
}

function renderPage(page = 1) {
  const list = document.getElementById('foodList');
  if (!list) return;
  list.innerHTML = '';
  const start = (page - 1) * PAGE_SIZE;
  const slice = allMeals.slice(start, start + PAGE_SIZE);

  if (!slice.length) {
    list.innerHTML = '<p style="text-align:center;color:#666;">No meals found.</p>';
    return;
  }

  slice.forEach((meal, idx) => {
    const item = document.createElement('div');
    item.className = 'food-item appear';
    item.innerHTML = `
      <img src="${meal.thumb || 'https://via.placeholder.com/400x240?text=No+image'}" alt="${escapeHtml(meal.name)}">
      <h3><span class="meal-name">${escapeHtml(meal.name)}</span> <span class="price"><i>${meal.price}</i></span></h3>
      <p class="short-description">${escapeHtml(shortText(meal.instructions || meal.category || 'Delicious meal from TheMealDB'))}</p>
      <div style="margin:8px 0;">
        <button class="order-btn appear-btn">Order Now</button>
      </div>
    `;
    // stagger animation slightly per item for nicer effect
    item.style.animationDelay = (idx * 60) + 'ms';
    list.appendChild(item);
    // set stagger for button inside (slightly after the card)
    const btn = item.querySelector('.order-btn');
    if (btn) btn.style.animationDelay = (idx * 60 + 120) + 'ms';
  });

  // Initialize order button handlers for newly created items
  initOrderButtons();
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  pagination.innerHTML = '';
  const total = allMeals.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const prev = document.createElement('button');
  prev.innerHTML = '&#8592; Prev';
  prev.className = 'pagination-btn btn btn-outline-secondary';
  prev.setAttribute('aria-label', 'Previous page');
  prev.dataset.type = 'prev';
  prev.disabled = currentPage <= 1;
  prev.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderPage(currentPage);
      renderPagination();
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  });
  pagination.appendChild(prev);

  const info = document.createElement('span');
  info.style.margin = '0 8px';
  info.style.color = '#666';
  info.textContent = `Page ${currentPage} / ${totalPages}`;
  pagination.appendChild(info);

  const next = document.createElement('button');
  next.innerHTML = 'Next &#8594;';
  next.className = 'pagination-btn btn btn-outline-secondary';
  next.setAttribute('aria-label', 'Next page');
  next.dataset.type = 'next';
  next.disabled = currentPage >= totalPages;
  next.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderPage(currentPage);
      renderPagination();
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  });
  pagination.appendChild(next);
}

// debounce helper
function debounce(fn, delay) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Wire up the search input (if present)
function wireSearchAndLoad() {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    const handler = debounce(() => {
      fetchMeals(searchInput.value.trim());
    }, 350);
    searchInput.addEventListener('input', handler);
  }

  // initial fetch
  fetchMeals('');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireSearchAndLoad);
} else {
  // DOM already ready (script may have been inserted dynamically)
  wireSearchAndLoad();
}