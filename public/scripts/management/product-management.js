const productsListElement = document.getElementById('products-grid');
const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productItemActions = buttonElement.closest('.product-item-actions');
  const productId = productItemActions.dataset.productid;
  const csrfToken = productItemActions.dataset.csrf;

  const productItem = buttonElement.closest('li');
  try {
    productsListElement.removeChild(productItem);
    const response = await fetch(`/admin/products/${productId}?_csrf=${csrfToken}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
    productsListElement.appendChild(productItem);
		alert('Could not delete the product!');
		return;
    }
  } catch (error) {
    productsListElement.appendChild(productItem);
    alert('Could not send request - maybe try again later!');
  }
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}
