const { testGenerator } = require('../../index')

const fixtures0 = require('../../example-src/components/simple-component.fixture.js').default

testGenerator({
  fixtures: fixtures0,
  file: '../../example-src/components/simple-component.story.js',
  componentName: 'Comment',
})
