import ApiTable from "./apiTable.js";
import { Numeric, Amount, Recipients } from "./util.js";
import { SchemeLink, SchemeYearLink, CountryLink } from "~/lib/links.js";

const COLUMNS = {
  name: {
    name: "Name",
    selector: (r) => r.name,
    cell: (r) => <SchemeLink {...r} />,
  },
  countries: {
    name: "Countries",
    selector: (r) => r.countries,
    cell: (r) => r.countries.map((c) => <CountryLink key={c} country={c} />),
  },
  oldest: {
    name: "Oldest",
    selector: (r) => Math.min(...r.years),
    cell: (r) => <SchemeYearLink scheme={r.name} year={Math.min(...r.years)} />,
  },
  latest: {
    name: "Latest",
    selector: (r) => Math.max(...r.years),
    cell: (r) => <SchemeYearLink scheme={r.name} year={Math.max(...r.years)} />,
  },
  total_recipients: {
    name: "Recipients",
    selector: (r) => r.total_recipients,
    cell: (r) => <Recipients link={SchemeLink} {...r} />,
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
};

export default function SchemesTable(props) {
  const columns = Object.keys(COLUMNS).map((k) => COLUMNS[k]);

  return <ApiTable columns={columns} {...props} />;
}
