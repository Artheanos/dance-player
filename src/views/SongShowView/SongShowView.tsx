import { useParams } from 'react-router'
import { ReactEventHandler, useRef } from 'react'
import { useBookmarks, useDbFetchSong, useRerender } from './utils'
import classes from './styles.module.css'
import { Header } from './Header.tsx'
import { Progress } from './Progress/Progress.tsx'
import { Controls } from './Controls/Controls.tsx'

export const SongShowView = () => {
  const {id} = useParams<{ id: string }>()
  const audioRef = useRef<HTMLMediaElement>(null)
  const audioPlayer = audioRef.current!
  const refreshState = useRerender()

  const song = useDbFetchSong(id!, {
    onSuccess: (song) => {
      const audioPlayer = audioRef.current
      if (!audioPlayer) return

      audioPlayer.src = URL.createObjectURL(song.blob)
      refreshState()
    },
  })

  const bookmarks = useBookmarks(song.data, song.set, audioPlayer?.currentTime)

  const onAudioUpdate: ReactEventHandler<HTMLAudioElement> = (event) => {
    if (!event.currentTarget.duration) return

    refreshState()
  }

  return (
    <>
      <audio ref={audioRef} onTimeUpdate={onAudioUpdate} onCanPlay={refreshState} onLoadedMetadata={refreshState}/>

      {(song.data && audioPlayer) ? (
        <div className={classes.container}>
          <Header song={song.data} setSong={song.set}/>

          <div className={classes.belowHeader}>
            <Progress audioPlayer={audioPlayer} bookmarks={bookmarks}/>

            <Controls audioPlayer={audioPlayer} bookmarks={bookmarks} refreshState={refreshState}/>
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </>
  )
}


