export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  testMatch: ['<rootDir>/src/tests/**/*.test.js'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
