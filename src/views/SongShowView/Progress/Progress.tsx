import classes from '../styles.module.css'
import { secondsToTimeString, UseBookmarksReturn } from '../utils.ts'
import { Bookmark } from './Bookmark.tsx'
import { useRef } from 'react'
import { Bar } from './Bar.tsx'

type Props = {
  audioPlayer: HTMLMediaElement
  bookmarks: UseBookmarksReturn
}

export const Progress = ({audioPlayer, bookmarks}: Props) => {
  const barInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={classes.progressContainer}>
      <span className={classes.progressTime}>
        {secondsToTimeString(audioPlayer.currentTime)}
      </span>

      <div className={classes.progressInput}>
        <Bar
          value={(audioPlayer.currentTime * 100 / audioPlayer.duration) || 0}
          setValue={(newPercentage) => {
            const newTime = newPercentage / 100 * audioPlayer.duration
            bookmarks.setLast(newTime)
            audioPlayer.currentTime = newTime
          }}
          inputRef={barInputRef}
        />

        {bookmarks.last !== null && (
          <Bookmark
            inputRef={barInputRef}
            timestamp={bookmarks.last}
            duration={audioPlayer.duration}
            type="last"
          />
        )}

        {
          bookmarks.saved.map((bookmark, index) => (
            <Bookmark
              active={bookmark === bookmarks.closestLeftSaved}
              inputRef={barInputRef}
              key={index}
              timestamp={bookmark}
              duration={audioPlayer.duration}
              type="saved"
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

