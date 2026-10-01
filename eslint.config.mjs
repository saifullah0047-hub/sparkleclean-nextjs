import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored template assets and the original static template source
    // are not part of the application source code.
    "public/**",
    "Poseify-1.0.0/**",
  ]),
  {
    rules: {
      // The template intentionally uses plain <img> tags and plain <a>
      // links to preserve the original markup and static assets.
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  {
    // The root layout intentionally loads the original Bootstrap/vendor
    // stylesheets and Google Fonts via <link> tags to preserve the exact
    // look of the template. These rules only apply to this file.
    files: ["app/layout.tsx"],
    rules: {
      "@next/next/no-page-custom-font": "off",
      "@next/next/no-css-tags": "off",
    },
  },
]);

export default eslintConfig;
