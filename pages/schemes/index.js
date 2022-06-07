import { Page } from "~/components/pages.js";
import SchemesTable from "~/components/schemesTable.js";
import getCachedContext from "~/lib/context.js";
import api, { useApi } from "~/lib/api.js";

export default function Schemes({ ...ctx }) {
  const query = {
    scheme__null: false,
    amount__null: false,
    order_by: "-amount_sum",
    limit: 25,
  };
  const [apiState, updateApiState] = useApi("schemes", query);
  return (
    <Page {...ctx}>
      <header className="page-heading">
        <h2>Schemes</h2>
      </header>

      <div className="section">
        <SchemesTable apiState={apiState} updateApiState={updateApiState} />
      </div>
    </Page>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
