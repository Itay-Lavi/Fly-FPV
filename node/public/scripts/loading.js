const formElement = document.querySelector('.loading-form');
const buttonElement = document.querySelector('.loading-form button[type="submit"]');

function setLoading(event) {
    buttonElement.innerHTML = 'Loading <i class="fa-solid fa-circle-notch fa-spin"></i>';
    buttonElement.style.cursor = 'initial';
}


formElement.addEventListener('submit', setLoading)