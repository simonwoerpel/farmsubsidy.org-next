import { useRouter } from "next/router";
import Link from "next/link";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import { COUNTRYNAMES } from "~/lib/context.js";
import { CountryLink, CountryYearLink } from "~/lib/links.js";

const ROUTES = {
  "/[slug]": ({ slug }) => ({ label: slug }), // md pages
  "/search": () => ({ label: "Search" }),
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
    <Breadcrumb>
      <Link href="/" passHref>
        <Breadcrumb.Item>FarmSubsidy.org</Breadcrumb.Item>
      </Link>
      {crumbs.map(({ label, url }) => (
        <Link href={url} passHref key={url}>
          <Breadcrumb.Item>{label}</Breadcrumb.Item>
        </Link>
      ))}
      <Breadcrumb.Item active>{leaf.label}</Breadcrumb.Item>
    </Breadcrumb>
  );
}
