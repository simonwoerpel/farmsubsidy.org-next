import { useState } from "react";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const INITIAL_SEARCHES = ["Nestlé", "Windsor"];
const ENDPOINTS = [
  { endpoint: "/recipients/search", label: "Recipients" },
  { endpoint: "/schemes/search", label: "Schemes" },
];

export default function SearchForm({
  initialSearches = INITIAL_SEARCHES,
  countries,
}) {
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0]);
  const [activeFilters, setActiveFilters] = useState({ year: "2020" });
  const activeCountry = activeFilters.country;
  const countryLabel = activeCountry ? `Country: ${activeCountry}` : "Country";
  const placeholder = `Search for ${activeEndpoint.label} names...`;
  return (
    <InputGroup className="mb-3">
      <DropdownButton variant="outline-primary" title={activeEndpoint.label}>
        {ENDPOINTS.filter((e) => activeEndpoint !== e).map((e) => (
          <Dropdown.Item key={e.label} onClick={() => setActiveEndpoint(e)}>
            {e.label}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <DropdownButton variant="outline-secondary" title={countryLabel}>
        {countries.map(({ country }) => (
          <Dropdown.Item
            key={country}
            disabled={activeFilters === country}
            onClick={() => setActiveFilters({ country })}
          >
            {country}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <FormControl aria-label="Search" placeholder={placeholder} />
    </InputGroup>
  );
}
