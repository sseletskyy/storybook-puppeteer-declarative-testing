const {storyGenerator} = require('storybook-puppeteer-declarative-testing')
require('../../example-src/components/simple-component.story.js').default(
  storyGenerator,
)
