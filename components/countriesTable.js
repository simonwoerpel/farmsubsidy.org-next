import Table from "react-bootstrap/Table";
import { CountryLink, CountryYearLink } from "../utils/links.js";

export default function CountriesTable({ countries }) {
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Country</th>
          <th>Oldest</th>
          <th>Latest</th>
          <th>Recipients</th>
          <th className="text-right">Total amount</th>
        </tr>
      </thead>
      <tbody>
        {countries.map(({ country, years, total_recipients, amount_sum }) => (
          <tr key={country}>
            <td>
              <CountryLink country={country} />
            </td>
            <td>
              <CountryYearLink
                country={country}
                year={Math.min(...years).toString()}
              />
            </td>
            <td>
              <CountryYearLink
                country={country}
                year={Math.max(...years).toString()}
              />
            </td>
            <td>{total_recipients}</td>
            <td className="money">{amount_sum}&nbsp;€</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
