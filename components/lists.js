import Link from "next/link";
import ListGroup from "react-bootstrap/ListGroup";
import { RecipientLink, CountryLink } from "~/lib/links.js";

export function RecipientList({ items }) {
  return (
    <ListGroup variant="flush">
      {items.map((i) => (
        <Link href={RecipientLink.getUrl({ ...i })} key={i.id} passHref>
          <ListGroup.Item action>
            <RecipientLink.Label {...i} />
          </ListGroup.Item>
        </Link>
      ))}
    </ListGroup>
  );
}
export function CountryList({ items }) {
  return (
    <ListGroup variant="flush">
      {items.map(({ country }) => (
        <Link href={CountryLink.getUrl({ country })} key={country} passHref>
          <ListGroup.Item action>
            <CountryLink.Label country={country} />
          </ListGroup.Item>
        </Link>
      ))}
    </ListGroup>
  );
}
