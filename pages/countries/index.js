import getCachedContext from "~/lib/context.js";
import { Page } from "~/components/pages.js";
import CountriesTable from "~/components/countriesTable.js";

export default function Countries({ countries, years }) {
  return (
    <Page countries={countries} years={years}>
      <header className="page-heading">
        <h2>Browse data by country</h2>
      </header>

      <div className="section">
        <CountriesTable countries={countries} />
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
