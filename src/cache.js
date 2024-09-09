const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const cacheFilePath = path.join(process.cwd(), "fileCache.json");

// Generate a hash for the given file content
function getFileHash(content) {
  return crypto.createHash("md5").update(content).digest("hex");
}

// Load the cache from the cache file
function loadCache() {
  if (fs.existsSync(cacheFilePath)) {
    return JSON.parse(fs.readFileSync(cacheFilePath, "utf-8"));
  }
  return {};
}

// Save the cache to the cache file
function saveCache(cache) {
  fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2));
}

// Update the cache with the hash of the given file content
function updateCache(filePath, content) {
  const cache = loadCache();
  cache[filePath] = getFileHash(content);
  saveCache(cache);
}

// Check if the file content has changed by comparing hashes
function hasFileChanged(filePath, content) {
  const cache = loadCache();
  const currentHash = getFileHash(content);
  return cache[filePath] !== currentHash;
}

module.exports = { updateCache, hasFileChanged };
