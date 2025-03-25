// Cart functionality using localStorage
class Cart {
    constructor() {
      this.cart = JSON.parse(localStorage.getItem('cart')) || [];
      this.updateCartCounter();
    }
  
    addItem(item) {
      const existingItem = this.cart.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.cart.push({ ...item, quantity: 1 });
      }
      this.saveCart();
    }
  
    removeItem(itemId) {
      this.cart = this.cart.filter(item => item.id !== itemId);
      this.saveCart();
    }
  
    getItems() {
      return this.cart;
    }
  
    getTotal() {
      return this.cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
    }
  
    getTotalItems() {
      return this.cart.reduce((total, item) => total + item.quantity, 0);
    }
  
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.updateCartCounter();
    }
  
    updateCartCounter() {
      const counters = document.querySelectorAll('#cartCounter');
      counters.forEach(counter => {
        counter.textContent = this.getTotalItems();
      });
    }
  
    clearCart() {
      this.cart = [];
      this.saveCart();
    }
  }
  
  // Initialize cart on page load
  const cart = new Cart();
  
  // Make cart available globally
  window.cart = cart;