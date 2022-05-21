import Link from "next/link";
import RecipientsTable from "../../components/recipientsTable.js";
import CountryYearsTable from "../../components/countryTable.js";
import api from "../../utils/api.js";

export default function Country({ country, years, topRecipients }) {
  return (
    <div className="content col-lg-8 col-md-8 col-sm-7">
      <header className="page-heading">
        <h2>
          EU Farm subsidies for {country.country}
          <br />
          <small> for all available years</small>
        </h2>
      </header>

      <p>
        These pages list farm subsidy payments made in{" "}
        <strong>{country.country}</strong> as published directly by the
        government of {country.country} or sourced via freedom of information
        requests.
      </p>

      <div className="section">
        <h3>Top recipients</h3>
        <RecipientsTable recipients={topRecipients} />
        <p className="more_info">
          <Link href="/search/?country=AT">
            <a>View all recipients &raquo;</a>
          </Link>
        </p>
      </div>
      <div className="section">
        <h3>Available years for Austria</h3>
        <CountryYearsTable country={country.country} years={years} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const results = await api("countries");
  const paths = results.map(({ country }) => ({
    params: { country },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const countries = await api("countries", { country: params.country });
  const years = await api("years", { country: params.country });
  const topRecipientIds = await api("recipients/base", {
    recipient_name__null: false,
    country: params.country,
    order_by: "-amount_sum",
    limit: 5,
  });
  const topRecipientsRes = await Promise.all(
    topRecipientIds.map(({ id }) => api("recipients", { recipient_id: id }))
  );
  const topRecipients = topRecipientsRes.flat();

  return { props: { country: countries[0], years, topRecipients } };
}
