import { SVGProps } from 'react'

export const ArrowLeftIcon = ({...props}: SVGProps<SVGSVGElement>) => (
  <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 12H19M5 12L11 6M5 12L11 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round"/>
  </svg>
)
