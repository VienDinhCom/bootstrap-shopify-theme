import { AddressForm } from '@shopify/theme-addresses';

const addressForms = document.querySelectorAll('[data-address=root]');

if (addressForms.length) {
  addressForms.forEach((addressForm) => {
    AddressForm(addressForm, 'en');

    console.log(addressForm);
  });
}
