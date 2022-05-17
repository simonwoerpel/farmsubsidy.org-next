import { useRouter } from "next/router";
import api from "../../utils/api.js";
import LoadingPlaceholder from "../../components/placeholder.js";
import RecipientPaymentsTable from "../../components/paymentsTable.js";

export default function Recipient({ recipient, payments }) {
  const router = useRouter();

  return (
    <div className="content col-lg-8 col-md-8 col-sm-7">
      <header className="page-heading">
        <LoadingPlaceholder isLoading={router.isLoading}>
          <h2>{recipient && recipient.name}</h2>
        </LoadingPlaceholder>
      </header>

      <div className="section">
        <LoadingPlaceholder as="p" isLoading={router.isLoading}>
          <p>
            {recipient && recipient.name[0]} is a recipient of farm subsidies from{" "}
            {recipient && recipient.country}.
          </p>
        </LoadingPlaceholder>
        <LoadingPlaceholder as="p" isLoading={router.isLoading}>
          <p>
            {recipient && recipient.name} has received (at least){" "}
            <strong>{recipient && recipient.amount_sum}&nbsp;€</strong> in payments of farm
            subsidies from the European Union under{" "}
            <abbr title="Common Agricultural Policy">the CAP</abbr>.
          </p>
        </LoadingPlaceholder>
      </div>

      <div className="section">
        <h3>Details of payments</h3>
        <LoadingPlaceholder as="p" isLoading={router.isLoading}>
          <RecipientPaymentsTable payments={payments} />
        </LoadingPlaceholder>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // pre-render the top recipients for each country
  const countries = await api("countries");
  const recipients = await Promise.all(
    countries.map(({ country }) =>
      api("recipients_base", {
        country,
        order_by: "-amount_sum",
        limit: process.env.PRERENDER_RECIPIENTS_COUNT || 5,
      })
    )
  );
  const paths = recipients
    .flat()
    .filter((r) => !!r)
    .map(({ id }) => ({ params: { id } }));
  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const recipients = await api("recipients", { recipient_id: params.id });
  const payments = await api("payments", { recipient_id: params.id });

  return { props: { recipient: recipients[0], payments } };
}
