/**
 * 讯飞星火（Spark）提供商
 */

import type {
  AIModelConfig,
  AIProviderInterface,
  AIRequest,
  AIResponse,
} from '../types'
import { createLogger } from '../../utils/logger'

const logger = createLogger('SparkProvider')

export class SparkProvider implements AIProviderInterface {
  name = 'spark' as const
  config: AIModelConfig
  private wsUrl: string = ''

  constructor(config: AIModelConfig) {
    this.config = {
      ...config,
      provider: 'spark',
      model: config.model || 'spark-3.5',
      apiEndpoint: config.apiEndpoint || 'wss://spark-api.xf-yun.com/v3.5/chat',
    }
  }

  async initialize(config: AIModelConfig): Promise<void> {
    this.config = { ...this.config, ...config }
    this.wsUrl = this.getWebSocketUrl()
  }

  async request(request: AIRequest): Promise<AIResponse> {
    try {
      // 讯飞星火使用WebSocket接口
      const response = await this.makeWebSocketRequest(request)

      return {
        success: true,
        text: response.text,
        usage: response.usage,
      }
    }
    catch (error) {
      logger.error('讯飞星火请求失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
      }
    }
  }

  validateConfig(): boolean {
    if (!this.config.apiKey) {
      logger.error('缺少讯飞API密钥')
      return false
    }

    // 讯飞需要APPID、APIKey和APISecret（用:分隔）
    const [appId, apiKey, apiSecret] = this.config.apiKey.split(':')
    if (!appId || !apiKey || !apiSecret) {
      logger.error('讯飞API密钥格式错误，应为 "APP_ID:API_KEY:API_SECRET"')
      return false
    }

    return true
  }

  cleanup(): void {
    // 清理WebSocket连接等资源
  }

  private async makeWebSocketRequest(request: AIRequest): Promise<{ text: string, usage?: any }> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.wsUrl)
      let fullText = ''
      let usage: any = null

      ws.onopen = () => {
        logger.debug('WebSocket连接已建立')

        // 发送请求
        const params = this.buildWebSocketParams(request)
        ws.send(JSON.stringify(params))
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.header.code !== 0) {
          ws.close()
          reject(new Error(`讯飞星火错误: ${data.header.code} - ${data.header.message}`))
          return
        }

        // 提取文本
        const payload = data.payload
        if (payload.choices && payload.choices.text) {
          payload.choices.text.forEach((item: any) => {
            fullText += item.content
          })
        }

        // 提取用量信息
        if (payload.usage) {
          usage = {
            promptTokens: payload.usage.text.prompt_tokens,
            completionTokens: payload.usage.text.completion_tokens,
            totalTokens: payload.usage.text.total_tokens,
          }
        }

        // 检查是否结束
        if (data.header.status === 2) {
          ws.close()
          resolve({ text: fullText, usage })
        }
      }

      ws.onerror = (error) => {
        logger.error('WebSocket错误:', error)
        reject(new Error('WebSocket连接错误'))
      }

      ws.onclose = () => {
        logger.debug('WebSocket连接已关闭')
      }
    })
  }

  private buildWebSocketParams(request: AIRequest): any {
    const [appId] = this.config.apiKey.split(':')

    return {
      header: {
        app_id: appId,
        uid: this.generateUID(),
      },
      parameter: {
        chat: {
          domain: this.getDomain(),
          temperature: this.config.temperature || 0.7,
          max_tokens: this.config.maxTokens || 2000,
          top_k: 4,
          chat_id: this.generateUID(),
        },
      },
      payload: {
        message: {
          text: this.buildMessages(request),
        },
      },
    }
  }

  private buildMessages(request: AIRequest): any[] {
    const messages = []

    // 添加系统提示
    const systemPrompt = this.getSystemPrompt(request.type)
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      })
    }

    // 添加用户消息
    messages.push({
      role: 'user',
      content: request.text,
    })

    return messages
  }

  private getSystemPrompt(type: AIRequest['type']): string {
    const prompts = {
      correct: '请纠正文本中的所有错误，包括拼写、语法和标点符号错误。',
      complete: '请自然地完成这段文本。',
      continue: '请继续写作，保持风格一致。',
      rewrite: '请重写这段文本，使其更加专业和清晰。',
      suggest: '请为这段文本提供改进建议。',
    }
    return prompts[type] || ''
  }

  private getWebSocketUrl(): string {
    const [appId, apiKey, apiSecret] = this.config.apiKey.split(':')

    // 生成鉴权URL（实际实现需要按照讯飞的鉴权规则）
    const date = new Date().toUTCString()
    const signatureOrigin = `host: spark-api.xf-yun.com\ndate: ${date}\nGET /v3.5/chat HTTP/1.1`

    // 这里应该使用真实的HMAC-SHA256签名
    // const signature = crypto.createHmac('sha256', apiSecret).update(signatureOrigin).digest('base64')

    // 简化处理，实际使用时需要完整的鉴权实现
    return this.config.apiEndpoint!
  }

  private getDomain(): string {
    const modelMap: Record<string, string> = {
      'spark-1.5': 'general',
      'spark-2.0': 'generalv2',
      'spark-3.0': 'generalv3',
      'spark-3.5': 'generalv3.5',
    }
    return modelMap[this.config.model] || 'generalv3.5'
  }

  private generateUID(): string {
    return `uid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * 支持的模型列表
   */
  static getSupportedModels() {
    return [
      { id: 'spark-1.5', name: '星火1.5', description: '基础版本' },
      { id: 'spark-2.0', name: '星火2.0', description: '增强版本' },
      { id: 'spark-3.0', name: '星火3.0', description: '专业版本' },
      { id: 'spark-3.5', name: '星火3.5', description: '最新版本，能力最强' },
    ]
  }
}
