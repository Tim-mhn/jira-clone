module.exports = {
  env: {
    browser: true,
    es2021: true,
    jasmine: true,
  },
  globals: {
    DoneFn: 'readonly',
  },
  extends: ['airbnb-base', 'plugin:import/typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  root: true,
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.js', '.ts'],
      },
    },
  },
  plugins: ['@typescript-eslint', 'import', 'unused-imports'],
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'no-use-before-define': 'off',
    'no-empty-function': 'off',
    'unused-imports/no-unused-imports': 'error',
    'import/no-unresolved': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'lines-between-class-members': 'off',
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true,
      },
    ],
    'no-underscore-dangle': 'off',
    'dot-notation': 'off',
    'no-return-assign': 'off',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_+',
        ignoreRestSiblings: true,
      },
    ],
  },
};
