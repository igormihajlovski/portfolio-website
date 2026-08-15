const languages = require("../_data/languages.js");

const CONTENT_TYPES = Object.freeze({
  Project: Object.freeze({ routeSegment: "projects" }),
  Blog: Object.freeze({ routeSegment: "blog" }),
});

const PUBLICATION_STATUSES = Object.freeze(["draft", "published"]);
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TRANSLATION_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function normalizeValue(value) {
  return String(value || "").trim();
}

function normalizePublicationStatus(value) {
  return normalizeValue(value).toLowerCase();
}

function getContentLanguage(languageCode) {
  const normalizedCode = normalizeValue(languageCode).toLowerCase();
  const language = languages[normalizedCode];

  if (!language) {
    throw new Error(
      `[content] Unsupported or missing language code: "${normalizedCode || "<empty>"}".`,
    );
  }

  return language;
}

function getContentType(contentType) {
  const definition = CONTENT_TYPES[contentType];

  if (!definition) {
    throw new Error(`[content] Unsupported content type: "${contentType}".`);
  }

  return definition;
}

function validateContentRecord(data, contentType, sourceLabel = "<synthetic>") {
  const definition = getContentType(contentType);
  const language = getContentLanguage(data?.lang);
  const title = normalizeValue(data?.title);
  const slug = normalizeValue(data?.slug);
  const translationId = normalizeValue(data?.translation_id);
  const status = normalizePublicationStatus(data?.status);

  if (!title) {
    throw new Error(`[content] ${contentType} "${sourceLabel}" is missing title.`);
  }

  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `[content] ${contentType} "${sourceLabel}" has invalid slug "${slug}".`,
    );
  }

  if (!TRANSLATION_ID_PATTERN.test(translationId)) {
    throw new Error(
      `[content] ${contentType} "${sourceLabel}" has invalid translation_id "${translationId}".`,
    );
  }

  if (!PUBLICATION_STATUSES.includes(status)) {
    throw new Error(
      `[content] ${contentType} "${sourceLabel}" has invalid publication status "${normalizeValue(data?.status)}". Expected Draft or Published.`,
    );
  }

  return {
    contentType,
    definition,
    language,
    title,
    slug,
    translationId,
    status,
    published: status === "published",
  };
}

function isPublishedContent(data, contentType) {
  return validateContentRecord(
    data,
    contentType,
    data?.page?.inputPath || data?.slug || "<synthetic>",
  ).published;
}

function localizedContentPermalink(data, contentType) {
  const record = validateContentRecord(
    data,
    contentType,
    data?.page?.inputPath || data?.slug || "<synthetic>",
  );

  if (!record.published) return false;

  const prefix = record.language.prefix || "";
  return `${prefix}/${record.definition.routeSegment}/${record.slug}/index.html`;
}

function validateProjectSlugPairs(entries) {
  const slugsByTranslationId = new Map();

  for (const entry of entries) {
    const record = validateContentRecord(
      entry.data,
      "Project",
      entry.inputPath || "<synthetic>",
    );
    const existing = slugsByTranslationId.get(record.translationId);

    if (existing && existing.slug !== record.slug) {
      throw new Error(
        `[content] Project translations with translation_id "${record.translationId}" must share one slug; found "${existing.slug}" in "${existing.inputPath}" and "${record.slug}" in "${entry.inputPath}".`,
      );
    }

    slugsByTranslationId.set(record.translationId, {
      slug: record.slug,
      inputPath: entry.inputPath || "<synthetic>",
    });
  }

  return entries;
}

module.exports = {
  CONTENT_TYPES,
  PUBLICATION_STATUSES,
  SLUG_PATTERN,
  TRANSLATION_ID_PATTERN,
  getContentLanguage,
  isPublishedContent,
  localizedContentPermalink,
  normalizePublicationStatus,
  validateContentRecord,
  validateProjectSlugPairs,
};
