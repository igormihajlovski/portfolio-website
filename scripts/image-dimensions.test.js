const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const nunjucks = require("nunjucks");
const { imageDimensions, dimensionsFromBuffer } = require("../_lib/image-dimensions.js");
const configureEleventy = require("../eleventy.config.js");

function jpegFixture(orientation = 1, littleEndian = true, progressive = false) {
  const tiff = Buffer.alloc(26);
  tiff.write(littleEndian ? "II" : "MM");
  const write16 = (value, offset) => littleEndian ? tiff.writeUInt16LE(value, offset) : tiff.writeUInt16BE(value, offset);
  const write32 = (value, offset) => littleEndian ? tiff.writeUInt32LE(value, offset) : tiff.writeUInt32BE(value, offset);
  write16(42, 2);
  write32(8, 4);
  write16(1, 8);
  write16(0x0112, 10);
  write16(3, 12);
  write32(1, 14);
  write16(orientation, 18);
  const exif = Buffer.concat([Buffer.from("Exif\0\0"), tiff]);
  const app1 = Buffer.alloc(4);
  app1.writeUInt16BE(0xffe1);
  app1.writeUInt16BE(exif.length + 2, 2);
  const frame = Buffer.from([0xff, progressive ? 0xc2 : 0xc0, 0, 11, 8, 0, 0, 0, 0, 1, 1, 0x11, 0]);
  frame.writeUInt16BE(600, 5);
  frame.writeUInt16BE(800, 7);
  return Buffer.concat([Buffer.from([0xff, 0xd8]), app1, exif, frame, Buffer.from([0xff, 0xd9])]);
}

test("current Services and Gallery files report independently verified dimensions", () => {
  for (const name of ["Development", "Design", "Support"]) {
    assert.deepEqual(imageDimensions(`/images/${name}.jpg`), { width: 1280, height: 853 });
  }
  assert.deepEqual(imageDimensions("/images/Christian-Jaeger-Testimonial-Review-p-1080.jpg"), { width: 1080, height: 608 });
  for (const name of [5, 6, 7]) {
    assert.deepEqual(imageDimensions(`/images/${name}.jpeg`), { width: 1200, height: 1600 });
  }
});

test("local PNG, relative URLs and query/fragment URLs are supported", () => {
  assert.deepEqual(imageDimensions("images/Featured-image-Portfolio-p-1080.png"), { width: 1080, height: 600 });
  assert.deepEqual(imageDimensions("/images/5.jpeg?preview=1#photo"), { width: 1200, height: 1600 });
});

test("JPEG orientation, both byte orders and progressive frame headers preserve the display ratio", () => {
  for (const littleEndian of [true, false]) {
    for (let orientation = 1; orientation <= 8; orientation++) {
      assert.deepEqual(
        dimensionsFromBuffer(jpegFixture(orientation, littleEndian, true)),
        orientation >= 5 ? { width: 600, height: 800 } : { width: 800, height: 600 },
      );
    }
  }
  assert.equal(dimensionsFromBuffer(jpegFixture(9)), null);
});

test("truncated, malformed and unsupported metadata safely returns no dimensions", () => {
  const jpeg = jpegFixture();
  for (let end = 0; end < jpeg.length; end++) assert.equal(dimensionsFromBuffer(jpeg.subarray(0, end)), null);
  const png = fs.readFileSync(path.resolve(__dirname, "../images/favicon.png"));
  assert.equal(dimensionsFromBuffer(png.subarray(0, 20)), null);
  const invalidPng = Buffer.from(png);
  invalidPng.writeUInt32BE(0, 16);
  assert.equal(dimensionsFromBuffer(invalidPng), null);
  const uncertainPng = Buffer.from(png);
  uncertainPng.write("eXIf", 37);
  assert.equal(dimensionsFromBuffer(uncertainPng), null);
  assert.equal(dimensionsFromBuffer(Buffer.from("GIF89a")), null);
  assert.equal(dimensionsFromBuffer(null), null);
});

test("missing files, external URLs, unsupported formats and escaping paths use the fallback", () => {
  for (const value of [
    undefined, null, "", "/images/missing-gallery-fixture.jpg", "/images/technologies/figma.svg",
    "/images/future-upload.webp", "https://example.com/photo.jpg", "//example.com/photo.png",
    "data:image/png;base64,example", "/images/../../outside.jpg", "/images/%invalid.jpg", "/php/config.php",
  ]) assert.equal(imageDimensions(value), null);
});

test("unreadable files do not block a CMS build", (t) => {
  t.mock.method(fs, "readFileSync", () => { throw new Error("unreadable image"); });
  assert.equal(imageDimensions("/images/5.jpeg"), null);
});

test("Case Study template retains Gallery order, captions, escaping and dimensionless fallback", () => {
  const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(path.resolve(__dirname, "../templates")));
  configureEleventy({
    addPassthroughCopy() {}, ignores: new Set(), addCollection() {},
    addFilter: (name, callback) => environment.addFilter(name, callback),
  });
  const html = environment.render("layouts/case-study.njk", {
    lang: "en", title: "Fixture", hero: {},
    gallery: [
      { image: "/images/5.jpeg", alt: 'Local "photo"', caption: "First caption" },
      { image: "https://example.com/future.jpg", alt: "Remote photo", caption: "Second caption" },
      { image: "/images/future.webp", alt: "New format", caption: "Third caption" },
    ],
  });
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(match => match[0]);
  assert.equal(images.length, 3);
  assert.match(images[0], /width="1200" height="1600"/);
  assert.match(images[0], /alt="Local &quot;photo&quot;"/);
  for (const image of images) assert.match(image, /loading="lazy" decoding="async"/);
  for (const image of images.slice(1)) assert.doesNotMatch(image, /\b(?:width|height)=/);
  assert(html.indexOf("First caption") < html.indexOf("Second caption"));
  assert(html.indexOf("Second caption") < html.indexOf("Third caption"));
});
