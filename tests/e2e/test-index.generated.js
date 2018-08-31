const {testGenerator} = require('spdt/lib/test-generator')

const fixtures0 = require('../../example-src/components/simple-component.fixture.js')
  .default

testGenerator({
  fixtures: fixtures0,
  file: '../../example-src/components/simple-component.story.js',
  componentName: 'SimpleComponent',
})
