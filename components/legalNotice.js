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
        Please <Link href={loginUrl}>login</Link> if you have an account our request one.
      </p>
      <p>
        To get access to the complete data as researcher or journalist, please
        print out the <a
        href="/farmsubsidy_datausage_agreement_2023_EN.pdf">data usage
        agreement</a>, sign it and send the paper version via post to:
      </p>
      <p>
        Open Knowledge Foundation Deutschland e.V.<br />
        Singerstraße 109<br />
        D-10179 Berlin
      </p>
      <p>
        As soon as we received the original document we&apos;ll send you the
        login by email. You can also scan the signed document and send it to{" "}
        <a href="mailto:farmsubsidy@okfn.de">farmsubsidy@okfn.de</a> beforehand
        so that you receive your login data earlier. Nevertheless, you have to
        send the original to the adress above, too.
      </p>
    </Alert>
  );
}
