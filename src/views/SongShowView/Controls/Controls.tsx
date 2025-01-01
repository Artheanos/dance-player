import classes from '../styles.module.css'
import { ControlsButton } from './ControlsButton.tsx'
import { SvgIcon } from '../../../components/SvgIcon.tsx'
import { UseBookmarksReturn } from '../utils.ts'

type Props = {
  audioPlayer: HTMLMediaElement
  bookmarks: UseBookmarksReturn
  refreshState: () => void
}

export const Controls = (props: Props) => {
  return (
    <div className={classes.controlsContainer} role="rowgroup">
      <div className={classes.controlsRow} role="row">
        <ButtonLeft {...props} />

        <ButtonPlayerPause {...props} />

        <ButtonRight {...props} />
      </div>

      <div className={classes.controlsRow} role="row">
        <ButtonSkipLeft {...props} />

        <ButtonRemoveBookmark {...props}/>

        <ButtonAddBookmark {...props}/>

        <ButtonSkipRight {...props} />
      </div>
    </div>
  )
}

const ButtonLeft = ({audioPlayer, bookmarks}: Props) => {
  return (
    <ControlsButton
      onClick={() => audioPlayer.currentTime = bookmarks.closestLeft}
    >
      <SvgIcon name={'left'}/>
    </ControlsButton>
  )
}

const ButtonPlayerPause = ({audioPlayer, refreshState}: Props) => {
  return (
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
  )
}

const ButtonRight = ({audioPlayer, bookmarks}: Props) => {
  return (
    <ControlsButton
      onClick={() => audioPlayer.currentTime = bookmarks.closestRight}
      disabled={bookmarks.closestRight === -1}
    >
      <SvgIcon name={'right'}/>
    </ControlsButton>
  )
}

const ButtonSkipLeft = ({audioPlayer}: Props) => (
  <ControlsButton
    onClick={() => {
      audioPlayer.currentTime -= 5
    }}
  >
    -5
  </ControlsButton>
)

const ButtonSkipRight = ({audioPlayer}: Props) => (
  <ControlsButton
    onClick={() => {
      audioPlayer.currentTime += 5
    }}
  >
    +5
  </ControlsButton>
)

const ButtonRemoveBookmark = ({bookmarks}: Props) => (
  <ControlsButton
    disabled={bookmarks.closestLeftSaved === -1}
    onClick={() => {
      bookmarks.removeSaved(bookmarks.closestLeftSaved)
    }}
  >
    <SvgIcon name="bookmark"/>
    -
  </ControlsButton>
)

const ButtonAddBookmark = ({bookmarks}: Props) => (
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
)
