import path from 'path'
import {
  generateContentForStoryIndex,
  generateStoryIndex,
} from '../lib/story-index-generator'
import { describe, it, expect } from './custom-jest'

describe('Story Index Generator', function() {
  it(`generateContentForStoryIndex: check relative path generation
when pathToStories is two levels deep`, () => {
    const pathToSrc = `${__dirname}/../example-src`
    const pathToStories = `${__dirname}/stories`
    const { content: actual } = generateContentForStoryIndex(
      pathToSrc,
      pathToStories,
    )
    const expected = `const {storyGenerator} = require('spdt')
require('../../example-src/components/simple-component.story.js').default(
  storyGenerator,
)
`
    expect(actual).toEqual(expected)
  })

  it(`generateContentForStoryIndex: check relative path generation
when pathToStories is one level deep`, () => {
    const pathToSrc = `${__dirname}/../example-src`
    const pathToStories = `${__dirname}/../stories`
    const { content: actual } = generateContentForStoryIndex(
      pathToSrc,
      pathToStories,
    )
    const expected = `const {storyGenerator} = require('spdt')
require('../example-src/components/simple-component.story.js').default(
  storyGenerator,
)
`
    expect(actual).toEqual(expected)
  })

  it(`generateStoryIndex: should return Either.Left with error message`, () => {
    const pathToSrc = `${__dirname}/../example-src`
    const nonExistedPathToStories = `${__dirname}/../stories`
    const actual = generateStoryIndex(pathToSrc, nonExistedPathToStories)
    expect(actual.isLeft()).toBeTruthy()
  })

  it(`generateStoryIndex: should return list of found .story.js files`, () => {
    const pathToSrc = `${__dirname}/../example-src`
    const existedPathToStories = `${__dirname}/stories`
    const actual = generateStoryIndex(pathToSrc, existedPathToStories)
    const expected = [
      path.resolve(
        __dirname,
        '../example-src/components/simple-component.story.js',
      ),
    ]
    expect(actual.isRight()).toBeTruthy()
    expect(actual.right()).toEqual(expected)
  })
})
