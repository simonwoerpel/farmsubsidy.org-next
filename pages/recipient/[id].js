import api from "../../utils/api.js";
import RecipientPaymentsTable from "../../components/paymentsTable.js";

export default function Recipient({ recipient, payments }) {
  return (
    <div className="content col-lg-8 col-md-8 col-sm-7">
      <header className="page-heading">
        <h2>{recipient.name}</h2>
      </header>

      <div className="section">
        <p>
          {recipient.name[0]} is a recipient of farm subsidies from{" "}
          {recipient.country}.
        </p>
        <p>
          {recipient.name} has received (at least){" "}
          <strong>{recipient.amount_sum}&nbsp;€</strong> in payments of farm
          subsidies from the European Union under{" "}
          <abbr title="Common Agricultural Policy">the CAP</abbr>.
        </p>
      </div>

      <div className="section">
        <h3>Details of payments</h3>
        <RecipientPaymentsTable payments={payments} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // pre-render the top recipients for each country
  const countries = await api("countries");
  const recipients = await Promise.all(
    countries.map(({ country }) =>
      api("recipients", {
        country,
        order_by: "-amount_sum",
        limit: process.env.PRERENDER_RECIPIENTS_COUNT || 1,
      })
    )
  );
  const paths = recipients
    .flat()
    .filter((r) => !!r)
    .map(({ id }) => ({ params: { id } }));
  return { paths, fallback: true };
}

// export async function getServerSideProps({ params }) {
export async function getStaticProps({ params }) {
  const recipients = await api("recipients", { recipient_id: params.id });
  const payments = await api("payments", { recipient_id: params.id });

  return { props: { recipient: recipients[0], payments } };
}
