import { useMemo } from "react";
import DataTable from "react-data-table-component";
import { Numeric, Amount, Recipients } from "./util.js";
import { CountryLink, CountryYearLink } from "~/lib/links.js";
import { DownloadCSVSync } from "./downloadCsv.js";
import ApiLink from "./apiLink.js";
import { getCountries } from "~/lib/api.js";

const COLUMNS = {
  country: {
    name: "Name",
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
  const apiUrl = getCountries.getUrl();
  const actions = useMemo(
    () => [
      <DownloadCSVSync
        rows={countries}
        fileName="farmsubsidy_countries.csv"
        key="download"
      />,
      <ApiLink url={apiUrl} key="apiUrl" />,
    ],
    []
  );
  return (
    <DataTable
      columns={Object.values(COLUMNS)}
      data={countries}
      defaultSortFieldId="name"
      actions={actions}
    />
  );
}
