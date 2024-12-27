import classes from '../styles.module.css'
import { ControlsButton } from './ControlsButton.tsx'
import { SvgIcon } from '../../../components/SvgIcon.tsx'
import { UseBookmarksReturn } from '../utils.ts'

type Props = {
  audioPlayer: HTMLMediaElement
  bookmarks: UseBookmarksReturn
  refreshState: () => void
}

export const Controls = ({audioPlayer, bookmarks, refreshState}: Props) => {
  return (
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
          onClick={() => audioPlayer.currentTime = bookmarks.closestLeft}
        >
          <SvgIcon name={'left'}/>
        </ControlsButton>

        <ControlsButton
          disabled={bookmarks.last === null}
          onClick={() => {
            if (bookmarks.last !== null) {
              bookmarks.addSaved(bookmarks.last)
              bookmarks.setLast(null)
            }
          }}
        >
          <SvgIcon name="bookmark"/>
          +
        </ControlsButton>

        <ControlsButton
          disabled={bookmarks.closestLeftSaved === -1}
          onClick={() => {
            bookmarks.removeSaved(bookmarks.closestLeftSaved)
          }}
        >
          <SvgIcon name="bookmark"/>
          -
        </ControlsButton>

        <ControlsButton
          onClick={() => audioPlayer.currentTime = bookmarks.closestRight}
          disabled={bookmarks.closestRight === -1}
        >
          <SvgIcon name={'right'}/>
        </ControlsButton>
      </div>
    </div>
  )
}