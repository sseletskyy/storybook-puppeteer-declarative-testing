const testCustomDeclarativeTest = (fixture) => {
  const { customDeclarativeTest } = (fixture && fixture.spdt) || {}
  let selector
  let value
  if (typeof customDeclarativeTest === 'string') {
    selector = 'h1'
    value = customDeclarativeTest
  }
  if (!selector || !value) {
    return null
  }
  return `
    it('should find component matching selector [${selector}] with value ${value}', async () => {
      const components = await iFrame.$$('${selector}')
      const expected = 1
      expect(components).toHaveLength(expected)
    })`
}

module.exports = {
  customDeclarativeTest: testCustomDeclarativeTest
}
