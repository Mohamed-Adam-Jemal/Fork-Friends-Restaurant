import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create compat instance
const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// Correct usage: pass an array to extends
const eslintConfig = [
  ...compat.extends(["next/core-web-vitals", "next/typescript"]),
  // you can add more rules or overrides here if needed
];

export default eslintConfig;
