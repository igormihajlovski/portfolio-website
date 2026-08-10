const MarkdownIt = require("markdown-it");

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const blogMarkdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const BLOG_READING_WORDS_PER_MINUTE = 220;

function inlineTokenText(token) {
  if (!token) return "";
  if (!token.children) return token.content || "";

  return token.children
    .filter((child) =>
      ["text", "code_inline", "html_inline", "image"].includes(child.type),
    )
    .map((child) =>
      child.type === "html_inline"
        ? String(child.content || "").replace(/<[^>]*>/g, "")
        : child.content || "",
    )
    .join("");
}

function slugifyHeading(value) {
  const slug = String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[&+]/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

function analyzeBlogArticle(value = "") {
  const environment = {};
  const tokens = blogMarkdown.parse(String(value || ""), environment);
  const slugCounts = new Map();
  const tableOfContents = [];
  const readableText = [];

  tokens.forEach((token, index) => {
    if (token.type === "inline") {
      readableText.push(inlineTokenText(token));
    }

    if (token.type !== "heading_open" || token.tag !== "h2") return;

    const headingText = inlineTokenText(tokens[index + 1]).trim();
    const baseSlug = slugifyHeading(headingText);
    const duplicateIndex = (slugCounts.get(baseSlug) || 0) + 1;
    const id = duplicateIndex === 1 ? baseSlug : `${baseSlug}-${duplicateIndex}`;

    slugCounts.set(baseSlug, duplicateIndex);
    token.attrSet("id", id);
    tableOfContents.push({ id, text: headingText });
  });

  const words = readableText
    .join(" ")
    .match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || [];

  return {
    html: blogMarkdown.renderer.render(tokens, blogMarkdown.options, environment),
    readingMinutes: Math.max(
      1,
      Math.ceil(words.length / BLOG_READING_WORDS_PER_MINUTE),
    ),
    tableOfContents,
    wordCount: words.length,
  };
}

function asDate(value) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function compareProjects(left, right) {
  const leftDate = asDate(left.data.published_date)?.getTime() || 0;
  const rightDate = asDate(right.data.published_date)?.getTime() || 0;

  if (leftDate !== rightDate) return rightDate - leftDate;

  return String(left.data.slug || left.data.title || "").localeCompare(
    String(right.data.slug || right.data.title || ""),
  );
}

function compareBlogPosts(left, right) {
  const leftDate = asDate(left.data.published_date)?.getTime() || 0;
  const rightDate = asDate(right.data.published_date)?.getTime() || 0;

  if (leftDate !== rightDate) return rightDate - leftDate;

  return String(left.data.slug || left.data.title || "").localeCompare(
    String(right.data.slug || right.data.title || ""),
  );
}

function isPublishedBlogPost(post) {
  return String(post.data.status || "").trim().toLowerCase() === "published";
}

module.exports = function (eleventyConfig) {
  ["css", "js", "images", "documents", "php"].forEach((directory) => {
    eleventyConfig.addPassthroughCopy(directory);
  });
  eleventyConfig.addPassthroughCopy("styleguide.html");
  eleventyConfig.addPassthroughCopy(".htaccess");

  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("CHANGELOG.md");
  eleventyConfig.ignores.add("styleguide.html");

  eleventyConfig.addCollection("caseStudies", (collectionApi) =>
    collectionApi.getFilteredByTag("caseStudy").sort(compareProjects),
  );

  eleventyConfig.addCollection("blogPosts", (collectionApi) =>
    collectionApi
      .getFilteredByTag("blogPost")
      .filter(isPublishedBlogPost)
      .sort(compareBlogPosts),
  );

  eleventyConfig.addFilter("homepageProjects", (projects = []) =>
    [...projects]
      .filter((project) => project.data.show_on_homepage === true)
      .sort(compareProjects)
      .slice(0, 3),
  );

  eleventyConfig.addFilter("renderMarkdown", (value = "") =>
    value ? markdown.render(String(value)) : "",
  );

  eleventyConfig.addFilter("blogArticle", analyzeBlogArticle);

  eleventyConfig.addFilter("displayDate", (value) => {
    const date = asDate(value);
    if (!date) return "";

    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  });

  eleventyConfig.addFilter("htmlDate", (value) => {
    const date = asDate(value);
    return date ? date.toISOString().slice(0, 10) : "";
  });

  eleventyConfig.addFilter("assetUrl", (value = "") => {
    if (!value) return "";
    if (/^(?:https?:)?\/\//.test(value) || value.startsWith("data:")) {
      return value;
    }

    return value.startsWith("/") ? value : `/${value}`;
  });

  eleventyConfig.addFilter("absoluteUrl", (value = "") => {
    if (!value) return "";
    if (/^https?:\/\//.test(value)) return value;

    const path = value.startsWith("/") ? value : `/${value}`;
    return `https://igormihajlovski.com${path}`;
  });

  return {
    dir: {
      input: ".",
      includes: "templates",
      output: "_dist",
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
