const formElement = document.querySelector('.auth-form');
const buttonElement = document.querySelector('.auth-form button[type="submit"]');

function setLoading() {
    buttonElement.innerHTML = 'Loading <i class="fa-solid fa-circle-notch fa-spin"></i>';
}


formElement.addEventListener('submit', setLoading)