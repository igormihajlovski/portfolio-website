function isPublished(status) {
  return String(status || "").trim().toLowerCase() === "published";
}

module.exports = {
  tags: ["blogPost"],
  lang: "en",
  layout: "layouts/blog-post.njk",
  blogStyles: true,
  eleventyComputed: {
    permalink: (data) =>
      isPublished(data.status) ? `/blog/${data.slug}/index.html` : false,
    eleventyExcludeFromCollections: (data) => !isPublished(data.status),
  },
};
