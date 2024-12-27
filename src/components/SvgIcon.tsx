import { ButtonHTMLAttributes, SVGProps } from 'react'

import { PauseIcon } from '../assets/icons/PauseIcon'
import { PlayIcon } from '../assets/icons/PlayIcon'
import { BookmarkIcon } from '../assets/icons/BookmarkIcon'
import { ArrowLeftIcon } from '../assets/icons/ArrowLeftIcon'
import { ArrowRightIcon } from '../assets/icons/ArrowRightIcon'
import { TrashIcon } from '../assets/icons/TrashIcon'
import { UploadIcon } from '../assets/icons/UploadIcon.tsx'
import { PencilIcon } from '../assets/icons/PencilIcon.tsx'
import { LocationArrowIcon } from '../assets/icons/LocationArrowIcon.tsx'
import { joinClasses } from '../utils.ts'

type Props = {
  name: keyof typeof icons
  size?: number
} & SVGProps<SVGSVGElement>

export const SvgIcon = ({size = 16, name, ...rest}: Props) => {
  const Icon = icons[name]

  return <Icon width={size} height={size} {...rest}/>
}

type SvgIconButtonProps = Props & {
  active?: boolean
  onClick: ButtonHTMLAttributes<HTMLButtonElement>['onClick']
}

export const SvgIconButton = ({size = 16, name, style, active, onClick, ...rest}: SvgIconButtonProps) => {
  return (
    <button
      className={joinClasses('svg-icon-button', active && 'svg-icon-button--active')}
      style={style}
      onClick={onClick}
    >
      <SvgIcon size={size} name={name} {...rest}/>
    </button>
  )
}

const icons = {
  play: PlayIcon,
  pause: PauseIcon,
  bookmark: BookmarkIcon,
  left: ArrowLeftIcon,
  right: ArrowRightIcon,
  delete: TrashIcon,
  upload: UploadIcon,
  pencil: PencilIcon,
  locationArrow: LocationArrowIcon,
}
