const languages = {
  en: {
    code: "en",
    label: "English",
    uiNameKey: "languageSwitcher.english",
    shortLabel: "EN",
    prefix: "",
    htmlLang: "en",
    hreflang: "en",
    intlLocale: "en-US",
    ogLocale: "en_US",
    rssLanguage: "en",
    default: true,
  },
  de: {
    code: "de",
    label: "Deutsch",
    uiNameKey: "languageSwitcher.german",
    shortLabel: "DE",
    prefix: "/de",
    htmlLang: "de",
    hreflang: "de",
    intlLocale: "de-DE",
    ogLocale: "de_DE",
    rssLanguage: null,
    default: false,
  },
};

for (const language of Object.values(languages)) {
  Object.freeze(language);
}

module.exports = Object.freeze(languages);
