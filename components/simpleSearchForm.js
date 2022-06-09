import { useState } from "react";
import Link from "next/link";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
// import Autocomplete from "./autocomplete.js";
import styles from "./simpleSearchForm.module.scss";

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
    <Form>
      <InputGroup size={size}>
        <DropdownButton
          variant="secondary"
          title={activeEndpoint.label}
          className={styles.button}
        >
          {ENDPOINTS.filter((e) => activeEndpoint !== e).map((e) => (
            <Dropdown.Item key={e.label} onClick={() => setActiveEndpoint(e)}>
              {e.label}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form.Control
          aria-label="Search"
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <Button
          variant="secondary"
          className={styles.button}
          href={`/search?search=${activeEndpoint.label}&q=${value}`}
        >
          Search
        </Button>
      </InputGroup>
      {!withoutHints && (
        <Form.Text muted>
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
