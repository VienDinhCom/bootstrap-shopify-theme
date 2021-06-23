import Swiper from 'swiper';
import { withElements } from 'with-elements';

withElements('.snippet-featured-slider', async (sliderElement) => {
  const containerElement = sliderElement.querySelector('.swiper-container');
  const prevBtn = containerElement.querySelector('.carousel-control-prev');
  const nextBtn = containerElement.querySelector('.carousel-control-next');

  const swiper = new Swiper(containerElement, {
    loop: true,

    slidesPerView: 1,
    spaceBetween: 0,
    breakpoints: {
      576: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  });

  prevBtn.addEventListener('click', () => {
    swiper.slidePrev();
  });

  nextBtn.addEventListener('click', () => {
    swiper.slideNext();
  });
});
