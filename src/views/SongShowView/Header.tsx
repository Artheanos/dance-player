import classes from './styles.module.css'
import { SvgIconButton } from '../../components/SvgIcon.tsx'
import { DbSong } from '../../db.ts'
import { useLocation, useNavigate } from 'react-router'
import { FormEvent, useState } from 'react'
import { TextInput } from '../../components/forms/TextInput.tsx'
import { dbUpdateSong } from './utils.ts'
import { StateSetter } from '../../utils.ts'
import { navigationPaths } from '../../navigationPaths.ts'

export const Header = ({song, setSong}: { song: DbSong, setSong: StateSetter<DbSong | undefined> }) => {
  const [editing, setEditing] = useState(false)
  const [editingText, setEditingText] = useState(song.name)
  const goBack = useGoBackToSongList()

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!editingText) return alert('Name is empty')

    const newSong = {...song, name: editingText}

    dbUpdateSong(newSong, {
      onSuccess: () => {
        setEditing(false)
        setSong(newSong)
      },
    })
  }

  const onEditClick = () => {
    if (editing) {
      setEditing(false)
      setEditingText(song.name)
    } else {
      setEditing(true)
    }
  }

  return (
    <div className={classes.headerContainer}>
      <div className={classes.headerControls}>
        <SvgIconButton name={'left'} size={24} onClick={goBack}/>
        <SvgIconButton name={'pencil'} size={24} onClick={onEditClick} active={editing}/>
      </div>

      {editing ? (
        <form onSubmit={onSubmit}>
          <TextInput name={'fileName'} value={editingText} label={'Name'} setValue={setEditingText} fullWidth/>
          <input type="submit" value="Save"/>
        </form>
      ) : (
        <h1 className={classes.header}>
          {song.name}
        </h1>
      )}
    </div>
  )
}

const useGoBackToSongList = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return () => {
    const canGoBack = location.key !== 'default'
    if (canGoBack) {
      navigate(-1)
    } else {
      navigate(navigationPaths.songs.root)
    }
  }
}