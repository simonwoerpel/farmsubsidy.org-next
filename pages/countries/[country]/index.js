import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import CountryYearsTable from "~/components/countryTable.js";
import NutsTable from "~/components/nutsTable.js";
import LegalNotice from "~/components/legalNotice.js";
import {
  getNuts,
  getCountry,
  getRecipientsChained,
  getYears,
} from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";
import { CountryLink } from "~/lib/links.js";
import { PUBLIC_YEARS } from "~/lib/settings.js";
import { useAuth } from "~/lib/auth.js";

async function getTopRecipients({ country }) {
  return await getRecipientsChained({
    country,
    order_by: "-amount_sum",
    limit: 5,
  });
}

export default function Country({
  country,
  countryYears,
  topRecipients,
  nuts,
  ...ctx
}) {
  const authenticated = useAuth();
  const [recipients, setRecipients] = useState(topRecipients);

  // reload top recipients if we are authenticated after mount
  useEffect(() => {
    if (authenticated) {
      getTopRecipients(country).then(setRecipients);
    }
  }, [authenticated]);

  const actions = [
    <CountryLink.Recipients {...country} key="recipients" />,
    <CountryLink.Payments {...country} key="payments" />,
  ];

  const years = countryYears.map((y) => y.year);
  const [minY, maxY] = [Math.min(...years), Math.max(...years)];
  const yearsDisplay = authenticated
    ? [minY, maxY].join(" - ")
    : PUBLIC_YEARS.join(" - ");

  return (
    <CustomPage title={country.name} {...ctx}>
      <Content>
        <header>
          <h1>{country.name}</h1>
          <h3>EU Farm subsidies for {yearsDisplay}</h3>
        </header>

        <p>
          These pages list farm subsidy payments made in{" "}
          <strong>{country.name}</strong> as published directly by the
          government of {country.name} or sourced via freedom of information
          requests.
        </p>

        <RecipientsTable
          title={`Top recipients (${yearsDisplay})`}
          recipients={recipients}
          columnsExclude={["country"]}
          actions={actions}
        />

        <LegalNotice />

        <CountryYearsTable
          title={`Available years for ${country.name}`}
          country={country.country}
          years={countryYears}
        />

        {nuts.length ? <NutsTable title="NUTS regions" nuts={nuts} /> : null}
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
  const topRecipients = await getTopRecipients({ country });
  let nuts = await getNuts(1, { country });
  nuts = nuts.filter(n => n.country == country)

  return {
    props: { ...ctx, country: countryData, countryYears, topRecipients, nuts },
  };
}
