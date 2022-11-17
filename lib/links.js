import React from "react";
import Link from "next/link";
import queryString from "query-string";
import slugify from "slugify";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Numeric } from "~/components/util.js";
import Flag from "~/components/countryFlag.js";
import { COUNTRYNAMES } from "~/lib/context.js";

const getPaymentsUrl = (query) =>
  `/search/payments?${queryString.stringify(query)}`;

const getRecipientsUrl = (query) =>
  `/search/recipients?${queryString.stringify(query)}`;

const SearchButton = React.forwardRef(
  ({ onClick, href, results, items = "recipients" }, ref) => (
    <Button href={href} onClick={onClick} ref={ref} variant="secondary">
      <FontAwesomeIcon
        icon={faMagnifyingGlass}
        style={{ width: 15 }}
        fixedWidth
      />
      View {results ? <Numeric value={results} /> : "all"} {items}
    </Button>
  )
);
SearchButton.displayName = "SearchButton";

// RECIPIENTS
const getRecipientParams = ({ id, name }) => [
  id,
  slugify(name[0]).substring(0, 100),
];

const getRecipientUrl = ({ id, name }) =>
  `/recipients/${getRecipientParams({ id, name }).join("/")}`;

function RecipientLink({ id, name, recipient_name, recipient_id }) {
  id = id || recipient_id;
  name = name || [recipient_name];
  return (
    <Link href={getRecipientUrl({ id, name })}>
      <a>{name[0]}</a>
    </Link>
  );
}

RecipientLink.getParams = getRecipientParams;
RecipientLink.getUrl = getRecipientUrl;
RecipientLink.Label = ({ name }) => name[0];

// SCHEMES
const getSchemeParams = ({ id, name }) => [id, slugify(name).substring(0, 100)];

const getSchemeUrl = ({ id, name }) =>
  `/schemes/${getSchemeParams({ id, name }).join("/")}`;

function SchemeLink({ name, id, scheme, scheme_id }) {
  id = id || scheme_id;
  name = name || scheme;
  return !!id ? (
    <Link href={getSchemeUrl({ id, name })}>
      <a>{name}</a>
    </Link>
  ) : (
    name
  );
}

SchemeLink.getParams = getSchemeParams;
SchemeLink.getUrl = getSchemeUrl;
SchemeLink.getRecipientsUrl = ({ name, scheme }) =>
  getRecipientsUrl({ scheme: scheme || name });
SchemeLink.getPaymentsUrl = ({ name, scheme }) =>
  getPaymentsUrl({ scheme: scheme || name });

SchemeLink.Recipients = function SchemeLinkRecipients({
  name,
  total_recipients,
  children,
}) {
  return (
    <Link href={SchemeLink.getRecipientsUrl({ name })} passHref>
      {children || <SearchButton results={total_recipients} />}
    </Link>
  );
};
SchemeLink.Payments = function SchemeLinkPayments({
  name,
  total_payments,
  children,
}) {
  return (
    <Link href={SchemeLink.getPaymentsUrl({ name })} passHref>
      {children || <SearchButton results={total_payments} items="payments" />}
    </Link>
  );
};

// SCHEME -> YEAR
const getSchemeYearUrl = ({ scheme, year }) =>
  getRecipientsUrl({ scheme, year });

function SchemeYearLink({ scheme, year }) {
  return (
    <Link href={getSchemeYearUrl({ scheme, year })}>
      <a>{year}</a>
    </Link>
  );
}

SchemeYearLink.getUrl = getSchemeYearUrl;

// COUNTRY
const getCountryParams = ({ country }) => ({ country });
const getCountryUrl = ({ country }) => `/countries/${country}`;

function CountryLink({ country, name, flagonly = false }) {
  const countryName = name || COUNTRYNAMES[country] || country;
  return (
    <Link href={getCountryUrl({ country })}>
      <a>
        <Flag iso={country} />
        {!flagonly && countryName}
      </a>
    </Link>
  );
}

CountryLink.getRecipientsUrl = ({ country }) => getRecipientsUrl({ country });
CountryLink.getPaymentsUrl = ({ country }) => getPaymentsUrl({ country });

CountryLink.getParams = getCountryParams;
CountryLink.getUrl = getCountryUrl;
CountryLink.Recipients = function CountryLinkRecipients({
  country,
  total_recipients,
  children,
}) {
  return (
    <Link href={CountryLink.getRecipientsUrl({ country })} passHref>
      {children || <SearchButton results={total_recipients} />}
    </Link>
  );
};
CountryLink.Payments = function CountryLinkPayments({
  country,
  total_payments,
  children,
}) {
  return (
    <Link href={CountryLink.getPaymentsUrl({ country })} passHref>
      {children || <SearchButton results={total_payments} items="payments" />}
    </Link>
  );
};

CountryLink.Label = function CountryLinkLabel({ country, name }) {
  const countryName = name || COUNTRYNAMES[country] || country;
  return (
    <>
      <Flag iso={country} />
      {countryName}
    </>
  );
};

// COUNTRY -> YEAR
const getCountryYearParams = ({ country, year }) => ({ country, year });
const getCountryYearUrl = ({ country, year }) =>
  `/countries/${country}/${year}`;

function CountryYearLink({ country, year, children }) {
  return (
    <Link href={getCountryYearUrl({ country, year })} passHref>
      {children || <a>{year}</a>}
    </Link>
  );
}

CountryYearLink.getRecipientsUrl = ({ country, year }) =>
  getRecipientsUrl({ country, year });
CountryYearLink.getPaymentsUrl = ({ country, year }) =>
  getPaymentsUrl({ country, year });

CountryYearLink.Recipients = function CountryYearLinkRecipients({
  country,
  year,
  total_recipients,
  children,
}) {
  return (
    <Link href={CountryYearLink.getRecipientsUrl({ country, year })} passHref>
      {children || <SearchButton results={total_recipients} />}
    </Link>
  );
};
CountryYearLink.Payments = function CountryYearLinkPayments({
  country,
  year,
  total_payments,
  children,
}) {
  return (
    <Link href={CountryYearLink.getPaymentsUrl({ country, year })} passHref>
      {children || <SearchButton results={total_payments} items="payments" />}
    </Link>
  );
};

// YEAR
const getYearUrl = ({ year }) => `/search/recipients?year=${year}`;

function YearLink({ year }) {
  return (
    <Link href={getYearUrl({ year })}>
      <a>{year}</a>
    </Link>
  );
}

YearLink.getUrl = getYearUrl;

// ADDRESS
const getLocationUrl = ({ location, recipient_address }) => {
  location = location || recipient_address;
  return `/search/recipients?location=${location}`;
};
function LocationLink({ location, recipient_address }) {
  location = location || recipient_address;
  return (
    <Link href={getLocationUrl({ location })}>
      <a>{location}</a>
    </Link>
  );
}

LocationLink.getUrl = getLocationUrl;

export {
  RecipientLink,
  SchemeLink,
  SchemeYearLink,
  CountryLink,
  CountryYearLink,
  YearLink,
  LocationLink,
};
