import SearchPage from "~/components/search.js";
import LocationsTable from "~/components/locationsTable.js";
import getCachedContext from "~/lib/context.js";
import { useLocationsApi } from "~/lib/api.js";

export default function LocationsSearchTable({ ...ctx }) {
  return (
    <SearchPage
      endpoint="Locations"
      useApi={useLocationsApi}
      ResultComponent={LocationsTable}
      {...ctx}
    />
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
