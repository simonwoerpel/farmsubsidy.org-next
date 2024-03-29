import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Papa from "papaparse";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { getExport } from "~/lib/api.js";
import { EXPORT_LIMIT } from "~/lib/settings.js";
import { useDebounce } from "~/lib/util.js";
import { useAuth } from "~/lib/auth.js";
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
  authenticated,
}) {
  const router = useRouter();
  const loginUrl = `/login?next=${router.asPath}`;
  const disabled = !authenticated || loading || !url || count > EXPORT_LIMIT;

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
      {!authenticated && (
        <div className="text-muted">
          <Link style={{ fontSize: "1rem" }} href={loginUrl}>
            Login to download data exports.
          </Link>
        </div>
      )}
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
  const authenticated = useAuth();

  // wait for base api and don't change too often
  const delayedShouldLoad = useDebounce(shouldLoad);

  useEffect(() => {
    if (authenticated && shouldLoad && delayedShouldLoad) {
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
      authenticated={authenticated}
    />
  );
}

export function DownloadCSVSync({ rows, fileName }) {
  // without extra api call
  const authenticated = useAuth();
  const count = rows.length;
  const csvData = Papa.unparse(rows);
  const url = getDataUrl(csvData);
  return (
    <DownloadButton
      url={url}
      fileName={fileName}
      count={count}
      authenticated={authenticated}
    />
  );
}
