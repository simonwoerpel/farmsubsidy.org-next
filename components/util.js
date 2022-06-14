import Link from "next/link";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const FMT = new Intl.NumberFormat("en-US");
const NBSP = (...args) => [...args].join("\u00A0");

const INTWORDS = {
  6: (val) => NBSP("≈", val, "million"),
  9: (val) => NBSP("≈", val, "billion"),
  12: (val) => NBSP("≈", val, "trillion"),
};

// https://github.com/django/django/blob/main/django/contrib/humanize/templatetags/humanize.py#L86
const intWord = (val) => {
  val = parseFloat(val);
  if (val < 1000000) return FMT.format(val);
  for (const [exponent, converter] of Object.entries(INTWORDS)) {
    const large_number = 10 ** exponent;
    if (val < large_number * 1000) {
      val = (val / large_number).toFixed(2);
      val = FMT.format(val);
      return converter(val);
    }
  }
  return FMT.format(val);
};

function IntWord({ value, append }) {
  if (value === undefined || value === null) {
    return null;
  }
  append = !!append ? `\u00A0${append}` : "";
  value = intWord(value);

  return (
    <span className="intword">
      {value}
      {append}
    </span>
  );
}

function Numeric({ value, append }) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  if (value === undefined || value === null) {
    return null;
  }
  append = !!append ? `\u00A0${append}` : "";

  return (
    <span className="numeric">
      {FMT.format(value)}
      {append}
    </span>
  );
}

Numeric.IntWord = IntWord;
export { Numeric };

const Amount = ({ value }) => (
  <Stack>
    <Numeric value={value} append="€" />
    {value > 1000000 && <Numeric.IntWord value={value} append="Euro" />}
  </Stack>
);

const Recipients = ({ link, ...r }) => (
  <Stack direction="horizontal">
    <Link href={link.getRecipientsUrl(r)} passHref>
      <Button variant="secondary-outline" size="sm">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          style={{ width: 15 }}
          fixedWidth
        />
        <Numeric value={r.total_recipients} />
      </Button>
    </Link>
  </Stack>
);

export { Amount, Recipients };
