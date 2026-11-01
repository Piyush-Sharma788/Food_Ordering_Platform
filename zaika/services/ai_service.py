import os
import logging
from zaika.models import MenuItem

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.openai_key = os.environ.get('OPENAI_API_KEY', '')
        self.gemini_key = os.environ.get('GOOGLE_GENERATIVE_AI_API_KEY', '')

    def _build_system_prompt(self) -> str:
        items = MenuItem.objects.filter(is_available=True)
        catalog = []
        for it in items:
            catalog.append(
                f"- {it.name} ({it.category}): Rs. {it.price}, Prep time ~{it.prep_time} mins. "
                f"Description: {it.description} [slug: {it.slug}]"
            )
        catalog_text = "\n".join(catalog)

        return (
            "You are 'Zaika AI', the intelligent campus dining assistant for Cd: Zaika.\n"
            "Your goals:\n"
            "1. Help campus students and faculty discover delicious meals, snacks, and beverages based on cravings, budget, and study breaks.\n"
            "2. ALWAYS use the verified campus menu provided below. DO NOT invent items, fake prices, fake availability, or fake discounts.\n"
            "3. Keep your replies friendly, encouraging, and concise (under 120 words).\n"
            "4. If a user asks what is quick under 5 minutes or what to eat during an exam break, recommend quick items like Hot Coffee, Cold Coffee, Vanilla Shake, Idli, or Momos.\n"
            "5. If recommending specific items, mention their exact name and verified price in Rs.\n\n"
            "OFFICIAL VERIFIED CAMPUS MENU:\n"
            f"{catalog_text}"
        )

    def chat(self, messages: list, preferred_provider: str = 'auto') -> dict:
        system_prompt = self._build_system_prompt()

        # Strategy 1: OpenAI
        if (preferred_provider == 'openai' or preferred_provider == 'auto') and self.openai_key:
            try:
                import openai
                client = openai.OpenAI(api_key=self.openai_key)
                formatted = [{'role': 'system', 'content': system_prompt}]
                for m in messages:
                    formatted.append({'role': m.get('role', 'user'), 'content': m.get('content', '')})

                res = client.chat.completions.create(
                    model='gpt-4o-mini',
                    messages=formatted,
                    temperature=0.7,
                    max_tokens=500
                )
                reply = res.choices[0].message.content
                if reply:
                    return {'reply': reply, 'provider_used': 'openai'}
            except Exception as e:
                logger.warning(f"OpenAI chat failed: {e}")

        # Strategy 2: Google Gemini
        if (preferred_provider == 'gemini' or preferred_provider == 'auto') and self.gemini_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_key)
                model = genai.GenerativeModel(
                    model_name='gemini-1.5-flash',
                    system_instruction=system_prompt
                )
                conversation_text = "\n".join([
                    f"{'Student' if m.get('role') == 'user' else 'Zaika AI'}: {m.get('content')}"
                    for m in messages
                ])
                res = model.generate_content(conversation_text)
                if res.text:
                    return {'reply': res.text, 'provider_used': 'gemini'}
            except Exception as e:
                logger.warning(f"Gemini chat failed: {e}")

        # Strategy 3: Built-in Local Culinary Engine Fallback
        last_msg = (messages[-1].get('content', '') if messages else '').lower()
        reply = self._generate_local_fallback(last_msg)
        return {'reply': reply, 'provider_used': 'local_fallback'}

    def _generate_local_fallback(self, query: str) -> str:
        if any(w in query for w in ['coffee', 'caffeine', 'study', 'tired', 'exam']):
            return (
                "For your study session, I recommend our freshly brewed Hot Coffee (Rs. 25, 3 mins) "
                "or Hazelnut Cold Coffee (Rs. 60, 5 mins) to keep you alert and energized!"
            )
        if any(w in query for w in ['burger', 'hungry', 'heavy', 'lunch', 'eat']):
            return (
                "If you are looking for a satisfying bite, try our Paneer Burger (Rs. 75, 10 mins) "
                "paired with salted French Fries (Rs. 50)!"
            )
        if any(w in query for w in ['shake', 'sweet', 'dessert', 'cold']):
            return (
                "Craving something sweet? Our Vanilla Shake (Rs. 65) and Chocolate Shake (Rs. 90) "
                "take only 4 minutes to prepare at the counter!"
            )
        if any(w in query for w in ['quick', 'fast', 'hurry', 'rush', 'late']):
            return (
                "In a rush between classes? Grab Idli (4 pcs for Rs. 40, ready in 4 mins) "
                "or Steam Momos (Rs. 30, ready in 5 mins)!"
            )
        if 'pizza' in query:
            return (
                "Our special Kulhad Pizza (Rs. 140) and Paneer Pizza (Rs. 170) are campus favorites "
                "with gooey melted mozzarella baked in clay pots!"
            )
        return (
            "Welcome to Cd: Zaika! We offer fresh Shakes, Hot & Cold Coffees, Paneer Burgers, "
            "Maggie Masaledar, and Pizzas freshly prepared in under 15 minutes. How can I help you choose today?"
        )


ai_service = AIService()

