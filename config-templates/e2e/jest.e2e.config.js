module.exports = {
  collectCoverage: false,
  globalSetup: './e2e/setup.js',
  globalTeardown: './e2e/teardown.js',
  notify: true,
  notifyMode: 'failure',
  preset: 'jest-puppeteer',
  rootDir: '../',
  testEnvironment: './e2e/puppeteer_environment.js',
  testMatch: ['**/?(*.)+(e2e).js'],
  verbose: true,
}
