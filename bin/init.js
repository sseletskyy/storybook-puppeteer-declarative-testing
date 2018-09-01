#! /usr/bin/env node

const shell = require('shelljs')
const path = require('path')
const {
  getConfig,
  /*generateConfigForPackageJson,*/ generateScriptsForPackageJson,
  SPDT_DIR,
} = require('../lib/config')

function insertInto(content) {
  shell.echo(`Insert it into your package.json\n-----\n`)
  shell.echo(content)
  shell.echo(`\n-----\n`)
}

// function echoConfigForPackageJson() {
//   insertInto(generateConfigForPackageJson())
// }

function echoScriptsForPackageJson() {
  insertInto(generateScriptsForPackageJson())
}

function copyConfigFilesToProject(source, dest) {
  const command = `cp -r ${source}/*.* ${dest}`
  shell.exec(command)
  shell.echo(`Copied jest-puppeteer config files to ${dest}`)
  return true
}

function mkDir(parentDir, dirName) {
  const command = `cd ${parentDir} && mkdir -p ${dirName}`
  shell.exec(command)
  shell.echo(`Created dir ${parentDir}/${dirName}`)
  return `${parentDir}/${dirName}`
}

function init() {
  const config = getConfig()
  const projectDir = path.resolve(config.projectRoot)
  const dest = mkDir(projectDir, SPDT_DIR)

  // echoConfigForPackageJson()
  echoScriptsForPackageJson()
  const configsSource = path.resolve(__dirname, '../config-templates')
  copyConfigFilesToProject(configsSource, dest)
}

init()
