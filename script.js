const products = [
  {
    id: 1,
    category: 'car',
    title: 'Honda Civic LX',
    brand: 'Honda',
    price: 22000,
    description: 'Reliable sedan with great fuel efficiency and modern style.',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 2,
    category: 'car',
    title: 'Toyota Corolla',
    brand: 'Toyota',
    price: 18500,
    description: 'Comfortable ride with excellent resale value.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 3,
    category: 'bike',
    title: 'Yamaha R15',
    brand: 'Yamaha',
    price: 4500,
    description: 'Sporty bike with responsive handling and a bold design.',
    image: 'https://images.unsplash.com/photo-1495395226205-4a33cb7d257a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 4,
    category: 'bike',
    title: 'Royal Enfield Classic 350',
    brand: 'Royal Enfield',
    price: 5600,
    description: 'Classic cruiser with nostalgic styling and a strong presence.',
    image: 'https://images.unsplash.com/photo-1517949908113-4c243a7e598e?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 5,
    category: 'cycle',
    title: 'Giant Escape 3',
    brand: 'Giant',
    price: 750,
    description: 'Lightweight commuter cycle ideal for city rides and exercise.',
    image: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 6,
    category: 'cycle',
    title: 'Trek FX 2',
    brand: 'Trek',
    price: 820,
    description: 'Versatile hybrid cycle for fitness and weekend adventures.',
    image: 'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=900&q=80',
  },
];

const state = {
  filteredProducts: [...products],
  cart: [],
  nextId: products.length + 1,
};

const landingBackgrounds = [
  'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1534670007418-7a543c9c4590?auto=format&fit=crop&w=1400&q=80',
];
let landingBgIndex = 0;

const catalog = document.getElementById('catalog');
const categoryFilter = document.getElementById('categoryFilter');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const toggleCartBtn = document.getElementById('toggleCartBtn');
const cartPanel = document.getElementById('cartPanel');
const showAddFormBtn = document.getElementById('showAddFormBtn');
const addFormPanel = document.getElementById('addFormPanel');
const addListingForm = document.getElementById('addListingForm');
const cancelAddBtn = document.getElementById('cancelAddBtn');
const checkoutBtn = document.getElementById('checkoutBtn');
const landingPage = document.getElementById('landingPage');
const appContainer = document.getElementById('appContainer');
const getStartedBtn = document.getElementById('getStartedBtn');
const learnMoreBtn = document.getElementById('learnMoreBtn');

function renderCatalog(items) {
  if (!catalog) return;
  catalog.innerHTML = items
    .map(
      (product) => `
      <article class="card">
        <div class="card-media">
          <img src="${product.image}" alt="${product.title}" />
        </div>
        <div class="card-header">
          <h3>${product.title}</h3>
          <p>${product.brand}</p>
        </div>
        <div class="card-content">
          <span class="tag">${product.category}</span>
          <p>${product.description}</p>
          <div class="card-footer">
            <span class="price">$${product.price.toLocaleString()}</span>
            <button class="btn btn-primary" data-action="add" data-id="${product.id}">Buy</button>
          </div>
        </div>
      </article>
    `
    )
    .join('');
}

function renderCart() {
  cartItems.innerHTML = state.cart
    .map(
      (item) => `
        <div class="cart-item">
          <h4>${item.title}</h4>
          <small>${item.brand} • ${item.category}</small>
          <p>Price: $${item.price.toLocaleString()}</p>
          <button class="btn btn-danger" data-action="remove" data-id="${item.id}">Remove</button>
        </div>
    `
    )
    .join('');

  const total = state.cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total.toLocaleString()}`;
  cartCount.textContent = state.cart.length;
}

function sortProducts(items) {
  if (!sortSelect) return items;
  const sorted = [...items];
  switch (sortSelect.value) {
    case 'priceLow':
      return sorted.sort((a, b) => a.price - b.price);
    case 'priceHigh':
      return sorted.sort((a, b) => b.price - a.price);
    case 'brand':
      return sorted.sort((a, b) => a.brand.localeCompare(b.brand));
    default:
      return items;
  }
}

function updateFilteredProducts() {
  const category = categoryFilter.value;
  const search = searchInput.value.trim().toLowerCase();

  const results = products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesSearch =
      product.title.toLowerCase().includes(search) ||
      product.brand.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);

    return matchesCategory && matchesSearch;
  });

  state.filteredProducts = sortProducts(results);
  renderCatalog(state.filteredProducts);
}

function toggleCartVisibility() {
  cartPanel.classList.toggle('hidden');
}

function toggleAddForm() {
  addFormPanel.classList.toggle('hidden');
}

function addToCart(productId) {
  const product = products.find((item) => item.id === Number(productId));
  if (!product) return;
  state.cart.push(product);
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  renderCart();
}

function handleCatalogClick(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (action === 'add') {
    addToCart(id);
  }
}

function handleCartClick(event) {
  const button = event.target.closest('button');
  if (!button) return;
  const action = button.dataset.action;
  const id = button.dataset.id;
  if (action === 'remove') {
    removeFromCart(id);
  }
}

function handleAddListing(event) {
  event.preventDefault();
  const category = document.getElementById('itemCategory').value;
  const title = document.getElementById('itemTitle').value.trim();
  const brand = document.getElementById('itemBrand').value.trim();
  const price = Number(document.getElementById('itemPrice').value);
  const description = document.getElementById('itemDescription').value.trim();

  if (!title || !brand || !price || !description) {
    alert('Please fill in all fields.');
    return;
  }

  const newItem = {
    id: state.nextId++,
    category,
    title,
    brand,
    price,
    description,
  };

  products.push(newItem);
  updateFilteredProducts();
  addListingForm.reset();
  toggleAddForm();
}

function handleCheckout() {
  if (state.cart.length === 0) {
    alert('Your cart is empty. Add a listing first.');
    return;
  }
  alert(`Thank you! You purchased ${state.cart.length} item(s) for ${cartTotal.textContent}.`);
  state.cart = [];
  renderCart();
}

function setLandingBackground() {
  if (!landingPage) return;
  landingPage.style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85)), url('${landingBackgrounds[landingBgIndex]}')`;
  landingBgIndex = (landingBgIndex + 1) % landingBackgrounds.length;
}

function showApp() {
  landingPage.classList.add('hidden');
  appContainer.classList.remove('hidden');
  document.getElementById('catalogAnchor').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function init() {
  setLandingBackground();
  setInterval(setLandingBackground, 3000);
  renderCatalog(state.filteredProducts);
  renderCart();

  categoryFilter.addEventListener('change', updateFilteredProducts);
  searchInput.addEventListener('input', updateFilteredProducts);
  sortSelect.addEventListener('change', updateFilteredProducts);
  catalog.addEventListener('click', handleCatalogClick);
  cartItems.addEventListener('click', handleCartClick);
  toggleCartBtn.addEventListener('click', toggleCartVisibility);
  showAddFormBtn.addEventListener('click', toggleAddForm);
  getStartedBtn.addEventListener('click', showApp);
  learnMoreBtn.addEventListener('click', () => {
    document.getElementById('featureSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  cancelAddBtn.addEventListener('click', toggleAddForm);
  addListingForm.addEventListener('submit', handleAddListing);
  checkoutBtn.addEventListener('click', handleCheckout);
}

init();
