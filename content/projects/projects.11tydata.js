module.exports = {
  tags: ["caseStudy"],
  layout: "layouts/case-study.njk",
  eleventyComputed: {
    permalink: (data) => `/projects/${data.slug}/index.html`,
  },
};
