import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import SchemesTable from "~/components/schemesTable.js";
import { DownloadWidget } from "~/components/widgets.js";
import getCachedContext from "~/lib/context.js";
import { useSchemesApi } from "~/lib/api.js";

export default function Schemes({ ...ctx }) {
  const [apiState, updateApiState] = useSchemesApi();

  return (
    <CustomPage title="Payment schemes and measures" {...ctx}>
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
