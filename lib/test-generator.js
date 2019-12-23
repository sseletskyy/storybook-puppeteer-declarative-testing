const R = require('ramda')
const fs = require('fs')
const path = require('path')
const debug = require('debug')('spdt')
const { getConfig, STORYBOOK_PORT, SPDT_DIR } = require('./config')

const saveFile = (fileName, content) => {
  fs.writeFile(fileName, content, (err) => {
    if (err) {
      return debug(`error: ${err}`)
    } else {
      return debug(`File was saved: ${fileName}`)
    }
  })
}

const generateImports = () => `const TIMEOUT = 5000
`

const generateDescribe = (componentName, fixtureName, itTests) => `
describe(
  '${componentName} - fixture ${fixtureName}',
  () => {
    let page
    beforeEach(async () => {
      // eslint-disable-next-line no-underscore-dangle
      page = await global.__BROWSER__.newPage()
      // prettier-ignore
      await page.goto(
        'http://localhost:${STORYBOOK_PORT}/iframe.html?path=/story/${componentName.toLowerCase()}--${fixtureName.toLowerCase()}',
        { waitUntil: 'load' }
      )
    }, TIMEOUT)

    afterEach(async () => {
      await page.close()
    })
${itTests}
  },
  TIMEOUT,
)
`

const testCheckSelectorObject = (strOrObj) => {
  let selector
  let length
  if (typeof strOrObj === 'string') {
    selector = strOrObj
    length = 1
  } else if (typeof strOrObj === 'object' && !Array.isArray(strOrObj)) {
    ;({ length, selector } = strOrObj)
  }

  if (!selector || !length) {
    return null
  }
  return `
    it('checkSelector: should find component matching selector [${selector}] ${length} time(s)', async () => {
      const components = await page.$$('${selector}')
      const expected = ${length}
      expect(components).toHaveLength(expected)
    })`
}

const testCheckSelector = (fixture) => {
  const { checkSelector } = R.propOr({}, 'spdt', fixture)
  if (!checkSelector) {
    return null
  }
  if (typeof checkSelector === 'string') {
    return testCheckSelectorObject(checkSelector)
  }
  if (Array.isArray(checkSelector)) {
    return checkSelector.map(testCheckSelectorObject)
  } else if (typeof checkSelector === 'object') {
    return testCheckSelectorObject(checkSelector)
  }
  return null
}

const testCheckAttrObject = ({ selector, attribute, expected }) => {
  if (!selector || !expected || !attribute) {
    return null
  }
  return `
    it('checkAttr: should find component matching selector [${selector}] with attribute [${attribute}]', async () => {
      const actual = await page.$eval('${selector}', element => element.getAttribute('${attribute}'))
      expect(actual).toEqual('${expected}')
    })`
}

const testCheckAttr = (fixture) => {
  const { checkAttr } = (fixture && fixture.spdt) || {}
  if (!checkAttr) {
    return null
  }
  if (Array.isArray(checkAttr)) {
    return checkAttr.map(testCheckAttrObject)
  } else if (typeof checkAttr === 'object') {
    return testCheckAttrObject(checkAttr)
  }
  return null
}

const testCheckSvg = (fixture) => {
  const { checkSvg } = R.propOr({}, 'spdt', fixture)
  if (checkSvg !== true) {
    return null
  }
  return `
    it('checkSvg: should load component as <svg>', async () => {
      const component = await page.$('svg')
      expect(component._remoteObject.description).toMatch('svg') // eslint-disable-line no-underscore-dangle
    })`
}

const testCheckAxes = (fixture) => {
  const { checkAxes } = R.propOr({}, 'spdt', fixture)
  if (!Number.isInteger(checkAxes)) {
    return null
  }
  return `
    it('checkAxes: should have ${checkAxes} axes', async () => {
      const axes = await page.$$('g.axis')
      const expected = ${checkAxes}
      expect(axes).toHaveLength(expected)
    })`
}

const testCheckBars = (fixture) => {
  const { checkBars } = R.propOr({}, 'spdt', fixture)
  if (checkBars !== true) {
    return null
  }
  const checkBarsValue = R.pathOr(0, ['props', 'data', 'length'], fixture)
  return `
    it('checkBars: should have ${checkBarsValue} bars according to fixture data', async () => {
      const bars = await page.$$('rect.bar')
      const expected = ${checkBarsValue} // fixture.props.data.length
      expect(bars).toHaveLength(expected)
    })`
}

const testCheckArcs = (fixture) => {
  const { checkArcs } = R.propOr({}, 'spdt', fixture)
  if (checkArcs !== true) {
    return null
  }
  const checkArcsValue = R.pathOr(0, ['props', 'data', 'length'], fixture)
  return `
    it('checkArcs: should have ${checkArcsValue} arcs according to fixture data', async () => {
      const arcs = await page.$$('path.arc')
      const expected = ${checkArcsValue} // fixture.props.data.length
      expect(arcs).toHaveLength(expected)
    })`
}

const config = getConfig()
let customMapper
try {
  const mapperPath = path.resolve(
    config.projectRoot,
    SPDT_DIR,
    'test-declarations.js',
  )
  // eslint-disable-next-line import/no-dynamic-require
  customMapper = require(mapperPath)
} catch (error) {
  debug(`Caught exception: ${error.message}`)
  throw error
}

// map a key in fixtures.[fixture name].spdt to respective function which generates an it test
const testMapper = {
  checkSelector: testCheckSelector,
  checkSvg: testCheckSvg,
  checkAxes: testCheckAxes,
  checkBars: testCheckBars,
  checkArcs: testCheckArcs,
  ...customMapper,
}

const generateItTests = (fixture) => {
  const result = []
  const spdtKeys = Object.keys(R.propOr({}, 'spdt', fixture))
  spdtKeys.forEach((checkItem) => {
    if (testMapper[checkItem]) {
      const test = testMapper[checkItem](fixture)
      result.push(Array.isArray(test) ? test.join('') : test)
    }
  })
  return result.join('')
}

function getFileName({ file, pathToTestIndex }) {
  const pathTo = pathToTestIndex || getConfig().pathToTestIndex
  return `${pathTo}/${file.replace('.story.', '.generated.spdt.')}`
}

function generateContent({ fixtures, componentName }) {
  const content = []
  content.push(generateImports(componentName))

  Object.keys(fixtures).forEach((fixtureName) => {
    const itTests = generateItTests(fixtures[fixtureName])
    content.push(generateDescribe(componentName, fixtureName, itTests))
  })
  return content
}

function testGenerator({ fixtures, file, componentName, pathToTestIndex }) {
  const content = generateContent({ fixtures, componentName })
  const fileName = getFileName({ file, pathToTestIndex })
  saveFile(fileName, content.join(''))
}

module.exports = {
  testGenerator,
  getFileName,
  generateContent,
  generateItTests,
  testCheckArcs,
  testCheckBars,
  testCheckSvg,
  testCheckSelector,
  testCheckAxes,
  saveFile,
  testCheckAttr,
}
