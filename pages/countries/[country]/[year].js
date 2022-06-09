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
        <header>
          <h1>{country.name}</h1>
          <h3>EU Farm subsidies for {year}</h3>
        </header>

        <p>
          These pages list farm subsidy payments made in{" "}
          <strong>{country.name}</strong> for {year} as published directly by
          the government of {country.name} or sourced via freedom of information
          requests.
        </p>

        <RecipientsTable
          title={`Top recipients in ${year}`}
          recipients={topRecipients}
          columnsExclude={["country"]}
          actions={<CountryYearLink.Recipients {...{ ...country, year }} />}
        />

        <CountryYearsTable
          title={`Available years for ${country.name}`}
          activeYear={year}
          country={country.country}
          years={countryYears}
        />
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
