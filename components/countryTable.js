import Table from "react-bootstrap/Table";
import { CountryYearLink } from "../utils/links.js";

export default function CountryYearsTable({ activeYear, country, years }) {
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Year</th>
          <th>Recipients</th>
          <th className="text-right">Total amount</th>
        </tr>
      </thead>
      <tbody>
        {years.map(({ year, total_recipients, amount_sum }) => (
          <tr
            key={year}
            classNameName={activeYear == year ? "table-primary" : null}
          >
            <td>
              <CountryYearLink country={country} year={year} />
            </td>
            <td>{total_recipients}</td>
            <td className="money">{amount_sum}&nbsp;€</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
