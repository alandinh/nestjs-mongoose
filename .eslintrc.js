module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    jest: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  parserOptions: {
    ecmaVersion: 2018,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  extends: [
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:prettier/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:sonarjs/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    '@typescript-eslint/tslint',
    'prettier',
    'simple-import-sort',
    'import',
    'unicorn',
    'sonarjs',
  ],
  rules: {
    "import/no-unresolved": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
  },
};
