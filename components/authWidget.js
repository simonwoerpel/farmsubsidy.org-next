import { useRouter } from "next/router";
import Link from "next/link";
import { Widget } from "~/components/container";
import { PUBLIC_YEARS } from "~/lib/settings.js";
import { useAuth } from "~/lib/auth.js";

export default function AuthWidget() {
  const router = useRouter();
  const authenticated = useAuth();
  if (authenticated) return null;

  const url = `/login?next=${router.asPath}`;
  const years = PUBLIC_YEARS.join(" - ");

  return (
    <Widget>
      <p>
        Due to legal reasons detailed payment data is only visible for the last
        two years ({years}).
      </p>
      <Link href={url}>Login to view the full dataset</Link>
    </Widget>
  );
}
