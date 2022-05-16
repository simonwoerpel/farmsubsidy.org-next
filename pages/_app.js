import Layout from "../components/layout.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/farmsubsidy.css";

function FarmsubsidyApp({ Component, pageProps }) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

export default FarmsubsidyApp;
