import { useRouter } from "next/router";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { COUNTRYNAMES } from "~/lib/context.js";
import { CountryLink, CountryYearLink } from "~/lib/links.js";
import styles from "./breadcrumb.module.scss";

const ROUTES = {
  "/[slug]": ({ slug }) => ({ label: slug }), // md pages
  "/search": () => ({ label: "Search" }),
  "/search/locations": () => ({ label: "Locations" }),
  "/search/recipients": () => ({ label: "Recipients" }),
  "/search/schemes": () => ({ label: "Schemes" }),
  "/search/payments": () => ({ label: "Payments" }),
  "/countries": () => ({ url: "/countries", label: "Countries" }),
  "/countries/[country]": ({ country }) => ({
    label: COUNTRYNAMES[country],
    url: CountryLink.getUrl({ country }),
  }),
  "/countries/[country]/[year]": ({ year }) => ({ label: year }),
  "/schemes": () => ({ url: "/schemes", label: "Schemes" }),
  "/schemes/[...param]": ({ param }) => ({
    label: param?.length > 1 ? param[1].replace(/-/g, " ") : "Scheme",
  }),
  "/recipients": () => ({ url: "/search/recipients", label: "Recipients" }),
  "/recipients/[...param]": ({ param }) => ({
    label: param?.length > 1 ? param[1].replace(/-/g, " ") : "Recipient",
  }),
};

const getBreadcrumbs = ({ route, query }) => {
  const crumbs = [ROUTES[route]];
  const routes = route.split("/");
  routes.pop();
  while (routes.length > 0) {
    const route = routes.join("/");
    const getRoute = ROUTES[route];
    getRoute && crumbs.push(getRoute);
    routes.pop();
  }
  return crumbs.reverse().map((c) => c(query));
};

export default function FSBreadcrumb() {
  const router = useRouter();
  if (router.route === "/") return null;
  const crumbs = getBreadcrumbs(router);
  const leaf = crumbs.pop();
  return (
    <Breadcrumb className={styles.root}>
      <Link href="/" passHref>
        <Breadcrumb.Item>Start</Breadcrumb.Item>
      </Link>
      {crumbs.map(({ label, url }) =>
        !!url ? (
          <Link href={url} passHref key={url}>
            <Breadcrumb.Item>{label}</Breadcrumb.Item>
          </Link>
        ) : (
          <Breadcrumb.Item key={label}>{label}</Breadcrumb.Item>
        )
      )}
      <Breadcrumb.Item active>{leaf.label}</Breadcrumb.Item>
    </Breadcrumb>
  );
}
