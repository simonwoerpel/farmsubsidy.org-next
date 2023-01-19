import { useMemo } from "react";
import DataTable from "react-data-table-component";
import {
  YearLink,
  SchemeLink,
  RecipientLink,
  CountryLink,
  NutsLink,
} from "~/lib/links.js";
import { getPayments } from "~/lib/api.js";
import { DownloadCSVSync } from "./downloadCsv.js";
import ApiTable from "./apiTable.js";
import ApiLink from "./apiLink.js";
import { Numeric } from "./util.js";

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
  nuts3: {
    name: "Region",
    cell: ({ nuts3 }) => <NutsLink {...nuts3} />,
  },
  nuts1: {
    name: "State",
    cell: ({ nuts1 }) => <NutsLink {...nuts1} />,
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
    cell: (r) =>
      r.scheme ? <SchemeLink id={r.scheme_id} name={r.scheme} /> : null,
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

export default function RecipientPaymentsTable({ payments, recipient }) {
  const apiUrl = getPayments.getUrl({ recipient_id: recipient?.id });
  const columns = useMemo(
    () => [COLUMNS.year, COLUMNS.scheme, COLUMNS.amount],
    []
  );
  const actions = useMemo(
    () => [
      <DownloadCSVSync
        rows={payments}
        fileName="farmsubsidy_payments.csv"
        key="download"
      />,
      <ApiLink url={apiUrl} key="apiUrl" />,
    ],
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
