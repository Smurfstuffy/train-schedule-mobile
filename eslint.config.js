// https://docs.expo.dev/guides/using-eslint/
const expoConfig = require("eslint-config-expo/flat");
const prettierConfig = require("eslint-config-prettier");
const prettier = require("eslint-plugin-prettier");
const { defineConfig } = require("eslint/config");

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      prettier,
    },
    ignores: [
      "node_modules",
      "dist",
      "build",
      "android/build",
      "ios/build",
      ".expo",
      "web-build",
      "metro.config.js",
      "babel.config.js",
      "tailwind.config.js",
      "*.config.js",
      "*.config.ts",
    ],
    rules: {
      // Prettier integration - reads from .prettierrc
      "prettier/prettier": "error",

      // React specific rules
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "error",

      // General rules
      "prefer-const": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Import rules
      "no-duplicate-imports": "error",
      "no-useless-rename": "error",
    },
  },
]);
