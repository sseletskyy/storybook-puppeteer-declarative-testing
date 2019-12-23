const checkInnerTextsObject = ({ selector, text }) => {
  if (!selector || text === undefined) {
    return null
  }
  return `
    it('checkInnerTexts: should find all components matching selector [${selector}] with value ${text}', async () => {
      const components = await page.$$eval('${selector}', elements => elements.map(e => e.innerText))
      const expected = '${text}'
      expect(components).toContain(expected)
    })`
}

const checkInnerTexts = fixture => {
  const { checkInnerTexts } = (fixture && fixture.spdt) || {}
  if (!checkInnerTexts) {
    return null
  }
  if (Array.isArray(checkInnerTexts)) {
    return checkInnerTexts.map(checkInnerTextsObject)
  } else if (typeof checkInnerTexts === 'object') {
    return checkInnerTextsObject(checkInnerTexts)
  }
  return null
}

module.exports = {
  checkInnerTexts: checkInnerTexts,
}
