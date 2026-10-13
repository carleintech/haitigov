import eslint from "@eslint/js";
import security from "eslint-plugin-security";
import globals from "globals";
import tseslint from "typescript-eslint";

const ignoredFiles = [
  "**/node_modules/**",
  "**/.next/**",
  "**/.turbo/**",
  "**/build/**",
  "**/coverage/**",
  "**/dist/**",
  "**/storybook-static/**",
  "packages/database/generated/**",
  "donne sample/**",
];

export default tseslint.config(
  { ignores: ignoredFiles },
  eslint.configs.recommended,
  security.configs.recommended,
  {
    files: ["**/*.{js,cjs,mjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.node,
      sourceType: "module",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
);
