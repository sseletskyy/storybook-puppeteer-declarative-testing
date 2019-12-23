import R from 'ramda'
import os from 'os'
import { describe, it, expect } from './custom-jest'
import {
  DEFAULT_CONFIG,
  findPackageJson,
  generateConfigForPackageJson,
  generateScriptsForPackageJson,
  getConfig,
  PACKAGE_JSON_CONFIG_KEY,
} from '../lib/config'
import overriddenConfig from './config.json'

describe('Config', () => {
  test(`findPackageJson should return nearest path to package.json`, () => {
    const actual = findPackageJson(__dirname)
    const expected = R.init(__dirname.split('/'))
      .concat('package.json')
      .join('/')
    expect(actual).toEqual(expected)
  })

  it(`findPackageJson should return null if nearest package.json not found`, () => {
    const actual = findPackageJson(os.homedir())
    const expected = null
    expect(actual).toEqual(expected)
  })

  it(`getConfig should return default config if package.json not found`, () => {
    const configPath = null
    const actual = getConfig(configPath)
    expect(actual).toEqual(DEFAULT_CONFIG)
  })

  it(`getConfig should return default config overridden by config.json + projectRoot`, () => {
    const configPath = `${__dirname}/config.json`
    const actual = getConfig(configPath)
    const projectRoot = __dirname // dir where package.json is located
    const expected = Object.assign({}, DEFAULT_CONFIG, overriddenConfig[PACKAGE_JSON_CONFIG_KEY], { projectRoot })
    expect(actual).toEqual(expected)
  })

  it('getConfig should return DEFAULT_CONFIG if configPath is incorrect', () => {
    const configPath = `${__dirname}/package.json`
    const actual = getConfig(configPath)
    const expected = DEFAULT_CONFIG
    expect(actual).toEqual(expected)
  })

  it('generateScriptsForPackageJson', () => {
    const actual = generateScriptsForPackageJson()
    const expected = `  "scripts": {
    ...
    "spdt:generate-story-index": "./node_modules/.bin/spdt:generate-story-index",
    "spdt:generate-test-index": "./node_modules/.bin/spdt:generate-test-index",
    "spdt:generate-tests": "./node_modules/.bin/spdt:generate-tests",
    "spdt:test": "jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js --runInBand",
    "spdt:test:chrome": "HEADLESS=false jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:test:chrome:slow": "SLOWMO=1000 HEADLESS=false jest --detectOpenHandles --config ./.spdt/jest.spdt.config.js",
    "spdt:storybook": "start-storybook -p 9009 -c ./.spdt",
    "spdt:storybook:ci": "start-storybook --ci --quiet -p 9009 -c ./.spdt",
    "spdt": "npm run spdt:generate-story-index && npm run spdt:generate-test-index && npm run spdt:generate-tests && npm run spdt:storybook",
    "spdt:ci": "npm run spdt:generate-story-index && npm run spdt:generate-test-index && npm run spdt:generate-tests && npm run spdt:storybook:ci",
    "ci": "start-server-and-test spdt:ci 9009 spdt:test"
  }`
    expect(actual).toEqual(expected)
  })
  it('generateConfigForPackageJson', () => {
    const actual = generateConfigForPackageJson()
    const expected = `  "${PACKAGE_JSON_CONFIG_KEY}": {
    "pathToSrc": "./src",
    "pathToStories": "./.spdt",
    "pathToTestIndex": "./.spdt",
    "testIndexName": "test-index.generated.ts"
  }`
    expect(actual).toEqual(expected)
  })
})
