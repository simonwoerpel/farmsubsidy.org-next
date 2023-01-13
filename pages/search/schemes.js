import SearchPage from "~/components/search.js";
import SchemesTable from "~/components/schemesTable.js";
import getCachedContext from "~/lib/context.js";
import { useSchemesApi } from "~/lib/api.js";

export default function SchemesSearchPage({ ...ctx }) {
  return (
    <SearchPage
      title="Search schemes"
      endpoint="Schemes"
      useApi={useSchemesApi}
      ResultComponent={SchemesTable}
      {...ctx}
    />
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
