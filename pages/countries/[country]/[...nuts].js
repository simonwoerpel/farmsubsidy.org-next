import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import NutsTable from "~/components/nutsTable.js";
import LegalNotice from "~/components/legalNotice.js";
import { getNuts, getRecipientsChained } from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";
import { NutsLink, CountryLink } from "~/lib/links.js";
import { PUBLIC_YEARS } from "~/lib/settings.js";
import { useAuth } from "~/lib/auth.js";

async function getTopRecipients(level, nuts) {
  return await getRecipientsChained({
    [`nuts${level}`]: nuts,
    order_by: "-amount_sum",
    limit: 5,
  });
}

export default function Nuts({ nuts, subNuts, topRecipients, ...ctx }) {
  const authenticated = useAuth();
  const [recipients, setRecipients] = useState(topRecipients);

  // reload top recipients if we are authenticated after mount
  useEffect(() => {
    if (authenticated) {
      getTopRecipients(nuts.level, nuts.code).then(setRecipients);
    }
  }, [authenticated]);

  const nutsLabel = `${nuts.code} - ${nuts.name}`;
  const [minY, maxY] = [Math.min(...nuts.years), Math.max(...nuts.years)];
  const yearsDisplay = authenticated
    ? [minY, maxY].join(" - ")
    : PUBLIC_YEARS.join(" - ");

  const actions = [
    <NutsLink.Recipients {...nuts} key="recipients" />,
    <NutsLink.Payments {...nuts} key="payments" />,
  ];

  return (
    <CustomPage title={nutsLabel} {...ctx}>
      <Content>
        <header>
          <h1>{nuts.name}</h1>
          <h3>NUTS region {nuts.code}</h3>
        </header>

        <p>
          These pages list farm subsidy payments made in{" "}
          <strong>{nutsLabel}</strong> as published directly by the government
          of <CountryLink country={nuts.country} /> or sourced via freedom of
          information requests.
        </p>

        <p><strong>Please note:</strong> This data is based on geocoding of
        recipient addresses which may be incomplete or inaccurate. There can
        exist more recipients in this region as listed here.</p>

        <RecipientsTable
          title={`Top recipients in ${nutsLabel} (${yearsDisplay})`}
          recipients={recipients}
          columnsExclude={[`nuts${nuts.level}`]}
          actions={actions}
        />

        <LegalNotice />

        {subNuts.length ? <NutsTable title="Sub regions" nuts={subNuts} /> : null}
      </Content>
      <Sidebar>
        <AmountWidget
          title="Total amount"
          value={nuts.amount_sum}
          country={nuts.country}
        >
          received all recipients in <em>{nutsLabel}</em> from{" "}
          {Math.min(...nuts.years)} to {Math.max(...nuts.years)}
        </AmountWidget>
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticPaths() {
  const nuts = await Promise.all([getNuts(1), getNuts(2), getNuts(3)]);
  const paths = nuts.flat().map(({ country, path }) => ({
    params: { country, nuts: path.substr(3).split("/") },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params: { nuts } }) {
  const ctx = await getCachedContext();
  const level = nuts.length;
  const nutsId = nuts[nuts.length - 1];
  const lookup = { [`nuts${level}`]: nutsId };
  const res = await getNuts(level, lookup);
  const topRecipients = await getTopRecipients(level, nutsId);
  const subNuts = level < 3 ? await getNuts(level + 1, lookup) : [];

  return {
    props: {
      nuts: res[0],
      subNuts,
      topRecipients,
      ...ctx,
    },
  };
}
