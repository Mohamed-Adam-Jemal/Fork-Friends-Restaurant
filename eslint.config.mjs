// eslint.config.mjs
import { defineConfig } from "eslint-define-config";

export default defineConfig({
  extends: ["next/core-web-vitals", "next/typescript"],
  rules: {
    // add custom rules here if needed
  },
});
