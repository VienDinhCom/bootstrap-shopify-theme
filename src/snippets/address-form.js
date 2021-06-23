import { withElements } from 'with-elements';
import { AddressForm } from '@shopify/theme-addresses';

withElements('.snippet-address-form', async (formElement) => {
  const fields = formElement.querySelector('.snippet-address-form__fields');

  AddressForm(fields, 'en');
});
