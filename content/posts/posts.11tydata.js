module.exports = {
  tags: ["caseStudy"],
  layout: "layouts/case-study.njk",
  eleventyComputed: {
    permalink: (data) => `/blog/${data.slug}/index.html`,
  },
};
