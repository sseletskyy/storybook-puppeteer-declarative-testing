const test = require('ava')
const {
  testCheckSelector,
  ROOT_SELECTOR,
} = require('../../lib/test-generator')

test('when declaration not set should return null', (t) => {
  const fixture = {}
  const actual = testCheckSelector(fixture)
  const expected = null
  t.is(actual, expected)
})

test('when declaration is boolean should return null', (t) => {
  const checkSelector = true
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkSelector },
  }
  const actual = testCheckSelector(fixture)
  const expected = null
  t.is(actual, expected)
})
test('when declaration is a string should return one generated it test with expected length 1', (t) => {
  const checkSelector = 'div.className'
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkSelector },
  }
  const actual = testCheckSelector(fixture)
  const expectedItTitle = `it('checkSelector: should find component matching selector [${checkSelector}] 1 time(s)'`
  const expectedSelector = `const components = await iFrame.$$('${ROOT_SELECTOR} ${checkSelector}')`
  const expectedExpected = `const expected = 1`
  t.true(actual.includes(expectedItTitle))
  t.true(actual.includes(expectedSelector))
  t.true(actual.includes(expectedExpected))
})
test('when declaration is an object and required keys are missing should return null', (t) => {
  const checkSelector = { noSelectorKey: true }
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkSelector },
  }
  const actual = testCheckSelector(fixture)
  const expected = null
  t.is(actual, expected)
})

test('when declaration is an object should return one generated it test with expected length based on key <length>', (t) => {
  const checkSelector = { selector: 'div.className', length: 3 }
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkSelector },
  }
  const actual = testCheckSelector(fixture)
  const expectedItTitle = `it('checkSelector: should find component matching selector [${checkSelector.selector}] ${
    checkSelector.length
  } time(s)'`
  const expectedSelector = `const components = await iFrame.$$('${ROOT_SELECTOR} ${checkSelector.selector}')`
  const expectedExpected = `const expected = ${checkSelector.length}`
  t.true(actual.includes(expectedItTitle))
  t.true(actual.includes(expectedSelector))
  t.true(actual.includes(expectedExpected))
})

test('when declaration is an array should return array.length generated it tests', (t) => {
  const checkSelector = [{ selector: 'div.className', length: 3 }, 'h1.title']
  const fixture = {
    props: {
      data: [1, 2, 3],
    },
    spdt: { checkSelector },
  }
  const actual = testCheckSelector(fixture)
  const expectedLength = 2
  t.true(Array.isArray(actual))
  t.is(actual.length, expectedLength)

  const expectedItTitleFirst = `it('checkSelector: should find component matching selector [${checkSelector[0].selector}] ${
    checkSelector[0].length
  } time(s)'`
  const expectedItTitleSecond = `it('checkSelector: should find component matching selector [${checkSelector[1]}] 1 time(s)'`
  t.true(actual[0].includes(expectedItTitleFirst))
  t.true(actual[1].includes(expectedItTitleSecond))
})
