const path = require('path')
const fs = require('fs')
const debug = require('debug')('spdt: get-config')

const DEFAULT_CONFIG = {
  pathToSrc: './src',
  pathToStories: './stories',
  pathToTestIndex: './e2e',
  testIndexName: 'test-index.generated.js',
}

const PACKAGE_SCRIPTS = {
  'spdt:generate-story-index': './node_modules/.bin/generate-story-index',
  'spdt:generate-test-index': './node_modules/.bin/generate-test-index',
  'spdt:generate-tests': './node_modules/.bin/generate-tests',
}

const PACKAGE_JSON_CONFIG_KEY = 'storybookPuppeteerDeclarativeTesting'

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
    const projectRoot = packagePath && { projectRoot: path.dirname(packagePath) }
    return Object.assign({}, DEFAULT_CONFIG, packageJsonConfig[PACKAGE_JSON_CONFIG_KEY], projectRoot)
  } catch (e) {
    debug(`error: ${e.code} ${e.message}`)
  }
  return DEFAULT_CONFIG
}

function generateScriptsForPackageJson() {
  const content = `  "scripts": {\n    ...\n`
    .concat(
      Object.keys(PACKAGE_SCRIPTS)
        .map((key) => `    "${key}": "${PACKAGE_SCRIPTS[key]}"`)
        .join(',\n'),
    )
    .concat('\n  }')
  return content
}

function generateConfigForPackageJson() {
  const content = `  "${PACKAGE_JSON_CONFIG_KEY}": {\n`
    .concat(
      Object.keys(DEFAULT_CONFIG)
        .map((key) => `    "${key}": "${DEFAULT_CONFIG[key]}"`)
        .join(',\n'),
    )
    .concat('\n  }')
  return content
}

module.exports = {
  getConfig,
  findPackageJson,
  generateScriptsForPackageJson,
  generateConfigForPackageJson,
  PACKAGE_JSON_CONFIG_KEY,
  DEFAULT_CONFIG,
  PACKAGE_SCRIPTS,
}
