import { toPascalCase } from '../lib/story-index-generator'
import { describe, it, expect } from './custom-jest'

describe('toPascalCase', () => {
  it('abc -> Abc', () => {
    expect(toPascalCase('abc')).toEqual('Abc')
  })
  it('abc-def -> AbcDef', () => {
    expect(toPascalCase('abc-def')).toEqual('AbcDef')
  })
  it('aBC-dEF -> ABCDEF', () => {
    // keep case of the rest chars
    expect(toPascalCase('aBC-dEF')).toEqual('ABCDEF')
  })
  it('abc_def -> AbcDef', () => {
    expect(toPascalCase('abc_def')).toEqual('AbcDef')
  })
  it('AbC DEf -> AbCDEf', () => {
    expect(toPascalCase('AbC DEf')).toEqual('AbCDEf')
  })
})
