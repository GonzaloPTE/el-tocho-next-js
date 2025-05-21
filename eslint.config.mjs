import unusedImports from "eslint-plugin-unused-imports";
// import js from "@eslint/js"; 
import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const ignoredPatterns = [
    "**/node_modules/**",
    "**/.next/**",
    "**/.open-next/**",
    "**/out/**",
    "**/.vercel/**",
    "**/.*/**"
];

export default [
    {
        ignores: ignoredPatterns,
    },
    ...compat.extends("next/core-web-vitals"), 
    {
        plugins: {
            "unused-imports": unusedImports,
        },
        rules: {
            "@next/next/no-img-element": "off",
            "react/no-unescaped-entities": "off",
            "import/no-anonymous-default-export": "off",
            "unused-imports/no-unused-imports": "warn",
        }
    },
    {
        files: ["eslint.config.mjs"],
        languageOptions: {
            sourceType: "module"
        },
        rules: {
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-floating-promises": "off",
            "@typescript-eslint/no-misused-promises": "off",
            "@typescript-eslint/dot-notation": "off",
            "@typescript-eslint/no-implied-eval": "off",
            "@typescript-eslint/no-unused-expressions": "off",
        }
    }
];