import api from "~/lib/api.js";

let CACHED_CONTEXT = null;

export default async function getCachedContext() {
  if (!!CACHED_CONTEXT) return CACHED_CONTEXT;
  const countries = await api("countries");
  const years = await api("years");
  CACHED_CONTEXT = { countries, years };
  return CACHED_CONTEXT;
}

export const COUNTRYNAMES = {
  AT: "Austria",
  BE: "Belgium",
  BG: "Bulgaria",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DE: "Germany",
  DK: "Denmark",
  EE: "Estonia",
  ES: "Spain",
  FI: "Finland",
  FR: "France",
  GB: "United Kingdom",
  GR: "Greece",
  HR: "Croatia",
  HU: "Hungary",
  IE: "Ireland",
  IT: "Italy",
  LT: "Lithuania",
  LU: "Luxembourg",
  LV: "Latvia",
  MT: "Malta",
  NL: "Netherlands",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SE: "Sweden",
  SI: "Slovenia",
  SK: "Slovakia",
};
