const test = require('ava')
const {toPascalCase} = require('../lib/story-index-generator')

test('toPascalCase', t => {
  t.is(toPascalCase('abc'), 'Abc')
  t.is(toPascalCase('abc-def'), 'AbcDef')
  t.is(toPascalCase('aBC-dEF'), 'AbcDef')
  t.is(toPascalCase('abc_def'), 'AbcDef')
  t.is(toPascalCase('ABC DEF'), 'AbcDef')
})
