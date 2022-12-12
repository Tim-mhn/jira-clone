module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:import/typescript', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    // 'import/parsers': {
    //   '@typescript-eslint/parser': ['.ts'],
    // },
    // 'import/resolver': {
    //   typescript: {},
    //   node: {
    //     extensions: ['.js', '.ts'],
    //   },
    // },
  },
  plugins: ['@typescript-eslint', 'unused-imports', 'import'],
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'class-methods-use-this': 'off',
    'no-underscore-dangle': 'off',
    'no-useless-constructor': 'off',
    'no-empty-function': 'off',
    'unused-imports/no-unused-imports': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'scss.lint.unknownAtRules': 'off',
    'lines-between-class-members': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'prefer-destructuring': 'off',
    unknownAtRules: 'off',
    'import/no-cycle': 'off',
    'no-return-assign': ['error', 'except-parens'],
    radix: 'off',
    'no-unused-expressions': [
      'error',
      {
        allowTernary: true,
      },
    ],
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
