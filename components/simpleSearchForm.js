import { useState } from "react";
import Link from "next/link";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
// import Autocomplete from "./autocomplete.js";

const SEARCH_HINTS = ["Nestlé", "Windsor"];
const ENDPOINTS = [
  { endpoint: "recipients/search", label: "Recipients" },
  { endpoint: "schemes/search", label: "Schemes" },
];

export default function SimpleSearchForm({ size, withoutHints }) {
  const [value, setValue] = useState("");
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0]);
  // const [recipientSuggestions, setRecipientSuggestions] = useState([]);
  const placeholder = `Search for ${activeEndpoint.label}...`;

  // execute autocomplete
  // useEffect(() => {
  //   if (value.length > 1) {
  //     const params = { ...activeParams, q: value };
  //     delete params["order_by"];
  //     delete params["p"];
  //     api("recipients/autocomplete", params).then((res) =>
  //       setRecipientSuggestions(res)
  //     );
  //   }
  // }, [value]);

  return (
    <Form className="fs-search-form">
      <InputGroup size={size}>
        <DropdownButton variant="primary" title={activeEndpoint.label}>
          {ENDPOINTS.filter((e) => activeEndpoint !== e).map((e) => (
            <Dropdown.Item key={e.label} onClick={() => setActiveEndpoint(e)}>
              {e.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form.Control
          aria-label="Search"
          autoFocus
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <Button
          variant="primary"
          href={`/search?search=${activeEndpoint.label}&q=${value}`}
        >
          Search
        </Button>
      </InputGroup>
      {!withoutHints && (
        <Form.Text className="search-examples" muted>
          e.g.{" "}
          {SEARCH_HINTS.map((q, i) => (
            <span key={q}>
              <Link href={`/search?q=${q}`}>{q}</Link>
              {i + 1 < SEARCH_HINTS.length && ", "}
            </span>
          ))}
        </Form.Text>
      )}
    </Form>
  );
}
