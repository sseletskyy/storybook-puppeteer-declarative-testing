import path from 'path'
import {
  generateContentForTestIndex,
  generateTestIndex,
} from '../lib/story-index-generator'
import { describe, it, expect } from './custom-jest'

describe('Test Index Generator', function() {
  it(`generateContentForTestIndex: check relative path generation
when pathToStories is one level deep`, () => {
    const pathToSrc = `${__dirname}/../example-src`
    const pathToTestIndex = `${__dirname}`
    const { content: actual } = generateContentForTestIndex(
      pathToSrc,
      pathToTestIndex,
    )
    const expected = `const {testGenerator} = require('spdt/lib/test-generator.js')

const fixtures0 = require('../example-src/components/simple-component.fixture.js')
  .default

testGenerator({
  fixtures: fixtures0,
  file: '../example-src/components/simple-component.story.js',
  componentName: 'SimpleComponent',
})
`
    expect(actual).toEqual(expected)
  })

  it(`generateTestIndex: when pathToTestIndex is wrong should return Either.Left with error message`, () => {
    const pathToSrc = `${__dirname}/../example-src`
    const nonExistedPathToTestIndex = `${__dirname}/e2e/e2e`
    const actual = generateTestIndex(pathToSrc, nonExistedPathToTestIndex)
    expect(actual.isLeft()).toBeTruthy()
  })
  it(`generateTestIndex: when pathToTestIndex is correct should return Either.Right with fileList`, () => {
    const pathToSrc = `${__dirname}/../example-src`
    const nonExistedPathToTestIndex = `${__dirname}/e2e`
    const actual = generateTestIndex(pathToSrc, nonExistedPathToTestIndex)
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
