import { useEffect, useMemo } from "react";
import Spinner from "react-bootstrap/Spinner";
import DataTable from "react-data-table-component";
import ErrorAlert from "./errorAlert.js";

const Loading = ({ loading, children }) => (
  <div style={{ position: "relative" }}>
    {loading && (
      <Spinner
        animation="border"
        role="status"
        style={{ position: "absolute", top: 300, left: "45%" }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    )}
    {children}
  </div>
);

export default function ApiTable({
  columns,
  apiState: { rows, totalRows, error, loading, tableProps, needServer },
  updateApiState,
}) {

  const handleSort = ({ column }, sortDirection) => {
    const order_by = sortDirection === "asc" ? column : `-${column}`;
    updateApiState({ order_by });
  };
  const handlePageChange = (p) => updateApiState({ p });
  const handlePerRowsChange = (limit, p) => updateApiState({ p, limit });

  const props = needServer
    ? {
        sortServer: true,
        onSort: handleSort,
        onChangeRowsPerPage: handlePerRowsChange,
        onChangePage: handlePageChange,
        pagination: true,
        paginationServer: true,
        disabled: loading,
        paginationTotalRows: totalRows,
        ...tableProps,
      }
    : { pagination: false };

  // avoid redundant re-rendering
  // https://react-data-table-component.netlify.app/?path=/docs/performance-optimization--page#optimizing-functionalhook-components
  const memoColumns = useMemo(() => columns, []);

  return error ? (
    <ErrorAlert {...error} />
  ) : (
    <Loading loading={loading}>
      <DataTable columns={memoColumns} data={rows} {...props} />
    </Loading>
  );
}
