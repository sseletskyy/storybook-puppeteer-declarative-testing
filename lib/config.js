const path = require('path')
const fs = require('fs')
const debug = require('debug')('spdt: get-config')

const DEFAULT_CONFIG = {
  pathToSrc: './src',
  pathToStories: './stories',
  pathToTestIndex: './e2e',
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
  const packagePath = configPath || findPackageJson()
  try {
    const packageJsonConfig = (packagePath && require(packagePath)) || {} // eslint-disable-line import/no-dynamic-require
    return Object.assign({}, DEFAULT_CONFIG, packageJsonConfig[PACKAGE_JSON_CONFIG_KEY])
  } catch (e) {
    debug(`error: ${e.code} ${e.message}`)
  }
  return DEFAULT_CONFIG
}

module.exports = {
  getConfig,
  findPackageJson,
  PACKAGE_JSON_CONFIG_KEY,
  DEFAULT_CONFIG,
}
