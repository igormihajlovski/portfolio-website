const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const yaml = require("js-yaml");
const nunjucks = require("nunjucks");
const configureEleventy = require("../eleventy.config.js");
const {
  PROJECT_TYPES,
  groupProjectsByType,
  validateProjectType,
} = require("../_lib/project-types.js");
const { validateContentRecord } = require("../_lib/localized-content.js");
const { dictionaries, validateDictionaryParity } = require("../_lib/ui-i18n.js");

const root = path.resolve(__dirname, "..");
const collections = new Map();
const filters = new Map();
configureEleventy({
  addPassthroughCopy() {},
  ignores: new Set(),
  addCollection: (name, callback) => collections.set(name, callback),
  addFilter: (name, callback) => filters.set(name, callback),
});

function project(slug, type, overrides = {}) {
  return {
    inputPath: `./fixtures/${overrides.lang || "en"}/${slug}.md`,
    url: `/${overrides.lang || "en"}/projects/${slug}/`,
    data: {
      title: slug,
      slug,
      translation_id: slug,
      lang: "en",
      status: "Published",
      project_type: type,
      published_date: "2026-08-01",
      show_on_homepage: true,
      hero: { featured_image: "/images/example.jpg" },
      ...overrides,
    },
  };
}

function renderListing(lang, entriesByLanguage) {
  const environment = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(root, "templates")),
  );
  for (const [name, callback] of filters) environment.addFilter(name, callback);
  return environment.render("includes/projects-listing.njk", {
    lang,
    collections: { caseStudiesByLanguage: entriesByLanguage },
  });
}

test("groups use the approved order and preserve collection order without mutation", () => {
  const entries = [
    project("tool", "Web Tools & Embeds"),
    project("newer-client", "Client Projects"),
    project("demo", "Demo Projects"),
    project("portfolio", "Personal Portfolio"),
    project("older-client", "Client Projects"),
  ];
  const snapshot = structuredClone(entries);
  const groups = groupProjectsByType(entries);
  assert.deepEqual(groups.map((group) => group.value), PROJECT_TYPES.map((type) => type.value));
  assert.deepEqual(groups[0].projects.map((entry) => entry.data.slug), ["newer-client", "older-client"]);
  assert.deepEqual(entries, snapshot);
});

test("empty groups are omitted, including an entirely empty collection", () => {
  assert.deepEqual(groupProjectsByType(), []);
  const groups = groupProjectsByType([project("demo", "Demo Projects")]);
  assert.deepEqual(groups.map((group) => group.value), ["Demo Projects"]);
});

test("missing, unknown and localized stored values fail with their source path", () => {
  for (const value of [undefined, null, "", "Unknown", "Webflow", "Kundenprojekte", "Client Projects ", {}, 1]) {
    assert.throws(() => validateProjectType(value, "invalid-record.md"), /invalid-record\.md.*project_type/);
    assert.throws(() => groupProjectsByType([project("invalid", value)]), /project_type/);
  }
  for (const type of PROJECT_TYPES) assert.equal(validateProjectType(type.value), type.value);
});

test("project type validation covers published and draft Projects and leaves Blog validation unchanged", () => {
  for (const status of ["Published", "Draft"]) {
    const data = project("entry", undefined, { status }).data;
    assert.throws(() => validateContentRecord(data, "Project", "entry.md"), /entry\.md.*project_type/);
    assert.doesNotThrow(() => validateContentRecord(data, "Blog", "entry.md"));
    data.project_type = "Client Projects";
    assert.doesNotThrow(() => validateContentRecord(data, "Project", "entry.md"));
  }
});

test("existing collections retain publication, language, date sorting and homepage selection rules", () => {
  const entries = [
    project("old-client", "Client Projects", { published_date: "2026-07-01" }),
    project("draft", "Client Projects", { status: "Draft", published_date: "2026-09-01", lang: "mk" }),
    project("portfolio", "Personal Portfolio", { published_date: "2026-08-03" }),
    project("german", "Client Projects", { lang: "de" }),
    project("new-client", "Client Projects", { published_date: "2026-08-02" }),
    project("not-home", "Demo Projects", { published_date: "2026-08-04", show_on_homepage: false }),
    project("string-true", "Web Tools & Embeds", { published_date: "2026-08-05", show_on_homepage: "true" }),
    project("home-tool", "Web Tools & Embeds", { published_date: "2026-08-01" }),
  ];
  const localized = collections.get("caseStudiesByLanguage")({ getFilteredByTag: () => entries });
  assert.deepEqual(localized.mk, []);
  assert.deepEqual(localized.de.map((entry) => entry.data.slug), ["german"]);
  assert.deepEqual(filters.get("projectGroups")(localized.en)[0].projects.map((entry) => entry.data.slug), ["new-client", "old-client"]);
  assert.deepEqual(filters.get("homepageProjects")(localized.en).map((entry) => entry.data.slug), ["portfolio", "new-client", "home-tool"]);
  assert.deepEqual(filters.get("homepageProjects")(localized.mk), []);
});

test("all Projects CMS collections require the shared select with identical stored values", () => {
  const schema = yaml.load(fs.readFileSync(path.join(root, ".pages.yml"), "utf8"));
  const component = schema.components.project_type;
  assert.equal(component.type, "select");
  assert.equal(component.required, true);
  assert.equal(component.default, undefined);
  assert.deepEqual(component.options.values, PROJECT_TYPES.map((type) => type.value));
  const projects = schema.content.find((item) => item.name === "projects").items;
  assert.equal(projects.length, 3);
  for (const collection of projects) {
    assert.deepEqual(collection.fields.filter((field) => field.name === "project_type"), [{ name: "project_type", component: "project_type" }]);
    assert.equal(collection.fields.find((field) => field.name === "category").component, "project_category");
  }
});

test("all nine localized records retain the expected classification and homepage inclusion", () => {
  for (const lang of ["en", "de", "mk"]) {
    const directory = path.join(root, "content", lang === "en" ? "" : lang, "projects");
    const files = fs.readdirSync(directory).filter((file) => file.endsWith(".md"));
    assert.equal(files.length, 3);
    for (const file of files) {
      const source = fs.readFileSync(path.join(directory, file), "utf8");
      const data = yaml.load(source.split(/^---\s*$/m)[1]);
      const expected = file === "personal-portfolio-website.md" ? "Personal Portfolio" : "Client Projects";
      assert.equal(data.project_type, expected, `${lang}/${file}`);
      assert.equal(data.status, "Published");
      assert.equal(data.show_on_homepage, true);
    }
  }
});

test("dictionary parity and localized group headings, card hierarchy and empty states render correctly", () => {
  const counts = Object.values(validateDictionaryParity());
  assert.ok(counts.every((count) => count === counts[0]));
  const entries = [project("client", "Client Projects"), project("portfolio", "Personal Portfolio")];
  for (const lang of ["en", "de", "mk"]) {
    for (const type of PROJECT_TYPES) assert.ok(dictionaries[lang].projectTypes[type.key]);
    const html = renderListing(lang, { [lang]: entries });
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.equal((html.match(/<h2 /g) || []).length, 2);
    assert.equal((html.match(/<h3 class="card-heading">/g) || []).length, 2);
    assert.equal((html.match(/loading="eager"/g) || []).length, 1);
    for (const key of ["clientProjects", "personalPortfolio"]) assert.ok(html.includes(dictionaries[lang].projectTypes[key]));
    for (const key of ["demoProjects", "webToolsEmbeds"]) assert.ok(!html.includes(`id="project-group-${key}"`));
    const empty = renderListing(lang, { en: entries, [lang]: [] });
    assert.ok(empty.includes(dictionaries[lang].projects.emptyState));
    assert.ok(!empty.includes('class="card-portfolio'));
  }
});
