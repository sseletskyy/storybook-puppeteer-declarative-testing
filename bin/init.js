#! /usr/bin/env node

const shell = require('shelljs')
const path = require('path')
const { getConfig, generateConfigForPackageJson, generateScriptsForPackageJson } = require('../lib/config')

function insertInto(content) {
  shell.echo(`Insert it into your package.json\n-----\n`)
  shell.echo(content)
  shell.echo(`\n-----\n`)
}

function echoConfigForPackageJson() {
  insertInto(generateConfigForPackageJson())
}

function echoScriptsForPackageJson() {
  insertInto(generateScriptsForPackageJson())
}

function copyConfigfilesToProject(config) {
  if (!config.projectRoot) {
    return false
  }
  const source = path.resolve(__dirname, '../config-templates/e2e')
  const dest = path.resolve(config.projectRoot)
  const command = `cp -r ${source} ${dest}`
  shell.exec(command)
  shell.echo(`Copied jest-puppeteer config files to ${dest}/e2e`)
  return true
}

function init() {
  const config = getConfig()
  echoConfigForPackageJson()
  echoScriptsForPackageJson()
  copyConfigfilesToProject(config)
}

init()
