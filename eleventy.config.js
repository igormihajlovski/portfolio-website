const MarkdownIt = require("markdown-it");
const site = require("./_data/site.json");
const languages = require("./_data/languages.js");
const {
  createTranslator,
  dictionaries,
  dictionaryKeyCounts,
  validateDictionaryParity,
} = require("./_lib/ui-i18n.js");
const {
  isPublishedContent,
  localizedContentPermalink,
  validateContentRecord,
  validateProjectSlugPairs,
} = require("./_lib/localized-content.js");

const languageEntries = Object.values(languages);
const defaultLanguages = languageEntries.filter((language) => language.default);

if (defaultLanguages.length !== 1) {
  throw new Error(
    `[i18n] Expected exactly one default language, found ${defaultLanguages.length}.`,
  );
}

const DEFAULT_LANGUAGE = defaultLanguages[0].code;
const configuredLanguageCodes = languageEntries.map((language) => language.code);
const dictionaryLanguageCodes = Object.keys(dictionaries);
const missingDictionaries = configuredLanguageCodes.filter(
  (languageCode) => !dictionaryLanguageCodes.includes(languageCode),
);
const unconfiguredDictionaries = dictionaryLanguageCodes.filter(
  (languageCode) => !configuredLanguageCodes.includes(languageCode),
);

if (missingDictionaries.length || unconfiguredDictionaries.length) {
  throw new Error(
    `[i18n] UI dictionary languages do not match configured languages (missing: ${missingDictionaries.join(", ") || "none"}; unconfigured: ${unconfiguredDictionaries.join(", ") || "none"}).`,
  );
}

const FIXED_ROUTES = Object.freeze({
  home: "/",
  projects: "/projects/",
  blog: "/blog/",
  privacy: "/privacy-policy/",
});

const FIXED_PAGE_IDS = Object.freeze(Object.keys(FIXED_ROUTES));

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

function displayDate(value, languageCode) {
  const date = asDate(value);
  if (!date) return "";

  return new Intl.DateTimeFormat(getLanguage(languageCode).intlLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
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
  return isPublishedContent(post.data, "Blog");
}

function isPublishedProject(project) {
  return isPublishedContent(project.data, "Project");
}

function absoluteSiteUrl(value = "") {
  if (!value) return "";
  if (/^https?:\/\//.test(value)) return value;

  const path = value.startsWith("/") ? value : `/${value}`;
  return `${site.url}${path}`;
}

function hasNoindexDirective(entry) {
  return /\bnoindex\b/i.test(String(entry.data?.robots || ""));
}

function asNewsletterDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const timestamp = String(value).trim();
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(
      timestamp,
    )
  ) {
    return null;
  }

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeBlogRssUpdate(post) {
  const title = post.data.title || "";
  const publishedAt = asDate(post.data.published_date);

  if (!post.url || !String(title).trim() || !publishedAt) return null;
  if (hasNoindexDirective(post)) return null;

  const canonicalUrl = absoluteSiteUrl(post.url);
  const category = post.data.category || "";
  const categories = [];

  if (category) categories.push(category);

  for (const tag of post.data.tags || []) {
    const normalizedTag = String(tag).toLowerCase();
    if (
      normalizedTag !== "blogpost" &&
      normalizedTag !== String(category).toLowerCase()
    ) {
      categories.push(tag);
    }
  }

  return {
    contentType: "Blog",
    title,
    canonicalUrl,
    guid: canonicalUrl,
    publishedAt,
    description: post.data.short_description || "",
    featuredImage: absoluteSiteUrl(post.data.featured_image || ""),
    categories,
    author: post.data.author || "Igor Mihajlovski",
    source: post,
  };
}

function normalizeProjectRssUpdate(project) {
  const data = project.data || project;
  const title = data.title || "";
  const slug = String(data.slug || "").trim();
  const description = data.short_description || "";
  const publishedAt = asNewsletterDate(data.newsletter_published_at);

  if (!publishedAt) return null;
  if (!String(title).trim() || !String(description).trim()) return null;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  if (hasNoindexDirective({ data })) return null;

  const canonicalUrl = absoluteSiteUrl(`/projects/${slug}/`);
  const categories = ["Project"];
  const projectCategory = String(data.category || "").trim();

  if (projectCategory && projectCategory.toLowerCase() !== "project") {
    categories.push(data.category);
  }

  return {
    contentType: "Project",
    title,
    canonicalUrl,
    guid: canonicalUrl,
    publishedAt,
    description,
    featuredImage: absoluteSiteUrl(data.hero?.featured_image || ""),
    categories,
    author: "Igor Mihajlovski",
    source: project,
  };
}

function compareRssUpdates(left, right) {
  const leftDate = left.publishedAt?.getTime() || 0;
  const rightDate = right.publishedAt?.getTime() || 0;

  if (leftDate !== rightDate) return rightDate - leftDate;

  return left.canonicalUrl.localeCompare(right.canonicalUrl);
}

function getLanguage(languageCode = DEFAULT_LANGUAGE) {
  const normalizedCode = String(languageCode || DEFAULT_LANGUAGE)
    .trim()
    .toLowerCase();
  const language = languages[normalizedCode];

  if (!language) {
    throw new Error(`[i18n] Unsupported language code: "${normalizedCode}".`);
  }

  return language;
}

const translate = createTranslator({
  getLanguage,
  defaultLanguage: DEFAULT_LANGUAGE,
});

function whatsappUrl(message) {
  const encodedMessage = encodeURIComponent(String(message || "")).replace(
    /'/g,
    "%27",
  );

  return `https://wa.me/38970265014?text=${encodedMessage}`;
}

function getEntryLanguage(entry, contentType) {
  const languageCode = String(entry.data?.lang || "")
    .trim()
    .toLowerCase();

  if (!languageCode) {
    throw new Error(
      `[i18n] ${contentType} entry "${entry.inputPath}" is missing required lang metadata.`,
    );
  }

  getLanguage(languageCode);
  return languageCode;
}

function validateTranslatableEntries(entries, contentType) {
  const seenTranslationKeys = new Map();

  for (const entry of entries) {
    const record = validateContentRecord(
      entry.data,
      contentType,
      entry.inputPath,
    );
    const languageCode = record.language.code;
    const translationId = record.translationId;

    const translationKey = `${contentType}:${languageCode}:${translationId}`;
    const existingPath = seenTranslationKeys.get(translationKey);

    if (existingPath) {
      throw new Error(
        `[i18n] Duplicate translation key "${translationKey}" in "${existingPath}" and "${entry.inputPath}".`,
      );
    }

    seenTranslationKeys.set(translationKey, entry.inputPath);
  }

  if (contentType === "Project") validateProjectSlugPairs(entries);

  return entries;
}

function getLocalizedContent(collectionApi, tag, contentType) {
  return validateTranslatableEntries(
    collectionApi.getFilteredByTag(tag),
    contentType,
  );
}

function getPublishedLocalizedContent(collectionApi, tag, contentType) {
  const isPublished =
    contentType === "Project" ? isPublishedProject : isPublishedBlogPost;

  return getLocalizedContent(collectionApi, tag, contentType).filter(isPublished);
}

function isDefaultLanguageEntry(entry, contentType) {
  return getEntryLanguage(entry, contentType) === DEFAULT_LANGUAGE;
}

function groupContentByLanguage(entries, contentType) {
  const groupedEntries = Object.fromEntries(
    languageEntries.map((language) => [language.code, []]),
  );

  for (const entry of entries) {
    groupedEntries[getEntryLanguage(entry, contentType)].push(entry);
  }

  return groupedEntries;
}

function addEntriesToTranslationMap(
  translationMap,
  entries,
  contentType,
) {
  translationMap[contentType] = {};

  for (const entry of entries) {
    const translationId = String(entry.data.translation_id).trim();
    const languageCode = getEntryLanguage(entry, contentType);

    translationMap[contentType][translationId] ||= {};
    translationMap[contentType][translationId][languageCode] = entry;
  }
}

function localizedUrl(routeKey, languageCode = DEFAULT_LANGUAGE) {
  if (!Object.prototype.hasOwnProperty.call(FIXED_ROUTES, routeKey)) {
    throw new Error(`[i18n] Unknown fixed route key: "${routeKey}".`);
  }

  const language = getLanguage(languageCode);
  const route = FIXED_ROUTES[routeKey];

  if (!language.prefix) return route;
  return route === "/" ? `${language.prefix}/` : `${language.prefix}${route}`;
}

function validateFixedPageTranslations(entries) {
  const translationMap = Object.fromEntries(
    FIXED_PAGE_IDS.map((fixedPageId) => [fixedPageId, {}]),
  );

  for (const entry of entries) {
    const fixedPageId = String(entry.data?.fixedPageId || "").trim();
    const language = getLanguage(entry.data?.lang);

    if (!FIXED_PAGE_IDS.includes(fixedPageId)) {
      throw new Error(
        `[i18n] Fixed page "${entry.inputPath}" has unknown fixedPageId "${fixedPageId || "<empty>"}".`,
      );
    }

    if (translationMap[fixedPageId][language.code]) {
      throw new Error(
        `[i18n] Duplicate ${language.code} fixed page for "${fixedPageId}".`,
      );
    }

    const expectedUrl = localizedUrl(fixedPageId, language.code);
    if (entry.url !== expectedUrl) {
      throw new Error(
        `[i18n] Fixed page "${entry.inputPath}" must render at "${expectedUrl}", received "${entry.url}".`,
      );
    }

    translationMap[fixedPageId][language.code] = entry;
  }

  for (const fixedPageId of FIXED_PAGE_IDS) {
    const missingLanguages = configuredLanguageCodes.filter(
      (languageCode) => !translationMap[fixedPageId][languageCode],
    );

    if (missingLanguages.length) {
      throw new Error(
        `[i18n] Fixed page "${fixedPageId}" is missing translations for: ${missingLanguages.join(", ")}.`,
      );
    }
  }

  return translationMap;
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
    getPublishedLocalizedContent(collectionApi, "caseStudy", "Project")
      .filter((entry) => isDefaultLanguageEntry(entry, "Project"))
      .sort(compareProjects),
  );

  eleventyConfig.addCollection("blogPosts", (collectionApi) =>
    getPublishedLocalizedContent(collectionApi, "blogPost", "Blog")
      .filter((entry) => isDefaultLanguageEntry(entry, "Blog"))
      .sort(compareBlogPosts),
  );

  eleventyConfig.addCollection("caseStudiesByLanguage", (collectionApi) =>
    groupContentByLanguage(
      getPublishedLocalizedContent(
        collectionApi,
        "caseStudy",
        "Project",
      ).sort(compareProjects),
      "Project",
    ),
  );

  eleventyConfig.addCollection("blogPostsByLanguage", (collectionApi) =>
    groupContentByLanguage(
      getPublishedLocalizedContent(collectionApi, "blogPost", "Blog").sort(
        compareBlogPosts,
      ),
      "Blog",
    ),
  );

  eleventyConfig.addCollection("translationMap", (collectionApi) => {
    const translationMap = {};

    addEntriesToTranslationMap(
      translationMap,
      getPublishedLocalizedContent(collectionApi, "caseStudy", "Project"),
      "Project",
    );
    addEntriesToTranslationMap(
      translationMap,
      getPublishedLocalizedContent(collectionApi, "blogPost", "Blog"),
      "Blog",
    );

    return translationMap;
  });

  eleventyConfig.addCollection("fixedPageTranslationMap", (collectionApi) =>
    validateFixedPageTranslations(collectionApi.getFilteredByTag("fixedPage")),
  );

  eleventyConfig.addCollection("rssUpdates", (collectionApi) => {
    const blogUpdates = getPublishedLocalizedContent(
      collectionApi,
      "blogPost",
      "Blog",
    )
      .filter((entry) => isDefaultLanguageEntry(entry, "Blog"))
      .map(normalizeBlogRssUpdate)
      .filter(Boolean);

    const projectUpdates = getPublishedLocalizedContent(
      collectionApi,
      "caseStudy",
      "Project",
    )
      .filter((entry) => isDefaultLanguageEntry(entry, "Project"))
      .map(normalizeProjectRssUpdate)
      .filter(Boolean);

    return [...blogUpdates, ...projectUpdates].sort(compareRssUpdates);
  });

  eleventyConfig.addCollection("sitemapPages", (collectionApi) =>
    collectionApi
      .getAll()
      .filter((entry) => {
        if (!entry.url || !entry.outputPath?.endsWith(".html")) return false;
        if (entry.data.eleventyExcludeFromCollections === true) return false;
        if (entry.data.sitemap?.exclude === true) return false;

        const robotsDirective = String(entry.data.robots || "");
        return !/\bnoindex\b/i.test(robotsDirective);
      })
      .sort((left, right) => left.url.localeCompare(right.url)),
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

  eleventyConfig.addFilter("displayDate", displayDate);

  eleventyConfig.addFilter("htmlDate", (value) => {
    const date = asDate(value);
    return date ? date.toISOString().slice(0, 10) : "";
  });

  eleventyConfig.addFilter("rssDate", (value) => {
    const date = asDate(value);
    return date ? date.toUTCString() : "";
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
    return `${site.url}${path}`;
  });

  eleventyConfig.addFilter("jsonString", (value = "") =>
    JSON.stringify(String(value)),
  );

  eleventyConfig.addFilter(
    "htmlLang",
    (languageCode) => getLanguage(languageCode).htmlLang,
  );

  eleventyConfig.addFilter(
    "ogLocale",
    (languageCode) => getLanguage(languageCode).ogLocale,
  );

  eleventyConfig.addFilter("localizedUrl", localizedUrl);
  eleventyConfig.addFilter("t", translate);
  eleventyConfig.addFilter("whatsappUrl", whatsappUrl);

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

module.exports._rssTest = {
  asNewsletterDate,
  isPublishedBlogPost,
  normalizeBlogRssUpdate,
  normalizeProjectRssUpdate,
  compareRssUpdates,
};

module.exports._i18nTest = {
  DEFAULT_LANGUAGE,
  FIXED_ROUTES,
  FIXED_PAGE_IDS,
  getLanguage,
  displayDate,
  localizedUrl,
  validateFixedPageTranslations,
  translate,
  whatsappUrl,
  dictionaryKeyCounts,
  validateDictionaryParity,
  validateTranslatableEntries,
};

module.exports._contentTest = {
  DEFAULT_LANGUAGE,
  addEntriesToTranslationMap,
  getEntryLanguage,
  groupContentByLanguage,
  isDefaultLanguageEntry,
  isPublishedBlogPost,
  isPublishedProject,
  localizedContentPermalink,
  validateContentRecord,
  validateProjectSlugPairs,
  validateTranslatableEntries,
};
