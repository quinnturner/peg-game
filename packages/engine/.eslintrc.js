module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module', // Allows for the use of imports
    // TODO: Review running ESLint from CLI. For now, we have to add project and tsconfigRootDir to eslintrc
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [`@typescript-eslint`],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // 'plugin:import/errors',
    // 'plugin:import/warnings',
    // 'plugin:import/typescript',
    'plugin:jest/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    // 'jest/globals': true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    // Allows us to write unions like `type Foo = "baz" | "bar"`
    // otherwise eslint will want to switch the strings to backticks,
    // which then crashes the ts compiler
    quotes: 'off',
    '@typescript-eslint/quotes': [
      2,
      'backtick',
      {
        avoidEscape: true,
      },
    ],
  },
  settings: {
    jest: {
      version: 26,
    },
  },
};
