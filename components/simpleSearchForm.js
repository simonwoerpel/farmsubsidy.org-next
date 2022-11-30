import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { SEARCH_ENDPOINTS } from "~/lib/api.js";
import styles from "./simpleSearchForm.module.scss";

const SEARCH_HINTS = ["Nestlé", "Windsor"];

export default function SimpleSearchForm({ size, withoutHints }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [activeEndpoint, setActiveEndpoint] = useState(SEARCH_ENDPOINTS[0]);
  const placeholder = `Search for ${activeEndpoint}...`;

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(`/search/${activeEndpoint.toLowerCase()}?q=${value}`);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup size={size}>
        <DropdownButton
          variant="secondary"
          title={activeEndpoint}
          className={styles.button}
        >
          {SEARCH_ENDPOINTS.filter((e) => activeEndpoint !== e).map((e) => (
            <Dropdown.Item key={e} onClick={() => setActiveEndpoint(e)}>
              {e}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <Form.Control
          aria-label="Search"
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <Button variant="secondary" className={styles.button} type="submit">
          Search
        </Button>
      </InputGroup>
      {!withoutHints && (
        <Form.Text muted>
          e.g.{" "}
          {SEARCH_HINTS.map((q, i) => (
            <span key={q}>
              <Link href={`/search?q=${q}`} legacyBehavior>{q}</Link>
              {i + 1 < SEARCH_HINTS.length && ", "}
            </span>
          ))}
        </Form.Text>
      )}
    </Form>
  );
}
