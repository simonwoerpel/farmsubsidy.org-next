import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-lg-offset-1 col-md-4 col-sm-4">
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
          </div>
          <div className="col-lg-3 col-lg-offset-1 col-md-4 col-sm-4">
            <h5>Get in touch</h5>
            <ul className="list-unstyled">
              <li>
                <a href="mailto:farmsubsidy[-at-]okfn[-dot-]de">Email</a>
              </li>
              <li>
                <a href="https://twitter.com/farmsubsidy">Twitter</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-lg-offset-1 col-md-4 col-sm-4">
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
          </div>
        </div>
        <hr />
        <div className="row text-small text-muted">
          <div className="col-lg-12">
            <p>
              FarmSubsidy.org uses the privacy friendly{" "}
              <a href="https://matomo.org">Matomo</a> software for statistical
              analysis of this website&apos;s traffic. We respect your
              browser&apos;s privacy setting (DNT-Header) and{" "}
              <a href="https://traffic.okfn.de/index.php?module=CoreAdminHome&amp;action=optOut&amp;language=en">
                you can opt out here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
