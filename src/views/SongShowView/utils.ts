import { useEffect, useState } from 'react'
import { audioStoreKey, db, DbSong } from '../../db.ts'
import { fatalError } from '../../utils.ts'

export const useBookmarks = (currentTime: number = 0) => {
  const [saved, setSaved] = useState<number[]>([])
  const [last, setLast] = useState<number | null>(null)
  const all = last ? saved.concat(last) : saved

  const closestLeft = findClosest(all, currentTime - 0.5, '<')
  const closestRight = findClosest(all, currentTime, '>')
  const closestLeftSaved = findClosest(saved, currentTime - 0.5, '<')

  const addSaved = (bookmark: number) => setSaved(prev => prev.concat(bookmark))
  const removeSaved = (bookmark: number) => setSaved(prev => prev.filter(i => i !== bookmark))

  return {
    last,
    setLast,
    saved,
    addSaved,
    removeSaved,
    closestLeft,
    closestRight,
    closestLeftSaved,
  }
}

export type UseBookmarksReturn = ReturnType<typeof useBookmarks>

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
        fatalError('Song not found')
      }
    }

    request.onerror = () => {
      fatalError('Error fetching song by ID')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return {data: song, set: setSong}
}

export const dbUpdateSong = (song: DbSong, {onSuccess}: { onSuccess?: () => void }) => {
  const transaction = db.transaction(audioStoreKey, 'readwrite')
  const store = transaction.objectStore(audioStoreKey)
  const request = store.put(song)

  request.onsuccess = () => {
    onSuccess?.()
  }

  request.onerror = () => {
    fatalError('Error fetching song by ID')
  }
}

export const secondsToTimeString = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
