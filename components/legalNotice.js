import { useRouter } from "next/router";
import Link from "next/link";
import Alert from "react-bootstrap/Alert";
import { useAuth } from "~/lib/auth.js";
import { PUBLIC_YEARS } from "~/lib/settings.js";

export default function LegalNotice({ variant = "secondary" }) {
  const router = useRouter();
  const authenticated = useAuth();
  if (authenticated) return null;

  const years = PUBLIC_YEARS.join(" - ");
  const loginUrl = `/login?next=${router.asPath}`;

  return (
    <Alert variant={variant}>
      <p>
        Due to legal reasons detailed payment data is only visible for the last
        two years ({years}).
      </p>
      <p>
        Please <Link href={loginUrl}>login</Link> if you have an account our{" "}
        <Link href="mailto:farmsubsidy@okfn.de">contact us</Link> if you are a
        researcher or journalist to get access to the full data.
      </p>
    </Alert>
  );
}
