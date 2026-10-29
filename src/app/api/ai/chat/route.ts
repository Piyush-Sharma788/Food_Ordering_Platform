import { NextRequest, NextResponse } from 'next/server';
import aiService from '@/lib/ai/ai-service';
import { aiChatSchema } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = aiChatSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, errors: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { messages, preferredProvider } = validated.data;
    const result = await aiService.chat(messages, preferredProvider);

    return NextResponse.json({
      success: true,
      reply: result.reply,
      providerUsed: result.providerUsed,
    });
  } catch (error) {
    console.error('AI chat endpoint error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'The AI assistant is temporarily unavailable. Please try again shortly.',
      },
      { status: 500 }
    );
  }
}

