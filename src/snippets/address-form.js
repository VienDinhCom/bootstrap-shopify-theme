import { AddressForm } from '@shopify/theme-addresses';

const forms = document.querySelectorAll('.snippet-address-form');

forms.forEach((form) => {
  const fields = form.querySelector('.snippet-address-form__fields');
  AddressForm(fields, 'en');
});
