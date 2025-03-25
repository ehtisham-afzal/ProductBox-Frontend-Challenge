document.addEventListener("DOMContentLoaded", () => {
  // Load featured items on homepage
  fetch("/.netlify/functions/items")
    .then((response) => response.json())
    .then((items) => {
      const featuredContainer = document.getElementById("featuredItems");
      const noItemsMessage = document.getElementById("noItemsMessage");

      if (items.length > 0) {
        noItemsMessage.style.display = "none";

        // Show first 3 items as featured
        const featuredItems = items.slice(0, 3);

        featuredItems.forEach((item) => {
          const col = document.createElement("div");
          col.className = "col";
          col.innerHTML = `
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
          featuredContainer.insertBefore(col, noItemsMessage);
        });

        // Add event listeners to all "Add to Cart" buttons
        document.querySelectorAll(".add-to-cart").forEach((button) => {
          button.addEventListener("click", (e) => {
            const itemId = parseInt(e.target.getAttribute("data-id"));
            addItemToCart(itemId);
            e.target.classList.add("pulse");
            setTimeout(() => {
              e.target.classList.remove("pulse");
            }, 500);
          });
        });
      } else {
        noItemsMessage.style.display = "flex";
      }
    })
    .catch((error) => console.error("Error loading featured items:", error));
});

function addItemToCart(itemId) {
  fetch(`/.netlify/functions/items/${itemId}`)
    .then((response) => response.json())
    .then((item) => {
      cart.addItem(item);
      showToast("Item added to cart!");
    })
    .catch((error) => console.error("Error adding item to cart:", error));
}

function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "position-fixed bottom-0 end-0 p-3";
  toast.style.zIndex = "11";
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
