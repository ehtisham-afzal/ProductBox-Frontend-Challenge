document.addEventListener('DOMContentLoaded', () => {
  let allItems = [];
  
  // Load items
  fetchItems();
  
  // Setup sort dropdown
  document.querySelectorAll('[data-sort]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const sortType = e.target.getAttribute('data-sort');
      sortItems(sortType);
    });
  });
  
  // Setup search
  document.getElementById('searchInput').addEventListener('input', (e) => {
    searchItems(e.target.value);
  });
});

function fetchItems() {
  fetch('/items')
    .then(response => response.json())
    .then(items => {
      allItems = items;
      displayItems(items);
    })
    .catch(error => console.error('Error fetching items:', error));
}

function displayItems(items) {
  const itemsList = document.getElementById('itemsList');
  itemsList.innerHTML = '';

  items.forEach(item => {
    const itemCard = document.createElement('div');
    itemCard.className = 'col';
    itemCard.innerHTML = `
      <div class="card h-100">
        <img src="${item.img}" class="card-img-top item-img" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
        <div class="card-body">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text">$${item.price}</p>
          <button class="btn btn-primary add-to-cart" data-id="${item.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
    itemsList.appendChild(itemCard);
  });

  // Add event listeners to all "Add to Cart" buttons
  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.getAttribute('data-id'));
      addItemToCart(itemId);
      e.target.classList.add('pulse');
      setTimeout(() => {
        e.target.classList.remove('pulse');
      }, 500);
    });
  });
}

function sortItems(sortType) {
  let sortedItems = [...allItems];
  
  switch(sortType) {
    case 'price-asc':
      sortedItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      break;
    case 'price-desc':
      sortedItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      break;
    case 'name-asc':
      sortedItems.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sortedItems.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
  
  displayItems(sortedItems);
}

function searchItems(query) {
  if (!query) {
    displayItems(allItems);
    return;
  }
  
  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.price.toString().includes(query)
  );
  
  displayItems(filteredItems);
}

function addItemToCart(itemId) {
  const item = allItems.find(i => i.id === itemId);
  if (item) {
    cart.addItem(item);
    showToast('Item added to cart!');
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'position-fixed bottom-0 end-0 p-3';
  toast.style.zIndex = '11';
  toast.innerHTML = `
    <div class="toast show align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}