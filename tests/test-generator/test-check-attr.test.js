import { testCheckAttr } from '../../lib/test-generator'
import { describe, it, expect } from '../custom-jest'

describe('Test Check Attr', () => {
  it('when declaration not set should return null', () => {
    const fixture = {}
    const actual = testCheckAttr(fixture)
    const expected = null
    expect(actual).toEqual(expected)
  })
  describe('when declaration is an object', () => {
    it('and required key `selector` is missing should return null', () => {
      const checkAttr = { noSelectorKey: true, expected: 'x', attribute: 'y' }
      const fixture = {
        props: {
          data: [1, 2, 3],
        },
        spdt: { checkAttr },
      }
      const actual = testCheckAttr(fixture)
      const expected = null
      expect(actual).toEqual(expected)
    })
    it('and required key `expected` is missing should return null', () => {
      const checkAttr = {
        selector: 'div.active',
        noExpectedKey: 'x',
        attribute: 'y',
      }
      const fixture = {
        props: {
          data: [1, 2, 3],
        },
        spdt: { checkAttr },
      }
      const actual = testCheckAttr(fixture)
      const expected = null
      expect(actual).toEqual(expected)
    })
    it('and required key `attribute` is missing should return null', () => {
      const checkAttr = {
        selector: 'div.active',
        expected: 'x',
        noAttributeKey: 'y',
      }
      const fixture = {
        props: {
          data: [1, 2, 3],
        },
        spdt: { checkAttr },
      }
      const actual = testCheckAttr(fixture)
      const expected = null
      expect(actual).toEqual(expected)
    })
    it('and all required keys are present should return generated test', () => {
      const checkAttr = {
        selector: 'div.active',
        expected: 'x',
        attribute: 'y',
      }
      const fixture = {
        props: {
          data: [1, 2, 3],
        },
        spdt: { checkAttr },
      }
      const actual = testCheckAttr(fixture)
      expect(actual).toMatch(
        `page.$eval('div.active', element => element.getAttribute('y'))`,
      )
      expect(actual).toMatch(`expect(actual).toEqual('x')`)
    })
  })
  describe('when declaration is an array', () => {
    it('and all required keys are present should return generated test', () => {
      const checkAttr = {
        selector: 'div.active',
        expected: 'x',
        attribute: 'y',
      }
      const checkAttr2 = {
        selector: 'div.disabled',
        expected: 'k',
        attribute: 'm',
      }
      const fixture = {
        props: {
          data: [1, 2, 3],
        },
        spdt: { checkAttr: [checkAttr, checkAttr2] },
      }
      const actual = testCheckAttr(fixture)
      expect(actual[0]).toMatch(
        `page.$eval('div.active', element => element.getAttribute('y'))`,
      )
      expect(actual[0]).toMatch(`expect(actual).toEqual('x')`)
      expect(actual[1]).toMatch(
        `page.$eval('div.disabled', element => element.getAttribute('m'))`,
      )
      expect(actual[1]).toMatch(`expect(actual).toEqual('k')`)
    })
  })
})
