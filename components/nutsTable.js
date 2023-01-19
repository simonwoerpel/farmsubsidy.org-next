import DataTable from "react-data-table-component";
import { Numeric, Amount, Recipients } from "./util.js";
import { NutsLink } from "~/lib/links.js";

const COLUMNS = {
  name: {
    name: "Name",
    selector: (r) => r.name,
    cell: (r) => <NutsLink {...r} />,
    sortable: true,
    column: "name",
    id: "name",
  },
  total_recipients: {
    name: "Recipients",
    selector: (r) => r.total_recipients,
    cell: (r) => <Recipients link={NutsLink} {...r} />,
    sortable: true,
  },
  amount_sum: {
    name: "Total amount",
    selector: (r) => r.amount_sum,
    cell: (r) => <Amount value={r.amount_sum} append="€" />,
    sortable: true,
    id: "amount_sum",
  },
};

export default function NutsTable({
  nuts,
  columns = Object.keys(COLUMNS),
  ...props
}) {
  return (
    <DataTable
      columns={columns.map((c) => COLUMNS[c])}
      data={nuts}
      defaultSortFieldId="amount_sum"
      defaultSortAsc={false}
      {...props}
    />
  );
}
