'use client'
import type { FC } from 'react'
import React, { useRef } from 'react'
import cn from 'classnames'
import Drawer from '@/app/components/base/drawer'
import { XClose } from '@/app/components/base/icons/src/vender/line/general'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'

type Props = {
  isShow: boolean
  onHide: () => void
  panelClassName?: string
  maxWidthClassName?: string
  contentClassName?: string
  headerClassName?: string
  height?: number | string
  title: string | JSX.Element
  body: JSX.Element
  foot?: JSX.Element
  isShowMask?: boolean
  clickOutsideNotOpen?: boolean
}

const DrawerPlus: FC<Props> = ({
  isShow,
  onHide,
  panelClassName = '',
  maxWidthClassName = '!max-w-[640px]',
  height = 'calc(100vh - 72px)',
  contentClassName,
  headerClassName,
  title,
  body,
  foot,
  isShowMask,
  clickOutsideNotOpen = true,
}) => {
  const ref = useRef(null)
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile

  if (!isShow)
    return null

  return (
    // clickOutsideNotOpen to fix confirm modal click cause drawer close
    <Drawer isOpen={isShow} clickOutsideNotOpen={clickOutsideNotOpen} onClose={onHide} footer={null} mask={isMobile || isShowMask} panelClassname={`mt-16 mx-2 sm:mr-2 mb-3 !p-0 ${panelClassName} ${maxWidthClassName} rounded-xl`}>
      <div
        className={cn(contentClassName, 'w-full flex flex-col bg-white border-[0.5px] border-gray-200 rounded-xl shadow-xl')}
        style={{
          height,
        }}
        ref={ref}
      >
        <div className={cn(headerClassName, 'shrink-0 flex justify-between items-center pl-6 pr-5 h-14 border-b border-b-gray-100')}>
          <div className='text-base font-semibold text-gray-900'>
            {title}
          </div>
          <div className='flex items-center'>
            <div
              onClick={onHide}
              className='flex justify-center items-center w-6 h-6 cursor-pointer'
            >
              <XClose className='w-4 h-4 text-gray-500' />
            </div>
          </div>
        </div>
        <div className='grow overflow-y-auto'>
          {body}
        </div>
        {foot && (
          <div className='shrink-0'>
            {foot}
          </div>
        )}
      </div>
    </Drawer>
  )
}
export default React.memo(DrawerPlus)
