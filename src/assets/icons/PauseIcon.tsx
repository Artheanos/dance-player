import { SVGProps } from 'react'

export const PauseIcon = ({...props}: SVGProps<SVGSVGElement>) => (
  <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8 5V19M16 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
