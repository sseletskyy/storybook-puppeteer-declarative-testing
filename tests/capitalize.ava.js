const test = require('ava')
const { capitalize } = require('../lib/story-index-generator')

test('Capitalize', (t) => {
  t.is(capitalize('abc'), 'Abc')
  t.is(capitalize('ABc'), 'ABc')
  t.is(capitalize('aBC'), 'ABC')
  t.is(capitalize('ABC'), 'ABC')
})
