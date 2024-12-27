import classes from '../styles.module.css'
import { secondsToTimeString, UseBookmarksReturn } from '../utils.ts'
import { Bookmark } from './Bookmark.tsx'
import { useRef } from 'react'

type Props = {
  audioPlayer: HTMLMediaElement
  bookmarks: UseBookmarksReturn
}

export const Progress = ({audioPlayer, bookmarks}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
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
            bookmarks.setLast(newTime)
            audioPlayer.currentTime = newTime
          }}
        />

        {bookmarks.last && (
          <Bookmark
            inputRef={inputRef}
            timestamp={bookmarks.last}
            duration={audioPlayer.duration}
            type='last'
          />
        )}

        {
          bookmarks.saved.map((bookmark, index) => (
            <Bookmark
              active={bookmark === bookmarks.closestLeftSaved}
              inputRef={inputRef}
              key={index}
              timestamp={bookmark}
              duration={audioPlayer.duration}
              type='saved'
            />
          ))
        }
      </div>

      <span className={classes.progressTime}>
        {secondsToTimeString(audioPlayer.duration)}
      </span>
    </div>
  )
}
