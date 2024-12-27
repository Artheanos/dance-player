import classes from '../styles.module.css'
import { MouseEvent, RefObject, TouchEvent, useEffect, useState } from 'react'

type Props = {
  value: number
  setValue: (value: number) => void
  inputRef: RefObject<HTMLInputElement>
}

export const Bar = ({value, setValue, inputRef}: Props) => {
  const [mouseIsDown, setMouseIsDown] = useState(false)
  const width = inputRef.current?.getBoundingClientRect().width || 0
  const left = value / 100 * width

  const setValueFromEvent = (event: DivInteractEvent) => {
    const left = getDistanceFromLeft(inputRef.current!, event)
    let newValue = left * 100 / width
    newValue = Math.max(0, Math.min(100, newValue))
    setValue(newValue)
  }

  const onTouchStart = (e: DivInteractEvent) => {
    e.preventDefault()
    setMouseIsDown(true)
    setValueFromEvent(e)
  }

  useEffect(() => {
    const onMouseMove = (e: DOMMouseEvent) => {
      e.preventDefault()
      if (mouseIsDown) {
        setValueFromEvent(e)
      }
    }

    const onMouseUp = () => {
      setMouseIsDown(false)
    }

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)

    return () => {
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousemove', onMouseMove)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, mouseIsDown, setMouseIsDown])

  return (
    <div
      className={classes.progressBar}
      ref={inputRef}
      onTouchStart={onTouchStart}
      onMouseDown={onTouchStart}
    >
      <div
        className={classes.progressBarFilling}
        style={{width: left}}
      />

      <div
        style={{left}}
        className={classes.progressBarPointer}
      />
    </div>
  )
}

const getDistanceFromLeft = (element: HTMLDivElement, event: DivInteractEvent): number => {
  if (isTouchEvent(event)) {
    return event.changedTouches[0].clientX - element.getBoundingClientRect().left
  } else {
    return event.clientX - element.getBoundingClientRect().left
  }
}

const isTouchEvent = (e: DivInteractEvent): e is DivTouchEvent => e.type.startsWith('touch')

type DivInteractEvent = DivMouseEvent | DivTouchEvent | DOMMouseEvent
type DivTouchEvent = TouchEvent<HTMLDivElement>
type DivMouseEvent = MouseEvent<HTMLDivElement>
type DOMMouseEvent = globalThis.MouseEvent
