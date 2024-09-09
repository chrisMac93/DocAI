require("dotenv").config(); // Load environment variables from .env file
const fs = require("fs");
const path = require("path");

// Function to get patterns from .gitignore file
function getGitignorePatterns() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  if (fs.existsSync(gitignorePath)) {
    return fs
      .readFileSync(gitignorePath, "utf-8")
      .split("\n")
      .filter((line) => line && !line.startsWith("#") && line.trim() !== "") // Exclude empty lines and comments
      .map((pattern) => pattern.trim());
  }
  return [];
}

module.exports = {
  include: ["src/**/*.js"], // Files to include in the scan
  exclude: [
    "node_modules/**",
    "test/**",
    "dist/**",
    ".git/**",
    ...getGitignorePatterns(), // Exclude patterns from .gitignore
  ], // Hardcoded exclusions
  openaiApiKey: process.env.OPENAI_API_KEY, // OpenAI API key from environment variables
};
