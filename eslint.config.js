import js from '@eslint/js';
import globals from 'globals';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintPluginSecurity from 'eslint-plugin-security';
import eslintPluginVitest from 'eslint-plugin-vitest';
import eslintIgnores from './eslint.ignores.js';

export default [
  eslintPluginSecurity.configs.recommended,
  eslintPluginPrettierRecommended,
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: eslintIgnores,
    languageOptions: {
      globals: {
        ...globals.browser,
        expect: 'readonly'
      }
    },
    plugins: {
      eslintPluginVitest
    },
    rules: {
      'block-spacing': 'error',
      complexity: ['error', { max: 7 }],
      // 'import/order': ['error', { groups: ['builtin', 'external', 'parent', 'sibling', 'index'] }],
      'no-console': 'warn',
      'no-debugger': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'no-unused-vars': 'warn'
    }
  }
];
