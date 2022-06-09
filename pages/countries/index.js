import getCachedContext from "~/lib/context.js";
import { Page } from "~/components/pages.js";
import CountriesTable from "~/components/countriesTable.js";

export default function Countries({ countries, years }) {
  return (
    <Page countries={countries} years={years}>
      <header className="page-heading">
        <h1>Countries</h1>
      </header>

      <CountriesTable countries={countries} />
    </Page>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
