const test = require('ava')
const path = require('path')
const {
  testGenerator,
  generateContent,
  getFileName,
  testCheckArcs,
  testCheckBars,
  testCheckSvg,
  testCheckAxes,
  saveFile,
  ROOT_SELECTOR,
} = require('../lib/test-generator')
const { STORYBOOK_PORT } = require('../lib/config')
const fixtures = require('../example-src/components/simple-component.fixture.js').default

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

test(`getFileName: check relative path generation`, (t) => {
  const { fileName, file: fl, pathToTestIndex: ptti } = setup()
  const expected = [ptti, '/', fl.replace('.story.', '.generated.spdt.')].join('')
  t.is(fileName, expected)
})

test(`generateContent: check generated imports`, (t) => {
  const { content } = setup()
  const expected = `const TIMEOUT = 5000
`
  t.is(content[IMPORT_INDEX], expected)
})

test(`generateContent: check generated describe title`, (t) => {
  const { content, componentName: cn, fixtureName: fn } = setup()
  const expected = `${cn} - fixture ${fn}`
  t.true(content[DESCRIBE_INDEX].includes(expected))
})

test(`generateContent: check generated describe page.goto url`, (t) => {
  const { content, componentName: cn, fixtureName: fn } = setup()
  const expected = `http://localhost:${STORYBOOK_PORT}/?selectedKind=${cn}&selectedStory=${fn}`
  t.true(content[DESCRIBE_INDEX].includes(expected))
})

test(`generateContent: check customDeclarativeTest it title`, (t) => {
  const { content, fixtureName: fn } = setup()
  const value = fixtures[fn].spdt.customDeclarativeTest
  const expected = `should find component matching selector [h1] with value ${value}`
  t.true(content[DESCRIBE_INDEX].includes(expected))
})

test('testGenerator', (t) => {
  testGenerator({
    fixtures,
    file,
    componentName,
    pathToTestIndex,
  })
  t.pass()
})

test('testCheckArcs: when declaration not set should return empty string', (t) => {
  const fixture = {}
  const actual = testCheckArcs(fixture)
  const expected = null
  t.is(actual, expected)
})

test('testCheckArcs: when declaration is set should return generated it test', (t) => {
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkArcs: true },
  }
  const actual = testCheckArcs(fixture)
  const expectedItTitle = `it('checkArcs: should have ${fixture.props.data.length} arcs according to fixture data'`
  const expectedSelector = `const arcs = await iFrame.$$('${ROOT_SELECTOR} path.arc')`
  t.true(actual.includes(expectedItTitle))
  t.true(actual.includes(expectedSelector))
})

test('testCheckAxes: when declaration not set should return empty string', (t) => {
  const fixture = {}
  const actual = testCheckAxes(fixture)
  const expected = null
  t.is(actual, expected)
})

test('testCheckAxes: when declaration is set should return generated it test', (t) => {
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
  t.true(actual.includes(expectedItTitle))
  t.true(actual.includes(expectedSelector))
  t.true(actual.includes(expectedValue))
})

test('testCheckBars: when declaration not set should return empty string', (t) => {
  const fixture = {}
  const actual = testCheckBars(fixture)
  const expected = null
  t.is(actual, expected)
})

test('testCheckBars: when declaration is set should return generated it test', (t) => {
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkBars: true },
  }
  const actual = testCheckBars(fixture)
  const expectedItTitle = `it('checkBars: should have ${fixture.props.data.length} bars according to fixture data'`
  const expectedSelector = `const bars = await iFrame.$$('${ROOT_SELECTOR} rect.bar')`
  t.true(actual.includes(expectedItTitle))
  t.true(actual.includes(expectedSelector))
})

test('testCheckSvg: when declaration not set should return empty string', (t) => {
  const fixture = {}
  const actual = testCheckSvg(fixture)
  const expected = null
  t.is(actual, expected)
})

test('testCheckSvg: when declaration is set should return generated it test', (t) => {
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkSvg: true },
  }
  const actual = testCheckSvg(fixture)
  const expectedItTitle = `it('checkSvg: should load component as <svg>'`
  const expectedSelector = `const component = await iFrame.$('svg')`
  t.true(actual.includes(expectedItTitle))
  t.true(actual.includes(expectedSelector))
})

test('saveFile: when path is incorrect should put error to debug logger', (t) => {
  const incorrectFile = path.resolve(__dirname, 'non-existed-dir', 'test-file-to.save')
  const content = 'test content'
  saveFile(incorrectFile, content)
  t.pass()
})
test('saveFile: when path is correct should put saved file to debug logger', (t) => {
  const incorrectFile = path.resolve(__dirname, 'e2e', 'test-file-to.save')
  const content = 'test content'
  saveFile(incorrectFile, content)
  t.pass()
})
