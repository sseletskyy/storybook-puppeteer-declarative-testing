module.exports = {
  collectCoverage: false,
  globalSetup: './.spdt/setup.js',
  globalTeardown: './.spdt/teardown.js',
  notify: true,
  notifyMode: 'failure',
  preset: 'jest-puppeteer',
  rootDir: '../',
  testEnvironment: './.spdt/puppeteer_environment.js',
  testMatch: ['**/?(*.)+(spdt).js'],
  verbose: true,
}
