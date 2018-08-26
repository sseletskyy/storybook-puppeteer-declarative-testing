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

const convertToRelative = (file) => `../src/${file.split('/src/')[1]}`
const generateCode = (file) => `require('${file}').default(
  storyGenerator,
)`

const requireStoryBookGenerator = `const storyGenerator = require('../src/test/e2e/storybook-generator').default
`

const fileList = recFindByExt(`${__dirname}/../src`, 'story.js')

const convertAndGenerate = R.compose(
  generateCode,
  convertToRelative,
)

const generatedCode = fileList.map(convertAndGenerate).join('\n')

fs.writeFile(`${__dirname}/index.js`, requireStoryBookGenerator.concat(generatedCode, '\n'), (err) => {
  if (err) {
    return console.error(err)
  } else {
    return console.log('File [index.js] was saved')
  }
})

// ==== generate e2e-test-builder.generated.js
const requireTestGenerator = `const e2eGenerator = require('../src/test/e2e/e2e-generator').default
`

const replaceStoryToFixture = (file) => file.replace('.story.', '.fixture.')
const convertToRelativeForTests = (file) => `../../${file.split('/src/')[1]}`

const generateTestCode = (config, index) => `
const fixtures${index} = require('${config.pathToFixture}')
  .default

e2eGenerator({
  fixtures: fixtures${index},
  file: '${config.pathToFile}',
  componentName: '${config.componentName}',
})
`

const getFileName = R.compose(
  R.head,
  R.split('.'),
  R.last,
  R.split('/'),
)

const convertToConfig = (file) => ({
  pathToFixture: replaceStoryToFixture(convertToRelative(file)),
  pathToFile: convertToRelativeForTests(file),
  componentName: getFileName(file),
})

const convertAndGenerateTestCode = (file, index) => generateTestCode(convertToConfig(file), index)

const e2eGeneratorContent = fileList.map(convertAndGenerateTestCode).join('')

fs.writeFile(`${__dirname}/e2e-test-builder.generated.js`, requireTestGenerator.concat(e2eGeneratorContent), (err) => {
  if (err) {
    return console.error(err)
  } else {
    return console.log('File [e2e-test-builder.generated.js] was saved')
  }
})

/* eslint-enable no-param-reassign */
/* eslint-enable no-console */
