import $ from 'jquery';

$('#show-main-tab').on('click', () => {
  $('.template-customer-login__tab').each((index, tab) => {
    $(tab).removeClass('template-customer-login__tab--active');
    if ($(tab).hasClass('template-customer-login__tab--main')) {
      $(tab).addClass('template-customer-login__tab--active');
    }
  });
});

$('#show-recovery-tab').on('click', () => {
  $('.template-customer-login__tab').each((index, tab) => {
    $(tab).removeClass('template-customer-login__tab--active');
    if ($(tab).hasClass('template-customer-login__tab--recovery')) {
      $(tab).addClass('template-customer-login__tab--active');
    }
  });
});
