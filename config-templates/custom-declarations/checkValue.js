const checkValueObject = ({ selector, value }) => {
  if (!selector || value === undefined) {
    return null
  }
  return `
    it('checkValue: should find component matching selector [${selector}] with value [${value}]', async () => {
      const actual = await page.$eval('${selector}', element => element.value)
      const expected = '${value}'
      expect(actual).toEqual(expected)
    })`
}
const declarationCheckValue = fixture => {
  const { checkValue } = (fixture && fixture.spdt) || {}
  if (!checkValue) {
    return null
  }
  if (Array.isArray(checkValue)) {
    return checkValue.map(checkValueObject)
  } else if (typeof checkValue === 'object') {
    return checkValueObject(checkValue)
  }
  return null
}

module.exports = {
  checkValue: declarationCheckValue,
}
