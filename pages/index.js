import Image from "next/image";
import Link from "next/link";
import { RecipientLink, CountryLink } from "../utils/links.js";
import api from "../utils/api.js";

export default function Index({ countries, topRecipients }) {
  return (
    <>
      <div className="row content-row">
        <div className="content col-lg-8 col-md-8 col-sm-7">
          <header className="page-heading">
            <h1>Welcome to farmsubsidy.org</h1>
          </header>

          <p className="lead">
            The European Union spends around €59 billion a year on farm
            subsidies.
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
        </div>

        <div className="sidebar col-lg-4 col-md-4 col-sm-5">
          <div className="right">
            <div className="sidebar-widget">
              <h3>All Time Top Recipients</h3>
              <ul>
                {topRecipients.map((r) => (
                  <li key={r.id}>
                    <RecipientLink {...r} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="sidebar-widget">
              <h3>Browse by country</h3>
              <ul>
                <li>
                  <Link href="/search">
                    <a>All Countries</a>
                  </Link>
                </li>

                {countries.map(({ country }) => (
                  <li key={country}>
                    <CountryLink country={country} />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="sidebar-widget">
            <div className="text-center">
              <a href="https://okfn.de">
                <Image
                  width="100%"
                  height="100%"
                  className="img-fluid"
                  src="/images/okfde.svg"
                  alt="Open Knowledge Foundation Germany"
                />
              </a>
            </div>
            <p>
              FarmSubsidy.org is a project of the{" "}
              <a href="https://okfn.de">Open Knowledge Foundation Germany</a>, a
              non-profit organisation working on transparency of public money.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const countries = await api("countries");
  const topRecipientIds = await api("recipients/base", {
    recipient_name__null: false,
    order_by: "-amount_sum",
    limit: 5,
  });
  const topRecipientsRes = await Promise.all(
    topRecipientIds.map(({ id }) => api("recipients", { recipient_id: id }))
  );
  const topRecipients = topRecipientsRes.flat();
  return { props: { countries, topRecipients } };
}
