const test = require('ava')
const R = require('ramda')
const os = require('os')
const {
  findPackageJson,
  getConfig,
  DEFAULT_CONFIG,
  PACKAGE_JSON_CONFIG_KEY,
  generateScriptsForPackageJson,
  generateConfigForPackageJson,
} = require('../lib/config')
const overriddenConfig = require('./config.json')

test(`findPackageJson should return nearest path to package.json`, (t) => {
  const actual = findPackageJson(__dirname)
  const expected = R.init(__dirname.split('/'))
    .concat('package.json')
    .join('/')
  t.is(actual, expected)
})

test(`findPackageJson should return null if nearest package.json not found`, (t) => {
  const actual = findPackageJson(os.homedir())
  const expected = null
  t.is(actual, expected)
})

test(`getConfig should return default config if package.json not found`, (t) => {
  const configPath = null
  const actual = getConfig(configPath)
  t.deepEqual(actual, DEFAULT_CONFIG)
})

test(`getConfig should return default config overridden by config.json + projectRoot`, (t) => {
  const configPath = `${__dirname}/config.json`
  const actual = getConfig(configPath)
  const projectRoot = __dirname // dir where package.json is located
  const expected = Object.assign({}, DEFAULT_CONFIG, overriddenConfig[PACKAGE_JSON_CONFIG_KEY], { projectRoot })
  t.deepEqual(actual, expected)
})

test('getConfig should return DEFAULT_CONFIG if configPath is incorrect', (t) => {
  const configPath = `${__dirname}/package.json`
  const actual = getConfig(configPath)
  const expected = DEFAULT_CONFIG
  t.is(actual, expected)
})

test('generateScriptsForPackageJson', (t) => {
  const actual = generateScriptsForPackageJson()
  const expected = `  "scripts": {
    ...
    "spdt:generate-story-index": "./node_modules/.bin/spdt:generate-story-index",
    "spdt:generate-test-index": "./node_modules/.bin/spdt:generate-test-index",
    "spdt:generate-tests": "./node_modules/.bin/spdt:generate-tests",
    "spdt:test": "jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:test:chrome": "HEADLESS=false jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:test:chrome:slow": "SLOWMO=1000 HEADLESS=false jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:storybook": "start-storybook -p 9009 -c ./.spdt",
    "spdt": "npm run spdt:generate-story-index && npm run spdt:generate-test-index && npm run spdt:generate-tests && npm run spdt:storybook"
  }`
  t.is(actual, expected)
})
test('generateConfigForPackageJson', (t) => {
  const actual = generateConfigForPackageJson()
  const expected = `  "${PACKAGE_JSON_CONFIG_KEY}": {
    "pathToSrc": "./src",
    "pathToStories": "./.spdt",
    "pathToTestIndex": "./.spdt",
    "testIndexName": "test-index.generated.js"
  }`
  t.is(actual, expected)
})
