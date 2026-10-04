import eslint from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "test-results/**", "playwright-report/**"] },
  eslint.configs.recommended,
  {
    files: ["assets/js/**/*.js"],
    languageOptions: { globals: globals.browser },
    rules: {
      camelcase: "error",
      "no-shadow": "error",
      "no-unused-vars": "error"
    }
  },
  {
    files: ["tests/**/*.js", "playwright.config.js"],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
    rules: { "no-unused-vars": "error" }
  }
];
