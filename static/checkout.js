document.addEventListener('DOMContentLoaded', () => {
  displayCartItems();
  setupCheckoutButton();
});

function displayCartItems() {
  const cartItemsContainer = document.getElementById('cartItems');
  const emptyCartMessage = document.getElementById('emptyCartMessage');
  const subtotalElement = document.getElementById('subtotal');
  const cartTotalElement = document.getElementById('cartTotal');
  const items = cart.getItems();
  
  cartItemsContainer.innerHTML = '';
  
  if (items.length === 0) {
    emptyCartMessage.classList.remove('d-none');
    subtotalElement.textContent = '$0.00';
    cartTotalElement.textContent = '$0.00';
    return;
  }
  
  emptyCartMessage.classList.add('d-none');
  
  items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'col';
    itemElement.innerHTML = `
      <div class="card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
            <img src="${item.img}" class="img-fluid rounded-start h-100 object-fit-cover" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300?text=No+Image'">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${item.name}</h5>
              <p class="card-text">$${item.price} × ${item.quantity}</p>
              <p class="card-text"><strong>$${(parseFloat(item.price) * item.quantity).toFixed(2)}</strong></p>
              <button class="btn btn-outline-danger btn-sm remove-item" data-id="${item.id}">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });
  
  // Update totals
  const subtotal = cart.getTotal();
  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  cartTotalElement.textContent = `$${subtotal.toFixed(2)}`;
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', (e) => {
      const itemId = parseInt(e.target.getAttribute('data-id'));
      cart.removeItem(itemId);
      displayCartItems();
    });
  });
}

function setupCheckoutButton() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  checkoutBtn.addEventListener('click', () => {
    if (cart.getItems().length === 0) {
      showAlert('Your cart is empty!', 'warning');
      return;
    }
    
    // In a real app, you would process payment here
    showAlert('Thank you for your purchase!', 'success');
    cart.clearCart();
    displayCartItems();
  });
}

function showAlert(message, type) {
  const alert = document.createElement('div');
  alert.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
  alert.style.zIndex = '11';
  alert.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  document.body.appendChild(alert);
  
  setTimeout(() => {
    alert.remove();
  }, 5000);
}