const productsListElement = document.getElementById('products-grid');
const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  try {
    const response = await fetch(`/admin/products/${productId}?_csrf=${csrfToken}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
		alert('Could not delete the product!');
		return;
    }
	
	productsListElement.removeChild(event.path[4]);
  } catch {
    alert('Could not send request - maybe try again later!');
  }
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}
