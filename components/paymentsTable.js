import DataTable from "react-data-table-component";
import { Numeric } from "./util.js";
import { YearLink, SchemeLink } from "~/lib/links.js";

const COLUMNS = {
  year: {
    name: "Year",
    selector: (r) => r.year,
    cell: (r) => <YearLink year={r.year} />,
    sortable: true,
  },
  scheme: {
    name: "Scheme",
    selector: (r) => r.scheme,
    cell: (r) => <SchemeLink id={r.scheme_id} name={r.scheme} />,
    sortable: true,
  },
  amount_sum: {
    name: "Amount",
    selector: (r) => r.amount,
    cell: (r) => <Numeric value={r.amount} append="€" />,
    sortable: true,
  },
};

export default function RecipientPaymentsTable({
  payments,
  columns = Object.keys(COLUMNS),
  paginated = false,
}) {
  const paginationProps = paginated
    ? {
        pagination: true,
        paginationPerPage: 25,
        paginationRowsPerPageOptions: [10, 25, 50, 100],
      }
    : {};

  return (
    <DataTable
      columns={columns.map((c) => COLUMNS[c])}
      data={payments}
      {...paginationProps}
    />
  );
}
