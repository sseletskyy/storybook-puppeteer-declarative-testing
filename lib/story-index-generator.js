const path = require('path')
const fs = require('fs')
const R = require('ramda')
const { Either } = require('monet')
const debug = require('debug')('spdt')
const { getConfig } = require('./config')
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

function recFindByExt(base, ext, files, result) {
  files = files || fs.readdirSync(base)
  result = result || []

  files.forEach((file) => {
    const newbase = path.join(base, file)
    if (fs.statSync(newbase).isDirectory()) {
      result = recFindByExt(newbase, ext, fs.readdirSync(newbase), result)
    } else {
      // eslint-disable-next-line no-lonely-if
      if (file.substr(-1 * (ext.length + 1)) === `.${ext}`) {
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

// TODO set path according to constant
const requireStoryBookGenerator = `const {storyGenerator} = require('storybook-puppeteer-declarative-testing')
`

function generateContentForStoryIndex(pathToSrc, pathToStories) {
  const fileList = recFindByExt(pathToSrc, 'story.js')

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

// eslint-disable-next-line consistent-return
function generateStoryIndex(pathToSrc, pathToStories) {
  const config = getConfig()
  pathToSrc = pathToSrc || config.pathToSrc
  pathToStories = pathToStories || config.pathToStories
  debug(`generateStoryIndex config=${JSON.stringify(config)}`)

  const { content, fileList } = generateContentForStoryIndex(pathToSrc, pathToStories)
  const either = writeFile(`${pathToStories}/index.js`, content)
  return either.isLeft() ? either : Either.Right(fileList)
}

// ==== generate e2e-test-builder.generated.js
// TODO set path according to constant
const requireTestGenerator = `const {testGenerator} = require('storybook-puppeteer-declarative-testing')
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
    R.juxt([
      R.compose(
        R.toUpper,
        R.head,
      ),
      R.compose(
        R.toLower,
        R.tail,
      ),
    ]),
  )

  return R.ifElse(R.equals(null), R.identity, capitalizer)(str)
}

function toPascalCase(str) {
  const compose = R.compose(
    R.join(''),
    R.map(capitalize),
    R.split(/-|_|\s/),
  )
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
  const fileList = recFindByExt(pathToSrc, 'story.js')

  const convertToRelativeFromTestIndex = convertToRelative(pathToTestIndex)

  const convertToConfig = (file) => ({
    pathToFixture: replaceStoryToFixture(convertToRelativeFromTestIndex(file)),
    pathToFile: convertToRelativeFromTestIndex(file),
    componentName: getFileName(file),
  })

  const convertAndGenerateTestCode = (file, index) => generateTestCode(convertToConfig(file), index)

  const e2eGeneratorContent = fileList.map(convertAndGenerateTestCode).join('')
  const content = requireTestGenerator.concat(e2eGeneratorContent)
  return {
    fileList,
    content,
  }
}

// eslint-disable-next-line consistent-return
function generateTestIndex(pathToSrc, pathToTestIndex) {
  const config = getConfig()
  pathToSrc = pathToSrc || config.pathToSrc
  pathToTestIndex = pathToTestIndex || config.pathToTestIndex
  debug(`generateTestIndex config=${JSON.stringify(config)}`)

  const { content, fileList } = generateContentForTestIndex(pathToSrc, pathToTestIndex)
  const either = writeFile(`${pathToTestIndex}/${config.testIndexName}`, content)
  return either.isLeft() ? either : Either.Right(fileList)
}
/* eslint-enable no-param-reassign */
/* eslint-enable no-console */

// module.exports.generateStoryIndex = generateStoryIndex
// module.exports.generateTestIndex = generateTestIndex
// module.exports.capitalize = capitalize
// module.exports.toPascalCase = toPascalCase
// module.exports.findPackageJson = findPackageJson

module.exports = {
  capitalize,
  generateContentForStoryIndex,
  generateContentForTestIndex,
  generateStoryIndex,
  generateTestIndex,
  toPascalCase,
}
