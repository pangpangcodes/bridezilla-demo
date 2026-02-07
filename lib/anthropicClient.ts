import Anthropic from '@anthropic-ai/sdk'

export class AnthropicClient {
  private client: Anthropic

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not set')
    }
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY
    })
  }

  async parseVendorData(
    text: string,
    existingVendors: any[],
    systemPrompt: string
  ): Promise<any> {
    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-haiku-20241022',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: text
        }]
      }, {
        timeout: 30000 // 30 second timeout
      })

      // Extract and parse JSON response
      const content = message.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response format')
      }

      return JSON.parse(content.text)
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw error
    }
  }
}
