import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import CloseButton from "react-bootstrap/CloseButton";
import Placeholder from "react-bootstrap/Placeholder";
import { CustomPage } from "~/components/pages.js";
import { Content, Sidebar } from "~/components/container.js";
import SearchForm from "~/components/searchForm.js";
import ErrorAlert from "~/components/errorAlert.js";
import { DownloadWidget, AggregationWidget } from "~/components/widgets.js";
import { Numeric } from "~/components/util.js";
import { shorten } from "~/lib/util.js";
import { COUNTRYNAMES } from "~/lib/context.js";
import { getAggregation } from "~/lib/api.js";

const ActiveFilters = ({ handleClear, filters }) => {
  const visibleFilters = ["year", "country", "location", "scheme"];
  return (
    <Stack direction="horizontal" gap={1}>
      {Object.entries(filters)
        .filter(([key, value]) => visibleFilters.indexOf(key) > -1)
        .map(([key, value]) => (
          <Badge bg="secondary" key={key}>
            {shorten(value)}
            <CloseButton variant="white" onClick={() => handleClear({ [key]: null })} />
          </Badge>
        ))}
    </Stack>
  );
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
          in <span className="text-muted">{shorten(location)}</span>
        </>
      )}
      {!!scheme && (
        <>
          {" "}
          in scheme <span className="text-muted">{shorten(scheme)}</span>
        </>
      )}
    </h4>
  );

export default function SearchPage({
  endpoint,
  ResultComponent,
  useApi,
  ...ctx
}) {
  const [apiState, updateApiState] = useApi();
  const [agg, setAgg] = useState(false);
  const [aggLoading, setAggLoading] = useState(false);

  // fetch aggregation for search result
  useEffect(() => {
    setAggLoading(true);
    getAggregation(apiState.apiQuery).then((res) => setAgg(res));
    setAggLoading(false);
  }, [apiState.apiQuery]);

  const formProps = {
    ...ctx,
    query: apiState.query,
    endpoint,
    handleParamsChange: updateApiState,
    isLoading: apiState.loading,
  };

  const { search, ...query } = apiState.query;

  const tableProps = {
    apiState,
    updateApiState,
    title: (
      <ResultHeadline
        loading={apiState.loading}
        count={apiState.totalRows}
        endpoint={endpoint}
        {...query}
      />
    ),
    actions: <ActiveFilters handleClear={updateApiState} filters={query} />,
  };

  return (
    <CustomPage hideSearchForm {...ctx}>
      <Content>
        <header>
          <h1>
            Search <span className="text-muted">{endpoint}</span>
          </h1>
        </header>

        <SearchForm {...formProps} />
        <ResultComponent {...tableProps} />
      </Content>
      <Sidebar>
        <DownloadWidget {...apiState} />
        <AggregationWidget
          loading={apiState.loading || aggLoading}
          {...agg}
          {...apiState.query}
        />
      </Sidebar>
    </CustomPage>
  );
}
