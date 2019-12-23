const path = require('path')
const fs = require('fs')
const R = require('ramda')
const { Either } = require('monet')
const debug = require('debug')('spdt')
const { getConfig } = require('./config')

const STORY_EXT = /\.story\.[tj]sx?/
/* eslint-disable no-param-reassign */

function recFindByExt(base, ext, files, result) {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach((file) => {
    const newbase = path.join(base, file)
    if (fs.statSync(newbase).isDirectory()) {
      result = recFindByExt(newbase, ext, fs.readdirSync(newbase), result)
    } else {
      // eslint-disable-next-line no-lonely-if
      if (RegExp(ext).test(file)) {
        result.push(newbase)
      }
    }
  })
  return result
}

// ==== generate index.js

const convertToRelative = R.curry((from, file) => path.relative(from, file))
const generateCode = (file) => `require('${file}').default(
  storyGenerator,
)`

const requireStoryBookGenerator = `const {storyGenerator} = require('spdt')
`

function generateContentForStoryIndex(pathToSrc, pathToStories) {
  const fileList = recFindByExt(pathToSrc, STORY_EXT)

  const convertAndGenerate = R.compose(
    generateCode,
    convertToRelative(pathToStories),
  )
  const generatedCode = fileList.map(convertAndGenerate).join('\n')
  const content = requireStoryBookGenerator.concat(generatedCode, '\n')
  return {
    fileList,
    content,
  }
}

function writeFile(file, content) {
  try {
    fs.writeFileSync(file, content)
    return Either.Right(true)
  } catch (err) {
    return Either.Left(err)
  }
}

function generateStoryIndex(pathToSrc, pathToStories) {
  const config = getConfig()
  pathToSrc = pathToSrc || config.pathToSrc
  pathToStories = pathToStories || config.pathToStories
  debug(`generateStoryIndex config=${JSON.stringify(config)}`)

  const { content, fileList } = generateContentForStoryIndex(
    pathToSrc,
    pathToStories,
  )
  const either = writeFile(`${pathToStories}/index.js`, content)
  return either.isLeft() ? either : Either.Right(fileList)
}

// ==== generate spdt-test-builder.generated.js
const requireTestGenerator = `const {testGenerator} = require('spdt/lib/test-generator.js')
`

const replaceStoryToFixture = (file) => file.replace('.story.', '.fixture.')

const generateTestCode = (config, index) => `
const fixtures${index} = require('${config.pathToFixture}')
  .default

testGenerator({
  fixtures: fixtures${index},
  file: '${config.pathToFile}',
  componentName: '${config.componentName}',
})
`

function capitalize(str) {
  const capitalizer = R.compose(
    R.join(''),
    R.juxt([R.compose(R.toUpper, R.head), R.tail]),
  )

  return R.ifElse(R.equals(null), R.identity, capitalizer)(str)
}

function toPascalCase(str) {
  const compose = R.compose(R.join(''), R.map(capitalize), R.split(/-|_|\s/))
  return compose(str)
}

const getFileName = R.compose(
  toPascalCase,
  R.head,
  R.split('.'),
  R.last,
  R.split('/'),
)

function generateContentForTestIndex(pathToSrc, pathToTestIndex) {
  const fileList = recFindByExt(pathToSrc, STORY_EXT)
  const convertToRelativeFromTestIndex = convertToRelative(pathToTestIndex)

  const convertToConfig = (file) => ({
    pathToFixture: replaceStoryToFixture(convertToRelativeFromTestIndex(file)),
    pathToFile: convertToRelativeFromTestIndex(file),
    componentName: getFileName(file),
  })

  const convertAndGenerateTestCode = (file, index) =>
    generateTestCode(convertToConfig(file), index)

  const e2eGeneratorContent = fileList.map(convertAndGenerateTestCode).join('')
  const content = requireTestGenerator.concat(e2eGeneratorContent)
  return {
    fileList,
    content,
  }
}

function generateTestIndex(pathToSrc, pathToTestIndex) {
  const config = getConfig()
  pathToSrc = pathToSrc || config.pathToSrc
  pathToTestIndex = pathToTestIndex || config.pathToTestIndex
  debug(`generateTestIndex config=${JSON.stringify(config)}`)

  const { content, fileList } = generateContentForTestIndex(
    pathToSrc,
    pathToTestIndex,
  )
  const either = writeFile(
    `${pathToTestIndex}/${config.testIndexName}`,
    content,
  )
  return either.isLeft() ? either : Either.Right(fileList)
}
/* eslint-enable no-param-reassign */

module.exports = {
  capitalize,
  generateContentForStoryIndex,
  generateContentForTestIndex,
  generateStoryIndex,
  generateTestIndex,
  toPascalCase,
}
