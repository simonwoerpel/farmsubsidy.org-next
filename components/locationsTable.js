import Stack from "react-bootstrap/Stack";
import ApiTable from "./apiTable.js";
import { Numeric, Amount } from "./util.js";
import { LocationLink, CountryLink, YearLink } from "~/lib/links.js";

const COLUMNS = {
  location: {
    name: "Location",
    selector: (r) => r.location,
    cell: (r) => <LocationLink {...r} />,
  },
  country: {
    name: "Country",
    selector: (r) => r.countries,
    cell: (r) => r.countries.map((c) => <CountryLink key={c} country={c} />),
  },
  total_recipients: {
    name: "Recipients",
    selector: (r) => <Numeric value={r.total_recipients} />,
    sortable: true,
    column: "total_recipients",
    id: "total_recipients",
  },
  amount_sum: {
    name: "Total amount",
    selector: (r) => r.amount_sum,
    cell: (r) => <Amount value={r.amount_sum} />,
    sortable: true,
    column: "amount_sum",
    id: "amount_sum",
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

export default function LocationsTable(props) {
  const columns = Object.keys(COLUMNS).map((k) => COLUMNS[k]);

  return <ApiTable columns={columns} {...props} />;
}
