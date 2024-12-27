import { ButtonHTMLAttributes } from 'react'
import classes from '../styles.module.css'

export const ControlsButton = ({children, ...rest}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={classes.controlsButton}
      {...rest}
    >
      {children}
    </button>
  )
}