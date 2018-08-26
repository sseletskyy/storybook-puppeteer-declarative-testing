const e2eGenerator = require('../src/test/e2e/e2e-generator').default

const fixtures0 = require('../src/components/Article/__tests__/Comment.fixture.js')
  .default

e2eGenerator({
  fixtures: fixtures0,
  file: '../../components/Article/__tests__/Comment.story.js',
  componentName: 'Comment',
})
