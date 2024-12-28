import { audioStoreKey, db, DbSong } from '../../db'
import { useEffect, useState } from 'react'
import { fatalError } from '../../utils.ts'

export const dbStore = ({name, file, onSuccess}: {
  name: string,
  file: File,
  onSuccess: (id: IDBValidKey) => unknown
}) => {
  if (!db) {
    return fatalError('Database is not initialized')
  }

  const transaction = db.transaction(audioStoreKey, 'readwrite')
  const store = transaction.objectStore(audioStoreKey)
  const fileBlob = new Blob([file], {type: file.type})
  const request = store.add({name, blob: fileBlob, bookmarks: []})

  request.onsuccess = () => {
    onSuccess(request.result)
  }

  request.onerror = () => {
    fatalError('Error storing file.')
  }
}

export const dbDelete = (id: IDBValidKey, {onSuccess}: { onSuccess?: () => void }) => {
  if (!db) {
    return fatalError('Database is not initialized')
  }

  const transaction = db.transaction(audioStoreKey, 'readwrite')
  const store = transaction.objectStore(audioStoreKey)
  const request = store.delete(id)

  request.onsuccess = () => {
    onSuccess?.()
  }

  request.onerror = () => {
    fatalError(`Failed to delete entry with ID ${id}`)
  }
}

export const useDbList = (listName: string) => {
  const [result, setResult] = useState<DbSong[]>()

  const fetch = () => {
    const transaction = db.transaction(listName, 'readonly')
    const store = transaction.objectStore(listName)
    const request = store.getAll()

    request.onsuccess = () => {
      setResult(request.result)
    }
  }

  useEffect(() => {
    if (!db) {
      return fatalError('Database is not initialized')
    }

    fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db, listName])

  return {data: result, refetch: fetch}
}
