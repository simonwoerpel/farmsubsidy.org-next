import { useState } from "react";
import { useRouter } from "next/router";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";
import Placeholder from "react-bootstrap/Placeholder";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import SearchForm from "~/components/searchForm.js";
import ErrorAlert from "~/components/errorAlert.js";
import SchemesTable from "~/components/schemesTable.js";
import { RecipientsSearchTable } from "~/components/recipientsTable.js";
import { DownloadWidget } from "~/components/widgets.js";
import { Numeric } from "~/components/util.js";
import { CountryLink } from "~/lib/links.js";
import getCachedContext, { COUNTRYNAMES } from "~/lib/context.js";
import api, { useApi, SEARCH_ENDPOINTS, getLocationParams } from "~/lib/api.js";

// initial queries
const INITIAL_QUERIES = {
  schemes: {
    scheme__null: false,
    amount__null: 0,
    order_by: "-amount_sum",
    limit: 25,
  },
  recipients: {
    recipient_name__null: false,
    order_by: "-amount_sum",
    amount__null: false,
    year: 2020,
    limit: 25,
  },
};

const ensureParams = (p) => {
  // make sure not to broad search
  if (!p.q && !p.year && !p.country && !p.scheme && !p.location) {
    p.year = 2020;
  }
  return p;
};

const ResultHeadline = ({
  count,
  endpoint,
  q,
  country,
  year,
  scheme,
  location,
  loading,
}) =>
  loading ? (
    <h4>
      <Placeholder as="span" animation="glow" bg="light">
        <Placeholder xs={6} />
      </Placeholder>
    </h4>
  ) : (
    <h4>
      <Numeric value={count} append={endpoint} />
      {!!q && (
        <>
          {" "}
          for <span className="text-muted">{q}</span>
        </>
      )}
      {!!country && (
        <>
          {" "}
          in <span className="text-muted">{COUNTRYNAMES[country]}</span>
        </>
      )}
      {!!year && <span className="text-muted"> ({year})</span>}
      {!!location && (
        <>
          {" "}
          in <span className="text-muted">{location}</span>
        </>
      )}
      {!!scheme && (
        <>
          {" "}
          in scheme{" "}
          <span className="text-muted">
            {scheme.substring(0, 50)}
            {scheme.length > 50 && "..."}
          </span>
        </>
      )}
    </h4>
  );

const ActiveFilters = ({ handleClear, filters }) => {
  const visibleFilters = ["year", "country", "location", "scheme"];
  return (
    <Stack direction="horizontal" gap={1}>
      {Object.entries(filters)
        .filter(([key, value]) => visibleFilters.indexOf(key) > -1)
        .map(([key, value]) => (
          <Badge bg="secondary" key={key}>
            {value}
            <CloseButton onClick={() => handleClear({ [key]: null })} />
          </Badge>
        ))}
    </Stack>
  );
};

export default function Search({ ...ctx }) {
  const router = useRouter();
  const { search: endpoint = SEARCH_ENDPOINTS[0], p: page = 1 } =
    getLocationParams();
  const apiEndpoint = endpoint.toLowerCase();
  const initialQuery = INITIAL_QUERIES[apiEndpoint];
  const [apiState, updateApiState] = useApi(apiEndpoint, initialQuery);

  const handleParamsChange = (query) =>
    updateApiState(ensureParams({ ...router.query, ...query }));

  const formProps = {
    ...ctx,
    query: apiState.query,
    endpoint,
    handleParamsChange,
    isLoading: apiState.loading,
  };

  const tableProps = {
    apiState,
    updateApiState: handleParamsChange,
  };

  const { search, ...query } = apiState.query;

  return (
    <CustomPage hideSearchForm {...ctx}>
      <Content>
        <header className="page-heading">
          <h1>Search</h1>
        </header>

        <SearchForm {...formProps} />
        <ResultHeadline
          loading={apiState.loading}
          count={apiState.totalRows}
          endpoint={endpoint}
          {...query}
        />
        <ActiveFilters handleClear={handleParamsChange} filters={query} />
        <span className="text-muted">Page {page}</span>

        {endpoint === "Recipients" ? (
          <RecipientsSearchTable {...tableProps} />
        ) : (
          <SchemesTable {...tableProps} />
        )}
      </Content>
      <Sidebar>
        <DownloadWidget {...apiState} />
      </Sidebar>
    </CustomPage>
  );
}

export async function getStaticProps() {
  const ctx = await getCachedContext();
  return { props: { ...ctx } };
}