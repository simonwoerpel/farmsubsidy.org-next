import Link from "next/link";
import Card from "react-bootstrap/Card";
import { Numeric } from "./util.js";
import Flag from "./countryFlag.js";
import DownloadCSV from "./downloadCsv.js";
import styles from "./container.module.scss";

export function AmountWidget({ title, value, country, year, children }) {
  return (
    <Card className={styles.widget}>
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

export function DownloadWidget({ title = "Data", ...props }) {
  return (
    <Card className={styles.widget}>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        <DownloadCSV {...props} />
      </Card.Body>
      <Card.Footer className="text-muted">
        <Link href="/data">
          <a>Information about the data</a>
        </Link>
      </Card.Footer>
    </Card>
  );
}
