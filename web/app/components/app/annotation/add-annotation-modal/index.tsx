'use client'
import type { FC } from 'react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AnnotationItemBasic } from '../type'
import EditItem, { EditItemType } from './edit-item'
import Drawer from '@/app/components/base/drawer-plus'
import Button from '@/app/components/base/button'
import Toast from '@/app/components/base/toast'

type Props = {
  isShow: boolean
  onHide: () => void
  onAdd: (payload: AnnotationItemBasic) => void
}

const AddAnnotationModal: FC<Props> = ({
  isShow,
  onHide,
  onAdd,
}) => {
  const { t } = useTranslation()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isCreateNext, setIsCreateNext] = useState(false)

  const isValid = (payload: AnnotationItemBasic) => {
    if (!payload.question)
      return t('appAnnotation.errorMessage.queryRequired')

    if (!payload.answer)
      return t('appAnnotation.errorMessage.answerRequired')

    return true
  }

  const handleSave = () => {
    const payload = {
      question,
      answer,
    }
    if (isValid(payload) !== true) {
      Toast.notify({
        type: 'error',
        message: isValid(payload) as string,
      })
      return
    }
    onAdd(payload)
    if (isCreateNext) {
      setQuestion('')
      setAnswer('')
    }
    else {
      onHide()
    }
  }
  return (
    <div>
      <Drawer
        isShow={isShow}
        onHide={onHide}
        maxWidthClassName='!max-w-[480px]'
        title={t('appAnnotation.addModal.title') as string}
        body={(
          <div className='p-6 pb-4 space-y-6'>
            <EditItem
              type={EditItemType.Query}
              content={question}
              onChange={setQuestion}
            />
            <EditItem
              type={EditItemType.Answer}
              content={answer}
              onChange={setAnswer}
            />
          </div>
        )}
        foot={
          (
            <div className='px-4 flex h-16 items-center justify-between border-t border-black/5 bg-gray-50 rounded-bl-xl rounded-br-xl leading-[18px] text-[13px] font-medium text-gray-500'>
              <div
                className='flex items-center space-x-2'
              >
                <input type="checkbox" checked={isCreateNext} onChange={() => setIsCreateNext(!isCreateNext)} className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-blue-700" />
                <div>{t('appAnnotation.addModal.createNext')}</div>
              </div>
              <div className='mt-2 flex space-x-2'>
                <Button className='!h-7 !text-xs !font-medium' type='primary' onClick={handleSave}>{t('common.operation.save')}</Button>
                <Button className='!h-7 !text-xs !font-medium' onClick={onHide}>{t('common.operation.cancel')}</Button>
              </div>
            </div>
          )
        }
      >
      </Drawer>
    </div>
  )
}
export default React.memo(AddAnnotationModal)
