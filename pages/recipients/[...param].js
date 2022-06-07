import { useRouter } from "next/router";
import Link from "next/link";
import ListGroup from "react-bootstrap/ListGroup";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { AmountWidget } from "~/components/widgets.js";
import LoadingPlaceholder from "~/components/placeholder.js";
import RecipientPaymentsTable from "~/components/paymentsTable.js";
import { Numeric } from "~/components/util.js";
import { CountryLink, LocationLink, RecipientLink } from "~/lib/links.js";
import api from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";

export default function Recipient({ recipient, payments = [], ...ctx }) {
  const router = useRouter();

  return (
    <CustomPage {...ctx}>
      <Content>
        <header className="page-heading">
          <LoadingPlaceholder isLoading={router.isLoading}>
            <h2>{recipient && recipient.name[0]}</h2>
          </LoadingPlaceholder>
        </header>

        <div className="section">
          <LoadingPlaceholder as="p" isLoading={router.isLoading}>
            <p>
              {recipient && recipient.name[0]} is a recipient of farm subsidies
              from {recipient && <CountryLink country={recipient.country} />}.
            </p>
          </LoadingPlaceholder>
        </div>

        <div className="section">
          <h3>Payments</h3>
          <LoadingPlaceholder as="p" isLoading={router.isLoading}>
            <RecipientPaymentsTable payments={payments} />
          </LoadingPlaceholder>
        </div>
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
      api("recipients", {
        country,
        order_by: "-amount_sum",
        recipient_name__null: false,
        limit: process.env.PRERENDER_RECIPIENTS_COUNT || 5,
      })
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
  const recipients = await api("recipients", { recipient_id });
  const payments = await api("payments", { recipient_id });
  // const recipient = recipienst[0]
  // const nearByRecipients = await api("recipients", {recipient_address__ilike: `${recipient.address}`})

  return { props: { recipient: recipients[0], payments, ...ctx } };
}
