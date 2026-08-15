module.exports = {
  tags: ["caseStudy"],
  lang: "en",
  layout: "layouts/case-study.njk",
  eleventyComputed: {
    permalink: (data) => `/projects/${data.slug}/index.html`,
  },
};
