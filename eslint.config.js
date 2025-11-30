import js from '@eslint/js';
import globals from 'globals';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'], plugins: { js }, extends: ['js/recommended'], languageOptions: { globals: globals.browser } },
  { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
  { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'], processor: 'markdown/markdown' },
  { files: ['**/*.css'], plugins: { css }, language: 'css/css', extends: ['css/recommended'] },
  {
    files: ['**/*.test.js', '**/test.js'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
  stylistic.configs.customize({
    semi: true,
    braceStyle: '1tbs',
  }),
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/max-statements-per-line': 'off',
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'none' },
        singleline: { delimiter: 'comma', requireLast: false },
      }],
      '@stylistic/spaced-comment': 'off',
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/semi': ['error', 'always', {
        omitLastInOneLineBlock: true,
      }],
      'markdown/no-missing-link-fragments': 'off',
      '@stylistic/quotes': ['error', 'single', {
        avoidEscape: true,
      }],
      '@stylistic/operator-linebreak': ['error', 'after', {
        overrides: { '?': 'before', ':': 'before' },
      }],
      'no-useless-escape': ['error', { allowRegexCharacters: ['[', '-'] }],
      // Disabling because it's been throwing errors.
      '@stylistic/indent': 'off',
    },
  },
  {
    files: ['content/**/src.js'],
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      'no-unused-vars': 'off',
    },
  },
  {
    files: ['**/*.md/*.js'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      // Many code samples are missing semicolons because they represent an expression, not a full statement.
      '@stylistic/semi': 'off',
    },
  },
  {
    ignores: [
      'package-lock.json',
      'public/thirdParty/**',
      '**/*.min.js',
      // This version was written while the project used a different linter, and we don't want to change its code formatting.
      'public/framework/snapFramework-1.0.js',
    ],
  },
]);
