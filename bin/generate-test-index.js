#! /usr/bin/env node

//const [, , ...args] = process.argv
//console.log(`BEGIN: generate story index: args = ${args}`)
const shell = require('shelljs')
const { generateTestIndex } = require('../lib/story-index-generator')
const { PACKAGE_JSON_CONFIG_KEY } = require('../lib/config')

const either = generateTestIndex()
if (either.isLeft()) {
  const error = either.left()
  shell.echo(`Error: ${error.message}`)
  if (error.code === 'ENOENT') {
    shell.echo(`Check value in package.json -> ${PACKAGE_JSON_CONFIG_KEY} -> pathToTestIndex`)
  }
  shell.exit(1)
} else {
  shell.echo(`Story files found: ${either.right().length}\nDone`)
  shell.exit()
}

//console.log('END: generate story index')
