import Swiper from 'swiper';
import uniq from 'lodash/uniq';
import { withElements } from 'with-elements';
import { ProductForm } from '@shopify/theme-product-form';

withElements('.template-product', async (templateElement) => {
  const sliderElement = templateElement.querySelector('.template-product__slider');
  const prevBtn = sliderElement.querySelector('.carousel-control-prev');
  const nextBtn = sliderElement.querySelector('.carousel-control-next');

  const slider = new Swiper(sliderElement, {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
  });

  prevBtn.addEventListener('click', () => {
    slider.slidePrev();
  });

  nextBtn.addEventListener('click', () => {
    slider.slideNext();
  });

  // Product Variant Selector
  (async () => {
    const selectedValues = [];

    const formElement = templateElement.querySelector('.template-product__form');
    const productHandle = formElement.dataset.productHandle;
    const productData = await fetch(`/products/${productHandle}.js`).then((res) => res.json());
    const buttonElement = formElement.querySelector('button[type=submit]');

    function proceeding() {
      const selectElements = formElement.querySelectorAll('.template-product__form-option select');

      // Select Variants by Steps
      selectElements.forEach((formSelectElement, index) => {
        const currentSelectValue = formSelectElement.value;
        const nextSelectElement = selectElements[index + 1];

        if (nextSelectElement) {
          if (currentSelectValue !== selectedValues[index]) {
            nextSelectElement.value = '';
          }

          if (currentSelectValue === '') {
            nextSelectElement.disabled = true;
          } else {
            nextSelectElement.disabled = false;
          }

          selectedValues[index] = currentSelectValue;
        }
      });

      // Disable Inappropriate Options
      const selectOneElement = selectElements[0];
      const selectTwoElement = selectElements[1];
      const selectThreeElement = selectElements[2];

      if (selectTwoElement) {
        const okayOptions = uniq(
          productData.variants.filter(({ option1 }) => option1 === selectOneElement.value).map(({ option2 }) => option2)
        );

        const selectTwoOptionElements = selectTwoElement.querySelectorAll('option');

        selectTwoOptionElements.forEach((selectTwoOptionElement) => {
          if (okayOptions.includes(selectTwoOptionElement.value)) {
            selectTwoOptionElement.disabled = false;
          } else {
            selectTwoOptionElement.disabled = true;
          }
        });
      }

      if (selectThreeElement) {
        const okayOptions = uniq(
          productData.variants
            .filter(({ option1, option2 }) => option1 === selectOneElement.value && option2 === selectTwoElement.value)
            .map(({ option3 }) => option3)
        );

        const selectThreeOptionElements = selectThreeElement.querySelectorAll('option');

        selectThreeOptionElements.forEach((selectThreeOptionElement) => {
          if (okayOptions.includes(selectThreeOptionElement.value)) {
            selectThreeOptionElement.disabled = false;
          } else {
            selectThreeOptionElement.disabled = true;
          }
        });
      }
    }

    proceeding();

    if (productData.variants.length > 1) {
      buttonElement.disabled = true;
    }

    new ProductForm(formElement, productData, {
      onOptionChange: (event) => {
        const variant = event.dataset.variant;

        proceeding();

        if (variant === null) {
          // The combination of selected options does not have a matching variant

          buttonElement.disabled = true;
        } else if (variant && !variant.available) {
          // The combination of selected options has a matching variant but it is
          // currently unavailable

          buttonElement.disabled = true;
        } else if (variant && variant.available) {
          // The combination of selected options has a matching variant and it is
          // available

          buttonElement.disabled = false;
        }

        // Slide to Current Variant Media
        sliderElement.querySelectorAll('.template-product__slider-slide').forEach((slideElement, index) => {
          if (+slideElement.dataset.mediaId === variant?.featured_media?.id) {
            slider.slideTo(index + 1);
          }
        });
      },
    });
  })();
});
