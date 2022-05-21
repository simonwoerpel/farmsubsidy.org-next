import api from "../utils/api.js";
import Image from "next/image";
import SearchForm from "../components/searchForm.js";

export default function Index({ countries, topRecipients }) {
  return (
    <>
      <div className="row content-row">
        <div className="content col-lg-8 col-md-8 col-sm-7">
          <header className="page-heading">
            <h1>Search</h1>
          </header>
          <SearchForm countries={countries} />
        </div>

        <div className="sidebar col-lg-4 col-md-4 col-sm-5">
          <div className="right">
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
                <a href="https://okfn.de">Open Knowledge Foundation Germany</a>,
                a non-profit organisation working on transparency of public
                money.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const countries = await api("countries");
  const topRecipientIds = await api("recipients/base", {
    order_by: "-amount_sum",
    limit: 100,
  });
  const topRecipientsRes = await Promise.all(
    topRecipientIds.map(({ id }) => api("recipients", { recipient_id: id }))
  );
  const topRecipients = topRecipientsRes.flat();
  return { props: { countries, topRecipients } };
}
