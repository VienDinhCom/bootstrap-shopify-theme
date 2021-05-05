import Swiper from 'swiper';

const sections = document.querySelectorAll('.section-featured-products');

sections.forEach((section) => {
  const swiperContainer = section.querySelector('.swiper-container');
  const prevBtn = swiperContainer.querySelector('.carousel-control-prev');
  const nextBtn = swiperContainer.querySelector('.carousel-control-next');

  const swiper = new Swiper(swiperContainer, {
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
