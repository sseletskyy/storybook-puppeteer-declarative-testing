const test = require('ava')
const path = require('path')
const { generateTestIndex, generateContentForTestIndex } = require('../lib/story-index-generator')

test(`generateContentForTestIndex: check relative path generation
when pathToStories is one level deep`, (t) => {
  const pathToSrc = `${__dirname}/../example-src`
  const pathToTestIndex = `${__dirname}`
  const { content: actual } = generateContentForTestIndex(pathToSrc, pathToTestIndex)
  const expected = `const {testGenerator} = require('spdt/lib/test-generator')

const fixtures0 = require('../example-src/components/simple-component.fixture.js')
  .default

testGenerator({
  fixtures: fixtures0,
  file: '../example-src/components/simple-component.story.js',
  componentName: 'SimpleComponent',
})
`
  t.is(actual, expected)
})

test(`generateTestIndex: when pathToTestIndex is wrong should return Either.Left with error message`, (t) => {
  const pathToSrc = `${__dirname}/../example-src`
  const nonExistedPathToTestIndex = `${__dirname}/e2e/e2e`
  const actual = generateTestIndex(pathToSrc, nonExistedPathToTestIndex)
  t.true(actual.isLeft())
})
test(`generateTestIndex: when pathToTestIndex is correct should return Either.Right with fileList`, (t) => {
  const pathToSrc = `${__dirname}/../example-src`
  const nonExistedPathToTestIndex = `${__dirname}/e2e`
  const actual = generateTestIndex(pathToSrc, nonExistedPathToTestIndex)
  const expected = [path.resolve(__dirname, '../example-src/components/simple-component.story.js')]
  t.true(actual.isRight())
  t.deepEqual(actual.right(), expected)
})
