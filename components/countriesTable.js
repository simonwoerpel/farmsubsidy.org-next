import DataTable from "react-data-table-component";
import { Numeric, Amount, Recipients } from "./util.js";
import { CountryLink, CountryYearLink } from "~/lib/links.js";

const COLUMNS = {
  country: {
    name: "Country",
    selector: (r) => r.country,
    cell: (r) => <CountryLink {...r} />,
    sortable: true,
    id: "name",
  },
  oldest: {
    name: "Oldest",
    selector: (r) => Math.min(...r.years),
    cell: (r) => (
      <CountryYearLink country={r.country} year={Math.min(...r.years)} />
    ),
    sortable: true,
  },
  latest: {
    name: "Latest",
    selector: (r) => Math.max(...r.years),
    cell: (r) => (
      <CountryYearLink country={r.country} year={Math.max(...r.years)} />
    ),
    sortable: true,
  },
  total_recipients: {
    name: "Recipients",
    selector: (r) => r.total_recipients,
    cell: (r) => <Recipients link={CountryLink} {...r} />,
    sortable: true,
  },
  amount_sum: {
    name: "Total amount",
    selector: (r) => r.amount_sum,
    cell: (r) => <Amount value={r.amount_sum} />,
    sortable: true,
  },
};

export default function CountriesTable({ countries }) {
  const columns = Object.keys(COLUMNS).map((c) => COLUMNS[c]);
  return (
    <DataTable columns={columns} data={countries} defaultSortFieldId="name" />
  );
}
