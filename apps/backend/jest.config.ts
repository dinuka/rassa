import type { Config } from "jest";

const config: Config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  testRegex: ".*\\.spec\\.ts$",
  transform: { "^.+\\.(t|j)s$": "ts-jest" },
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "../coverage",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@repo/shared-types$": "<rootDir>/../../../packages/shared-types/src/index.ts",
    "^@repo/shared-types/(.*)$": "<rootDir>/../../../packages/shared-types/src/$1",
  },
};

export default config;
