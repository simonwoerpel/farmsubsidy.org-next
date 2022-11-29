import Link from "next/link";
import Alert from "react-bootstrap/Alert";
import { PUBLIC_YEARS } from "~/lib/settings.js";

export default function LegalNotice() {
  const years = PUBLIC_YEARS.join(" - ");
  return (
    <Alert variant="secondary">
      <p>
        Due to legal reasons detailed payment data is only visible for the last
        two years ({years}).
      </p>
      <p>
        Please <Link href="/access">contact us</Link> if you are a researcher or
        journalist to get access to the full data.
      </p>
    </Alert>
  );
}
