import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
export default defineConfig([
  js.configs.recommended,
  ...ts.configs.recommended,
  { files: ['**/*.mjs'], languageOptions: { globals: { console: 'readonly', process: 'readonly' } } },
  globalIgnores(['.next/**', 'out/**', 'next-env.d.ts', 'playwright-report/**', 'test-results/**']),
]);
