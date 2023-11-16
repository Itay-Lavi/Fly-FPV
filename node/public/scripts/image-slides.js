const nextSlideBtnEl = document.querySelector('.next');
const prevSlideBtnEl = document.querySelector('.prev');
const slidesEls = document.querySelectorAll('.slide');

let slideIndex = 0;
let slideTimeout;

function moveSlide(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  let i;
  if (n > slidesEls.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slidesEls.length;
  }
  for (i = 0; i < slidesEls.length; i++) {
    slidesEls[i].style.display = 'none';
  }
  slidesEls[slideIndex - 1].style.display = 'flex';

  clearTimeout(slideTimeout);
  slideTimeout = setTimeout(() => moveSlide(1), 5000);
}

showSlides(slideIndex);

nextSlideBtnEl.addEventListener('click', () => moveSlide(1));
prevSlideBtnEl.addEventListener('click', () => moveSlide(-1));
