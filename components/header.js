import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
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
          </div>
          <div className="col-md-6 search-form">
            <form action="/search/" method="get" acceptCharset="utf-8">
              <div className="input-group">
                <input
                  type="text"
                  name="q"
                  value=""
                  id="q"
                  placeholder="Enter a company name or place"
                  className="form-control input-lg"
                />
                <span className="input-group-btn">
                  <button className="btn btn-fs-search input-lg" type="submit">
                    Search
                  </button>
                </span>
              </div>
              <small className="search-examples">
                e.g.{" "}
                <Link href="/search/?q=nestle">
                  <a>Nestle</a>
                </Link>{" "}
                or{" "}
                <Link href="/search/?q=windsor">
                  <a>Windsor</a>
                </Link>
              </small>
            </form>
          </div>
        </div>
        <div
          className="navbar navbar-dark navbar-expand-sm navbar-fs"
          role="navigation"
        >
          <Link href="/">
            <a className="navbar-brand">
              <strong>FarmSubsidy</strong>.org
            </a>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#menu"
            aria-controls="menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse collapse" id="menu">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item ">
                <Link href="/countries/">
                  <a className="nav-link">Countries</a>
                </Link>
              </li>
              <li className="nav-item ">
                <Link href="/faq/">
                  <a className="nav-link">FAQ</a>
                </Link>
              </li>
              <li>
                <a
                  className="nav-link twitter"
                  href="https://twitter.com/farmsubsidy/"
                >
                  <Image
                    src="/images/twitter_logo.png"
                    alt="Twitter Bird"
                    width={25}
                    height={20}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
