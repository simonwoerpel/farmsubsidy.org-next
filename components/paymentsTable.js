import Table from "react-bootstrap/Table";
import { YearLink, SchemeLink } from "../utils/links.js";

export default function RecipientPaymentsTable({ payments }) {
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Year</th>
          <th>Scheme</th>
          <th className="text-right">Total amount</th>
        </tr>
      </thead>
      <tbody>
        {payments
          ? payments.map(({ pk, scheme, year, amount }) => (
              <tr key={pk}>
                <td>
                  <YearLink year={year} />
                </td>
                <td>
                  <SchemeLink scheme={scheme} />
                </td>
                <td className="money">{amount}&nbsp;€</td>
              </tr>
            ))
          : "No data."}
      </tbody>
    </Table>
  );
}
