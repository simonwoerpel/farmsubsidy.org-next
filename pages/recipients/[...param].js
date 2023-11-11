import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ListGroup from "react-bootstrap/ListGroup";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import LoadingPlaceholder from "~/components/placeholder.js";
import RecipientPaymentsTable from "~/components/paymentsTable.js";
import LegalNotice from "~/components/legalNotice.js";
import { CountryLink, LocationLink, RecipientLink } from "~/lib/links.js";
import { getRecipients, getRecipient, getPayments } from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";
import { useAuth } from "~/lib/auth.js";

export default function Recipient({
  recipientData,
  paymentsData = [],
  ...ctx
}) {
  const router = useRouter();
  const authenticated = useAuth();
  const [payments, setPayments] = useState(paymentsData);
  const [recipient, setRecipient] = useState(recipientData);

  // reload payments if we are authenticated after mount
  useEffect(() => {
    if (authenticated) {
      getPayments({ recipient_id: recipientData.id }).then((r) =>
        setPayments(r.results)
      );
      getRecipient(recipientData.id).then(setRecipient);
    }
  }, [authenticated]);

  return (
    <CustomPage title={recipient ? recipient.name[0] : null} {...ctx}>
      <Content>
        <header>
          <LoadingPlaceholder isLoading={router.isLoading}>
            <h1>{recipient && recipient.name[0]}</h1>
          </LoadingPlaceholder>
        </header>

        <LoadingPlaceholder as="p" isLoading={router.isLoading}>
          <p>
            {recipient && recipient.name[0]} is a recipient of farm subsidies
            from {recipient && <CountryLink country={recipient.country} />}.
          </p>
        </LoadingPlaceholder>

        <LoadingPlaceholder as="p" isLoading={router.isLoading}>
          <RecipientPaymentsTable payments={payments} recipient={recipient} />
          <LegalNotice />
        </LoadingPlaceholder>
      </Content>
      <Sidebar>
        {recipient && (
          <>
            <AmountWidget title="Total amount" value={recipient.amount_sum}>
              received <strong>{recipient.name[0]}</strong> from{" "}
              {Math.min(...recipient.years)} to {Math.max(...recipient.years)}{" "}
              in payments of farm subsidies from the European Union under{" "}
              <abbr title="Common Agricultural Policy">the CAP</abbr>.
            </AmountWidget>
            <Sidebar.StyledWidget header="Address">
              <ListGroup>
                {recipient.address.map((x) => (
                  <Link
                    href={LocationLink.getUrl({ location: x })}
                    key={x}
                    passHref
                    legacyBehavior
                  >
                    <ListGroup.Item action>{x}</ListGroup.Item>
                  </Link>
                ))}
              </ListGroup>
            </Sidebar.StyledWidget>
            {recipient.name.length > 1 && (
              <Sidebar.StyledWidget header="Names">
                <ListGroup>
                  {recipient.name.map((x) => (
                    <ListGroup.Item key={x}>{x}</ListGroup.Item>
                  ))}
                </ListGroup>
              </Sidebar.StyledWidget>
            )}
            {recipient.recipient_url?.length > 1 && (
              <Sidebar.StyledWidget header="Source data">
                <ListGroup>
                  {recipient.recipient_url.map((x) => (
                    <ListGroup.Item key={x} action href={x}>
                      {x}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Sidebar.StyledWidget>
            )}
          </>
        )}
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticPaths() {
  // pre-render the top recipients for each country
  const { countries } = await getCachedContext();
  const recipients = await Promise.all(
    countries.map(({ country }) =>
      getRecipients(
        {
          country,
          order_by: "-amount_sum",
          limit: process.env.PRERENDER_RECIPIENTS_COUNT || 5,
        },
        false
      )
    )
  );
  const paths = recipients
    .flat()
    .map((r) => ({ params: { param: RecipientLink.getParams(r) } }));
  return { paths, fallback: true };
}

export async function getStaticProps({
  params: {
    param: [recipient_id, ...rest], // recipients/[id]/[slug]
  },
}) {
  const ctx = await getCachedContext();
  const recipientData = await getRecipient(recipient_id);
  const { results: paymentsData } = await getPayments({ recipient_id });

  return { props: { recipientData, paymentsData, ...ctx } };
}
