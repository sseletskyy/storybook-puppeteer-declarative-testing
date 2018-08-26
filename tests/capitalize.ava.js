const test = require('ava')
const {capitalize} = require('../lib/story-index-generator')

test('Capitalize', t => {
  t.is(capitalize('abc'), 'Abc')
  t.is(capitalize('ABc'), 'Abc')
  t.is(capitalize('aBC'), 'Abc')
  t.is(capitalize('ABC'), 'Abc')
})
