const {
  isPublishedContent,
  localizedContentPermalink,
} = require("../../../_lib/localized-content.js");

module.exports = {
  tags: ["blogPost"],
  lang: "de",
  status: "Draft",
  layout: "layouts/blog-post.njk",
  blogStyles: true,
  eleventyComputed: {
    permalink: (data) => localizedContentPermalink(data, "Blog"),
    published: (data) => isPublishedContent(data, "Blog"),
  },
};
