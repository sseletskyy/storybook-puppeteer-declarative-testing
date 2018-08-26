const path = require('path')
const fs = require('fs')
const R = require('ramda')
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


const getSrcDirName = R.compose(
  R.last,
  R.split('/')
)

function generateStoryIndex(pathToSrc, pathToStories) {
  const fileList = recFindByExt(pathToSrc, 'story.js')
  console.log('fileList = ', fileList)
  const srcDirName = getSrcDirName(pathToSrc)

  const convertAndGenerate = R.compose(
    generateCode,
    convertToRelative(pathToStories),
  )
  const generatedCode = fileList.map(convertAndGenerate).join('\n')
  const content = requireStoryBookGenerator.concat(generatedCode, '\n')
  if(process.env.NODE_ENV === 'AVA') return content
  fs.writeFile(`${pathToStories}/index.js`, content, (err) => {
    if (err) {
      return console.error(err)
    } else {
      return console.log('File [index.js] was saved')
    }
  })
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
      R.juxt([R.compose(R.toUpper, R.head), R.compose(R.toLower, R.tail)])
  );

  return R.ifElse(R.equals(null), R.identity, capitalizer)(str)
}

function toPascalCase(str){
  const compose = R.compose(
    R.join(''),
    R.map(capitalize),
    R.split(/-|_|\s/)
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

function generateTestIndex(pathToSrc, pathToTestIndex) {
  const fileList = recFindByExt(pathToSrc, 'story.js')

  const converToRelativeFromTestIndex = convertToRelative(pathToTestIndex)

  const convertToConfig = (file) => ({
    pathToFixture: replaceStoryToFixture(converToRelativeFromTestIndex(file)),
    pathToFile: converToRelativeFromTestIndex(file),
    componentName: getFileName(file),
  })

  const convertAndGenerateTestCode = (file, index) => generateTestCode(convertToConfig(file), index)

  const e2eGeneratorContent = fileList.map(convertAndGenerateTestCode).join('')
  const content = requireTestGenerator.concat(e2eGeneratorContent)
  if(process.env.NODE_ENV === 'AVA') return content
  fs.writeFile(`${pathToTestIndex}/test-index.generated.js`, content, (err) => {
    if (err) {
      return console.error(err)
    } else {
      return console.log('File [test-index.generated.js] was saved')
    }
  })
}
/* eslint-enable no-param-reassign */
/* eslint-enable no-console */

module.exports.generateStoryIndex = generateStoryIndex
module.exports.generateTestIndex = generateTestIndex
module.exports.capitalize = capitalize
module.exports.toPascalCase = toPascalCase
