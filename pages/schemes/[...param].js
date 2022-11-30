import slugify from "slugify";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import LegalNotice from "~/components/legalNotice.js";
import { getSchemes, getScheme, getRecipientsChained } from "~/lib/api.js";
import { SchemeLink } from "~/lib/links.js";
import getCachedContext from "~/lib/context.js";

export default function Scheme({ scheme, topRecipients, ...ctx }) {
  const actions = [
    <SchemeLink.Recipients {...scheme} key="recipients" />,
    <SchemeLink.Payments {...scheme} key="payments" />,
  ];

  return (
    <CustomPage {...ctx}>
      <Content>
        <header>
          <h1>Scheme</h1>
          <h3>{scheme.name}</h3>
        </header>

        <div className="section">
          <RecipientsTable
            title="Top recipients"
            recipients={topRecipients}
            actions={actions}
          />
        </div>

        <LegalNotice />
      </Content>
      <Sidebar>
        <AmountWidget title="Total amount" value={scheme.amount_sum}>
          received all recipients from {Math.min(...scheme.years)} to{" "}
          {Math.max(...scheme.years)} within the scheme <em>{scheme.name}</em>
        </AmountWidget>
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticPaths() {
  const { results: schemes } = await getSchemes({ limit: 4000 });
  const paths = schemes.map((s) => ({
    params: { param: SchemeLink.getParams(s) },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({
  params: {
    param: [scheme_id, ...rest], // schemes/[id]/[slug]
  },
}) {
  const ctx = await getCachedContext();
  const scheme = await getScheme(scheme_id);
  const topRecipients = await getRecipientsChained({
    scheme_id,
    order_by: "-amount_sum",
    limit: 5,
  });

  return { props: { scheme, topRecipients, ...ctx } };
}
