import Link from "next/link";

export function RecipientLink({ id, name }) {
  return (
    <Link href={`/recipient/${id}`}>
      <a>{name}</a>
    </Link>
  );
}

export function SchemeLink({ scheme }) {
  return (
    <Link href={`/search?scheme=${scheme}`}>
      <a>{scheme}</a>
    </Link>
  );
}

export function CountryLink({ country }) {
  return (
    <Link href={`/${country}`}>
      <a>{country}</a>
    </Link>
  );
}

export function YearLink({ year }) {
  return (
    <Link href={`/search?year=${year}`}>
      <a>{year}</a>
    </Link>
  );
}

export function CountryYearLink({ country, year }) {
  return (
    <Link href={`/${country}/${year}`}>
      <a>{year}</a>
    </Link>
  );
}
