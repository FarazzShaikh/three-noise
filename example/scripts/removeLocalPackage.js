import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function main() {
  const jsonPath = path.resolve(__dirname, "../package.json");
  const packageJsonRaw = fs.readFileSync(jsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonRaw);

  // Remove any "file://" props inside the package.json dependencies
  const dependencies = packageJson.dependencies;
  for (const key in dependencies) {
    if (dependencies[key].startsWith("file:")) {
      delete dependencies[key];
    }
  }

  // Write the modified package.json back to the file
  fs.writeFileSync(jsonPath, JSON.stringify(packageJson, null, 2));
}

main();
