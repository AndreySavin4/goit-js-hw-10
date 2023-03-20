export default function fetchCountries(queryName) {
  return fetch(
    `https://restcountries.com/v3.1/name/${queryName}?fields=name,capital,population,flags,languages`
  ).then(respons => {
    if (!respons.ok) {
      throw new Error('Error');
    }
    return respons.json();
  });
}
