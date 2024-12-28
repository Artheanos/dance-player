import { RefObject } from 'react'
import { joinClasses } from '../../../utils.ts'
import classes from '../styles.module.css'
import { SvgIcon } from '../../../components/SvgIcon.tsx'

export const Bookmark = ({timestamp, duration, inputRef, active, type, onClick}: {
  timestamp: number
  duration: number
  inputRef: RefObject<HTMLInputElement>
  color?: string
  active?: boolean
  onClick?: () => void
  type: 'saved' | 'last'
}) => {
  const width = (inputRef.current?.getBoundingClientRect().width || 100)
  const offset = 0
  const left = (timestamp / duration || 0) * width + offset

  const className = joinClasses(
    classes.progressBookmark,
    active && classes.progressBookmarkActive,
    type === 'saved' && classes.progressBookmarkSaved,
    type === 'last' && classes.progressBookmarkLast,
  )

  return (
    <SvgIcon
      name="locationArrow"
      className={className}
      onClick={onClick}
      size={20}
      style={{
        left,
      }}
    />
  )
}