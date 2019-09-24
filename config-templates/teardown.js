/* eslint-disable */
const fs = require('fs')
const os = require('os')
const path = require('path')

const DIR = process.env.DIR || path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

function rimraf(dirPath) {
  function rmFile(entry) {
    const entryPath = path.join(dirPath, entry)
    if (fs.lstatSync(entryPath).isDirectory()) {
      rimraf(entryPath)
    } else {
      fs.unlinkSync(entryPath)
    }
  }
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(rmFile)
    fs.rmdirSync(dirPath)
  }
}

module.exports = async function teardown() {
  console.log('Teardown Puppeteer')
  await global.SPDT_BROWSER.close()
  rimraf(DIR)
}
/* eslint-enable */
