import DataTable from "react-data-table-component";
import { Numeric, Amount, Recipients } from "./util.js";
import { CountryYearLink } from "~/lib/links.js";

const COLUMNS = {
  year: {
    name: "Year",
    selector: (r) => r.year,
    cell: (r) => <CountryYearLink country={r.countries[0]} year={r.year} />,
    sortable: true,
    column: "year",
    id: "year",
  },
  total_recipients: {
    name: "Recipients",
    selector: (r) => r.total_recipients,
    cell: (r) => (
      <Recipients
        link={CountryYearLink}
        country={r.countries[0]}
        year={r.year}
        total_recipients={r.total_recipients}
      />
    ),
    sortable: true,
  },
  amount_sum: {
    name: "Total amount",
    selector: (r) => r.amount_sum,
    cell: (r) => <Amount value={r.amount_sum} append="€" />,
    sortable: true,
  },
};

export default function CountriesTable({
  country,
  years,
  activeYear,
  columns = Object.keys(COLUMNS),
}) {
  const conditionalRowStyles = [
    {
      when: (r) => r.year.toString() === activeYear?.toString(),
      style: {
        backgroundColor: "var(--bs-gray-200)",
      },
    },
  ];

  return (
    <DataTable
      columns={columns.map((c) => COLUMNS[c])}
      data={years}
      conditionalRowStyles={conditionalRowStyles}
      defaultSortFieldId="year"
    />
  );
}
