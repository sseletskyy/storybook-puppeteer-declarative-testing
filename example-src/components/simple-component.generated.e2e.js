const TIMEOUT = 5000

describe(
  'SimpleComponent - fixture fixtureOne',
  () => {
    let page
    let iFrame
    beforeAll(async () => {
      // eslint-disable-next-line no-underscore-dangle
      page = await global.__BROWSER__.newPage()
      // prettier-ignore
      await page.goto('http://localhost:9009/?selectedKind=SimpleComponent&selectedStory=fixtureOne')
      const frames = await page.frames()
      iFrame = frames.find((f) => f.name() === 'storybook-preview-iframe')
    }, TIMEOUT)

    afterAll(async () => {
      await page.close()
    })

    it('should load component matching selector [div.simple-component]', async () => {
      const components = await iFrame.$$('div.simple-component')
      const expected = 1
      expect(components).toHaveLength(expected)
    })
  },
  TIMEOUT,
)
