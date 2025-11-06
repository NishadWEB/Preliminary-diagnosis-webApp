import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function printTree(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach((entry, index) => {
    const filePath = path.join(dir, entry.name);
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";

    // skip heavy or hidden folders
    if (["node_modules", ".git", "dist", "build"].includes(entry.name)) {
      console.log(prefix + connector + entry.name + " (skipped)");
      return;
    }

    console.log(prefix + connector + entry.name);

    if (entry.isDirectory()) {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      printTree(filePath, newPrefix);
    }
  });
}

const projectPath = path.resolve(__dirname);
console.log("📂 Project Structure:\n");
printTree(projectPath);
