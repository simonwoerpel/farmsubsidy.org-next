// https://github.com/vercel/next.js/blob/canary/examples/blog-starter/lib/api.js
//

import fs from "fs";
import { join } from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkFrontmatter from "remark-frontmatter";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

function markdownToHtml(markdown) {
  const result = unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .processSync(markdown);
  return result.value;
}

const pagesDirectory = join(process.cwd(), "_content");

const getRealSlug = (slug) => slug.replace(/\.md$/, "");

export function getPageSlugs() {
  return fs.readdirSync(pagesDirectory).map(getRealSlug);
}

export function getPageBySlug(slug, fields = []) {
  const realSlug = getRealSlug(slug);
  const fullPath = join(pagesDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const html = markdownToHtml(content);

  if (fields.length > 0) {
    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
      const items = {};
      if (field === "slug") {
        items[field] = realSlug;
      }
      if (field === "html") {
        items[field] = html;
      }

      if (typeof data[field] !== "undefined") {
        items[field] = data[field];
      }
    });

    return items;
  }

  return { ...data, html };
}

export function getAllPages(fields = []) {
  const slugs = getPageSlugs();
  const pages = slugs.map((slug) => getPageBySlug(slug, fields));
  return pages;
}
