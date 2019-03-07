import { capitalize } from '../lib/story-index-generator'
import { describe, it, expect } from './custom-jest'

describe('Capitalize', () => {
  it('abc -> Abc', () => {
    expect(capitalize('abc')).toEqual('Abc')
  })
  it('ABc -> ABc', () => {
    expect(capitalize('ABc')).toEqual('ABc')
  })
  it('aBC -> ABC', () => {
    expect(capitalize('aBC')).toEqual('ABC')
  })
  it('ABC -> ABC', () => {
    expect(capitalize('ABC')).toEqual('ABC')
  })
})
