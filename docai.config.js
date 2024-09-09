require("dotenv").config();
const fs = require("fs");
const path = require("path");

function getGitignorePatterns() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    return fs
      .readFileSync(gitignorePath, "utf-8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#") && line.trim() !== "") // Exclude empty lines
      .map((pattern) => pattern.trim());
  }
  return [];
}

module.exports = {
  include: ["src/**/*.js"],
  exclude: [
    "node_modules/**",
    "test/**",
    "dist/**",
    ".git/**",
    ...getGitignorePatterns(),
  ], // Hardcoded exclusions
  openaiApiKey: process.env.OPENAI_API_KEY,
};
