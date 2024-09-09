const fs = require("fs");
const path = require("path");
const config = require("../docai.config");
const { generateDocumentation } = require("../llm/generate");
const { updateCache, hasFileChanged } = require("./cache");

// Add the excluded files cache at the top
const excludedFilesCache = new Set();

// function to scan the codebase for changes
function scanCodebase() {
  console.log("Scanning codebase for changes...");

  // Ensure fileCache.json is added to .gitignore
  ensureFileCacheInGitignore();

  const changes = detectChanges();
  if (changes) {
    console.log("Changes detected, generating documentation...");
    generateDocumentation(changes)
      .then((doc) => {
        updateReadme(doc);
      })
      .catch((error) => {
        console.error("Error generating documentation:", error);
      });
  } else {
    console.log("No changes detected.");
    return; // Early return to stop further execution
  }
}

// function to ensure the fileCache.json is added to .gitignore
function ensureFileCacheInGitignore() {
  const gitignorePath = path.join(process.cwd(), ".gitignore");
  const cacheFileName = "fileCache.json";

  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
    if (!gitignoreContent.includes(cacheFileName)) {
      fs.appendFileSync(gitignorePath, `\n${cacheFileName}\n`);
      console.log(`${cacheFileName} added to .gitignore.`);
    }
  } else {
    fs.writeFileSync(gitignorePath, `${cacheFileName}\n`);
    console.log(".gitignore created and fileCache.json added.");
  }
}

// function to detect changes in the codebase
function detectChanges() {
  const basePath = process.cwd();
  const files = getAllFiles(basePath, config.exclude);
  let changes = "";

  console.log(`Found ${files.length} files to scan.`);

  files.forEach((file) => {
    // console.log(`Scanning file: ${file}`);
    const content = fs.readFileSync(file, "utf-8");
    if (hasFileChanged(file, content)) {
      // console.log(`File changed: ${file}`);
      const summary = summarizeContent(content);
      changes += `\n\nFile: ${file}\n${summary}`;
      updateCache(file, content);
    }
  });

  return changes ? changes : null;
}

// function to summarize the content of the codebase
function summarizeContent(content) {
  const lines = content.split("\n");
  let summary = "";
  
  lines.forEach((line, index) => {
    // Capture comments above function or class definitions
    if (line.startsWith("function") || line.startsWith("class")) {
      let precedingComment = "";
      
      // Check for comments before the function/class declaration
      for (let i = index - 1; i >= 0; i--) {
        const previousLine = lines[i].trim();
        if (previousLine.startsWith("//") || previousLine.startsWith("/*")) {
          precedingComment = previousLine + "\n" + precedingComment;
        } else if (previousLine !== "") {
          break; // Stop if a non-comment line is encountered
        }
      }
      summary += `${precedingComment}${line}\n`;
    }
  });
  
  return summary;
}


// function to get all files in the codebase
function getAllFiles(dirPath, excludePatterns, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    // Hardcode to exclude node_modules, test, dist, and .git directories
    if (file === 'node_modules' || file === 'test' || file === 'dist' || file === '.git' || file === '.env' || file === 'package-lock.json' || file === 'tmp') {
      // console.log(`Excluding hardcoded directory: ${filePath}`);
      return; // Skip this directory
    }

    if (fs.statSync(filePath).isDirectory()) {
      if (!isExcluded(filePath, excludePatterns)) {
        arrayOfFiles = getAllFiles(filePath, excludePatterns, arrayOfFiles);
      } else {
        // console.log(`Excluding directory by pattern: ${filePath}`);
      }
    } else {
      if (!isExcluded(filePath, excludePatterns)) {
        arrayOfFiles.push(filePath);
      } else {
        // console.log(`Excluding file by pattern: ${filePath}`);
      }
    }
  });

  return arrayOfFiles;
}

// function to check if the file is excluded
function isExcluded(filePath, excludePatterns) {
  // Check if the file is already cached as excluded
  if (excludedFilesCache.has(filePath)) {
    return true; // If cached, no need to check again
  }

  // Check if the file matches any exclusion patterns
  const isExcluded = excludePatterns.some((pattern) => {
    if (!pattern || pattern.trim() === "") return false;

    // Simple check for folder names or file extensions
    if (filePath.includes(pattern)) return true;

    // Fallback to regex for complex patterns
    const regex = new RegExp(
      pattern
        .replace(/\./g, "\\.") // Escape dots
        .replace(/\*\*/g, ".*") // Handle wildcard patterns
        .replace(/\*/g, "[^/]*")
    );

    return regex.test(filePath);
  });

  // If the file is excluded, add it to the cache
  if (isExcluded) {
    excludedFilesCache.add(filePath);
  }

  return isExcluded;
}

// function to update the README.md file
function updateReadme(doc) {
  const readmePath = path.join(process.cwd(), "README.md");
  // Overwrite README with new documentation
  fs.writeFileSync(readmePath, doc);
  console.log("README.md updated.");
}

module.exports = { scanCodebase };
