import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIChatMessage } from '@/types';

export class GeminiAdapter {
  private client: GoogleGenerativeAI | null = null;

  constructor() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (apiKey) {
      this.client = new GoogleGenerativeAI(apiKey);
    }
  }

  public isAvailable(): boolean {
    return Boolean(this.client && process.env.GOOGLE_GENERATIVE_AI_API_KEY);
  }

  public async generateChatResponse(
    systemPrompt: string,
    messages: IAIChatMessage[]
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Google Generative AI client not configured. Missing GOOGLE_GENERATIVE_AI_API_KEY.');
    }

    const model = this.client.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    // Format chat history
    // Convert all preceding messages into a prompt sequence
    const conversationText = messages
      .map((m) => `${m.role === 'user' ? 'Student' : 'Zaika Assistant'}: ${m.content}`)
      .join('\n');

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: conversationText }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.7,
      },
    });

    const reply = result.response.text();
    if (!reply) {
      throw new Error('Gemini returned an empty response.');
    }

    return reply;
  }
}

