import Button from "react-bootstrap/Button";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import CountryYearsTable from "~/components/countryTable.js";
import api from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";
import { CountryLink } from "~/lib/links.js";

export default function Country({
  country,
  countryYears,
  topRecipients,
  ...ctx
}) {
  return (
    <CustomPage {...ctx}>
      <Content>
        <header className="page-heading">
          <h2>
            EU Farm subsidies for {country.name}
            <br />
            <small> for all available years</small>
          </h2>
        </header>

        <p>
          These pages list farm subsidy payments made in{" "}
          <strong>{country.name}</strong> as published directly by the
          government of {country.name} or sourced via freedom of information
          requests.
        </p>

        <div className="section">
          <h3>Top recipients</h3>
          <RecipientsTable
            recipients={topRecipients}
            columnsExclude={["country"]}
          />
          <p className="more_info">
            <CountryLink.Recipients {...country} />
          </p>
        </div>
        <div className="section">
          <h3>Available years for {country.name}</h3>
          <CountryYearsTable country={country.country} years={countryYears} />
        </div>
      </Content>
      <Sidebar>
        <AmountWidget
          title="Total amount"
          value={country.amount_sum}
          country={country.country}
        >
          received all recipients in <em>{country.name}</em> from{" "}
          {Math.min(...country.years)} to {Math.max(...country.years)}
        </AmountWidget>
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticPaths() {
  const results = await api("countries");
  const paths = results.map(({ country }) => ({
    params: CountryLink.getParams({ country }),
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const ctx = await getCachedContext();
  const countries = await api("countries", { country: params.country });
  const countryYears = await api("years", { country: params.country });
  const topRecipientIds = await api("recipients/base", {
    recipient_name__null: false,
    country: params.country,
    order_by: "-amount_sum",
    limit: 5,
  });
  const topRecipientsRes = await Promise.all(
    topRecipientIds.map(({ id }) => api("recipients", { recipient_id: id }))
  );
  const topRecipients = topRecipientsRes.flat();

  return {
    props: { ...ctx, country: countries[0], countryYears, topRecipients },
  };
}