const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const nunjucks = require("nunjucks");
const { versionedAsset } = require("../_lib/asset-version.js");

test("versions are stable and shared by root-relative and relative references", () => {
  const first = versionedAsset("/css/blog.css");
  assert.match(first, /^\/css\/blog\.css\?v=[a-f\d]{16}$/);
  assert.equal(versionedAsset("/css/blog.css"), first);
  assert.equal(versionedAsset("css/blog.css"), first.slice(1));
  assert.match(versionedAsset("/js/webflow.js"), /\?v=[a-f\d]{16}$/);
});

test("content changes and reversions update versions without editing tracked files", (t) => {
  const filePath = path.resolve(__dirname, "../css/blog.css");
  const originalRead = fs.readFileSync;
  const originalContent = originalRead(filePath);
  let content = originalContent;
  t.mock.method(fs, "readFileSync", (filename, ...options) =>
    filename === filePath ? content : originalRead(filename, ...options),
  );

  const originalUrl = versionedAsset("/css/blog.css");
  content = Buffer.concat([originalContent, Buffer.from("\n/* changed fixture */")]);
  assert.notEqual(versionedAsset("/css/blog.css"), originalUrl);
  content = originalContent;
  assert.equal(versionedAsset("/css/blog.css"), originalUrl);
});

test("replaces old versions while retaining other query parameters and fragments", () => {
  const result = new URL(
    versionedAsset("/css/blog.css?theme=dark&v=old&v=older#example"),
    "https://example.com",
  );
  assert.equal(result.pathname, "/css/blog.css");
  assert.equal(result.searchParams.get("theme"), "dark");
  assert.equal(result.searchParams.getAll("v").length, 1);
  assert.match(result.searchParams.get("v"), /^[a-f\d]{16}$/);
  assert.equal(result.hash, "#example");
});

test("external URLs and non-CSS/JS assets remain untouched without file reads", (t) => {
  t.mock.method(fs, "readFileSync", () => {
    assert.fail("Excluded URLs must not read local files");
  });
  for (const value of [
    "https://cdn.example.com/script.js?v=2&site=example",
    "//cdn.example.com/style.css?v=1",
    "https://fonts.googleapis.com/css2?family=Inter&display=swap",
    "data:text/javascript,void(0)",
    "/images/favicon.png",
    "/documents/Web-Development.lottie",
    "",
  ]) {
    assert.equal(versionedAsset(value), value);
  }
});

test("missing local assets and paths outside the repository fail explicitly", () => {
  assert.throws(() => versionedAsset("/css/missing-cache-version-test.css"), /ENOENT/);
  assert.throws(() => versionedAsset("../outside.css"), /outside the project/);
  assert.throws(() => versionedAsset("/css/../../outside.js"), /outside the project/);
  assert.throws(() => versionedAsset("/%2e%2e/outside.css"), /outside the project/);
});

test("Nunjucks escapes query separators exactly once", () => {
  const environment = new nunjucks.Environment();
  environment.addFilter("versionedAsset", versionedAsset);
  const html = environment.renderString(
    '<link href="{{ asset | versionedAsset | escape }}">',
    { asset: "/css/blog.css?theme=dark&v=old" },
  );
  assert.match(html, /^<link href="\/css\/blog\.css\?theme=dark&amp;v=[a-f\d]{16}">$/);
});
