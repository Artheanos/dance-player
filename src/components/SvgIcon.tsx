import { SVGProps } from 'react'

import { PauseIcon } from '../assets/icons/PauseIcon'
import { PlayIcon } from '../assets/icons/PlayIcon'
import { BookmarkIcon } from '../assets/icons/BookmarkIcon'
import { ArrowLeftIcon } from '../assets/icons/ArrowLeftIcon'
import { ArrowRightIcon } from '../assets/icons/ArrowRightIcon'
import { TrashIcon } from '../assets/icons/TrashIcon'
import { UploadIcon } from '../assets/icons/UploadIcon.tsx'

type Props = {
  name: keyof typeof icons
  size?: number
} & SVGProps<SVGSVGElement>

export const SvgIcon = ({size = 16, name, ...rest}: Props) => {
  const Icon = icons[name]

  return <Icon width={size} height={size} {...rest}/>
}

export const SvgIconButton = ({size = 16, name, style, ...rest}: Props) => {
  return (
    <div className="svg-icon-button" style={style}>
      <SvgIcon size={size} name={name} {...rest}/>
    </div>
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
}
