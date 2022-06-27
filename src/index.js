import './css/styles.css';
import fetchCountries from './fetchCountries';
import Notiflix from 'notiflix';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import debounce from 'lodash.debounce';

const refs = {
  inputEL: document.querySelector('#search-box'),
  listCountriesEL: document.querySelector('.country-list'),
  oneCountryEL: document.querySelector('.country-info'),
};

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
    clearCountryDivAndCountriesList();
    return;
  }

  fetchCountries(userInputValue)
    .then(resolve => {
      if (resolve.length > 10) {
        clearCountryDivAndCountriesList();
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

  clearCountryDivAndCountriesList();

  let oneCountryMarkup = country
    .map(
      ({
        flags: { svg },
        name: { common, official },
        capital,
        languages,
        population,
      }) => {
        const languagesStr = Object.values(languages).join(', ');
        currentCountry = official;

        return `<p>
                <span><img src="${svg}" alt="flag" width="40px" height="auto"></span>
                <span class="country-name">${common}</span>
                </p>
                <p><span class="span-text">Capital:</span> ${capital}</p>
                <p><span class="span-text">Population:</span> ${population}</p>
                <p><span class="span-text">Languages:</span> ${languagesStr}</p>`;
      }
    )
    .join('');

  refs.oneCountryEL.insertAdjacentHTML('beforeend', oneCountryMarkup);
}

function renderCountriesMarkup(countries) {
  clearCountryDivAndCountriesList();
  currentCountry = '';

  let countriesItemsMarkup = countries
    .map(({ flags: { svg }, name: { common } }) => {
      return `<li class="list-items">
                 <img src="${svg}" alt="flag" width="40px" height="auto">
                 <div class="item-text">${common}</div>
              </li>`;
    })
    .join('');

  refs.listCountriesEL.insertAdjacentHTML('beforeend', countriesItemsMarkup);
}

function clearCountryDivAndCountriesList() {
  refs.listCountriesEL.innerHTML = '';
  refs.oneCountryEL.innerHTML = '';
}

function showInfoMessage(message) {
  return Notiflix.Notify.info(`${message}`, {
    width: '400px',
    position: 'center-top',
    clickToClose: true,
    svgSize: '120px',
    fontSize: '18px',
    timeout: 2000,
  });
}

function showErrorMessage() {
  clearCountryDivAndCountriesList();
  currentCountry = '';

  return Notiflix.Notify.failure(`Oops, there is no country with that name`, {
    width: '400px',
    position: 'center-top',
    clickToClose: true,
    svgSize: '120px',
    fontSize: '18px',
    timeout: 2000,
  });
}

function showOneCountryMarkup(e) {
  if (e.target.nodeName === 'LI') {
    const nameCountry = e.target.lastElementChild.textContent;
    fetchCountries(nameCountry)
      .then(resolve => {
        if (resolve.length > 10) {
          clearCountryDivAndCountriesList();
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
          clearCountryDivAndCountriesList();
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
          clearCountryDivAndCountriesList();
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
