import { RefObject } from 'react'

export const Bookmark = ({timestamp, duration, inputRef, color, active}: {
  timestamp: number
  duration: number
  inputRef: RefObject<HTMLInputElement>
  color?: string
  active?: boolean
}) => {
  const width = (inputRef.current?.getBoundingClientRect().width || 100) - 15
  const offset = 8
  const left = (timestamp / duration || 0) * width + offset

  return (
    <div
      style={{
        left,
        position: 'absolute',
        width: active ? '4px' : '2px',
        height: active ? '12px' : '10px',
        backgroundColor: color,
      }}
    />
  )
}