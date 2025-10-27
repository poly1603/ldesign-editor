/**
 * AI 功能的类型定义
 */

/**
 * AI 提供商类型
 */
export type AIProvider = 'deepseek' | 'openai' | 'claude' | 'azure' | 'baidu' | 'qwen' | 'spark' | 'glm' | 'custom'

/**
 * AI 模型配置
 */
export interface AIModelConfig {
  provider: AIProvider
  model: string
  apiKey: string
  apiEndpoint?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

/**
 * AI 配置选项
 */
export interface AIConfig {
  enabled: boolean
  defaultProvider: AIProvider
  providers: {
    [key in AIProvider]?: AIModelConfig
  }
  features: {
    errorCorrection: boolean
    autoComplete: boolean
    textContinuation: boolean
    textRewrite: boolean
    smartSuggestions: boolean
  }
  shortcuts?: {
    errorCorrection?: string
    autoComplete?: string
    textContinuation?: string
    textRewrite?: string
  }
}

/**
 * AI 请求类型
 */
export type AIRequestType = 'correct' | 'complete' | 'continue' | 'rewrite' | 'suggest'

/**
 * AI 请求参数
 */
export interface AIRequest {
  type: AIRequestType
  text: string
  context?: string
  language?: string
  options?: Record<string, any>
}

/**
 * AI 响应
 */
export interface AIResponse {
  success: boolean
  text?: string
  suggestions?: string[]
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * AI 提供商接口
 */
export interface AIProviderInterface {
  name: AIProvider
  config: AIModelConfig

  /**
   * 初始化提供商
   */
  initialize(config: AIModelConfig): Promise<void>

  /**
   * 发送请求
   */
  request(request: AIRequest): Promise<AIResponse>

  /**
   * 验证配置
   */
  validateConfig(): boolean

  /**
   * 清理资源
   */
  cleanup(): void
}

/**
 * 默认 AI 配置
 */
export const defaultAIConfig: AIConfig = {
  enabled: true,
  defaultProvider: 'deepseek',
  providers: {
    deepseek: {
      provider: 'deepseek',
      model: 'deepseek-chat',
      apiKey: '',
      apiEndpoint: 'https://api.deepseek.com/v1',
      temperature: 0.7,
      maxTokens: 2000,
      stream: false
    },
    openai: {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      apiKey: '',
      apiEndpoint: 'https://api.openai.com/v1',
      temperature: 0.7,
      maxTokens: 2000,
      stream: false
    },
    claude: {
      provider: 'claude',
      model: 'claude-3-sonnet-20240229',
      apiKey: '',
      apiEndpoint: 'https://api.anthropic.com/v1',
      temperature: 0.7,
      maxTokens: 4000,
      stream: false
    },
    baidu: {
      provider: 'baidu',
      model: 'ernie-bot',
      apiKey: '', // 格式: API_KEY:SECRET_KEY
      apiEndpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
      temperature: 0.7,
      maxTokens: 2000,
      stream: false
    },
    qwen: {
      provider: 'qwen',
      model: 'qwen-turbo',
      apiKey: '',
      apiEndpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
      temperature: 0.7,
      maxTokens: 2000,
      stream: false
    },
    spark: {
      provider: 'spark',
      model: 'spark-3.5',
      apiKey: '', // 格式: APP_ID:API_KEY:API_SECRET
      apiEndpoint: 'wss://spark-api.xf-yun.com/v3.5/chat',
      temperature: 0.7,
      maxTokens: 2000,
      stream: false
    },
    glm: {
      provider: 'glm',
      model: 'glm-4',
      apiKey: '',
      apiEndpoint: 'https://open.bigmodel.cn/api/paas/v4/chat/completions',
      temperature: 0.7,
      maxTokens: 2000,
      stream: false
    }
  },
  features: {
    errorCorrection: true,
    autoComplete: true,
    textContinuation: true,
    textRewrite: true,
    smartSuggestions: true
  },
  shortcuts: {
    errorCorrection: 'Alt+F',
    autoComplete: 'Ctrl+Space',
    textContinuation: 'Alt+Enter',
    textRewrite: 'Alt+R'
  }
}