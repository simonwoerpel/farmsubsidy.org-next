import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import slugify from "slugify";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import api, { SEARCH_PARAMS } from "~/lib/api.js";

const EXPORT_PARAMS = { output: "csv" };

const toB64 = (value) => {
  value = unescape(encodeURIComponent(value));
  return typeof btoa !== "undefined"
    ? btoa(value)
    : Buffer.from(value).toString("base64"); // node build
};

export default function DownloadCSV({
  endpoint,
  apiQuery,
  rows,
  loading: apiLoading,
}) {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState();

  useEffect(() => {
    if (!apiLoading && !loading) {
      const query = { ...apiQuery, ...EXPORT_PARAMS };
      setLoading(true);
      api(endpoint, query).then((res) => setResult(res));
      setLoading(false);
    }
  }, [apiQuery]);

  const count = rows.length;
  const dataUrl = result ? "data:text/csv;base64," + toB64(result) : null;
  const nameParams = { ...apiQuery, ...router.query };
  const fileName =
    "farmsubsidy_" +
    Object.entries(nameParams)
      .filter(([k, v]) => SEARCH_PARAMS.indexOf(k) > -1)
      .map(([k, v]) => slugify(v.toString()).substr(0, 25))
      .join("_") +
    `_page${apiQuery.p || 1}.csv`;

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
