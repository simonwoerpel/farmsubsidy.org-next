import { Page } from "~/components/pages.js";
import getCachedContext from "~/lib/context.js";
import { getPageBySlug, getPageSlugs } from "~/lib/content.js";

export default function MarkdownPage({ content: { title, html }, ...ctx }) {
  return (
    <Page title={title} {...ctx}>
      <header className="page-heading">
        <h1>{title}</h1>
      </header>
      <div
        className="fs-page__content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </Page>
  );
}

export async function getStaticProps({ params: { slug } }) {
  const ctx = await getCachedContext();
  const content = getPageBySlug(slug);
  return { props: { ...ctx, content } };
}

export async function getStaticPaths() {
  const paths = getPageSlugs().map((slug) => ({ params: { slug } }));
  return { paths, fallback: false };
}
