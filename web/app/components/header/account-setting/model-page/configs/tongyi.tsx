import { ProviderEnum } from '../declarations'
import type { ProviderConfig } from '../declarations'
import { Tongyi, TongyiText, TongyiTextCn } from '@/app/components/base/icons/src/image/llm'

const config: ProviderConfig = {
  item: {
    key: ProviderEnum.tongyi,
    titleIcon: {
      'en': <TongyiText className='w-[88px] h-6' />,
      'zh-Hans': <TongyiTextCn className='w-[100px] h-6' />,
    },
  },
  modal: {
    key: ProviderEnum.tongyi,
    title: {
      'en': 'Setup Tongyi',
      'zh-Hans': '设置通义千问',
    },
    icon: <Tongyi className='w-6 h-6' />,
    link: {
      href: 'https://docs.dify.ai',
      label: {
        'en': 'Get your API key from AliCloud',
        'zh-Hans': '从阿里云获取 API Key',
      },
    },
    validateKeys: ['dashscope_api_key'],
    fields: [
      {
        type: 'text',
        key: 'dashscope_api_key',
        required: true,
        label: {
          'en': 'API Key',
          'zh-Hans': 'API Key',
        },
        placeholder: {
          'en': 'Enter your API key here',
          'zh-Hans': '在此输入您的 API Key',
        },
      },
    ],
  },
}

export default config
