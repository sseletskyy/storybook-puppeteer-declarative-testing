const checkInnerTextObject = ({ selector, text }) => {
  if (!selector || text === undefined) {
    return null
  }
  return `
    it('checkInnerText: should find component matching selector [${selector}] with value [${text}]', async () => {
      const actual = await page.$eval('${selector}', element => element.innerText)
      const expected = '${text}'
      expect(actual).toEqual(expected)
    })`
}
const declarationCheckInnerText = fixture => {
  const { checkInnerText } = (fixture && fixture.spdt) || {}
  if (!checkInnerText) {
    return null
  }
  if (Array.isArray(checkInnerText)) {
    return checkInnerText.map(checkInnerTextObject)
  } else if (typeof checkInnerText === 'object') {
    return checkInnerTextObject(checkInnerText)
  }
  return null
}

module.exports = {
  checkInnerText: declarationCheckInnerText,
}
