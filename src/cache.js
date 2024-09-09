const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const cacheFilePath = path.join(process.cwd(), "fileCache.json");

function getFileHash(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

function loadCache() {
  if (fs.existsSync(cacheFilePath)) {
    return JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
  }
  return {};
}

function saveCache(cache) {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
}

function updateCache(filePath, content) {
  const cache = loadCache();
  cache[filePath] = getFileHash(content);
  saveCache(cache);
}

function hasFileChanged(filePath, content) {
  const cache = loadCache();
  const currentHash = getFileHash(content);
  return cache[filePath] !== currentHash;
}

module.exports = { updateCache, hasFileChanged };
