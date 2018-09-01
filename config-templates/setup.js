const puppeteer = require('puppeteer') // eslint-disable-line import/no-extraneous-dependencies
const fs = require('fs')
const os = require('os')
const path = require('path')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

module.exports = async function setup() {
  const headless = process.env.HEADLESS !== 'false'
  const slowMoValue = Number(process.env.SLOWMO)
  const options = { headless }
  if (!Number.isNaN(slowMoValue) && !headless) {
    options.slowMo = slowMoValue
  }
  const browser = await puppeteer.launch(options)
  // This global is not available inside tests but only in global teardown
  global.SPDT_BROWSER = browser
  // Instead, we expose the connection details via file system to be used in tests
  try {
    fs.mkdirSync(DIR)
  } catch (e) {
    if (e.code !== 'EEXIST') {
      throw e
    }
  }
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}
