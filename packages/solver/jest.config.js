module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Require .ts file extensions
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.ts$',
  moduleFileExtensions: [`ts`, `js`],
  // Ignore combinatorics from coverage because it's an external file
  // and I don't want it to ruin 100% coverage :-)
  collectCoverageFrom: ['src/**/{!(combinatorics),}.ts'],
};
