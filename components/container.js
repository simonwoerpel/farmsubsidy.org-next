import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Breadcrumb from "./breadcrumb.js";
import styles from "./container.module.scss";

export default function MainContainer({ children }) {
  return (
    <Container fluid as="main" className={styles.main}>
      <Row>{children}</Row>
    </Container>
  );
}

export function Content({ children }) {
  return (
    <Col xl={9} lg={8} md={8} sm={7} className={styles.content}>
      <Breadcrumb />
      {children}
    </Col>
  );
}

function Widget({ title, children }) {
  return (
    <Card className={styles.widget}>
      <Card.Body>
        {title ? <Card.Title>{title}</Card.Title> : null}
        {children}
      </Card.Body>
    </Card>
  );
}

function StyledWidget({ header, title, children, footer }) {
  return (
    <Card className={styles.widget}>
      <Card.Header>{header}</Card.Header>
      <Card.Body>
        {title && <Card.Title>{title}</Card.Title>}
        {children}
      </Card.Body>
      {footer && <Card.Footer className="text-muted">{footer}</Card.Footer>}
    </Card>
  );
}

function Sidebar({ children }) {
  return (
    <Col className={styles.sidebar} xl={3} lg={4} md={4} sm={5}>
      {children}
      <Widget>
        <div className="text-center">
          <a href="https://fragdenstaat.de">
            <Image
              width="191"
              height="44"
              src="/images/fds.svg"
              alt="FragDenStaat.de"
            />
          </a>
        </div>
        <p>
          FarmSubsidy.org is a project by{" "}
          <a href="https://fragdenstaat.de">FragDenStaat</a>,
          the central contact for all questions relating to freedom of
          information in Germany.
        </p>
      </Widget>
    </Col>
  );
}

Sidebar.Widget = Widget;
Sidebar.StyledWidget = StyledWidget;

export { Sidebar };
