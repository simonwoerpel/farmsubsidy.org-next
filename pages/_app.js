import { SSRProvider } from "@react-aria/ssr";
import "~/styles/farmsubsidy.scss";

export default function FarmsubsidyApp({ Component, pageProps }) {
  return (
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  );
}
