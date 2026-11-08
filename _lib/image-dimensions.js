const fs = require("node:fs");
const path = require("node:path");

const projectRoot = path.resolve(__dirname, "..");
const imagesRoot = path.join(projectRoot, "images");
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const jpegFrameMarkers = new Set([
  0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7,
  0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf,
]);

function dimensions(width, height, orientation = 1) {
  if (!width || !height || width > 0x7fffffff || height > 0x7fffffff) return null;
  return orientation >= 5 ? { width: height, height: width } : { width, height };
}

function jpegOrientation(tiff) {
  const order = tiff.toString("ascii", 0, 2);
  if (order !== "II" && order !== "MM") return null;
  const read16 = (offset) => order === "II" ? tiff.readUInt16LE(offset) : tiff.readUInt16BE(offset);
  const read32 = (offset) => order === "II" ? tiff.readUInt32LE(offset) : tiff.readUInt32BE(offset);
  if (read16(2) !== 42) return null;
  const directory = read32(4);
  if (directory < 8) return null;
  const count = read16(directory);
  if (directory + 2 + count * 12 > tiff.length) return null;
  for (let index = 0; index < count; index++) {
    const entry = directory + 2 + index * 12;
    if (read16(entry) !== 0x0112) continue;
    if (read16(entry + 2) !== 3 || read32(entry + 4) !== 1) return null;
    const orientation = read16(entry + 8);
    return orientation >= 1 && orientation <= 8 ? orientation : null;
  }
  return 1;
}

function jpegDimensions(bytes) {
  let offset = 2;
  let size = null;
  let orientation = 1;
  while (offset < bytes.length) {
    if (bytes[offset++] !== 0xff) return null;
    while (bytes[offset] === 0xff) offset++;
    const marker = bytes[offset++];
    if (marker === 0xd9) return size && dimensions(size.width, size.height, orientation);
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = bytes.readUInt16BE(offset);
    const end = offset + length;
    if (length < 2 || end > bytes.length) return null;
    if (marker === 0xda) return size && dimensions(size.width, size.height, orientation);
    if (jpegFrameMarkers.has(marker)) {
      if (length < 8 || length < 8 + 3 * bytes[offset + 7]) return null;
      size = { width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3) };
    }
    if (marker === 0xe1 && length >= 8 && bytes.toString("ascii", offset + 2, offset + 8) === "Exif\0\0") {
      orientation = jpegOrientation(bytes.subarray(offset + 8, end));
      if (orientation === null) return null;
    }
    offset = end;
  }
  return null;
}

function pngDimensions(bytes) {
  if (bytes.length < 33 || bytes.readUInt32BE(8) !== 13 || bytes.toString("ascii", 12, 16) !== "IHDR") return null;
  let offset = 8;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) return null;
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    // PNG EXIF is conservatively unsupported; omit attributes rather than guess.
    if (type === "eXIf") return null;
    if (type === "IEND") return dimensions(bytes.readUInt32BE(16), bytes.readUInt32BE(20));
    offset = end;
  }
  return null;
}

function dimensionsFromBuffer(bytes) {
  if (!Buffer.isBuffer(bytes)) return null;
  try {
    if (bytes.subarray(0, 8).equals(pngSignature)) return pngDimensions(bytes);
    if (bytes.readUInt16BE(0) === 0xffd8) return jpegDimensions(bytes);
  } catch {
    // Truncated or unsupported metadata must not prevent CMS content publishing.
  }
  return null;
}

// Local JPEG/PNG only. External URLs, other formats, missing/unreadable files,
// and uncertain metadata return null: keep the original image without dimensions.
function imageDimensions(value) {
  if (typeof value !== "string" || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return null;
  try {
    const pathname = decodeURIComponent(value.split(/[?#]/, 1)[0]);
    if (!/\.(?:jpe?g|png)$/i.test(pathname)) return null;
    const filePath = path.resolve(projectRoot, pathname.replace(/^\/+/, ""));
    const relative = path.relative(imagesRoot, filePath);
    if (!relative || relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return null;
    return dimensionsFromBuffer(fs.readFileSync(filePath));
  } catch {
    return null;
  }
}

module.exports = { imageDimensions, dimensionsFromBuffer };
