const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/*
 * This is a custom ESLint configuration for use with
 * Next.js apps.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

module.exports = {
  extends: [
    "@vercel/style-guide/eslint/node",
    "@vercel/style-guide/eslint/browser",
    "@vercel/style-guide/eslint/typescript",
    "@vercel/style-guide/eslint/react",
    "@vercel/style-guide/eslint/next",
    "eslint-config-turbo",
  ].map(require.resolve),
  parserOptions: {
    project,
  },
  globals: {
    React: true,
    JSX: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: ["node_modules/", "dist/"],
  // add rules configurations here
  rules: {
    "import/no-default-export": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "@typescript-eslint/no-confusing-void-expression": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/prefer-string-starts-ends-with": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-shadow": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@next/next/no-img-element": "off",
    "no-console": "off",
    "eslint-comments/require-description": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    eqeqeq: "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "react/jsx-sort-props": "off",
    "import/no-extraneous-dependencies": "off",
    "react/no-array-index-key": "off",
    "jsx-a11y/anchor-has-content": "off",
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/anchor-is-valid": "off",
    "react/jsx-no-leaked-render": "off",
    "@typescript-eslint/no-dynamic-delete": "off",
    "react/function-component-definition": [
      2,
      { namedComponents: ["arrow-function", "function-declaration"] },
    ],
  },
};
