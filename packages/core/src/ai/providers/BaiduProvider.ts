/**
 * 百度文心一言（ERNIE-Bot）提供商
 */

import type {
  AIModelConfig,
  AIProviderInterface,
  AIRequest,
  AIResponse,
} from '../types'
import { createLogger } from '../../utils/logger'

const logger = createLogger('BaiduProvider')

export class BaiduProvider implements AIProviderInterface {
  name = 'baidu' as const
  config: AIModelConfig
  private accessToken?: string
  private tokenExpiry?: number

  constructor(config: AIModelConfig) {
    this.config = {
      ...config,
      provider: 'baidu',
      model: config.model || 'ernie-bot',
      apiEndpoint: config.apiEndpoint || 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat',
    }
  }

  async initialize(config: AIModelConfig): Promise<void> {
    this.config = { ...this.config, ...config }

    // 获取访问令牌
    await this.refreshAccessToken()
  }

  async request(request: AIRequest): Promise<AIResponse> {
    try {
      // 确保有有效的访问令牌
      await this.ensureAccessToken()

      const messages = this.buildMessages(request)

      const response = await fetch(`${this.config.apiEndpoint}/${this.getModelEndpoint()}?access_token=${this.accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          temperature: this.config.temperature || 0.7,
          top_p: 0.9,
          penalty_score: 1.0,
          stream: this.config.stream || false,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`百度文心一言请求失败: ${response.status} - ${error}`)
      }

      const data = await response.json()

      if (data.error_code)
        throw new Error(`百度文心一言错误: ${data.error_code} - ${data.error_msg}`)

      return {
        success: true,
        text: data.result,
        usage: data.usage
          ? {
            promptTokens: data.usage.prompt_tokens,
            completionTokens: data.usage.completion_tokens,
            totalTokens: data.usage.total_tokens,
          }
          : undefined,
      }
    }
    catch (error) {
      logger.error('文心一言请求失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      }
    }
  }

  validateConfig(): boolean {
    if (!this.config.apiKey) {
      logger.error('缺少百度API密钥')
      return false
    }

    // 百度需要API Key和Secret Key（用:分隔）
    const [apiKey, secretKey] = this.config.apiKey.split(':')
    if (!apiKey || !secretKey) {
      logger.error('百度API密钥格式错误，应为 "API_KEY:SECRET_KEY"')
      return false
    }

    return true
  }

  cleanup(): void {
    this.accessToken = undefined
    this.tokenExpiry = undefined
  }

  private buildMessages(request: AIRequest): any[] {
    const systemPrompt = this.getSystemPrompt(request.type)
    const messages = []

    if (systemPrompt) {
      messages.push({
        role: 'user',
        content: `${systemPrompt}\n\n${request.text}`,
      })
    }
    else {
      messages.push({
        role: 'user',
        content: request.text,
      })
    }

    return messages
  }

  private getSystemPrompt(type: AIRequest['type']): string {
    const prompts = {
      correct: '请纠正以下文本中的错误，包括拼写、语法和表达问题：',
      complete: '请根据上下文完成以下内容：',
      continue: '请继续写下去：',
      rewrite: '请重写以下内容，使其更加清晰、专业：',
      suggest: '请为以下内容提供改进建议：',
    }
    return prompts[type] || ''
  }

  private getModelEndpoint(): string {
    const modelMap: Record<string, string> = {
      'ernie-bot': 'ernie_bot',
      'ernie-bot-turbo': 'ernie_bot_turbo',
      'ernie-bot-4': 'ernie_bot_4',
      'ernie-3.5-8k': 'ernie_3.5_8k',
      'ernie-3.5-128k': 'ernie_3.5_128k',
    }
    return modelMap[this.config.model] || 'ernie_bot'
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.validateConfig())
      throw new Error('百度配置无效')

    const [apiKey, secretKey] = this.config.apiKey.split(':')

    const response = await fetch(
      `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secretKey}`,
      { method: 'POST' },
    )

    if (!response.ok)
      throw new Error('获取百度访问令牌失败')

    const data = await response.json()

    if (data.error)
      throw new Error(`获取百度访问令牌失败: ${data.error} - ${data.error_description}`)

    this.accessToken = data.access_token
    this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // 提前1分钟刷新

    logger.info('百度访问令牌刷新成功')
  }

  private async ensureAccessToken(): Promise<void> {
    if (!this.accessToken || !this.tokenExpiry || Date.now() >= this.tokenExpiry)
      await this.refreshAccessToken()
  }
}
