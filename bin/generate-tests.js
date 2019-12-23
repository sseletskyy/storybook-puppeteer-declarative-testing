#! /usr/bin/env node

const shell = require('shelljs')
const path = require('path')
const { getConfig } = require('../lib/config')

const config = getConfig()
const nodeExec = `npx babel-node --extensions '.ts,.tsx,.js,.jsx'`
const pathToFile = path.resolve(config.projectRoot, config.pathToTestIndex, config.testIndexName)
const command = `${nodeExec} ${pathToFile}`
shell.echo(`Command: ${command}`)
shell.cd(config.projectRoot)
shell.exec(command)
shell.exit()
