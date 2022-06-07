import Card from "react-bootstrap/Card";
import { Numeric } from "./util.js";
import Flag from "./countryFlag.js";

export function AmountWidget({ title, value, country, year, children }) {
  return (
    <Card className="fs-sidebar__widget">
      <Card.Header>
        {country && <Flag iso={country} />}
        {title}
        {year && ` (${year})`}
      </Card.Header>
      <Card.Body>
        <Card.Title>
          <Numeric.IntWord value={value} append="Euro" />
        </Card.Title>
        {children}
      </Card.Body>
      <Card.Footer className="text-muted">
        Please note that these numbers only summarise the contents of our
        database and are <em>not</em> official statistics.
      </Card.Footer>
    </Card>
  );
}
