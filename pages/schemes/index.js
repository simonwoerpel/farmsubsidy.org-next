import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import SchemesTable from "~/components/schemesTable.js";
import { DownloadWidget } from "~/components/widgets.js";
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
    <CustomPage {...ctx}>
      <Content>
        <header className="page-heading">
          <h2>Schemes</h2>
        </header>

        <div className="section">
          <SchemesTable apiState={apiState} updateApiState={updateApiState} />
        </div>
      </Content>
      <Sidebar>
        <DownloadWidget
          count={apiState.rows.length}
          endpoint={apiState.endpoint}
          query={apiState.apiQuery}
        />
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
