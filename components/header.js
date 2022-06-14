import Link from "next/link";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Navbar from "./navbar.js";
import SimpleSearchForm from "./simpleSearchForm.js";
import styles from "./header.module.scss";

function CowHeader({ ...navProps }) {
  // deprecated
  return (
    <>
      <header>
        <Container className={styles.root} fluid>
          <Row>
            <Col md={6}>
              <div className={styles.cow}>
                <Link href="/">
                  <a>
                    <Image
                      className={styles.cowImg}
                      src="/images/cow.svg"
                      alt="FarmSubsidy Euro Cow"
                      layout="fill"
                    />
                  </a>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <Navbar {...navProps} />
    </>
  );
}

export default function Header({ ...navProps }) {
  return (
    <>
      <header>
        <Container className={styles.root} fluid />
      </header>
      <Navbar {...navProps} />
    </>
  );
}

export function Hero({ ...navProps }) {
  return (
    <>
      <header className={styles.root}>
        <Container className={styles.hero} fluid>
          <Row>
            <Col md={3} />
            <Col md={6} className={styles.heroInner}>
              <h1 className={styles.heroClaim}>
                The European Union spends around €59 billion a year on farm
                subsidies.
                <br />
                <br />
                This site tells you who receives the money.
              </h1>
              <SimpleSearchForm size="lg" />
              <Stack direction="horizontal" gap={3}>
                <Link href="/countries" passHref>
                  <Button size="lg" variant="secondary">
                    Countries
                  </Button>
                </Link>
                <Link href="/schemes" passHref>
                  <Button size="lg" variant="secondary">
                    Schemes
                  </Button>
                </Link>
                <Link href="/search/locations" passHref>
                  <Button size="lg" variant="secondary">
                    Locations
                  </Button>
                </Link>
              </Stack>
            </Col>
            <Col md={3} />
          </Row>
        </Container>
      </header>
      <Navbar hideSearchForm {...navProps} />
    </>
  );
}
