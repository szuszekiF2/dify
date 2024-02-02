import type { FC } from 'react'
import { memo } from 'react'

type HeaderProps = {
  title: string
}
const Header: FC<HeaderProps> = ({
  title,
}) => {
  return (
    <div className='sticky top-0 flex items-center px-8 h-16 bg-white/80 text-base font-medium text-gray-900 border-b-[0.5px] border-b-gray-100 backdrop-blur-md z-10'>
      {title}
    </div>
  )
}

export default memo(Header)
