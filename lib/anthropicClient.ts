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
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{
          role: 'user',
          content: text
        }]
      }, {
        timeout: 180000 // 3 minute timeout for large PDFs
      })

      // Extract and parse JSON response
      const content = message.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response format')
      }

      // Strip markdown code fences if present
      let jsonText = content.text.trim()
      if (jsonText.startsWith('```')) {
        // Remove opening fence (```json or ```)
        jsonText = jsonText.replace(/^```(?:json)?\n?/, '')
        // Remove closing fence
        jsonText = jsonText.replace(/\n?```$/, '')
        jsonText = jsonText.trim()
      }

      return JSON.parse(jsonText)
    } catch (error) {
      console.error('Anthropic API error:', error)
      throw error
    }
  }
}
