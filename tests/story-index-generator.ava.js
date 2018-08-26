const test = require('ava')
const { generateStoryIndex, generateTestIndex } = require('../index')

test(`generateStoryIndex: check relative path generation
when pathToStories is two levels deep`, t => {
  const pathToSrc = `${__dirname}/../example-src`
  const pathToStories = `${__dirname}/stories`
  const actual = generateStoryIndex(pathToSrc, pathToStories)
  const expected = `const {storyGenerator} = require('storybook-puppeteer-declarative-testing')
require('../../example-src/components/simple-component.story.js').default(
  storyGenerator,
)
`
  t.is(actual, expected)
})

test(`generateStoryIndex: check relative path generation
when pathToStories is one level deep`, t => {
  const pathToSrc = `${__dirname}/../example-src`
  const pathToStories = `${__dirname}/../stories`
  const actual = generateStoryIndex(pathToSrc, pathToStories)
  const expected = `const {storyGenerator} = require('storybook-puppeteer-declarative-testing')
require('../example-src/components/simple-component.story.js').default(
  storyGenerator,
)
`
  t.is(actual, expected)
})

test(`generateTestIndex: check relative path generation
when pathToStories is one level deep`, t => {
  const pathToSrc = `${__dirname}/../example-src`
  const pathToTestIndex = `${__dirname}`
  const actual = generateTestIndex(pathToSrc, pathToTestIndex)
  const expected = `const {testGenerator} = require('storybook-puppeteer-declarative-testing')

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
