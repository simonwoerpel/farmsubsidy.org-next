import Link from "next/link";
import Image from "next/image";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import { CountryLink, YearLink } from "~/lib/links.js";
import SimpleSearchForm from "./simpleSearchForm.js";
import Flag from "./countryFlag.js";

// <Image
//   src="/images/cow.svg"
//   alt="FarmSubsidy Euro Cow"
//   className="d-inline-block align-top"
//   width={30}
//   height={30}
// />{" "}
export default function MainNavbar({ countries, years, hideSearchForm }) {
  return (
    <Navbar bg="primary" variant="dark" sticky="top">
      <Container>
        <Link href="/" passHref>
          <Navbar.Brand>
            <strong>FarmSubsidy</strong>.org
          </Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link href="/about" passHref>
              <Nav.Link>About</Nav.Link>
            </Link>
            <Link href="/faq" passHref>
              <Nav.Link>FAQ</Nav.Link>
            </Link>
            <Link href="/data" passHref>
              <Nav.Link>Data</Nav.Link>
            </Link>
            <NavDropdown title="Countries" id="countries-nav-dropdown">
              <Link href="/countries" passHref>
                <NavDropdown.Item>All Countries</NavDropdown.Item>
              </Link>
              {countries?.length > 0 && (
                <>
                  <NavDropdown.Divider />
                  {countries?.map(({ country, name }) => (
                    <Link
                      href={CountryLink.getUrl({ country })}
                      key={country}
                      passHref
                    >
                      <NavDropdown.Item>
                        <CountryLink.Label country={country} />
                      </NavDropdown.Item>
                    </Link>
                  ))}
                </>
              )}
            </NavDropdown>
            {years?.length > 0 && (
              <NavDropdown title="Years" id="years-nav-dropdown">
                {years?.sort().map(({ year }) => (
                  <Link href={YearLink.getUrl({ year })} key={year} passHref>
                    <NavDropdown.Item>{year}</NavDropdown.Item>
                  </Link>
                ))}
              </NavDropdown>
            )}
            <Link href="/schemes" passHref>
              <Nav.Link>Schemes</Nav.Link>
            </Link>
          </Nav>
          {!hideSearchForm && <SimpleSearchForm withoutHints />}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
