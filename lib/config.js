const path = require('path')
const fs = require('fs')
const debug = require('debug')('spdt')

const STORYBOOK_PORT = process.env.STORYBOOK_PORT || 9009

const SPDT_DIR = './.spdt'

const DEFAULT_CONFIG = {
  pathToSrc: './src',
  pathToStories: SPDT_DIR,
  pathToTestIndex: SPDT_DIR,
  testIndexName: 'test-index.generated.ts',
}

const PACKAGE_SCRIPTS = {
  'spdt:generate-story-index': './node_modules/.bin/spdt:generate-story-index',
  'spdt:generate-test-index': './node_modules/.bin/spdt:generate-test-index',
  'spdt:generate-tests': './node_modules/.bin/spdt:generate-tests',
  'spdt:test': `jest --detectOpenHandles --config ${SPDT_DIR}/jest.spdt.config.js --runInBand`,
  'spdt:test:chrome': `HEADLESS=false jest --detectOpenHandles --config ${SPDT_DIR}/jest.spdt.config.js`,
  'spdt:test:chrome:slow': `SLOWMO=1000 HEADLESS=false jest --detectOpenHandles --config ${SPDT_DIR}/jest.spdt.config.js`,
  'spdt:storybook': `start-storybook -p ${STORYBOOK_PORT} -c ${SPDT_DIR}`,
  'spdt:storybook:ci': `start-storybook --ci --quiet -p ${STORYBOOK_PORT} -c ${SPDT_DIR}`,
  spdt:
    'npm run spdt:generate-story-index && npm run spdt:generate-test-index && npm run spdt:generate-tests && npm run spdt:storybook',
  'spdt:ci':
    'npm run spdt:generate-story-index && npm run spdt:generate-test-index && npm run spdt:generate-tests && npm run spdt:storybook:ci',
  ci: 'start-server-and-test spdt:ci 9009 spdt:test',
}

const PACKAGE_JSON_CONFIG_KEY = 'spdt'

function findPackageJson(startDir) {
  let dir = path.resolve(startDir || process.cwd())

  do {
    const pkgFile = path.join(dir, 'package.json')

    if (!fs.existsSync(pkgFile) || !fs.statSync(pkgFile).isFile()) {
      dir = path.join(dir, '..')
    } else {
      return pkgFile
    }
  } while (dir !== path.resolve(dir, '..'))
  return null
}

function getConfig(configPath) {
  // prettier-ignore
  const packagePath = configPath === null
    ? configPath
    : configPath || findPackageJson()
  try {
    const packageJsonConfig = (packagePath && require(packagePath)) || {} // eslint-disable-line import/no-dynamic-require
    const projectRoot = packagePath && {
      projectRoot: path.dirname(packagePath),
    }
    return Object.assign(
      {},
      DEFAULT_CONFIG,
      packageJsonConfig[PACKAGE_JSON_CONFIG_KEY],
      projectRoot,
    )
  } catch (e) {
    debug(`error: ${e.code} ${e.message}`)
  }
  return DEFAULT_CONFIG
}

function generateScriptsForPackageJson() {
  return `  "scripts": {\n    ...\n`
    .concat(
      Object.keys(PACKAGE_SCRIPTS)
        .map((key) => `    "${key}": "${PACKAGE_SCRIPTS[key]}"`)
        .join(',\n'),
    )
    .concat('\n  }')
}

function generateConfigForPackageJson() {
  return `  "${PACKAGE_JSON_CONFIG_KEY}": {\n`
    .concat(
      Object.keys(DEFAULT_CONFIG)
        .map((key) => `    "${key}": "${DEFAULT_CONFIG[key]}"`)
        .join(',\n'),
    )
    .concat('\n  }')
}

module.exports = {
  getConfig,
  findPackageJson,
  generateScriptsForPackageJson,
  generateConfigForPackageJson,
  PACKAGE_JSON_CONFIG_KEY,
  DEFAULT_CONFIG,
  PACKAGE_SCRIPTS,
  STORYBOOK_PORT,
  SPDT_DIR,
}
