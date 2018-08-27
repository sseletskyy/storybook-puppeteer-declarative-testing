const R = require('ramda')
const fs = require('fs')
const debug = require('debug')('spdt: test-generator')
const { getConfig } = require('./config')

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
    let iFrame
    beforeAll(async () => {
      // eslint-disable-next-line no-underscore-dangle
      page = await global.__BROWSER__.newPage()
      // prettier-ignore
      await page.goto('http://localhost:9001/?selectedKind=${componentName}&selectedStory=${fixtureName}')
      const frames = await page.frames()
      iFrame = frames.find((f) => f.name() === 'storybook-preview-iframe')
    }, TIMEOUT)

    afterAll(async () => {
      await page.close()
    })
${itTests}
  },
  TIMEOUT,
)
`

const testCheckSelector = (fixture) => {
  const { checkSelector } = R.propOr({}, 'e2e', fixture)
  if (!checkSelector) {
    return undefined
  }
  return `
    it('should load component matching selector [${checkSelector}]', async () => {
      const components = await iFrame.$$('${checkSelector}')
      const expected = 1
      expect(components).toHaveLength(expected)
    })`
}

const testCheckSvg = (fixture) => {
  const { checkSvg } = R.propOr({}, 'e2e', fixture)
  if (checkSvg !== true) {
    return undefined
  }
  return `
    it('should load component as <svg>', async () => {
      const component = await iFrame.$('svg')
      expect(component._remoteObject.description).toMatch('svg') // eslint-disable-line no-underscore-dangle
    })`
}

const testCheckAxes = (fixture) => {
  const { checkAxes } = R.propOr({}, 'e2e', fixture)
  return `
    it('should have ${checkAxes} axes', async () => {
      const axes = await iFrame.$$('g.axis')
      const expected = ${checkAxes}
      expect(axes).toHaveLength(expected)
    })`
}

const testCheckBars = (fixture) => {
  const { checkBars } = R.propOr({}, 'e2e', fixture)
  if (checkBars !== true) {
    return ''
  }
  const checkBarsValue = R.pathOr(0, ['props', 'data', 'length'], fixture)
  return `
    it('should have ${checkBarsValue} bars according to fixure data', async () => {
      const bars = await iFrame.$$('rect.bar')
      const expected = ${checkBarsValue} // fixture.props.data.length
      expect(bars).toHaveLength(expected)
    })`
}

const testCheckArcs = (fixture) => {
  const { checkArcs } = R.propOr({}, 'e2e', fixture)
  if (checkArcs !== true) {
    return ''
  }
  const checkArcsValue = R.pathOr(0, ['props', 'data', 'length'], fixture)
  return `
    it('should have ${checkArcsValue} arcs according to fixure data', async () => {
      const arcs = await iFrame.$$('path.arc')
      const expected = ${checkArcsValue} // fixture.props.data.length
      expect(arcs).toHaveLength(expected)
    })`
}

// map a key in fixtures.[fixture name].e2e to respective function which generates an it test
const testMapper = {
  checkSelector: testCheckSelector,
  checkSvg: testCheckSvg,
  checkAxes: testCheckAxes,
  checkBars: testCheckBars,
  checkArcs: testCheckArcs,
}

const generateItTests = (fixture) => {
  const result = []
  const e2eKeys = Object.keys(R.propOr({}, 'e2e', fixture))
  e2eKeys.forEach((checkItem) => testMapper[checkItem] && result.push(testMapper[checkItem](fixture)))
  return result.join('')
}

// eslint-disable-next-line consistent-return
function testGenerator({ fixtures, file, componentName, pathToTestIndex }) {
  const config = getConfig()
  const pathTo = pathToTestIndex || config.pathToTestIndex

  const fileName = `${pathTo}/${file.replace('.story.', '.generated.e2e.')}`
  const content = []
  content.push(generateImports(componentName))

  Object.keys(fixtures).forEach((fixtureName) => {
    const itTests = generateItTests(fixtures[fixtureName])
    content.push(generateDescribe(componentName, fixtureName, itTests))
  })

  if (process.env.NODE_ENV === 'AVA') {
    return { content, fileName }
  }

  saveFile(fileName, content.join(''))
}

module.exports = { testGenerator }
