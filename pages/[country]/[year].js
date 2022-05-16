function Country({ country, years, topRecipients }) {
  return (
    <div>
      <h1>{country.country}</h1>
      <ul>
        {years.map(({ year }) => (
          <li key={year}>{year}</li>
        ))}
      </ul>
      <ul>
        {topRecipients.map(({ name }) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://api.farmsubsidy-next.medienrevolte.de/countries");
  const { results } = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = [];
  results.map(({ country, years }) => {
    years.map((year) => {
      paths.push({ params: { country, year: year.toString() } });
    });
  });

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const countryRes = await fetch(
    `https://api.farmsubsidy-next.medienrevolte.de/countries?country=${params.country}&year=${params.year}`
  );
  const { results: countries } = await countryRes.json();
  const country = countries[0];

  const yearsRes = await fetch(
    `https://api.farmsubsidy-next.medienrevolte.de/years?country=${params.country}`
  );
  const { results: years } = await yearsRes.json();

  const recipientsRes = await fetch(
    `https://api.farmsubsidy-next.medienrevolte.de/recipients?country=${params.country}&year=${params.year}&order_by=-amount_sum&limit=5`
  );
  const { results: topRecipients } = await recipientsRes.json();

  // Pass post data to the page via props
  return { props: { country, years, topRecipients } };
}

export default Country;
