import Link from "next/link";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { CountryLink, YearLink } from "~/lib/links.js";
import SimpleSearchForm from "./simpleSearchForm.js";
import Flag from "./countryFlag.js";

import styles from "./navbar.module.scss";

export default function MainNavbar({ countries, years, hideSearchForm }) {
  return (
    <Navbar variant="dark" sticky="top" className={styles.root}>
      <Container fluid className={styles.container}>
        <Link href="/" passHref legacyBehavior>
          <Navbar.Brand className={styles.brand}>
            <strong>FarmSubsidy</strong>.org
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/about" passHref legacyBehavior>
              <Nav.Link className={styles.link}>About</Nav.Link>
            </Link>
            <Link href="/data" passHref legacyBehavior>
              <Nav.Link className={styles.link}>Data</Nav.Link>
            </Link>
            <Link href="/stories" passHref legacyBehavior>
              <Nav.Link className={styles.link}>Stories</Nav.Link>
            </Link>
            <NavDropdown
              title="Countries"
              id="countries-nav-dropdown"
              className={styles.dropdown}
            >
              <Link href="/countries" passHref legacyBehavior>
                <NavDropdown.Item>All Countries</NavDropdown.Item>
              </Link>
              {countries?.length > 0 && (
                <>
                  <NavDropdown.Divider />
                  {countries.map(({ country, name }) => (
                    <Link
                      href={CountryLink.getUrl({ country })}
                      key={country}
                      passHref
                      legacyBehavior>
                      <NavDropdown.Item>
                        <CountryLink.Label country={country} />
                      </NavDropdown.Item>
                    </Link>
                  ))}
                </>
              )}
            </NavDropdown>
            {years?.length > 0 && (
              <NavDropdown
                title="Years"
                id="years-nav-dropdown"
                className={styles.dropdown}
              >
                {years.sort().map(({ year }) => (
                  <Link href={YearLink.getUrl({ year })} key={year} passHref legacyBehavior>
                    <NavDropdown.Item>{year}</NavDropdown.Item>
                  </Link>
                ))}
              </NavDropdown>
            )}
            <Link href="/schemes" passHref legacyBehavior>
              <Nav.Link className={styles.link}>Schemes</Nav.Link>
            </Link>
            <Link href="/search/locations" passHref legacyBehavior>
              <Nav.Link className={styles.link}>Locations</Nav.Link>
            </Link>
          </Nav>
          {!hideSearchForm && <SimpleSearchForm withoutHints />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
