import getCachedContext from "~/lib/context.js";
import { Page } from "~/components/pages.js";
import CountriesTable from "~/components/countriesTable.js";

export default function Countries({ ...ctx }) {
  return (
    <Page title="All countries" {...ctx}>
      <header className="page-heading">
        <h1>Countries</h1>
      </header>

      <CountriesTable countries={ctx.countries} />
    </Page>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
