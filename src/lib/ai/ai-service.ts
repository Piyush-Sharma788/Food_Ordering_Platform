import { OpenAIAdapter } from './openai-adapter';
import { GeminiAdapter } from './gemini-adapter';
import { IAIChatMessage } from '@/types';
import MenuItem from '@/models/MenuItem';
import connectToDatabase from '@/lib/db';
import { SEED_MENU_ITEMS } from '@/data/seed-data';

export interface AIServiceResponse {
  reply: string;
  providerUsed: 'openai' | 'gemini' | 'local_fallback';
  recommendedItemSlugs?: string[];
}

export class AIService {
  private openaiAdapter: OpenAIAdapter;
  private geminiAdapter: GeminiAdapter;

  constructor() {
    this.openaiAdapter = new OpenAIAdapter();
    this.geminiAdapter = new GeminiAdapter();
  }

  /**
   * Constructs the ground truth system prompt embedding actual active menu items
   */
  private async buildSystemPrompt(): Promise<{ prompt: string; menuCatalog: string }> {
    let items;
    try {
      await connectToDatabase();
      items = await MenuItem.find({ isAvailable: true }).lean();
    } catch {
      items = SEED_MENU_ITEMS;
    }

    if (!items || items.length === 0) {
      items = SEED_MENU_ITEMS;
    }

    const formattedCatalog = items
      .map(
        (it) =>
          `- ${it.name} (${it.category}): Rs. ${it.price}, Prep time ~${it.prepTime} mins. Description: ${it.description} [slug: ${it.slug}]`
      )
      .join('\n');

    const systemPrompt = `You are "Zaika AI", the intelligent culinary assistant for Cd: Zaika, the campus food ordering platform.
Your goals:
1. Help campus students and faculty discover delicious meals, snacks, and beverages based on their cravings, budget, dietary needs (veg), and study breaks.
2. ALWAYS use the verified campus menu provided below. DO NOT invent items, fake prices, fake availability, or fake discounts.
3. Keep your replies friendly, encouraging, and concise (under 120 words).
4. If a user asks what is quick under 5 minutes or what to eat during an exam break, recommend quick items like Hot Coffee, Cold Coffee, Vanilla Shake, Idli, or Momos.
5. If recommending specific items, mention their exact name and verified price in Rs.

OFFICIAL VERIFIED CAMPUS MENU:
${formattedCatalog}`;

    return { prompt: systemPrompt, menuCatalog: formattedCatalog };
  }

  public async chat(
    messages: IAIChatMessage[],
    preferredProvider: 'openai' | 'gemini' | 'auto' = 'auto'
  ): Promise<AIServiceResponse> {
    const { prompt } = await this.buildSystemPrompt();

    // Strategy 1: User asked for OpenAI specifically or auto with OpenAI available
    if (preferredProvider === 'openai' && this.openaiAdapter.isAvailable()) {
      try {
        const reply = await this.openaiAdapter.generateChatResponse(prompt, messages);
        return { reply, providerUsed: 'openai' };
      } catch (err) {
        console.warn('OpenAI call failed, attempting fallback to Gemini:', err);
      }
    }

    // Strategy 2: User asked for Gemini specifically or auto with Gemini available
    if (preferredProvider === 'gemini' && this.geminiAdapter.isAvailable()) {
      try {
        const reply = await this.geminiAdapter.generateChatResponse(prompt, messages);
        return { reply, providerUsed: 'gemini' };
      } catch (err) {
        console.warn('Gemini call failed, attempting fallback to OpenAI:', err);
      }
    }

    // Strategy 3: Auto selection (prefer Gemini for fast response, or OpenAI)
    if (this.geminiAdapter.isAvailable()) {
      try {
        const reply = await this.geminiAdapter.generateChatResponse(prompt, messages);
        return { reply, providerUsed: 'gemini' };
      } catch (err) {
        console.warn('Gemini auto call failed, trying OpenAI:', err);
      }
    }

    if (this.openaiAdapter.isAvailable()) {
      try {
        const reply = await this.openaiAdapter.generateChatResponse(prompt, messages);
        return { reply, providerUsed: 'openai' };
      } catch (err) {
        console.warn('OpenAI auto call failed:', err);
      }
    }

    // Strategy 4: High-reliability local fallback assistant
    const lastUserMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
    const fallbackReply = this.generateLocalFallback(lastUserMsg);

    return {
      reply: fallbackReply,
      providerUsed: 'local_fallback',
    };
  }

  private generateLocalFallback(query: string): string {
    if (query.includes('coffee') || query.includes('caffeine') || query.includes('study') || query.includes('tired')) {
      return 'For your study session, I recommend our freshly brewed Hot Coffee (Rs. 25, 3 mins) or Hazelnut Cold Coffee (Rs. 60, 5 mins) to keep you alert and energized!';
    }
    if (query.includes('burger') || query.includes('hungry') || query.includes('heavy') || query.includes('lunch')) {
      return 'If you are looking for a satisfying bite, try our Paneer Burger (Rs. 75, 10 mins) paired with French Fries (Rs. 50)!';
    }
    if (query.includes('shake') || query.includes('sweet') || query.includes('dessert')) {
      return 'Craving something sweet? Our Vanilla Shake (Rs. 65) and Chocolate Shake (Rs. 90) take only 4 minutes to prepare!';
    }
    if (query.includes('quick') || query.includes('fast') || query.includes('hurry') || query.includes('late')) {
      return 'In a rush between classes? Grab Idli (4 pcs for Rs. 40, ready in 4 mins) or Steam Momos (Rs. 30, ready in 5 mins)!';
    }
    if (query.includes('pizza')) {
      return 'Our special Kulhad Pizza (Rs. 140) and Paneer Pizza (Rs. 170) are campus favorites with gooey melted cheese!';
    }
    return 'Welcome to Cd: Zaika! We offer fresh Shakes, Hot & Cold Coffees, Paneer Burgers, Maggie Masaledar, and Pizzas freshly prepared in under 15 minutes. How can I help you choose today?';
  }
}

export const aiService = new AIService();
export default aiService;

