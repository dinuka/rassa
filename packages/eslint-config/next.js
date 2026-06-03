const base = require("./base.js");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const globals = require("globals");

/** @type {import("eslint").Linter.Config[]} */
const next = [
  ...base,
  {
    ignores: [".next/"],
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
      sourceType: "module",
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tsPlugin },
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node, ...globals.es2022, React: "readonly" },
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
    },
  },
];

module.exports = next;
