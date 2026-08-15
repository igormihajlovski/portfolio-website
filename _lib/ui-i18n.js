const english = require("../_data/i18n/en.json");
const german = require("../_data/i18n/de.json");

const dictionaries = Object.freeze({
  en: english,
  de: german,
});

function flattenDictionary(value, path = "", result = new Map()) {
  if (typeof value === "string") {
    if (!value.trim()) {
      throw new Error(`[i18n] Translation "${path}" must not be empty.`);
    }

    result.set(path, value);
    return result;
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`[i18n] Translation "${path || "<root>"}" must be a string or object.`);
  }

  const entries = Object.entries(value);
  if (!entries.length) {
    throw new Error(`[i18n] Translation object "${path || "<root>"}" must not be empty.`);
  }

  for (const [key, child] of entries) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key)) {
      throw new Error(`[i18n] Invalid translation key segment "${key}" at "${path || "<root>"}".`);
    }

    flattenDictionary(child, path ? `${path}.${key}` : key, result);
  }

  return result;
}

function getInterpolationNames(value, key, locale) {
  const names = [...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g)].map(
    (match) => match[1],
  );
  const withoutPlaceholders = value.replace(
    /\{[a-zA-Z][a-zA-Z0-9]*\}/g,
    "",
  );

  if (/[{}]/.test(withoutPlaceholders)) {
    throw new Error(
      `[i18n] Malformed interpolation placeholder in "${key}" for "${locale}".`,
    );
  }

  return [...new Set(names)].sort();
}

function validateDictionaryParity(localeDictionaries = dictionaries) {
  const localeEntries = Object.entries(localeDictionaries);
  if (!localeEntries.length) {
    throw new Error("[i18n] At least one UI translation dictionary is required.");
  }

  const [referenceLocale, referenceDictionary] = localeEntries[0];
  const reference = flattenDictionary(referenceDictionary);

  for (const [key, value] of reference) {
    getInterpolationNames(value, key, referenceLocale);
  }

  for (const [locale, dictionary] of localeEntries.slice(1)) {
    const candidate = flattenDictionary(dictionary);
    const missing = [...reference.keys()].filter((key) => !candidate.has(key));
    const extra = [...candidate.keys()].filter((key) => !reference.has(key));

    if (missing.length || extra.length) {
      const details = [
        missing.length ? `missing: ${missing.join(", ")}` : "",
        extra.length ? `extra: ${extra.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join("; ");

      throw new Error(
        `[i18n] UI dictionary parity failed for "${locale}" against "${referenceLocale}" (${details}).`,
      );
    }

    for (const [key, referenceValue] of reference) {
      const referenceNames = getInterpolationNames(
        referenceValue,
        key,
        referenceLocale,
      );
      const candidateNames = getInterpolationNames(candidate.get(key), key, locale);

      if (referenceNames.join("\n") !== candidateNames.join("\n")) {
        throw new Error(
          `[i18n] Interpolation placeholders for "${key}" differ between "${referenceLocale}" and "${locale}".`,
        );
      }
    }
  }

  return Object.fromEntries(
    localeEntries.map(([locale, dictionary]) => [
      locale,
      flattenDictionary(dictionary).size,
    ]),
  );
}

const dictionaryKeyCounts = Object.freeze(validateDictionaryParity());

function getDictionaryValue(dictionary, key) {
  return String(key || "")
    .split(".")
    .filter(Boolean)
    .reduce((value, segment) => value?.[segment], dictionary);
}

function interpolate(value, variables, key, locale) {
  const replacements = variables || {};

  return value.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/g, (match, name) => {
    if (!Object.prototype.hasOwnProperty.call(replacements, name)) {
      throw new Error(
        `[i18n] Missing interpolation variable "${name}" for "${key}" in "${locale}".`,
      );
    }

    return String(replacements[name]);
  });
}

function createTranslator({ getLanguage, defaultLanguage }) {
  if (typeof getLanguage !== "function") {
    throw new Error("[i18n] createTranslator requires the central language resolver.");
  }

  return function translate(key, languageCode = defaultLanguage, variables = {}) {
    const locale = getLanguage(languageCode).code;
    const dictionary = dictionaries[locale];

    if (!dictionary) {
      throw new Error(`[i18n] No UI dictionary configured for language "${locale}".`);
    }

    const value = getDictionaryValue(dictionary, key);
    if (typeof value !== "string") {
      throw new Error(`[i18n] Missing UI translation "${key}" for language "${locale}".`);
    }

    return interpolate(value, variables, key, locale);
  };
}

module.exports = {
  dictionaries,
  dictionaryKeyCounts,
  flattenDictionary,
  getInterpolationNames,
  validateDictionaryParity,
  createTranslator,
};
