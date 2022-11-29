import Button from "react-bootstrap/Button";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import CountryYearsTable from "~/components/countryTable.js";
import LegalNotice from "~/components/legalNotice.js";
import { getCountry, getRecipientsChained, getYears } from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";
import { CountryLink } from "~/lib/links.js";
import { PUBLIC_YEARS } from "~/lib/settings.js";

export default function Country({
  country,
  countryYears,
  topRecipients,
  ...ctx
}) {
  const actions = [
    <CountryLink.Recipients {...country} key="recipients" />,
    <CountryLink.Payments {...country} key="payments" />,
  ];

  const years = PUBLIC_YEARS.join(" - ");

  return (
    <CustomPage {...ctx}>
      <Content>
        <header>
          <h1>{country.name}</h1>
          <h3>EU Farm subsidies for {years}</h3>
        </header>

        <p>
          These pages list farm subsidy payments made in{" "}
          <strong>{country.name}</strong> as published directly by the
          government of {country.name} or sourced via freedom of information
          requests.
        </p>

        <RecipientsTable
          title={`Top recipients (${years})`}
          recipients={topRecipients}
          columnsExclude={["country"]}
          actions={actions}
        />

        <LegalNotice />

        <CountryYearsTable
          title={`Available years for ${country.name}`}
          country={country.country}
          years={countryYears}
        />
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
  const { countries } = await getCachedContext();
  const paths = countries.map(({ country }) => ({
    params: CountryLink.getParams({ country }),
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params: { country } }) {
  const ctx = await getCachedContext();
  const countryData = await getCountry(country);
  const countryYears = await getYears({ country });
  const topRecipients = await getRecipientsChained({
    country,
    order_by: "-amount_sum",
    limit: 5,
  });

  return {
    props: { ...ctx, country: countryData, countryYears, topRecipients },
  };
}
