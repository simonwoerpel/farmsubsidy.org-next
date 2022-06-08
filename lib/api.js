import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/router";

const parseResponse = async (res) => {
  const contentType = res.headers.get("Content-Type");
  if (contentType.indexOf("json") > -1) return await res.json();
  const results = await res.text();
  return { results };
};

export default async function api(
  path,
  params = {},
  withMeta = false,
  all = false
) {
  const searchParams = new URLSearchParams(params);
  let hasNext = true;
  let url = `${
    process.env.NEXT_PUBLIC_API_ENDPOINT
  }/${path}?${searchParams.toString()}`;
  const allData = [];
  while (hasNext) {
    const res = await fetch(url);
    if (res.ok) {
      const data = await parseResponse(res);
      if (!all) {
        return withMeta ? data : data.results;
      } else {
        allData.push(data.results);
        hasNext = !!data.next_url && data.results.length > 0;
        url = data.next_url;
      }
    }
    if (res.status >= 400 && res.status < 600) {
      const { error } = await res.json();
      throw new Error(error);
    }
  }
  return allData.flat();
}

// HOC LOGIC for api table / search view
//
export function useApi(endpoint, initialQuery) {
  // gets initial data (api response) from prerendered page or initial GET
  // query parameters but updates (pagination, sorting) via state & router
  const router = useRouter();
  const [params, setParams] = useReducer(
    apiParamsReducer,
    { endpoint, initialQuery },
    initApi
  );
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [needServer, setNeedServer] = useState(true);

  const handleParamsChange = (query) => {
    const urlQuery = getLocationParams(PARAMS);
    query = cleanParams({ ...urlQuery, ...query });
    router.push({ pathname: router.pathname, query }, undefined, {
      scroll: false,
      shallow: true,
    });
  };

  // update apiParams based on router changes
  useEffect(() => setParams(router.query), [router.query]);

  // call api on apiParams changes
  useEffect(() => {
    if (!loading && needServer) {
      setLoading(true);
      const { endpoint, apiQuery } = params;
      api(endpoint, apiQuery, true)
        .then(({ item_count, results, next_url, prev_url }) => {
          setError(false);
          setTotalRows(item_count);
          setRows(results);
          setNeedServer(!!(prev_url || next_url));
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
    needServer,
    ...params,
  };

  return [state, handleParamsChange];
}

const PER_PAGE = [10, 25, 50, 100];
export const SEARCH_PARAMS = [
  "q",
  "country",
  "year",
  "location",
  "scheme",
  "search",
];
const PARAMS = SEARCH_PARAMS + ["p", "limit", "order_by"]; // table state params
const DEFAULTS = { p: 1, limit: 25, order_by: "-amount_sum" };
export const SEARCH_ENDPOINTS = ["Recipients", "Schemes"];

function initApi({ endpoint, initialQuery }) {
  // initial api params (without SEARCH_PARAMS)
  // based on initial query
  const baseApiQuery = {
    ...DEFAULTS,
    ...Object.fromEntries(
      Object.entries(initialQuery).filter(
        ([k, v]) => SEARCH_PARAMS.indexOf(k) < 0
      )
    ),
  };

  // get initial url query params from window.location
  // if empty, use initialQuery
  let query = cleanParams(getLocationParams(PARAMS));
  if (Object.keys(query).length === 0) {
    query = cleanParams(initialQuery, PARAMS);
  }

  const apiQuery = { ...baseApiQuery, ...rewriteQueryForApi(query) };

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
    endpoint,
    apiQuery,
    initialApiQuery: { ...apiQuery }, // remember for reset page
    baseApiQuery,
    query,
  };
}

// useReducer
function apiParamsReducer(state, query) {
  query = cleanParams(query, PARAMS);
  const newState = { ...state, query };
  if (Object.keys(query).length > 0) {
    // update api params
    newState.apiQuery = {
      ...state.baseApiQuery,
      ...rewriteQueryForApi(query),
    };
  } else {
    // reset params (bc router query empty)
    newState.apiQuery = { ...state.initialApiQuery };
    // use as trigger to re-mount table:
    newState.tableProps.key = Math.random().toString();
  }
  return newState;
}

export function getLocationParams(keys = []) {
  if (typeof window !== `undefined`) {
    const { searchParams } = new URL(window.location);
    if (keys.length > 0) {
      return Object.fromEntries(
        [...searchParams].filter(
          ([key, value]) => keys.indexOf(key) > -1 && !!value
        )
      );
    }
    return Object.fromEntries(
      [...searchParams].filter(([key, value]) => !!value)
    );
  } else return {};
}

const rewriteQueryForApi = ({ search = SEARCH_ENDPOINTS[0], ...query }) => {
  const qLookup = search === "Recipients" ? "recipient_fingerprint" : "scheme";
  if (query.q) {
    const { q, ...rest } = query;
    query = { ...rest, [`${qLookup}__ilike`]: `%${q}%` };
  }
  if (query.location) {
    const { location, ...rest } = query;
    query = { ...rest, recipient_address__ilike: `%${location}%` };
  }
  return query;
};

const typed = (params) => {
  const INT = ["limit", "p", "year"];
  for (let [key, val] of Object.entries(params)) {
    if (INT.indexOf(key) > -1) {
      val = parseInt(val);
      if (key == "limit") {
        val = PER_PAGE.indexOf(val) < 0 ? DEFAULTS.limit : val;
      }
      params[key] = val;
    }
    if (val === "true") {
      params[key] = true;
    }
    if (val == "false") {
      params[key] = false;
    }
  }
  return params;
};

const cleanParams = (params, keys = []) => {
  // clean & type params
  params = Object.fromEntries(
    Object.entries(params).filter(
      ([k, v]) =>
        (keys.length ? keys.indexOf(k) > -1 : true) &&
        !(v === null || v === undefined || v === "")
    )
  );
  return typed(params);
};
