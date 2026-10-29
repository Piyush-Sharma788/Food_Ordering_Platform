import OpenAI from 'openai';
import { IAIChatMessage } from '@/types';

export class OpenAIAdapter {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  public isAvailable(): boolean {
    return Boolean(this.client && process.env.OPENAI_API_KEY);
  }

  public async generateChatResponse(
    systemPrompt: string,
    messages: IAIChatMessage[]
  ): Promise<string> {
    if (!this.client) {
      throw new Error('OpenAI client not configured. Missing OPENAI_API_KEY.');
    }

    const formattedMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content,
      })),
    ];

    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply = response.choices[0]?.message?.content;
    if (!reply) {
      throw new Error('OpenAI returned an empty response.');
    }

    return reply;
  }
}

