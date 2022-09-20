const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-managment');
const cartTotalPriceElement = document.getElementById('cart-total-price');
const cartBadgeElements = document.querySelectorAll('.nav-items .badge');
const cartOrderButtonElement = document.querySelector('#cart-total button');

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target;

  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  const fetchConfig = {
    method: 'PATCH',
    body: JSON.stringify({
      productId,
      quantity: quantity,
      _csrf: csrfToken,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  };

  let response;
  try {
     response = await fetch('/cart/items', fetchConfig);
  } catch (error) {
    return alert('Something went wrong!');
  }

  if (!response.ok) {
	return alert('Something went wrong!');
  }

  const responseData = await response.json();


  if (responseData.updatedCartData.updatedItemPrice <= 0) {
	form.parentElement.parentElement.remove();
	cartOrderButtonElement.remove();
  } else {
	const cartItemTotalPriceElement = form.parentElement.querySelector('.cart-item-price');
	cartItemTotalPriceElement.textContent = responseData.updatedCartData.updatedItemPrice.toFixed(2);
  }

  cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);

  for (const cartBadge of cartBadgeElements) {
    cartBadge.textContent = responseData.updatedCartData.newTotalQuantity;
  }

}

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
}


