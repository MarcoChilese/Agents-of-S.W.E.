module.exports = {
  roots: [
    // "<rootDir>/dist/test"
    '<rootDir>/spec',
  ],
  setupFiles: [
    // "<rootDir>/dist/test/test-setup/jest-setup.js"
    '<rootDir>/src/testSetup/jest-setup.js',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
  ],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+.css!?$': '<rootDir>/src/testSetup/cssStub.js',
  },
  testRegex: '(\\.|/)(test|spec)\\.(jsx?)$',
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  coverageDirectory: '<rootDir>/',
  collectCoverage: true,
};
