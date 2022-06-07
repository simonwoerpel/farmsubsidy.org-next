import Link from "next/link";
import Image from "next/image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Navbar from "./navbar.js";
import SimpleSearchForm from "./simpleSearchForm.js";

export default function Header({ ...navProps }) {
  return (
    <header>
      <Container className="fs-header" fluid>
        <Row className="fs-header__row">
          <Col md={6}>
            <div className="the-cow">
              <Link href="/">
                <a>
                  <Image
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
      <Navbar {...navProps} />
    </header>
  );
}

export function Hero({ countries, years }) {
  return (
    <header>
      <Container className="fs-header fs-header--hero" fluid>
        <Row className="fs-header__row">
          <Col md={3} />
          <Col md={6}>
            <h1 className="hero-claim">
              The European Union spends around €59 billion a year on farm
              subsidies. This site tells you who receives the money.
            </h1>
            <SimpleSearchForm size="lg" />
            <Link href="/countries">
              <Button size="lg" variant="secondary">
                Countries
              </Button>
            </Link>
            <Link href="/schemes">
              <Button size="lg" variant="secondary">
                Schemes
              </Button>
            </Link>
          </Col>
          <Col md={3} />
        </Row>
      </Container>
      <Navbar countries={countries} years={years} hideSearchForm />
    </header>
  );
}
