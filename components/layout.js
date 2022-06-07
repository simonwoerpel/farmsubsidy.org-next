import Head from "next/head";
import { useRouter } from "next/router";
import Footer from "./footer.js";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const DEFAULT_DESCRIPTION =
  "FarmSubsidy shows who gets subsidies under the European Common Agricultural Policy";

export default function Layout({ title, description, children }) {
  const router = useRouter();
  const url = `${BASE_URL}${router.asPath}`;
  return (
    <>
      <Head>
        <title>
          {title ? `${title} - ` : ""}Explore European Common Agricultural
          Policy farm subsidy payments | FarmSubsidy.org
        </title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/images/favicon/site.webmanifest" />
        <link
          rel="mask-icon"
          href="/images/favicon/safari-pinned-tab.svg"
          color="#139744"
        />
        <link rel="shortcut icon" href="/images/favicon/favicon.ico" />
        <meta name="msapplication-TileColor" content="#139744" />
        <meta property="twitter:title" content={title} />
        <meta
          name="msapplication-config"
          content="/images/favicon/browserconfig.xml"
        />
        <meta name="theme-color" content="#139744" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@farmsubsidy" />
        <meta name="twitter:creator" content="@okfde" />
        <meta name="author" content="Open Knowledge Foundation Germany" />
        <meta
          property="og:description"
          content={description || DEFAULT_DESCRIPTION}
        />
        <meta name="description" content={description || DEFAULT_DESCRIPTION} />
        <meta name="og:site" content="farmsubsidy.org" />
        <meta property="og:url" content={url} />
        <meta
          name="google-site-verification"
          content="Ky0DwP0Po8pm91bBwCkbbNt1Qf6FLXut_7Kd1jvSGFc"
        />
      </Head>
      {children}
      <Footer />
    </>
  );
}
