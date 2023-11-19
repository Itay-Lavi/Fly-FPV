const addToCartButtonElement = document.querySelector(
  '#product-details button'
);
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;
  const initialText = addToCartButtonElement.innerText;

  addToCartButtonElement.disabled = true;
  addToCartButtonElement.innerText = 'Adding...';

  const fetchConfig = {
    method: 'POST',
    body: JSON.stringify({
      productId: productId,
      _csrf: csrfToken,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response;
  try {
    response = await fetch('/cart/items', fetchConfig);
    if (!response.ok) throw 'error';
  } catch (error) {
    addToCartButtonElement.disabled = false;
    addToCartButtonElement.innerText = initialText;
    alert('Something went worng!');
    return;
  }

  const responseData = await response.json();
  const newTotalQuantity = responseData.newTotalItems;

  for (const cartBadge of cartBadgeElements) {
    cartBadge.textContent = newTotalQuantity;
  }

  addToCartButtonElement.innerText = 'Added';
}

addToCartButtonElement.addEventListener('click', addToCart);
