module.exports = {
  testEnvironment: 'node',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  coverageDirectory: 'coverage',

  collectCoverageFrom: [
    'src/**/*.js',     
    '!src/**/*.test.js',
    '!src/**/_test/**', 
  ],

  coverageReporters: ['text', 'lcov', 'html'],

  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js',
  ],

  verbose: true,
};
