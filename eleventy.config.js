const MarkdownIt = require("markdown-it");

const markdown = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

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

  eleventyConfig.addFilter("homepageProjects", (projects = []) =>
    [...projects]
      .filter((project) => project.data.show_on_homepage === true)
      .sort(compareProjects)
      .slice(0, 3),
  );

  eleventyConfig.addFilter("renderMarkdown", (value = "") =>
    value ? markdown.render(String(value)) : "",
  );

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
