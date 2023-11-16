const btnStatus = {
  add: 'Add',
  added: 'Added',
  remove: 'Remove',
  removed: 'Removed',
  loading: 'Loading...',
  error: 'Error',
};

const productButtons = document.querySelectorAll('.product-item button');

async function handleComplementary({ choosenProductId, csrf, method }) {
    const productId = document.querySelector('body').dataset.productid;
 
  const response = await fetch(
    `/admin/products/${productId}/complementary/?_csrf=${csrf}`,
    {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        choosenProductId,
      }),
    }
  );

  if (response.status != 200) {
    throw new Error('Something went wrong!');
  }
}

async function handleSlider({ choosenProductId, csrf, method }) {
  const response = await fetch(
    `/admin/products/${choosenProductId}/slider/?_csrf=${csrf}`,
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
    const arguments = { csrf, choosenProductId: productid, method };

    const currentUrl = window.location.pathname;
    const page = currentUrl.includes('slider') ? 'slider' : 'complementary';

    if (page == 'slider') {
      await handleSlider(arguments);
    } else {
      await handleComplementary(arguments);
    }
    buttonElement.innerText = initialButtonText === add ? added : removed;
    await sleep(3);
    buttonElement.innerText = initialButtonText === add ? remove : add;
    buttonElement.disabled = false;
  } catch (err) {
    console.log(err);
    buttonElement.innerText = error;
    await sleep(3);
    buttonElement.disabled = false;
    buttonElement.innerText = initialButtonText;
  }
}

productButtons.forEach((button) => {
  button.addEventListener('click', handleButtonClick);
});
