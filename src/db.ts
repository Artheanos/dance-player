import { useEffect, useState } from 'react'

export let db: IDBDatabase

export const audioStoreKey = 'audios'

export const useInitDb = (): boolean => {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (db) return

    const request = indexedDB.open('AudioDB', 2)

    request.onupgradeneeded = (event) => {
      const _db = (event.target as IDBOpenDBRequest).result
      if (!_db.objectStoreNames.contains(audioStoreKey)) {
        _db.createObjectStore(audioStoreKey, {keyPath: 'id', autoIncrement: true})
      }
    }

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result
      setReady(true)
    }

    request.onerror = () => {
      alert('Error initializing IndexedDB')
    }
  }, [])

  return ready
}

export type DbSong = {
  id: number,
  name: string,
  blob: File
}