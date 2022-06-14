import { useState, useEffect } from "react";
import Papa from "papaparse";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { getExport } from "~/lib/api.js";
import { EXPORT_LIMIT } from "~/lib/settings.js";
import { useDebounce } from "~/lib/util.js";
import { Numeric } from "./util.js";

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
  url,
  count,
}) {
  const disabled = loading || !url || count > EXPORT_LIMIT;

  return (
    <>
      <Button
        disabled={disabled}
        variant="secondary"
        href={url}
        download={fileName}
      >
        {loading ? (
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        ) : (
          <FontAwesomeIcon icon={faDownload} style={{ width: 15 }} fixedWidth />
        )}{" "}
        Download <Numeric value={count} /> rows (csv)
      </Button>
      {count > EXPORT_LIMIT && (
        <div className="text-muted">
          Export is limited to 100.000 rows. Please refine your search.
        </div>
      )}
    </>
  );
}

export default function DownloadCSV({
  endpoint,
  loading: apiLoading,
  apiQuery,
  totalRows,
  rows,
}) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // wait for base api and don't change too often
  const delayedShouldLoad = useDebounce(shouldLoad);

  useEffect(() => {
    if (shouldLoad && delayedShouldLoad) {
      setShouldLoad(false);
      setResult();
      setLoading(true);
      getExport(endpoint, apiQuery).then((res) => {
        setResult(res);
        setLoading(false);
      });
    }
  }, [delayedShouldLoad]);

  useEffect(
    () =>
      setShouldLoad(
        totalRows > 0 && totalRows <= EXPORT_LIMIT && !loading && !apiLoading
      ),
    [apiQuery, apiLoading, totalRows]
  );

  return (
    <DownloadButton
      loading={loading || apiLoading}
      url={result?.export_url}
      count={totalRows}
    />
  );
}

export function DownloadCSVSync({ rows, fileName }) {
  // without extra api call
  const count = rows.length;
  const csvData = Papa.unparse(rows);
  const url = getDataUrl(csvData);
  return <DownloadButton url={url} fileName={fileName} count={count} />;
}
