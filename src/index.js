import './css/styles.css';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import debounce from 'lodash.debounce';
import refs from './refsObj';
import markupOneCountryFn from './markupOneCountryFn';
import markupCountriesList from './markupCountriesList';
import notiflixOptions from './notiflixOptionsObj';

const DEBOUNCE_DELAY = 300;
let currentCountry = '';

refs.inputEL.addEventListener(
  'input',
  debounce(findCountryAndRenderMarkup, DEBOUNCE_DELAY)
);
refs.listCountriesEL.addEventListener('click', showOneCountryMarkup);

function findCountryAndRenderMarkup(e) {
  const userInputValue = e.target.value.trim();

  if (userInputValue === '') {
    currentCountry = '';
    clearHtml();
    return;
  }

  fetchCountries(userInputValue)
    .then(resolve => {
      if (resolve.length > 10) {
        clearHtml();
        showInfoMessage(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }

      if (resolve.length > 1) {
        renderCountriesMarkup(resolve);
      } else if (resolve.length === 1) {
        renderOneCountryMarkup(resolve);
      }
    })
    .catch(showErrorMessage);
}

function renderOneCountryMarkup(country) {
  if (country[0].name.official === currentCountry) {
    return;
  }

  currentCountry = country[0].name.official;

  clearHtml();

  refs.oneCountryEL.insertAdjacentHTML(
    'beforeend',
    markupOneCountryFn(country)
  );
}

function renderCountriesMarkup(countries) {
  clearHtml();
  currentCountry = '';

  refs.listCountriesEL.insertAdjacentHTML(
    'beforeend',
    markupCountriesList(countries)
  );
}

function clearHtml() {
  refs.listCountriesEL.innerHTML = '';
  refs.oneCountryEL.innerHTML = '';
}

function showInfoMessage(message) {
  return Notiflix.Notify.info(`${message}`, notiflixOptions);
}

function showErrorMessage() {
  clearHtml();
  currentCountry = '';

  return Notiflix.Notify.failure(
    `Oops, there is no country with that name`,
    notiflixOptions
  );
}

function showOneCountryMarkup(e) {
  if (e.target.nodeName === 'LI') {
    const nameCountry = e.target.lastElementChild.textContent;
    fetchCountries(nameCountry)
      .then(resolve => {
        if (resolve.length > 10) {
          clearHtml();
          showInfoMessage(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }

        if (resolve.length > 1) {
          renderCountriesMarkup(resolve);
        } else if (resolve.length === 1) {
          renderOneCountryMarkup(resolve);
        }
      })
      .catch(showErrorMessage);
    return;
  }
  if (e.target.nodeName === 'IMG') {
    const nameCountry = e.target.nextElementSibling.textContent;
    fetchCountries(nameCountry)
      .then(resolve => {
        if (resolve.length > 10) {
          clearHtml();
          showInfoMessage(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }

        if (resolve.length > 1) {
          renderCountriesMarkup(resolve);
        } else if (resolve.length === 1) {
          renderOneCountryMarkup(resolve);
        }
      })
      .catch(showErrorMessage);
    return;
  }
  if (e.target.nodeName === 'DIV') {
    const nameCountry = e.target.textContent;
    fetchCountries(nameCountry)
      .then(resolve => {
        if (resolve.length > 10) {
          clearHtml();
          showInfoMessage(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }

        if (resolve.length > 1) {
          renderCountriesMarkup(resolve);
        } else if (resolve.length === 1) {
          renderOneCountryMarkup(resolve);
        }
      })
      .catch(showErrorMessage);
    return;
  }
}
