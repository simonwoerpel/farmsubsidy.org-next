import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import queryString from "query-string";
import { API_URL, API_KEY, DEFAULT_YEAR, DEFAULT_LIMIT } from "./settings.js";
import * as Q from "./query.js";

// PUBLIC QUERIES

export async function getCountries(query = {}, includeMeta = false) {
  return await api("countries", Q.getCountryQuery(query), includeMeta);
}

export async function getCountry(country, query = {}) {
  const res = await api("countries", Q.getCountryQuery({ country, ...query }));
  return res[0];
}

export async function getYears(query = {}) {
  return await api("years", Q.getYearQuery(query));
}

export async function getYear(year, query = {}) {
  const res = await api("years", Q.getYearQuery({ year }));
  return res[0];
}

export async function getSchemes(query = {}, includeMeta = true) {
  return await api("schemes", Q.getSchemeQuery(query), includeMeta);
}

export async function getScheme(scheme_id) {
  const res = await api("schemes", Q.getSchemeQuery({ scheme_id }));
  return res[0];
}

export async function getRecipients(query = {}, includeMeta = true) {
  return await api("recipients", Q.getRecipientQuery(query), includeMeta);
}

export async function getRecipient(recipient_id) {
  const res = await api("recipients", Q.getRecipientQuery({ recipient_id }));
  return res[0];
}

export async function getRecipientsChained(query = {}) {
  // for heavy lookups that don't need string aggregations in the first place
  const ids = await api("recipients/base", Q.getRecipientQuery(query));
  const recipients = await Promise.all(
    ids.map(({ id }) => getRecipient(id, false))
  );
  return recipients.filter((r) => !!r);
}

export async function getLocations(query = {}, includeMeta = true) {
  return await api("locations", Q.getLocationQuery(query), includeMeta);
}

export async function getLocation(recipient_address) {
  const res = await api("locations", Q.getLocationQuery({ recipient_address }));
  return res[0];
}

export async function getPayments(query = {}, includeMeta = true) {
  return await api("payments", Q.getPaymentQuery(query), includeMeta);
}

export async function getAggregation(query = {}) {
  const { order_by, limit, p, ...rest } = query;
  query = { ...rest };
  const res = await api("agg", query);
  return res[0];
}

export async function getExport(endpoint, query) {
  const path = `export/${endpoint}`;
  return await serverApi(path, query);
}

getCountries.endpoint = "countries";
getCountries.getQuery = Q.getCountryQuery;
getYears.endpoint = "years";
getYears.getQuery = Q.getYearQuery;
getSchemes.endpoint = "schemes";
getSchemes.getQuery = Q.getSchemeQuery;
getLocations.endpoint = "locations";
getLocations.getQuery = Q.getLocationQuery;
getRecipients.endpoint = "recipients";
getRecipients.getQuery = Q.getRecipientQuery;
getPayments.endpoint = "payments";
getPayments.getQuery = Q.getPaymentQuery;

const API = {
  [getCountries.endpoint]: getCountries,
  [getYears.endpoint]: getYears,
  [getSchemes.endpoint]: getSchemes,
  [getLocations.endpoint]: getLocations,
  [getRecipients.endpoint]: getRecipients,
  [getPayments.endpoint]: getPayments,
};

for (const fetcher of Object.values(API)) {
  fetcher.getUrl = (query) =>
    `${API_URL}/${fetcher.endpoint}?${queryString.stringify(
      fetcher.getQuery(query)
    )}`;
}

export default API;

// CLIENT SIDE INTERACTIVE APIS (search)
const DEFAULT_QUERY = {
  order_by: "-amount_sum",
  limit: DEFAULT_LIMIT,
  p: 1,
};

export function usePaymentsApi() {
  const initialQuery = { ...DEFAULT_QUERY, order_by: "year" };
  return useApi(getPayments, initialQuery, initPaymentsApi);
}

export function useRecipientsApi() {
  const initialQuery = {
    year: DEFAULT_YEAR,
    ...DEFAULT_QUERY,
  };
  return useApi(getRecipients, initialQuery, initRecipientsApi);
}

export function useSchemesApi() {
  return useApi(getSchemes, DEFAULT_QUERY, initSchemesApi);
}

export function useLocationsApi() {
  return useApi(getLocations, DEFAULT_QUERY, initLocationsApi);
}

const useApi = (fetcher, initialQuery, initializer) => {
  // gets initial data (api response) from prerendered page or initial GET
  // query parameters but updates (pagination, sorting) via state & router
  const router = useRouter();
  const [params, setParams] = useReducer(
    apiParamsReducer,
    initialQuery,
    initializer
  );
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);

  const handleParamsChange = (query) => {
    const urlQuery = getWindowParams(PARAMS);
    query = cleanParams({ ...urlQuery, ...query });
    router.push({ pathname: router.pathname, query }, undefined, {
      scroll: false,
      shallow: true,
    });
  };

  // update apiParams based on router changes
  useEffect(() => setParams(getWindowParams(PARAMS)), [router.query]);

  // call api on apiParams changes
  useEffect(() => {
    if (!loading) {
      setTotalRows(0);
      setLoading(true);
      fetcher(params.apiQuery)
        .then(({ item_count, results }) => {
          setError(false);
          setTotalRows(item_count);
          setRows(results);
          setLoading(false);
        })
        .catch((e) => setError(e));
    }
  }, [params]);

  const state = {
    error,
    loading,
    rows,
    totalRows,
    endpoint: fetcher.endpoint,
    url: fetcher.getUrl(params.apiQuery),
    ...params,
  };

  return [state, handleParamsChange];
};

const rewriteQuery = (query) => {
  // map window query to actual api query
  if (!!query.q) {
    const { q, ...rest } = query;
    query = { ...rest, recipient_fingerprint__ilike: `%${q}%` };
  }
  if (!!query.location) {
    const { location, ...rest } = query;
    query = { ...rest, recipient_address__ilike: `%${location}%` };
  }
  return query;
};

const initPaymentsApi = (initialQuery) => initApi(initialQuery, rewriteQuery);

const initRecipientsApi = (initialQuery) => {
  const clean = (query) => {
    // make sure not to broad search
    if (
      !query.q &&
      !query.year &&
      !query.country &&
      !query.scheme &&
      !query.location
    ) {
      query.year = 2020;
    }
    return query;
  };

  return initApi(initialQuery, rewriteQuery, clean);
};

const initSchemesApi = (initialQuery) => {
  const rewrite = (query) => {
    // map window query to actual api query
    // drop possible but useless location param
    if (!!query.location) delete query.location;
    if (!!query.q) {
      const { q, ...rest } = query;
      query = { ...rest, scheme__ilike: `%${q}%` };
    }
    return query;
  };

  return initApi(initialQuery, rewrite);
};

const initLocationsApi = (initialQuery) => {
  const rewrite = (query) => {
    // map window query to actual api query
    // drop possible but useless location param
    if (!!query.location) delete query.location;
    if (!!query.q) {
      const { q, ...rest } = query;
      query = { ...rest, recipient_address__ilike: `%${q}%` };
    }
    return query;
  };

  return initApi(initialQuery, rewrite);
};

const PER_PAGE = [10, 25, 50, 100];
export const SEARCH_ENDPOINTS = [
  "Recipients",
  "Schemes",
  "Locations",
  "Payments",
];
export const SEARCH_PARAMS = ["q", "country", "year", "location", "scheme"];
const PARAMS = SEARCH_PARAMS + ["p", "limit", "order_by"]; // table state params

const initApi = (initialQuery, rewrite = (p) => p, clean = (p) => p) => {
  // initial api params (without SEARCH_PARAMS)
  // based on initial query
  const baseApiQuery = {
    ...DEFAULT_QUERY,
    ...Object.fromEntries(
      Object.entries(initialQuery).filter(
        ([k, v]) => SEARCH_PARAMS.indexOf(k) < 0
      )
    ),
  };

  // get initial url query params from window.location
  // if empty, use initialQuery
  let query = cleanParams(getWindowParams(PARAMS));
  if (Object.keys(query).length === 0) {
    query = cleanParams(initialQuery, PARAMS);
  }
  query = clean(query);

  const apiQuery = { ...baseApiQuery, ...rewrite(query) };

  const {
    p: paginationDefaultPage,
    limit: paginationPerPage,
    order_by,
  } = apiQuery;

  // initial props for data table
  const defaultSortFieldId = order_by.replace(/^-/, "");
  const defaultSortAsc = order_by.indexOf("-") < 0;
  const tableProps = {
    defaultSortFieldId,
    defaultSortAsc,
    paginationDefaultPage,
    paginationPerPage,
    paginationRowsPerPageOptions: PER_PAGE,
    key: "1",
  };

  // initial state
  return {
    tableProps,
    apiQuery,
    initialApiQuery: { ...apiQuery }, // remember for reset page
    baseApiQuery,
    query,
    rewrite,
    clean,
  };
};

// useReducer
const apiParamsReducer = (state, query) => {
  query = state.clean(query, PARAMS);
  const newState = { ...state, query };
  if (Object.keys(query).length > 0) {
    // update api params
    newState.apiQuery = {
      ...state.baseApiQuery,
      ...state.rewrite(query),
    };
  } else {
    // reset params (bc router query empty)
    newState.apiQuery = { ...state.initialApiQuery };
    // use as trigger to re-mount table:
    newState.tableProps.key = Math.random().toString();
  }
  return newState;
};

// ACTUAL API CALL

async function api(path, query = {}, includeMeta = false) {
  query.api_key = API_KEY;
  const url = `${API_URL}/${path}?${queryString.stringify(query, {
    skipNull: true,
    skipEmptyString: true,
  })}`;
  const res = await fetch(url, {
    withCredentials: true,
    credentials: "include",
  });
  if (res.ok) {
    const data = await parseResponse(res);
    return includeMeta ? data : data.results;
  }
  if (res.status >= 400 && res.status < 600) {
    const { error } = await res.json();
    throw new Error(error);
  }
}

async function serverApi(path, query) {
  // pass through nextjs api routes
  const url = `/api/${path}?${queryString.stringify(query)}`;
  const res = await fetch(url);
  if (res.ok) {
    const data = await res.json();
    return data;
  }
  if (res.status >= 400 && res.status < 600) {
    const { error } = await res.json();
    throw new Error(error);
  }
}

const getWindowParams = (keys = []) => {
  const query = getWindowQuery();
  if (keys.length > 0) {
    return Object.fromEntries(
      Object.entries(query).filter(
        ([key, value]) => keys.indexOf(key) > -1 && !!value
      )
    );
  }
  return query;
};

const cleanParams = (params, keys = []) => {
  if (!!params.limit) {
    // ensure limit is within PER_PAGE
    params.limit =
      PER_PAGE.indexOf(params.limit) < 0 ? DEFAULT_LIMIT : params.limit;
  }
  // filter out empty params and optional filter for specific keys
  return Object.fromEntries(
    Object.entries(params).filter(
      ([k, v]) =>
        (keys.length ? keys.indexOf(k) > -1 : true) &&
        !(v === null || v === undefined || v === "")
    )
  );
};

const parseResponse = async (res) => {
  const contentType = res.headers.get("Content-Type");
  if (contentType.indexOf("json") > -1) return await res.json();
  const results = await res.text();
  return { results };
};

const getWindowQuery = () => {
  if (typeof window !== `undefined`) {
    return queryString.parse(window.location.search, {
      parseNumbers: true,
      parseBooleans: true,
    });
  }
  return {};
};
