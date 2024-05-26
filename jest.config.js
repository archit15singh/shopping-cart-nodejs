export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['./src/tests/setup.js'],
  testMatch: ['**/tests/**/*.test.js'],
};
