const storyGenerator = require('../src/test/e2e/storybook-generator').default
require('../src/components/Article/__tests__/Comment.story.js').default(
  storyGenerator,
)
