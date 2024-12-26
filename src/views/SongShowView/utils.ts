export const findClosest = (array: number[], value: number, type: '<' | '>'): number => {
  let smallestDiff = null
  let result = null

  for (const item of array) {
    let potentialDiff = null

    if (type === '<' && item < value - 0.000001) {
      potentialDiff = value - item
    } else if (type === '>' && item > value + .000001) {
      potentialDiff = item - value
    } else {
      continue
    }

    if (smallestDiff === null || potentialDiff < smallestDiff) {
      smallestDiff = potentialDiff
      result = item
    }
  }

  return result || -1
}
