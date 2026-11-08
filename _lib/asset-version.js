const { createHash } = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");

function versionedAsset(value = "") {
  if (
    typeof value !== "string" ||
    /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)
  ) {
    return value;
  }

  const pathname = value.split(/[?#]/, 1)[0];
  if (!/\.(?:css|js)$/i.test(pathname)) return value;

  const filePath = path.resolve(
    projectRoot,
    decodeURIComponent(pathname).replace(/^\/+/, ""),
  );
  const relativePath = path.relative(projectRoot, filePath);
  if (
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error(`Cannot version an asset outside the project: ${value}`);
  }

  // Read current bytes on each render, including subsequent watch builds.
  const version = createHash("sha256")
    .update(fs.readFileSync(filePath))
    .digest("hex")
    .slice(0, 16);
  const url = new URL(value, "https://assets.invalid/");
  url.searchParams.set("v", version);

  return `${pathname}?${url.searchParams.toString()}${url.hash}`;
}

module.exports = { versionedAsset };
