import { describe, expect, it } from 'vitest'

import { findClosest } from './utils'

describe('findClosest', () => {
  it('finds closest value', () => {
    const array = [4, 7, 9]
    expect(findClosest(array, 1, '<')).toEqual(-1)
    expect(findClosest(array, 1, '>')).toEqual(4)
    expect(findClosest(array, 8, '<')).toEqual(7)
    expect(findClosest(array, 8, '>')).toEqual(9)
    expect(findClosest(array, 7, '>')).toEqual(9)
  })
})
