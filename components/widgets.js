import Link from "next/link";
import Stack from "react-bootstrap/Stack";
import Badge from "react-bootstrap/Badge";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { Amount, Numeric } from "./util.js";
import Flag from "./countryFlag.js";
import DownloadCSV from "./downloadCsv.js";
import styles from "./container.module.scss";
import { SEARCH_PARAMS } from "~/lib/api.js";
import { shorten } from "~/lib/util.js"

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

export function AggregationWidget({
  title = "Results",
  loading,
  amount_sum,
  total_recipients,
  total_payments,
  ...query
}) {
  const renderedQuery = (
    <Stack direction="horizontal" gap={1}>
      {SEARCH_PARAMS.filter((p) => Object.keys(query).indexOf(p) > -1).map(
        (p) => (
          <Badge bg="secondary" key={p}>
            {shorten(query[p])}
          </Badge>
        )
      )}
    </Stack>
  );

  return (
    <Card className={styles.widget}>
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        {loading ? (
          <Placeholder as={Card.Title} animation="glow" bg="light">
            <Placeholder xs={12} />
          </Placeholder>
        ) : (
          <Card.Title>
            <Numeric.IntWord value={amount_sum} append="Euro" />
          </Card.Title>
        )}
        {loading ? (
          <Placeholder as={Card.Text} animation="glow" bg="light">
            <Placeholder xs={2} /> <Placeholder xs={7} /> <Placeholder xs={5} />
          </Placeholder>
        ) : (
          <>
            <Card.Text>
              received all recipients for the current selection.
            </Card.Text>
            {renderedQuery}
            <Card.Text>
              <strong>
                <Numeric value={total_recipients} />
              </strong>{" "}
              Recipients
              <br />
              <strong>
                <Numeric value={total_payments} />
              </strong>{" "}
              Payments
            </Card.Text>
          </>
        )}
      </Card.Body>
      <Card.Footer className="text-muted">
        Please note that these numbers only summarise the contents of our
        database and are <em>not</em> official statistics.
      </Card.Footer>
    </Card>
  );
}
