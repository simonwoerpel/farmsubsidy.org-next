import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

export default function ApiLink({ url }) {
  return (
    <Button href={url} variant="outline-secondary">
      <FontAwesomeIcon icon={faCode} style={{ width: 15 }} fixedWidth /> Api
      url (json)
    </Button>
  );
}
