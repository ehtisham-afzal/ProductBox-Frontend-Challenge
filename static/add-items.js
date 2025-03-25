document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addItemForm');
  const successMessage = document.getElementById('successMessage');
  
  form.addEventListener('submit', handleFormSubmit);
  
  document.getElementById('addAnotherBtn').addEventListener('click', () => {
    successMessage.classList.add('d-none');
    form.reset();
    form.classList.remove('was-validated');
  });
});

function handleFormSubmit(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const form = e.target;
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }
  
  const name = document.getElementById('name').value;
  const price = document.getElementById('price').value;
  const image = document.getElementById('image').value;
  const description = document.getElementById('description').value;
  
  const newItem = {
    name,
    price,
    img: image,
    description
  };
  
  fetch('/.netlify/functions/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newItem)
  })
  .then(response => response.json())
  .then(item => {
    // Show success message
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');
    
    successText.textContent = `"${item.name}" has been listed successfully!`;
    successMessage.classList.remove('d-none');
    form.reset();
    form.classList.remove('was-validated');
  })
  .catch(error => {
    console.error('Error adding item:', error);
    showAlert('There was an error adding your item. Please try again.', 'danger');
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