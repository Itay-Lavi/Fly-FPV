const btnStatus = {
  add: 'Add',
  added: 'Added',
  remove: 'Remove',
  removed: 'Removed',
  loading: 'Loading...',
  error: 'Error',
};

const productButtons = document.querySelectorAll('.product-item button');

async function addOrRemoveFromSlider({ productId, csrfToken, method }) {
console.log(productId);
  console.log(csrfToken);

  const response = await fetch(
    `/admin/products/slider/${productId}?_csrf=${csrfToken}`,
    {
      method,
    }
  );

  if (response.status != 200) {
    throw new Error('Something went wrong!');
  }
}

function sleep(seconds) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function handleButtonClick(event) {
  const buttonElement = event.target;
  const productItemActions = buttonElement.closest('.product-item-actions');

  const { csrf, productid } = productItemActions.dataset;
  const { add, added, remove, removed, error, loading } = btnStatus;
  const initialButtonText = buttonElement.innerText;

  buttonElement.disabled = true;
  buttonElement.innerText = loading;

  try {
    const method = initialButtonText === add ? 'POST' : 'DELETE';
    await addOrRemoveFromSlider({
      csrfToken: csrf,
      productId: productid,
      method,
    });
    buttonElement.innerText = initialButtonText === add ? added : removed;
    await sleep(3);
    buttonElement.innerText = initialButtonText === add ? remove : add;
    buttonElement.disabled = false;
  } catch (err) {
    buttonElement.innerText = error;
    await sleep(3);
    buttonElement.disabled = false;
    buttonElement.innerText = initialButtonText;
  }
}

productButtons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});
