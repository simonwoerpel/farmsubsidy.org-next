import api from "../utils/api.js";
import CountriesTable from "../components/countriesTable.js";

export default function Countries({ countries }) {
  return (
    <div className="content col-lg-8 col-md-8 col-sm-7">
      <header className="page-heading">
        <h2>Browse data by country</h2>
      </header>

      <div className="section">
        <CountriesTable countries={countries} />
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const countries = await api("countries");
  return { props: { countries } };
}
