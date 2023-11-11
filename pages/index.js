import { useState, useEffect } from "react";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import { IndexPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import { RecipientList, CountryList } from "~/components/lists.js";
import { getRecipientsChained } from "~/lib/api.js";
import getCachedContext from "~/lib/context.js";
import { useAuth } from "~/lib/auth.js";

async function getTopRecipients() {
  return await getRecipientsChained({
    order_by: "-amount_sum",
    limit: 5,
  });
}

export default function Index({ ...ctx }) {
  const authenticated = useAuth();
  const [recipients, setRecipients] = useState(ctx.topRecipients);

  // reload top recipients if we are authenticated after mount
  useEffect(() => {
    if (authenticated) {
      getTopRecipients().then(setRecipients);
    }
  }, [authenticated]);

  return (
    <IndexPage {...ctx}>
      <Content>
        <header className="page-heading">
          <h1>Welcome to farmsubsidy.org</h1>
        </header>

        <p>
          The aim of farmsubsidy.org is to obtain detailed data relating to
          payments and recipients of farm subsidies in every EU member state and
          make this data available in a way that is useful to European citizens.
        </p>

        <h3>Recent updates</h3>

        <p>
          Please have a look at the{" "}
          <Link href="https://github.com/okfde/farmsubsidy-store/blob/main/CHANGELOG.md">
            data changes
          </Link>{" "}
          as the platform is updated regulary and some numbers my change over
          time.
        </p>

        <h4>November 2023</h4>

        <p>
          For the <a href="https://climatearena.eu/">Climate Arena
          Conference</a> in Vienna, Nov. 2023, we updated most of the countries
          data to include the recipients until 2022. Due to legal reasons, the
          last two recent years are public acessible, which is from now on 
          <strong> 2021 and 2022</strong>.
        </p>

        <h4>December 2022</h4>

        <p>
          In cooperation with WDR, NDR, Süddeutsche Zeitung, Correctiv, Der
          Standard, IrpiMedia, Reporter.lu, Reporters United, Expresso, Follow
          The Money and Gazeta Wyborcza, FragDenStaat analysed the data and
          published it jointly in December 2022.{" "}
          <Link href="/stories">Here is what we have found</Link>.
        </p>

        <h3>Information</h3>

        <ul>
          <li>
            <Link href="/faq">About EU farm subsidies</Link>
          </li>
          <li>
            <Link href="/data">About the data</Link>
          </li>
          <li>
            <Link href="/search">Start exploring!</Link>
          </li>
        </ul>

        <h4>Official Sources</h4>

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
      </Content>
      <Sidebar>
        <Sidebar.Widget title="All Time Top Recipients">
          <RecipientList items={recipients} />
        </Sidebar.Widget>

        <Sidebar.Widget title="Browse by country">
          <CountryList items={ctx.countries} />
        </Sidebar.Widget>
      </Sidebar>
    </IndexPage>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  const topRecipients = await getTopRecipients();
  return { props: { ...ctx, topRecipients } };
}
