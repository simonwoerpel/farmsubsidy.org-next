import slugify from "slugify";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import api from "~/lib/api.js";
import { SchemeLink } from "~/lib/links.js";
import getCachedContext from "~/lib/context.js";

export default function Country({ scheme, topRecipients, ...ctx }) {
  return (
    <CustomPage {...ctx}>
      <Content>
        <header className="page-heading">
          <h2>
            EU Farm subsidies
            <br />
            <small>{scheme.name}</small>
          </h2>
        </header>

        <div className="section">
          <h3>Top recipients</h3>
          <RecipientsTable recipients={topRecipients} />
          <p className="more_info">
            <SchemeLink.Recipients {...scheme} />
          </p>
        </div>
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
  const results = await api(
    "schemes",
    {
      scheme_id__null: false,
      amount__gte: 0,
      order_by: "-amount_sum",
    },
    false,
    true
  );
  const paths = results.map((s) => ({
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
  const schemes = await api("schemes", { scheme_id });
  const topRecipientIds = await api("recipients/base", {
    scheme_id,
    recipient_name__null: false,
    amount__null: false,
    order_by: "-amount_sum",
    limit: 5,
  });
  const topRecipientsRes = await Promise.all(
    topRecipientIds.map(({ id }) => api("recipients", { recipient_id: id }))
  );
  const topRecipients = topRecipientsRes.flat();

  return { props: { scheme: schemes[0], topRecipients, ...ctx } };
}
