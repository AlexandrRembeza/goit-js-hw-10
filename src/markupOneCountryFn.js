export default function markupOneCountryFn(country) {
  return country
    .map(
      ({
        flags: { svg },
        name: { common, official },
        capital,
        languages,
        population,
      }) => {
        const languagesStr = Object.values(languages).join(', ');

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
}
