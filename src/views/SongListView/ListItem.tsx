import { HTMLProps, ReactNode } from 'react'
import { joinClasses } from '../../utils.ts'

export const ListItem = ({children, clickable, className, ...rest}: {
  children: ReactNode,
  clickable?: boolean
} & HTMLProps<HTMLLIElement>) => (
  <li className={joinClasses('list-item', clickable && 'list-item--clickable', className)} {...rest}>
    {children}
  </li>
)