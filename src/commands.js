const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const { scanCodebase } = require("./scan");

function init() {
  const initFlagPath = path.join(process.cwd(), ".docai_initialized");

  if (fs.existsSync(initFlagPath)) {
    console.log("DocAI is already initialized.");
    return;
  }

  // Initialize Husky hooks
  execSync("npx husky install");

  // Manually create the pre-commit hook
  const preCommitHook = path.join(".husky", "pre-commit");
  if (!fs.existsSync(".husky")) {
    fs.mkdirSync(".husky");
  }
  fs.writeFileSync(
    preCommitHook,
    `#!/bin/sh\n. "$(dirname "$0")/_/husky.sh"\n\nnpm run docai\n`
  );
  fs.chmodSync(preCommitHook, "755");
  console.log("DocAI initialized and Husky pre-commit hook added.");

  // Create the initialization flag file
  fs.writeFileSync(initFlagPath, "initialized");
}

function scan() {
  // Call scan.js logic here
  scanCodebase();
}

module.exports = { init, scan };
