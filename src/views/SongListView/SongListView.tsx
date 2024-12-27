import { ChangeEvent, useState } from 'react'
import { audioStoreKey, DbSong } from '../../db'
import { useNavigate } from 'react-router'
import { navigationPaths } from '../../navigationPaths'
import { dbDelete, dbStore, useDbList } from './utils'
import { TextInput } from '../../components/forms/TextInput.tsx'
import classes from './styles.module.css'
import { FileInput } from './FileInput.tsx'
import { ListItem } from './ListItem.tsx'
import { SongItem } from './SongItem.tsx'

export const SongListView = () => {
  const songs = useDbList(audioStoreKey)

  const [fileName, setFileName] = useState('')
  const [file, setFile] = useState<File>()

  const navigate = useNavigate()

  const onDelete = (song: DbSong) => {
    const confirmed = confirm(`Are you sure you want to delete ${song.name}`)
    if (confirmed) {
      dbDelete(song.id, {onSuccess: () => songs.refetch()})
    }
  }

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith('audio/')) {
      return alert('Wrong file type')
    }

    if (!fileName) setFileName(file.name.split('.').slice(0, -1).join('.'))

    setFile(file)
  }

  const onSubmit = () => {
    if (!file || !fileName) {
      return alert('Empty values detected')
    }

    dbStore({
      name: fileName,
      file,
      onSuccess: (key) => {
        setFile(undefined)
        setFileName('')
        navigate(navigationPaths.songs.single(key))
      },
    })
  }

  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        <h2 className={classes.listHeader}>Your songs</h2>
        <ul className={classes.listUl}>
          {songs.data?.map((song) => (
            <SongItem
              key={song.id}
              song={song}
              onDelete={() => onDelete(song)}
            />
          ))}
          {!songs.data?.length && <ListItem>Empty</ListItem>}
        </ul>
      </div>

      <div className={classes.uploadContainer}>
        <div className={classes.uploadInputs}>
          <FileInput
            name={'file'}
            onChange={onFileChange}
            accept={'audio/mp3'}
          />

          <TextInput
            name={'fileName'}
            value={fileName}
            setValue={setFileName}
            label={'File name'}
            fullWidth
          />
        </div>

        <div className={classes.uploadSubmitButton}>
          <input
            type="submit"
            value="Create"
            onClick={onSubmit}
            disabled={!file || !file.name}
          />
        </div>
      </div>
    </div>
  )
}

