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
        <header>
          <h1>Schemes</h1>
        </header>

        <SchemesTable
          title=" "
          apiState={apiState}
          updateApiState={updateApiState}
        />
      </Content>
      <Sidebar>
        <DownloadWidget {...apiState} />
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
