import { useEffect, useState } from 'react'
import { audioStoreKey, db, DbSong } from '../../db.ts'

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

export const useRerender = () => {
  const [, setState] = useState(0)
  return () => setState(prev => prev + 1)
}

export const useDbFetchSong = (id: string, {onSuccess}: { onSuccess?: (song: DbSong) => void }) => {
  const [song, setSong] = useState<DbSong>()

  useEffect(() => {
    const transaction = db.transaction(audioStoreKey, 'readonly')
    const store = transaction.objectStore(audioStoreKey)
    const request = store.get(Number(id))

    request.onsuccess = () => {
      const song = request.result
      if (song) {
        setSong(song)
        onSuccess?.(song)
      } else {
        console.error('Song not found')
      }
    }

    request.onerror = () => {
      console.error('Error fetching song by ID')
    }
  }, [id])

  return song
}

export const secondsToTimeString = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
