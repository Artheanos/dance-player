import { describe, expect, it } from 'vitest'

import { findClosest, secondsToTimeString } from './utils'

describe('findClosest', () => {
  it('finds closest value', () => {
    const array = [7, 9, 4]
    expect(findClosest(array, 1, '<')).toEqual(-1)
    expect(findClosest(array, 1, '>')).toEqual(4)
    expect(findClosest(array, 8, '<')).toEqual(7)
    expect(findClosest(array, 8, '>')).toEqual(9)
    expect(findClosest(array, 7, '>')).toEqual(9)
  })
})

describe('secondsToTimeString', () => {
  it('parses seconds', () => {
    expect(secondsToTimeString(0)).toEqual('0:00')
    expect(secondsToTimeString(1)).toEqual('0:01')
    expect(secondsToTimeString(59)).toEqual('0:59')
    expect(secondsToTimeString(159)).toEqual('2:39')
  })
})
