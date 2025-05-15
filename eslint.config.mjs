import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      // Ignore Prisma generated files
      "src/generated/**/*",
      "prisma/generated/**/*",
      "**/*.d.ts",
      "node_modules/**/*",
      ".next/**/*",
      "out/**/*",
      "dist/**/*", // Added dist
      "build/**/*", // Added build
      "coverage/**/*", // Added coverage
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
      import: eslintPluginImport,
    },
    rules: {
      // Existing rules (kept for now, review later)
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "react/no-unescaped-entities": "off",
      "react-hooks/exhaustive-deps": "warn",
      "@next/next/no-img-element": "warn",
      "@next/next/no-head-element": "warn",
      "jsx-a11y/alt-text": "warn",

      // Rules for simple-import-sort
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      // Recommended import plugin rules (can be fine-tuned)
      // "import/no-unresolved": "error", // Covered by TypeScript
      // "import/named": "error", // Covered by TypeScript
      // "import/namespace": "error", // Covered by TypeScript
      // "import/default": "error", // Covered by TypeScript
      // "import/export": "error", // Covered by TypeScript
      "import/first": "error",
      "import/no-duplicates": "error",
      "import/no-named-default": "error",
      "import/newline-after-import": "error",
      "import/no-webpack-loader-syntax": "error",
      // "import/no-useless-path-segments": "error", // Can be too aggressive
    },
  },
  // Make sure eslintPluginPrettierRecommended is last
  eslintPluginPrettierRecommended,
];

export default eslintConfig;
