import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Papa from "papaparse";
import slugify from "slugify";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import api, { SEARCH_PARAMS } from "~/lib/api.js";

const EXPORT_PARAMS = { output: "csv", limit: 1000, p: 1 };

const toB64 = (value) => {
  value = unescape(encodeURIComponent(value));
  return typeof btoa !== "undefined"
    ? btoa(value)
    : Buffer.from(value).toString("base64"); // node build
};

const getDataUrl = (value) =>
  value ? "data:text/csv;base64," + toB64(value) : null;

function DownloadButton({
  loading = false,
  fileName = "farmsubsidy.csv",
  dataUrl,
  count,
}) {
  return (
    <Button
      disabled={loading}
      variant="secondary"
      href={dataUrl}
      download={fileName}
    >
      <FontAwesomeIcon icon={faDownload} style={{ width: 15 }} fixedWidth />{" "}
      Download {count} rows (csv)
    </Button>
  );
}

export default function DownloadCSV({
  endpoint,
  apiQuery,
  totalRows,
  rows,
  loading: apiLoading,
}) {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState();

  const query = { ...apiQuery, ...EXPORT_PARAMS };
  if (totalRows > 0 && totalRows < 1001) {
    query.limit = totalRows;
  }

  useEffect(() => {
    if (!apiLoading && !loading) {
      console.log(query);
      setLoading(true);
      api(endpoint, query).then((res) => setResult(res));
      setLoading(false);
    }
  }, [apiQuery]);

  const count = totalRows < 1001 ? totalRows : rows.length;
  const dataUrl = getDataUrl(result);
  const nameParams = { ...apiQuery, ...router.query };
  const fileName =
    "farmsubsidy_" +
    Object.entries(nameParams)
      .filter(([k, v]) => SEARCH_PARAMS.indexOf(k) > -1)
      .map(([k, v]) => slugify(v.toString()).substr(0, 25))
      .join("_") +
    `_page${apiQuery.p || 1}.csv`;

  return (
    <DownloadButton
      loading={loading}
      fileName={fileName}
      dataUrl={dataUrl}
      count={count}
    />
  );
}

export function DownloadCSVSync({ rows, fileName }) {
  // without extra api call
  const count = rows.length;
  const csvData = Papa.unparse(rows);
  const dataUrl = getDataUrl(csvData);
  return <DownloadButton dataUrl={dataUrl} fileName={fileName} count={count} />;
}
