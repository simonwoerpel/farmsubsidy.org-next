import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import RecipientsTable from "~/components/recipientsTable.js";
import LegalNotice from "~/components/legalNotice.js";
import { getSchemes, getScheme, getRecipientsChained } from "~/lib/api.js";
import { SchemeLink } from "~/lib/links.js";
import getCachedContext from "~/lib/context.js";
import { useAuth } from "~/lib/auth.js";
import LoadingPlaceholder from "~components/placeholder";

async function getTopRecipients(scheme_id) {
  return await getRecipientsChained({
    scheme_id,
    order_by: "-amount_sum",
    limit: 5,
  });
}

export default function Scheme({ scheme, topRecipients, ...ctx }) {
  const router = useRouter();
  const authenticated = useAuth();
  const [recipients, setRecipients] = useState(topRecipients);

  // reload top recipients if we are authenticated after mount
  useEffect(() => {
    if (authenticated) {
      getTopRecipients(scheme.id).then(setRecipients);
    }
  }, [authenticated, scheme]);

  const actions = scheme
    ? [
        <SchemeLink.Recipients {...scheme} key="recipients" />,
        <SchemeLink.Payments {...scheme} key="payments" />,
      ]
    : [];

  return (
    <CustomPage title={scheme ? scheme.name : null} {...ctx}>
      <Content>
        <LoadingPlaceholder isLoading={router.isLoading}>
          <header>
            <h1>Scheme</h1>
            <h3>{scheme ? scheme.name : null}</h3>
          </header>
        </LoadingPlaceholder>

        <LoadingPlaceholder isLoading={router.isLoading}>
          {scheme && scheme.description && (
            <div className="section">
              <p>{scheme.description}</p>
            </div>
          )}
        </LoadingPlaceholder>

        <div className="section">
          <RecipientsTable
            title="Top recipients"
            recipients={recipients}
            actions={actions}
          />
        </div>

        <LegalNotice />
      </Content>
      <Sidebar>
        <LoadingPlaceholder isLoading={router.isLoading}>
          {scheme && (
            <AmountWidget title="Total amount" value={scheme.amount_sum}>
              received all recipients from {Math.min(...scheme.years)} to{" "}
              {Math.max(...scheme.years)} within the scheme{" "}
              <em>{scheme.name}</em>
            </AmountWidget>
          )}
        </LoadingPlaceholder>
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticPaths() {
  const { results: schemes } = await getSchemes({
    limit: 25,
    order_by: "-amount_sum",
  });
  const paths = schemes.map((s) => ({
    params: { param: SchemeLink.getParams(s) },
  }));
  return { paths, fallback: true };
}

export async function getStaticProps({
  params: {
    param: [scheme_id, ...rest], // schemes/[id]/[slug]
  },
}) {
  const ctx = await getCachedContext();
  const scheme = await getScheme(scheme_id);
  const topRecipients = await getTopRecipients(scheme_id);

  return { props: { scheme, topRecipients, ...ctx } };
}
