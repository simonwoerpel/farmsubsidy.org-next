import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { useDebounce } from "~/lib/util.js";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import Flag from "./countryFlag.js";
import Autocomplete from "./autocomplete.js";
import { COUNTRYNAMES } from "~/lib/context.js";
import { SEARCH_ENDPOINTS } from "~/lib/api.js";

const CloseButton = ({ handleClear, ...props }) => (
  <Button onClick={handleClear} {...props}>
    <FontAwesomeIcon icon={faCircleXmark} fixedWidth style={{ width: 20 }} />
  </Button>
);

export default function SearchForm({
  endpoint,
  countries,
  years,
  handleParamsChange,
  isLoading,
  query: { country, year, q = "" },
}) {
  const router = useRouter();
  const [value, setValue] = useState(q);
  const [blocked, setBlocked] = useState(false);
  const [recipientSuggestions, setRecipientSuggestions] = useState([]);
  const countryLabel = COUNTRYNAMES[country] || "Country";
  const yearLabel = year || "Year";
  const placeholder = `Search for ${endpoint}...`;

  // execute autocomplete on value change
  // const aValue = useDebounce(value);
  // const aChanged = blocked !== aValue;
  // useEffect(() => {
  //   if (endpoint === "Recipients" && aChanged && !isLoading) {
  //     setRecipientSuggestions([]);
  //     if (aValue.length > 1) {
  //       const params = {
  //         country,
  //         year,
  //         recipient_name__ilike: `${aValue}%`,
  //       };
  //       api("recipients/autocomplete", params).then((res) =>
  //         setRecipientSuggestions(res)
  //       );
  //     }
  //   }
  // }, [aValue]);

  const handleValueSelect = (value) => {
    setBlocked(value);
    setRecipientSuggestions([]);
    setValue(value);
    handleParamsChange({ q: value });
  };

  const handleEndpointChange = (endpoint) =>
    router.push({
      pathname: `/search/${endpoint.toLowerCase()}`,
      query: router.query,
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    handleParamsChange({ q: value });
  };

  const handleClear = () => {
    setValue("");
    handleParamsChange({ q: null });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup className="mb-3">
        <DropdownButton variant="secondary" title={endpoint}>
          {SEARCH_ENDPOINTS.filter((e) => endpoint !== e).map((e) => (
            <Dropdown.Item key={e} onClick={() => handleEndpointChange(e)}>
              {e}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton variant="outline-secondary" title={countryLabel}>
          {country && (
            <>
              <Dropdown.Item
                onClick={() => handleParamsChange({ country: null })}
              >
                Clear
              </Dropdown.Item>
              <Dropdown.Divider />
            </>
          )}
          {countries.map(({ name, years, ...c }) => (
            <Dropdown.Item
              key={c.country}
              disabled={
                country === c.country || (!!year && years.indexOf(year) < 0)
              }
              onClick={() => handleParamsChange({ country: c.country })}
            >
              <Flag iso={c.country} />
              {name}
              {
                //<Badge pill bg="secondary">{c.total_recipients}</Badge>
              }
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <DropdownButton variant="outline-secondary" title={yearLabel}>
          {year && (
            <>
              <Dropdown.Item onClick={() => handleParamsChange({ year: null })}>
                Clear
              </Dropdown.Item>
              <Dropdown.Divider />
            </>
          )}
          {years.map((y) => (
            <Dropdown.Item
              key={y.year}
              disabled={
                year === y.year || (country && y.countries.indexOf(country) < 0)
              }
              onClick={() => handleParamsChange({ year: y.year.toString() })}
            >
              {y.year}
              {
                //<Badge bg="secondary">{y.total_recipients}</Badge>
              }
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <FormControl
          aria-label="Search"
          autoFocus
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        {!!value && (
          <CloseButton
            disabled={isLoading}
            variant="outline-secondary"
            handleClear={handleClear}
          />
        )}
        <Button variant="secondary" disabled={isLoading} type="submit">
          Search
          {isLoading && (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
        </Button>
      </InputGroup>
      <Autocomplete
        recipients={recipientSuggestions}
        onSelect={handleValueSelect}
      />
    </Form>
  );
}
