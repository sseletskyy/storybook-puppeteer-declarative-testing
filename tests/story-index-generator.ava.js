const test = require('ava')
const path = require('path')
const { generateContentForStoryIndex, generateStoryIndex } = require('../lib/story-index-generator')

test(`generateContentForStoryIndex: check relative path generation
when pathToStories is two levels deep`, (t) => {
  const pathToSrc = `${__dirname}/../example-src`
  const pathToStories = `${__dirname}/stories`
  const { content: actual } = generateContentForStoryIndex(pathToSrc, pathToStories)
  const expected = `const {storyGenerator} = require('spdt')
require('../../example-src/components/simple-component.story.js').default(
  storyGenerator,
)
`
  t.is(actual, expected)
})

test(`generateContentForStoryIndex: check relative path generation
when pathToStories is one level deep`, (t) => {
  const pathToSrc = `${__dirname}/../example-src`
  const pathToStories = `${__dirname}/../stories`
  const { content: actual } = generateContentForStoryIndex(pathToSrc, pathToStories)
  const expected = `const {storyGenerator} = require('spdt')
require('../example-src/components/simple-component.story.js').default(
  storyGenerator,
)
`
  t.is(actual, expected)
})

test(`generateStoryIndex: should return Either.Left with error message`, (t) => {
  const pathToSrc = `${__dirname}/../example-src`
  const nonExistedPathToStories = `${__dirname}/../stories`
  const actual = generateStoryIndex(pathToSrc, nonExistedPathToStories)
  t.true(actual.isLeft())
})

test(`generateStoryIndex: should return list of found .story.js files`, (t) => {
  const pathToSrc = `${__dirname}/../example-src`
  const existedPathToStories = `${__dirname}/stories`
  const actual = generateStoryIndex(pathToSrc, existedPathToStories)
  const expected = [path.resolve(__dirname, '../example-src/components/simple-component.story.js')]
  t.true(actual.isRight())
  t.deepEqual(actual.right(), expected)
})
