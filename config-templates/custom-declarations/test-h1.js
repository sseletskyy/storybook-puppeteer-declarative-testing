const declarationTestH1 = (fixture) => {
  const { testH1 } = (fixture && fixture.spdt) || {}
  let selector
  let value
  if (typeof testH1 === 'string') {
    selector = 'h1'
    value = testH1
  }
  if (!selector || !value) {
    return null
  }
  return `
    it('testH1: should find component matching selector [${selector}] with value ${value}', async () => {
      const components = await iFrame.$$eval('[id=root] ${selector}', elements => elements.map(e => e.innerText))
      const expected = '${value}'
      expect(components).toContain(expected)
    })`
}

module.exports = {
  testH1: declarationTestH1,
}
