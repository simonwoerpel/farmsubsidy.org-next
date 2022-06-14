import SearchPage from "~/components/search.js";
import { PaymentsSearchTable } from "~/components/paymentsTable.js";
import getCachedContext from "~/lib/context.js";
import { usePaymentsApi } from "~/lib/api.js";

export default function PaymentsSearchPage({ ...ctx }) {
  return (
    <SearchPage
      endpoint="Payments"
      useApi={usePaymentsApi}
      ResultComponent={PaymentsSearchTable}
      {...ctx}
    />
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}
