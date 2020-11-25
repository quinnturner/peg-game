module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Require .ts file extensions
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: [`ts`, `js`],
};
