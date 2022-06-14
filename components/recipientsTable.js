import DataTable from "react-data-table-component";
import Stack from "react-bootstrap/Stack";
import {
  RecipientLink,
  CountryLink,
  YearLink,
  LocationLink,
} from "~/lib/links.js";
import { Numeric } from "./util.js";
import ApiTable from "./apiTable.js";

const COLUMNS = {
  name: {
    name: "Name",
    selector: (r) => r.name[0],
    cell: (r) => <RecipientLink {...r} />,
  },
  address: {
    name: "Location",
    selector: (r) => <LocationLink location={r.address[0]} />,
  },
  amount_sum: {
    name: "Total amount",
    selector: (r) => r.amount_sum,
    cell: (r) => <Numeric value={r.amount_sum} append="€" />,
    column: "amount_sum",
    id: "amount_sum",
    sortable: true,
  },
  total_payments: {
    name: "Payments",
    selector: (r) => r.total_payments,
    cell: (r) => <Numeric value={r.total_payments} />,
    column: "total_payments",
    id: "total_payments",
    sortable: true,
  },
  country: {
    name: "Country",
    selector: (r) => r.country,
    cell: (r) => <CountryLink country={r.country} />,
  },
  years: {
    name: "Active years",
    selector: (r) => r.years,
    cell: (r) => (
      <Stack direction="horizontal" gap={1}>
        {r.years.sort().map((y) => (
          <YearLink key={y} year={y} />
        ))}
      </Stack>
    ),
  },
};

export default function RecipientsTable({
  recipients,
  columns = Object.keys(COLUMNS),
  columnsExclude = null,
  ...props
}) {
  if (!!columnsExclude) {
    columns = columns.filter((c) => columnsExclude.indexOf(c) < 0);
  }

  return (
    <DataTable
      columns={columns.map((c) => COLUMNS[c])}
      data={recipients}
      defaultSortFieldId="amount_sum"
      defaultSortAsc={false}
      {...props}
    />
  );
}

export function RecipientsSearchTable(props) {
  const columns = Object.values(COLUMNS);
  return <ApiTable columns={columns} {...props} />;
}
