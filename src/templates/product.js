import { ProductForm } from '@shopify/theme-product-form';

(async () => {
  const templateElement = document.querySelector('.template-product');

  if (templateElement) {
    const formElement = templateElement.querySelector('.template-product__form');
    const productHandle = formElement.dataset.productHandle;
    const productData = await fetch(`/products/${productHandle}.js`).then((res) => res.json());

    const optionValues = [];

    function run() {
      const formVariantElements = formElement.querySelectorAll('.template-product__form-variant');

      formVariantElements.forEach((currentVariantElement, currentVariantIndex) => {
        const currentVariantValue = currentVariantElement.querySelector('select').value;
        const nextVariantElement = formVariantElements[currentVariantIndex + 1];

        if (nextVariantElement) {
          const nextVariantSelectElement = nextVariantElement.querySelector('select');
          const nextVariantOptionElements = nextVariantElement.querySelectorAll('option');

          if (currentVariantValue !== optionValues[currentVariantIndex]) {
            nextVariantSelectElement.value = '';
          }

          if (currentVariantValue === '') {
            nextVariantSelectElement.disabled = true;
          } else {
            nextVariantSelectElement.disabled = false;
          }

          optionValues[currentVariantIndex] = currentVariantValue;
        }
      });
    }

    run();

    const productForm = new ProductForm(formElement, productData, {
      onOptionChange: (event) => {
        const variant = event.dataset.variant;

        run();

        // if (variant === null) {
        //   // The combination of selected options does not have a matching variant
        //   alert('Does not have a matching variant');
        // } else if (variant && !variant.available) {
        //   // The combination of selected options has a matching variant but it is
        //   // currently unavailable

        //   alert('Unavailable');
        // } else if (variant && variant.available) {
        //   // The combination of selected options has a matching variant and it is
        //   // available

        //   alert('Available');
        // }
      },
    });
  }
})();
