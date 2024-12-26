import { useParams } from 'react-router'
import { ReactEventHandler, useRef, useState } from 'react'
import { SvgIcon } from '../../components/SvgIcon'
import { findClosest, secondsToTimeString, useDbFetchSong, useRerender } from './utils'
import classes from './styles.module.css'
import { Bookmark } from './Bookmark.tsx'
import { ControlsButton } from './ControlsButton.tsx'

export const SongShowView = () => {
  const {id} = useParams<{ id: string }>()
  const audioRef = useRef<HTMLMediaElement>(null)
  const audioPlayer = audioRef.current!
  const inputRef = useRef<HTMLInputElement>(null)

  const refreshState = useRerender()
  const [savedBookmarks, setSavedBookmarks] = useState<number[]>([])
  const [lastBookmark, setLastBookmark] = useState<number | null>(null)
  const allBookmarks = lastBookmark ? savedBookmarks.concat(lastBookmark) : savedBookmarks

  const currentTime = audioPlayer?.currentTime || 0
  const closestLeftSavedBookmark = findClosest(savedBookmarks, currentTime - 0.5, '<')

  const closestLeftBookmark = findClosest(allBookmarks, currentTime - 0.5, '<')
  const closestRightBookmark = findClosest(allBookmarks, currentTime, '>')

  const song = useDbFetchSong(id!, {
    onSuccess: (song) => {
      const audioPlayer = audioRef.current
      if (!audioPlayer) return

      audioPlayer.src = URL.createObjectURL(song.blob)
      refreshState()
    },
  })

  const onAudioUpdate: ReactEventHandler<HTMLAudioElement> = (event) => {
    if (!event.currentTarget.duration) return

    refreshState()
  }

  return (
    <>
      <audio ref={audioRef} onTimeUpdate={onAudioUpdate} onCanPlay={refreshState}/>

      {(song && audioPlayer) ? (
        <div className={classes.container}>
          <h1 className={classes.header}>{song.name}</h1>

          <div className={classes.belowHeader}>
            <div className={classes.progressContainer}>
            <span className={classes.progressTime}>
              {secondsToTimeString(audioPlayer.currentTime)}
            </span>

              <div className={classes.progressInput}>
                <input
                  ref={inputRef}
                  style={{width: '100%'}}
                  step={0.1}
                  type="range"
                  value={(audioPlayer.currentTime * 100 / audioPlayer.duration) || 0}
                  onChange={(e) => {
                    const newPercentage = Number(e.target.value)
                    const newTime = newPercentage / 100 * audioPlayer.duration
                    setLastBookmark(newTime)
                    audioPlayer.currentTime = newTime
                  }}
                />

                {lastBookmark && (
                  <Bookmark
                    inputRef={inputRef}
                    timestamp={lastBookmark}
                    duration={audioPlayer.duration}
                    color={'red'}
                  />
                )}

                {
                  savedBookmarks.map((bookmark, index) => (
                    <Bookmark
                      active={bookmark === closestLeftSavedBookmark}
                      inputRef={inputRef}
                      key={index}
                      timestamp={bookmark}
                      duration={audioPlayer.duration}
                      color={'yellow'}
                    />
                  ))
                }
              </div>

              <span className={classes.progressTime}>
              {secondsToTimeString(audioPlayer.duration)}
            </span>
            </div>
            <div className={classes.controlsContainer}>
              <div className={classes.controlsRow}>
                <ControlsButton
                  onClick={() => {
                    audioPlayer.currentTime -= 5
                  }}
                >
                  -5
                </ControlsButton>
                <ControlsButton
                  onClick={() => {
                    if (audioPlayer.paused) {
                      audioPlayer.play()
                    } else {
                      audioPlayer.pause()
                    }
                    refreshState()
                  }}
                >
                  <SvgIcon name={audioPlayer.paused ? 'play' : 'pause'} size={20}/>
                </ControlsButton>
                <ControlsButton
                  onClick={() => {
                    audioPlayer.currentTime += 5
                  }}
                >
                  +5
                </ControlsButton>
              </div>

              <div className={classes.controlsRow}>
                <ControlsButton
                  onClick={() => audioPlayer.currentTime = closestLeftBookmark}
                >
                  <SvgIcon name={'left'}/>
                </ControlsButton>

                <ControlsButton
                  disabled={lastBookmark === null}
                  onClick={() => {
                    if (lastBookmark !== null) {
                      setSavedBookmarks(prev => prev.concat(lastBookmark))
                      setLastBookmark(null)
                    }
                  }}
                >
                  <SvgIcon name="bookmark"/>
                  +
                </ControlsButton>

                <ControlsButton
                  disabled={closestLeftSavedBookmark === -1}
                  onClick={() => {
                    setSavedBookmarks(prev => prev.filter(bookmark => bookmark !== closestLeftSavedBookmark))
                  }}
                >
                  <SvgIcon name="bookmark"/>
                  -
                </ControlsButton>

                <ControlsButton
                  onClick={() => audioPlayer.currentTime = closestRightBookmark}
                  disabled={closestRightBookmark === -1}
                >
                  <SvgIcon name={'right'}/>
                </ControlsButton>
              </div>
            </div>
          </div>
        </div>
      ) : (
        'Loading...'
      )}
    </>
  )
}


