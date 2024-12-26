import { ChangeEvent, HTMLProps, ReactNode, useState } from 'react'
import { audioStoreKey, DbSong } from '../../db'
import { Link, useNavigate } from 'react-router'
import { navigationPaths } from '../../navigationPaths'
import { dbDelete, dbStore, useDbList } from './utils'
import { SvgIconButton } from '../../components/SvgIcon'
import { TextInput } from '../../components/forms/TextInput.tsx'
import { joinClasses } from '../../utils.ts'

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
      alert('Wrong file type')
      return
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
    <div style={{
      height: '100dvh',
      width: 'auto',
      display: 'flex',
      alignContent: 'start',
      flexWrap: 'wrap',
      gap: '24px',
    }}>
      <div
        style={{
          minWidth: '300px',
          maxWidth: '420px',
          width: '100%',
          flex: 1,
        }}
      >
        <h2 style={{textAlign: 'left', marginTop: 0}}>Your songs</h2>
        <ul style={{padding: 0}}>
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

      <div
        style={{
          border: '1px solid var(--color-primary-3)',
          borderRadius: '8px',
          boxSizing: 'border-box',
          minWidth: '200px',
          maxWidth: '380px',
          width: '100%',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '12px',
        }}
      >
        <div style={{display: 'flex', alignItems: 'end', gap: '12px'}}>
          <label htmlFor="file-upload" className="file-upload" style={{textWrap: 'nowrap'}}>
            Choose file
          </label>
          <input id="file-upload" type="file" accept="audio/mp3" onChange={onFileChange}/>

          <TextInput
            name={'fileName'}
            value={fileName}
            setValue={setFileName}
            label={'File name'}
          />
        </div>

        <div style={{width: '100%', display: 'flex', justifyContent: 'right'}}>
          <input
            type="submit"
            value="Upload"
            onClick={onSubmit}
            disabled={!file || !file.name}
          />
        </div>
      </div>
    </div>
  )
}

const ListItem = ({children, clickable, ...rest}: {
  children: ReactNode,
  clickable?: boolean
} & HTMLProps<HTMLLIElement>) => (
  <li className={joinClasses('list-item', clickable && 'list-item--clickable')} {...rest}>
    {children}
  </li>
)

const SongItem = ({song, onDelete}: { song: DbSong, onDelete: () => void }) => {
  return (
    <ListItem
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 0,
      }}
      clickable
    >
      <Link
        className="link--disabled"
        to={navigationPaths.songs.single(song.id)}
        style={{
          flex: 1,
          textAlign: 'left',
          padding: '12px',
        }}
      >
        {song.name}
      </Link>

      <SvgIconButton
        size={20}
        name={'delete'}
        cursor="pointer"
        onClick={() => onDelete()}
        style={{
          marginRight: '12px',
        }}
      />
    </ListItem>
  )
}
