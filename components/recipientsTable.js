import Table from "react-bootstrap/Table";
import { RecipientLink } from "../utils/links.js";

export default function RecipientsTable({ recipients }) {
  return (
    <Table bordered hover responsive>
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th className="text-right">Total amount</th>
        </tr>
      </thead>
      <tbody>
        {recipients.map(({ id, name, address, amount_sum }) => (
          <tr key={id}>
            <td>
              <RecipientLink id={id} name={name} />
            </td>
            <td>{address}</td>
            <td className="money">{amount_sum}&nbsp;€</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
