import debounce from 'lodash/debounce';
import { withElements } from 'with-elements';
import PredictiveSearch from '@shopify/theme-predictive-search';

withElements('.template-search', async (templateElement) => {
  const formElement = templateElement.querySelector('.template-search__form');
  const formInputElement = formElement.querySelector('.template-search__form-input');
  const formResultsElement = formElement.querySelector('.template-search__form-results');

  var predictiveSearch = new PredictiveSearch({
    search_path: PredictiveSearch.SEARCH_PATH,
    resources: {
      type: [PredictiveSearch.TYPES.PAGE, PredictiveSearch.TYPES.ARTICLE, PredictiveSearch.TYPES.PRODUCT],
      limit: 2,
    },
  });

  formInputElement.onkeyup = debounce(({ target: { value } }) => {
    if (value === '') {
      formResultsElement.innerHTML = '';
    } else {
      predictiveSearch.query(value);
    }
  }, 500);

  window.onclick = (event) => {
    if (!formResultsElement.contains(event.target)) {
      formResultsElement.innerHTML = '';
    }
  };

  formResultsElement.onfocusout = () => {
    formResultsElement.innerHTML = '';
  };

  predictiveSearch.on('success', function ({ resources: { results } }) {
    const items = [];

    for (const itemType in results) {
      if (Object.hasOwnProperty.call(results, itemType)) {
        results[itemType].forEach((item) => {
          items.push({ itemType, ...item });
        });
      }
    }

    formResultsElement.innerHTML = items
      .map((item) => {
        return `<a class="list-group-item" href="${item.url}">${item.title}</a>`;
      })
      .join('');
  });
});
