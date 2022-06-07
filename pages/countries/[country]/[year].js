import Button from "react-bootstrap/Button";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import CountryYearsTable from "~/components/countryTable.js";
import api from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";
import { CountryYearLink } from "~/lib/links.js";

export default function CountryYear({
  country,
  year,
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
            <small> for {year}</small>
          </h2>
        </header>

        <p>
          These pages list farm subsidy payments made in{" "}
          <strong>{country.name}</strong> for {year} as published directly by
          the government of {country.name} or sourced via freedom of information
          requests.
        </p>

        <div className="section">
          <h3>{`Top recipients in ${year}`}</h3>
          <RecipientsTable
            recipients={topRecipients}
            columnsExclude={["country"]}
          />
          <p className="more_info">
            <CountryYearLink.Recipients {...{ ...country, year }} />
          </p>
        </div>
        <div className="section">
          <h3>{`Available years for ${country.name}`}</h3>
          <CountryYearsTable
            activeYear={year}
            country={country.country}
            years={countryYears}
          />
        </div>
      </Content>
      <Sidebar>
        <AmountWidget
          title="Total amount"
          value={country.amount_sum}
          country={country.country}
          year={year}
        >
          received all recipients in {country.name} in {year}
        </AmountWidget>
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticPaths() {
  const results = await api("countries");

  const paths = [];
  results.map(({ country, years }) => {
    years.map((year) => {
      paths.push({ params: { country, year: year.toString() } });
    });
  });

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const ctx = await getCachedContext();
  const countries = await api("countries", {
    country: params.country,
    year: params.year,
  });

  const countryYears = await api("years", { country: params.country });

  const topRecipients = await api("recipients", {
    recipient_name__null: false,
    country: params.country,
    year: params.year,
    order_by: "-amount_sum",
    limit: 5,
  });

  return {
    props: {
      year: params.year.toString(),
      country: countries[0],
      countryYears,
      topRecipients,
      ...ctx,
    },
  };
}
