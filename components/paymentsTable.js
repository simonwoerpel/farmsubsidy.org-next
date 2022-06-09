import { useMemo } from "react";
import DataTable from "react-data-table-component";
import { Numeric } from "./util.js";
import { YearLink, SchemeLink } from "~/lib/links.js";
import { DownloadCSVSync } from "./downloadCsv.js";

const COLUMNS = {
  year: {
    name: "Year",
    selector: (r) => r.year,
    cell: (r) => <YearLink year={r.year} />,
    id: "year",
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

export default function RecipientPaymentsTable({ payments }) {
  const actions = useMemo(
    () => (
      <DownloadCSVSync rows={payments} fileName="farmsubsidy_payments.csv" />
    ),
    []
  );
  const paginationProps =
    payments.length > 10
      ? {
          pagination: true,
          paginationPerPage: 10,
          paginationRowsPerPageOptions: [10, 25, 50, 100],
        }
      : {};

  return (
    <DataTable
      title="Payments"
      columns={Object.values(COLUMNS)}
      data={payments}
      defaultSortFieldId="year"
      actions={actions}
      {...paginationProps}
    />
  );
}
