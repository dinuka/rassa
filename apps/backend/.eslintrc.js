module.exports = {
  extends: ["@repo/eslint-config/base"],
  ignorePatterns: ["dist/", "node_modules/"],
  overrides: [
    {
      files: ["src/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      },
    },
    {
      files: ["**/*.spec.ts"],
      env: { jest: true },
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
      },
    },
  ],
};
