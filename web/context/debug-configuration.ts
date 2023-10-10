import { createContext } from 'use-context-selector'
import { PromptMode } from '@/models/debug'
import type { BlockStatus, ChatModelPromptConfig, CitationConfig, CompletionModelPromptConfig, CompletionParams, DatasetConfigs, Inputs, ModelConfig, MoreLikeThisConfig, PromptConfig, PromptItem, SpeechToTextConfig, SuggestedQuestionsAfterAnswerConfig } from '@/models/debug'
import type { DataSet } from '@/models/datasets'
import { ModelModeType } from '@/types/app'

type IDebugConfiguration = {
  appId: string
  hasSetAPIKEY: boolean
  isTrailFinished: boolean
  mode: string
  modelModeType: ModelModeType
  promptMode: PromptMode
  setPromptMode: (promptMode: PromptMode) => void
  isAdvancedMode: boolean
  canReturnToSimpleMode: boolean
  setCanReturnToSimpleMode: (canReturnToSimpleMode: boolean) => void
  currentAdvancedPrompt: PromptItem | PromptItem[]
  setCurrentAdvancedPrompt: (prompt: PromptItem | PromptItem[]) => void
  chatModelPromptConfig: ChatModelPromptConfig
  setChatModelPromptConfig: (config: ChatModelPromptConfig) => void
  completionModelPromptConfig: CompletionModelPromptConfig
  setCompletionModelPromptConfig: (config: CompletionModelPromptConfig) => void
  hasSetBlockStatus: BlockStatus
  conversationId: string | null // after first chat send
  setConversationId: (conversationId: string | null) => void
  introduction: string
  setIntroduction: (introduction: string) => void
  controlClearChatMessage: number
  setControlClearChatMessage: (controlClearChatMessage: number) => void
  prevPromptConfig: PromptConfig
  setPrevPromptConfig: (prevPromptConfig: PromptConfig) => void
  moreLikeThisConfig: MoreLikeThisConfig
  setMoreLikeThisConfig: (moreLikeThisConfig: MoreLikeThisConfig) => void
  suggestedQuestionsAfterAnswerConfig: SuggestedQuestionsAfterAnswerConfig
  setSuggestedQuestionsAfterAnswerConfig: (suggestedQuestionsAfterAnswerConfig: SuggestedQuestionsAfterAnswerConfig) => void
  speechToTextConfig: SpeechToTextConfig
  setSpeechToTextConfig: (speechToTextConfig: SpeechToTextConfig) => void
  citationConfig: CitationConfig
  setCitationConfig: (citationConfig: CitationConfig) => void
  formattingChanged: boolean
  setFormattingChanged: (formattingChanged: boolean) => void
  inputs: Inputs
  setInputs: (inputs: Inputs) => void
  query: string // user question
  setQuery: (query: string) => void
  // Belows are draft infos
  completionParams: CompletionParams
  setCompletionParams: (completionParams: CompletionParams) => void
  // model_config
  modelConfig: ModelConfig
  setModelConfig: (modelConfig: ModelConfig) => void
  dataSets: DataSet[]
  setDataSets: (dataSet: DataSet[]) => void
  showSelectDataSet: () => void
  // dataset config
  datasetConfigs: DatasetConfigs
  setDatasetConfigs: (config: DatasetConfigs) => void
  hasSetContextVar: boolean
}

const DebugConfigurationContext = createContext<IDebugConfiguration>({
  appId: '',
  hasSetAPIKEY: false,
  isTrailFinished: false,
  mode: '',
  modelModeType: ModelModeType.chat,
  promptMode: PromptMode.simple,
  setPromptMode: () => { },
  isAdvancedMode: false,
  canReturnToSimpleMode: false,
  setCanReturnToSimpleMode: () => { },
  chatModelPromptConfig: {
    context: {
      hasSet: false,
    },
    variables: [],
  },
  currentAdvancedPrompt: [],
  setCurrentAdvancedPrompt: () => { },
  setChatModelPromptConfig: () => {},
  completionModelPromptConfig: {
    context: {
      hasSet: false,
    },
    variables: [],
    historyPrefix: {
      hasSet: false,
      value: {
        userPrefix: '',
        assistantPrefix: '',
      },
    },
    query: {
      hasSet: false,
    },
  },
  setCompletionModelPromptConfig: () => { },
  hasSetBlockStatus: {
    context: false,
    history: false,
    query: false,
  },
  conversationId: '',
  setConversationId: () => { },
  introduction: '',
  setIntroduction: () => { },
  controlClearChatMessage: 0,
  setControlClearChatMessage: () => { },
  prevPromptConfig: {
    prompt_template: '',
    prompt_variables: [],
  },
  setPrevPromptConfig: () => { },
  moreLikeThisConfig: {
    enabled: false,
  },
  setMoreLikeThisConfig: () => { },
  suggestedQuestionsAfterAnswerConfig: {
    enabled: false,
  },
  setSuggestedQuestionsAfterAnswerConfig: () => { },
  speechToTextConfig: {
    enabled: false,
  },
  setSpeechToTextConfig: () => { },
  citationConfig: {
    enabled: false,
  },
  setCitationConfig: () => {},
  formattingChanged: false,
  setFormattingChanged: () => { },
  inputs: {},
  setInputs: () => { },
  query: '',
  setQuery: () => { },
  completionParams: {
    max_tokens: 16,
    temperature: 1, // 0-2
    top_p: 1,
    presence_penalty: 1, // -2-2
    frequency_penalty: 1, // -2-2
  },
  setCompletionParams: () => { },
  modelConfig: {
    provider: 'OPENAI', // 'OPENAI'
    model_id: 'gpt-3.5-turbo', // 'gpt-3.5-turbo'
    mode: ModelModeType.unset,
    configs: {
      prompt_template: '',
      prompt_variables: [],
    },
    opening_statement: null,
    more_like_this: null,
    suggested_questions_after_answer: null,
    speech_to_text: null,
    retriever_resource: null,
    dataSets: [],
  },
  setModelConfig: () => { },
  dataSets: [],
  showSelectDataSet: () => { },
  setDataSets: () => { },
  datasetConfigs: {
    top_k: {
      enable: false,
      value: 2,
    },
    score_threshold: {
      enable: false,
      value: 0.7,
    },
  },
  setDatasetConfigs: () => {},
  hasSetContextVar: false,
})

export default DebugConfigurationContext
