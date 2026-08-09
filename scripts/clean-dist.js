const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const outputDirectory = path.resolve(projectRoot, "_dist");

if (
  path.dirname(outputDirectory) !== projectRoot ||
  path.basename(outputDirectory) !== "_dist"
) {
  throw new Error("Refusing to clean an unexpected output directory.");
}

fs.rmSync(outputDirectory, { recursive: true, force: true });
