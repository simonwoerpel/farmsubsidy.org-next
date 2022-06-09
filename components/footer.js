import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import styles from "./footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.root}>
      <Container className={styles.footer}>
        <Row>
          <Col>
            <h5>Looking for more information?</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/legal">
                  <a>Legal / Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a>About us</a>
                </Link>
              </li>
            </ul>
          </Col>
          <Col>
            <h5>Get in touch</h5>
            <ul className="list-unstyled">
              <li>
                <a href="mailto:farmsubsidy[-at-]okfn[-dot-]de">Email</a>
              </li>
              <li>
                <a href="https://twitter.com/farmsubsidy">Twitter</a>
              </li>
            </ul>
          </Col>
          <Col>
            <h5>Technical</h5>
            <ul className="list-unstyled">
              <li>
                <a href="https://github.com/okfde/farmsubsidy.org">
                  Get the code
                </a>
              </li>
              <li>
                <a href="http://data.farmsubsidy.org/">Get the raw data</a>
              </li>
            </ul>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <p className="text-small">
              FarmSubsidy.org uses the privacy friendly{" "}
              <a href="https://matomo.org">Matomo</a> software for statistical
              analysis of this website&apos;s traffic. We respect your
              browser&apos;s privacy setting (DNT-Header) and{" "}
              <a href="https://traffic.okfn.de/index.php?module=CoreAdminHome&amp;action=optOut&amp;language=en">
                you can opt out here
              </a>
              .
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
