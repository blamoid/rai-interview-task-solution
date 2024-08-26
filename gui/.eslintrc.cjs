/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.vue'],
      rules: {
        '@typescript-eslint/no-var-requires': ['off'],
        '@typescript-eslint/no-empty-function': ['off'],
        '@typescript-eslint/camelcase': ['off'],
      },
    },
    {
      files: ['**/*.vue'],
      rules: {
        'vue/valid-v-slot': [
          'error',
          {
            allowModifiers: true,
          },
        ],
        'vue/no-v-html': ['off'],
        'vue/no-v-text-v-html-on-component': ['off'],
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
};
