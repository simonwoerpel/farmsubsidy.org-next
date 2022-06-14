import { useMemo } from "react";
import DataTable from "react-data-table-component";
import { Numeric } from "./util.js";
import {
  YearLink,
  SchemeLink,
  RecipientLink,
  CountryLink,
} from "~/lib/links.js";
import { DownloadCSVSync } from "./downloadCsv.js";
import ApiTable from "./apiTable.js";

const COLUMNS = {
  recipient: {
    name: "Recipient",
    selector: (r) => r.recipient_name,
    cell: (r) => <RecipientLink {...r} />,
  },
  country: {
    name: "Country",
    selector: (r) => r.country,
    cell: (r) => <CountryLink country={r.country} />,
  },
  year: {
    name: "Year",
    selector: (r) => r.year,
    cell: (r) => <YearLink year={r.year} />,
    column: "year",
    id: "year",
    sortable: true,
  },
  scheme: {
    name: "Scheme",
    selector: (r) => r.scheme,
    cell: (r) => <SchemeLink id={r.scheme_id} name={r.scheme} />,
    column: "scheme",
    id: "scheme",
    sortable: true,
  },
  amount: {
    name: "Amount",
    selector: (r) => r.amount,
    cell: (r) => <Numeric value={r.amount} append="€" />,
    id: "amount",
    column: "amount",
    sortable: true,
  },
};

export default function RecipientPaymentsTable({ payments }) {
  const columns = useMemo(
    () => [COLUMNS.year, COLUMNS.scheme, COLUMNS.amount],
    []
  );
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
      columns={columns}
      data={payments}
      defaultSortFieldId="year"
      actions={actions}
      {...paginationProps}
    />
  );
}

export function PaymentsSearchTable(props) {
  const columns = Object.values(COLUMNS);
  return <ApiTable columns={columns} {...props} />;
}
