module.exports = {
  extends: ["@repo/eslint-config/base"],
  ignorePatterns: ["dist/", "node_modules/"],
  overrides: [
    {
      files: ["src/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: ["@typescript-eslint"],
    },
    {
      files: ["**/*.spec.ts"],
      env: { jest: true },
    },
  ],
};
