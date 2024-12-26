import { useParams } from 'react-router'
import { ReactEventHandler, RefObject, useEffect, useRef, useState } from 'react'
import { audioStoreKey, db, DbSong } from '../../db'
import { SvgIcon } from '../../components/SvgIcon'
import { findClosest } from './utils'
import classes from './styles.module.css'

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
                <button
                  className={classes.controlsButton}
                  onClick={() => {
                  audioPlayer.currentTime -= 5
                }}
                >
                  -5
                </button>
                <button
                  className={classes.controlsButton}
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
                </button>
                <button
                  className={classes.controlsButton}
                  onClick={() => {
                  audioPlayer.currentTime += 5
                }}
                >+5
                </button>
              </div>

              <div className={classes.controlsRow}>
                <button
                  className={classes.controlsButton}
                  onClick={() => audioPlayer.currentTime = closestLeftBookmark}
                >
                  <SvgIcon name={'left'}/>
                </button>

                <button
                  className={classes.controlsButton}
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
                </button>

                <button
                  className={classes.controlsButton}
                  disabled={closestLeftSavedBookmark === -1}
                  onClick={() => {
                    setSavedBookmarks(prev => prev.filter(bookmark => bookmark !== closestLeftSavedBookmark))
                  }}
                >
                  <SvgIcon name="bookmark"/>
                  -
                </button>

                <button
                  className={classes.controlsButton}
                  onClick={() => audioPlayer.currentTime = closestRightBookmark}
                  disabled={closestRightBookmark === -1}
                >
                  <SvgIcon name={'right'}/>
                </button>

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

const Bookmark = ({timestamp, duration, inputRef, color}: {
  timestamp: number,
  duration: number,
  inputRef: RefObject<HTMLInputElement>,
  color?: string
}) => {
  const width = (inputRef.current?.getBoundingClientRect().width || 100) - 15
  const offset = 8
  const left = (timestamp / duration || 0) * width + offset

  return (
    <div
      style={{
        left,
        position: 'absolute',
        width: '2px',
        height: '10px',
        backgroundColor: color,
      }}
    />
  )
}

const useRerender = () => {
  const [, setState] = useState(0)
  return () => setState(prev => prev + 1)
}

const useDbFetchSong = (id: string, {onSuccess}: { onSuccess?: (song: DbSong) => void }) => {
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

const secondsToTimeString = (seconds: number) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`
