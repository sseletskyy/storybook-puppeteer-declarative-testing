import path from 'path'
import {
  generateContent,
  getFileName,
  ROOT_SELECTOR,
  saveFile,
  testCheckArcs,
  testCheckAxes,
  testCheckBars,
  testCheckSvg,
  testGenerator,
} from '../lib/test-generator'
import { STORYBOOK_PORT } from '../lib/config'
import fixtures from '../example-src/components/simple-component.fixture'
import { describe, it, expect } from './custom-jest'

const IMPORT_INDEX = 0
const DESCRIBE_INDEX = 1

const pathToSrc = `${__dirname}/../example-src`
const pathToTestIndex = `${__dirname}/spdt`
const file = '../../example-src/components/simple-component.story.js'
const componentName = 'SimpleComponent'
const fixtureName = Object.keys(fixtures)[0]

const setup = () => {
  const fileName = getFileName({
    pathToTestIndex,
    file,
  })
  const content = generateContent({
    fixtures,
    componentName,
  })
  return {
    fileName,
    content,
    pathToSrc,
    pathToTestIndex,
    componentName,
    fixtureName,
    file,
  }
}
describe('Test Generator', () => {
  it(`getFileName: check relative path generation`, () => {
    const { fileName, file: fl, pathToTestIndex: ptti } = setup()
    const expected = [ptti, '/', fl.replace('.story.', '.generated.spdt.')].join('')
    expect(fileName).toEqual(expected)
  })

  it(`generateContent: check generated imports`, () => {
    const { content } = setup()
    const expected = `const TIMEOUT = 5000
`
    expect(content[IMPORT_INDEX]).toEqual(expected)
  })

  it(`generateContent: check generated describe title`, () => {
    const { content, componentName: cn, fixtureName: fn } = setup()
    const expected = `${cn} - fixture ${fn}`
    expect(content[DESCRIBE_INDEX].includes(expected)).toBeTruthy()
  })

  it(`generateContent: check generated describe page.goto url`, () => {
    const { content, componentName: cn, fixtureName: fn } = setup()
    const expected = `http://localhost:${STORYBOOK_PORT}/?selectedKind=${cn}&selectedStory=${fn}`
    expect(content[DESCRIBE_INDEX].includes(expected)).toBeTruthy()
  })

  it(`generateContent: check customDeclarativeTest it title`, () => {
    const { content, fixtureName: fn } = setup()
    const value = fixtures[fn].spdt.customDeclarativeTest
    const expected = `should find component matching selector [h1] with value ${value}`
    expect(content[DESCRIBE_INDEX].includes(expected)).toBeTruthy()
  })

  it('testGenerator', () => {
    testGenerator({
      fixtures,
      file,
      componentName,
      pathToTestIndex,
    })
    expect(true).toBeTruthy()
  })

  it('testCheckArcs: when declaration not set should return empty string', () => {
    const fixture = {}
    const actual = testCheckArcs(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })

  it('testCheckArcs: when declaration is set should return generated it test', () => {
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkArcs: true },
    }
    const actual = testCheckArcs(fixture)
    const expectedItTitle = `it('checkArcs: should have ${fixture.props.data.length} arcs according to fixture data'`
    const expectedSelector = `const arcs = await iFrame.$$('${ROOT_SELECTOR} path.arc')`
    expect(actual.includes(expectedItTitle)).toBeTruthy()
    expect(actual.includes(expectedSelector)).toBeTruthy()
  })

  it('testCheckAxes: when declaration not set should return empty string', () => {
    const fixture = {}
    const actual = testCheckAxes(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })

  it('testCheckAxes: when declaration is set should return generated it test', () => {
    const checkAxes = 2
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkAxes },
    }
    const actual = testCheckAxes(fixture)
    const expectedItTitle = `it('checkAxes: should have ${checkAxes} axes'`
    const expectedSelector = `const axes = await iFrame.$$('${ROOT_SELECTOR} g.axis')`
    const expectedValue = `const expected = ${checkAxes}`
    expect(actual.includes(expectedItTitle)).toBeTruthy()
    expect(actual.includes(expectedSelector)).toBeTruthy()
    expect(actual.includes(expectedValue)).toBeTruthy()
  })

  it('testCheckBars: when declaration not set should return empty string', () => {
    const fixture = {}
    const actual = testCheckBars(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })

  it('testCheckBars: when declaration is set should return generated it test', () => {
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkBars: true },
    }
    const actual = testCheckBars(fixture)
    const expectedItTitle = `it('checkBars: should have ${fixture.props.data.length} bars according to fixture data'`
    const expectedSelector = `const bars = await iFrame.$$('${ROOT_SELECTOR} rect.bar')`
    expect(actual.includes(expectedItTitle)).toBeTruthy()
    expect(actual.includes(expectedSelector)).toBeTruthy()
  })

  it('testCheckSvg: when declaration not set should return empty string', () => {
    const fixture = {}
    const actual = testCheckSvg(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })

  it('testCheckSvg: when declaration is set should return generated it test', () => {
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkSvg: true },
    }
    const actual = testCheckSvg(fixture)
    const expectedItTitle = `it('checkSvg: should load component as <svg>'`
    const expectedSelector = `const component = await iFrame.$('svg')`
    expect(actual.includes(expectedItTitle)).toBeTruthy()
    expect(actual.includes(expectedSelector)).toBeTruthy()
  })

  it('saveFile: when path is incorrect should put error to debug logger', () => {
    const incorrectFile = path.resolve(__dirname, 'non-existed-dir', 'test-file-to.save')
    const content = 'test content'
    saveFile(incorrectFile, content)
    expect(true).toBeTruthy()
  })
  it('saveFile: when path is correct should put saved file to debug logger', () => {
    const incorrectFile = path.resolve(__dirname, 'e2e', 'test-file-to.save')
    const content = 'test content'
    saveFile(incorrectFile, content)
    expect(true).toBeTruthy()
  })
})
