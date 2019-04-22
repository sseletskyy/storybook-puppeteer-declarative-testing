import { testCheckSelector } from '../../lib/test-generator'
import { describe, it, expect } from '../custom-jest'

describe('Test Check Selector', function() {
  it('when declaration not set should return null', () => {
    const fixture = {}
    const actual = testCheckSelector(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })

  it('when declaration is boolean should return null', () => {
    const checkSelector = true
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkSelector },
    }
    const actual = testCheckSelector(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })
  it('when declaration is a string should return one generated it test with expected length 1', () => {
    const checkSelector = 'div.className'
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkSelector },
    }
    const actual = testCheckSelector(fixture)
    const expectedItTitle = `it('checkSelector: should find component matching selector [${checkSelector}] 1 time(s)'`
    const expectedSelector = `const components = await iFrame.$$('${checkSelector}')`
    const expectedExpected = `const expected = 1`
    expect(actual.includes(expectedItTitle)).toBeTruthy()
    expect(actual.includes(expectedSelector)).toBeTruthy()
    expect(actual.includes(expectedExpected)).toBeTruthy()
  })
  it('when declaration is an object and required keys are missing should return null', () => {
    const checkSelector = { noSelectorKey: true }
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkSelector },
    }
    const actual = testCheckSelector(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })

  it('when declaration is an object should return one generated it test with expected length based on key <length>', () => {
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
    const expectedSelector = `const components = await iFrame.$$('${checkSelector.selector}')`
    const expectedExpected = `const expected = ${checkSelector.length}`
    expect(actual.includes(expectedItTitle)).toBeTruthy()
    expect(actual.includes(expectedSelector)).toBeTruthy()
    expect(actual.includes(expectedExpected)).toBeTruthy()
  })

  it('when declaration is an array should return array.length generated it tests', () => {
    const checkSelector = [{ selector: 'div.className', length: 3 }, 'h1.title']
    const fixture = {
      props: {
        data: [1, 2, 3],
      },
      spdt: { checkSelector },
    }
    const actual = testCheckSelector(fixture)
    const expectedLength = 2
    expect(Array.isArray(actual)).toBeTruthy()
    expect(actual.length).toEqual(expectedLength)

    const expectedItTitleFirst = `it('checkSelector: should find component matching selector [${
      checkSelector[0].selector
    }] ${checkSelector[0].length} time(s)'`
    const expectedItTitleSecond = `it('checkSelector: should find component matching selector [${
      checkSelector[1]
    }] 1 time(s)'`
    expect(actual[0].includes(expectedItTitleFirst)).toBeTruthy()
    expect(actual[1].includes(expectedItTitleSecond)).toBeTruthy()
  })
})
