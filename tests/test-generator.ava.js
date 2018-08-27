const test = require('ava')
const { testGenerator } = require('../index')
const fixtures = require('../example-src/components/simple-component.fixture.js').default

const IMPORT_INDEX = 0
const DESCRIBE_INDEX = 1

const setup = () => {
  const pathToSrc = `${__dirname}/../example-src`
  const pathToTestIndex = `${__dirname}/e2e`
  const file = '../../example-src/components/simple-component.story.js'
  const componentName = 'SimpleComponent'
  const fixtureName = Object.keys(fixtures)[0]
  const actual = testGenerator({
    pathToSrc,
    pathToTestIndex,
    fixtures,
    file,
    componentName,
  })
  return {
    ...actual,
    pathToSrc,
    pathToTestIndex,
    componentName,
    fixtureName,
    file,
  }
}

test(`testGenerator: check relative path generation`, (t) => {
  const { fileName, file, pathToTestIndex } = setup()
  const expected = [pathToTestIndex, '/', file.replace('.story.', '.generated.e2e.')].join('')
  t.is(fileName, expected)
})

test(`testGenerator: check generated imports`, (t) => {
  const { content } = setup()
  const expected = `const TIMEOUT = 5000
`
  t.is(content[IMPORT_INDEX], expected)
})

test(`testGenerator: check generated describe title`, (t) => {
  const { content, componentName, fixtureName } = setup()
  const expected = `${componentName} - fixture ${fixtureName}`
  t.true(content[DESCRIBE_INDEX].includes(expected))
})

test(`testGenerator: check generated describe page.goto url`, (t) => {
  const { content, componentName, fixtureName } = setup()
  const expected = `http://localhost:9001/?selectedKind=${componentName}&selectedStory=${fixtureName}`
  t.true(content[DESCRIBE_INDEX].includes(expected))
})
