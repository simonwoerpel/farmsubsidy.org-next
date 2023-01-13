import SearchPage from "~/components/search.js";
import { RecipientsSearchTable } from "~/components/recipientsTable.js";
import getCachedContext from "~/lib/context.js";
import { useRecipientsApi } from "~/lib/api.js";

export default function RecipientSearchPage({ ...ctx }) {
  return (
    <SearchPage
      title="Search recipients"
      endpoint="Recipients"
      useApi={useRecipientsApi}
      ResultComponent={RecipientsSearchTable}
      {...ctx}
    />
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
