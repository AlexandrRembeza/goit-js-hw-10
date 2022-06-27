export default function markupCountriesList(countries) {
  return countries
    .map(({ flags: { svg }, name: { common } }) => {
      return `<li class="list-items">
                 <img src="${svg}" alt="flag" width="40px" height="auto">
                 <div class="item-text">${common}</div>
              </li>`;
    })
    .join('');
}
