import { SSRProvider } from "@react-aria/ssr";
import Layout from "../components/layout.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/farmsubsidy.css";

function FarmsubsidyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    </SSRProvider>
  );
}

export default FarmsubsidyApp;
