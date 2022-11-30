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
          <a href="https://okfn.de">
            <Image
              width="808"
              height="366"
              src="/images/okfde.svg"
              alt="Open Knowledge Foundation Germany"
            />
          </a>
        </div>
        <p>
          FarmSubsidy.org is a project of the{" "}
          <a href="https://okfn.de">Open Knowledge Foundation Germany</a>, a
          non-profit organisation working on transparency of public money.
        </p>
      </Widget>
    </Col>
  );
}

Sidebar.Widget = Widget;
Sidebar.StyledWidget = StyledWidget;

export { Sidebar };
