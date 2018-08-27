const test = require('ava')
const R = require('ramda')
const os = require('os')
const { findPackageJson, getConfig, DEFAULT_CONFIG, PACKAGE_JSON_CONFIG_KEY } = require('../lib/config')
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

test(`getConfig should return default config overridden by config.json`, (t) => {
  const configPath = `${__dirname}/config.json`
  const actual = getConfig(configPath)
  const expected = Object.assign({}, DEFAULT_CONFIG, overriddenConfig[PACKAGE_JSON_CONFIG_KEY])
  t.deepEqual(actual, expected)
})

test('getConfig should return DEFAULT_CONFIG if configPath is incorrect', (t) => {
  const configPath = `${__dirname}/package.json`
  const actual = getConfig(configPath)
  const expected = DEFAULT_CONFIG
  t.is(actual, expected)
})
