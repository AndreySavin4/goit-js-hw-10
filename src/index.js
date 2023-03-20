import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const rest = {
  input: document.querySelector('input#search-box'),
  markupList: document.querySelector('ul.country-list'),
  countryInfo: document.querySelector('div.country-info'),
};

rest.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const queryName = e.target.value.trim();
  if (queryName) {
    fetchCountries(queryName)
      .then(countries => {
        if (countries.length > 10) {
          Notify.warning(
            'Too many matches found. Please enter a more specific name.'
          );
          // rest.countryInfo.innerHTML = '';
          // rest.markupList.innerHTML = '';
          return;
        }
        if (countries.length >= 2 || countries.length <= 10) {
          const countryListMarkup = countries.map(country =>
            createMarkupCountryList(country)
          );
          rest.markupList.innerHTML = countryListMarkup.join('');
          rest.countryInfo.innerHTML = '';
        }
        if (countries.length === 1) {
          const countryInfoMarkup = countries.map(country =>
            createMarkupCountryInfo(country)
          );
          rest.countryInfo.innerHTML = countryInfoMarkup.join('');
          rest.markupList.innerHTML = '';
        }
      })
      .catch(error => {
        Notify.failure('Oops, there is no country with that name');
        rest.countryInfo.innerHTML = '';
        rest.markupList.innerHTML = '';
        return error;
      });
  }
  rest.countryInfo.innerHTML = '';
  rest.markupList.innerHTML = '';
  return;
}

// countries//
function createMarkupCountryList(country) {
  const {
    name: { common },
    flags: { svg },
  } = country;
  const oneCountry = `
<li class='counties-list'>
<img src="${svg}" alt=${common} width="50">
<p>${common}</p>
</li>
      `;

  return (rest.markupList.innerHTML = oneCountry);
}

//country//
function createMarkupCountryInfo(country) {
  const {
    name: { common },
    flags: { svg },
    capital,
    population,
    languages,
  } = country;
  const language = Object.values(languages).join(', ');
  const countryInfo = `
  <img src="${svg}" alt=${common} width="100">

  <h1>${common}</h1>
  <p><span>Capital</span>:${capital}</p>
  <p><span>Population</span>:${population}</p>
  <p><span>Languages</span>:${language}</p>
  `;
  return (rest.countryInfo.innerHTML = countryInfo);
}
