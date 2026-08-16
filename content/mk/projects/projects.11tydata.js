const {
  isPublishedContent,
  localizedContentPermalink,
} = require("../../../_lib/localized-content.js");

module.exports = {
  tags: ["caseStudy"],
  lang: "mk",
  status: "Draft",
  layout: "layouts/case-study.njk",
  eleventyComputed: {
    permalink: (data) => localizedContentPermalink(data, "Project"),
    published: (data) => isPublishedContent(data, "Project"),
  },
};
