import Link from "next/link";
import { IndexPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { RecipientList, CountryList } from "~/components/lists.js";
import { getRecipientsChained } from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";

export default function Index({ countries, years, topRecipients }) {
  return (
    <IndexPage countries={countries} years={years}>
      <Content>
        <header className="page-heading">
          <h1>Welcome to farmsubsidy.org</h1>
        </header>

        <p className="lead">
          The European Union spends around €59 billion a year on farm subsidies.
          <br />
          This site tells you who receives the money.
        </p>

        <iframe
          src="//player.vimeo.com/video/6184633"
          width="100%"
          height="352"
          frameBorder="0"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen
        ></iframe>

        <h2>Official Sources</h2>

        <p>Official sources on the CAP/European agricultural policy.</p>

        <ul>
          <li>
            <a
              href="http://ec.europa.eu/agriculture/index_en.htm"
              target="_blank"
              rel="noreferrer"
            >
              European Commission - Agriculture and Rural Development
            </a>
          </li>
          <li>
            <a
              href="http://europa.eu/pol/agr/index_en.htm"
              target="_blank"
              rel="noreferrer"
            >
              European Union - Agriculture
            </a>
          </li>
        </ul>

        <h2>Basic Information</h2>
        <p>Some basic information to start reading.</p>

        <ul>
          <li>
            <a
              href="http://en.wikipedia.org/wiki/Common_Agricultural_Policy"
              target="_blank"
              rel="noreferrer"
            >
              Wikipedia - Common Agricultural Policy (CAP)
            </a>
          </li>
        </ul>
      </Content>
      <Sidebar>
        <Sidebar.Widget title="All Time Top Recipients">
          <RecipientList items={topRecipients} />
        </Sidebar.Widget>

        <Sidebar.Widget title="Browse by country">
          <CountryList items={countries} />
        </Sidebar.Widget>
      </Sidebar>
    </IndexPage>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  const topRecipients = await getRecipientsChained({
    order_by: "-amount_sum",
    limit: 5,
  });
  return { props: { ...ctx, topRecipients } };
}
