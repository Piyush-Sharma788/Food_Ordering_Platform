'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, RefreshCw, Zap } from 'lucide-react';
import { IAIChatMessage } from '@/types';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<IAIChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am Zaika AI, your campus food assistant. What are you craving today, or do you need a recommendation for your study break?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [providerUsed, setProviderUsed] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Quick bite under 5 mins',
    'Caffeine boost for study',
    'Affordable lunch under Rs. 75',
    'Best cheese pizza?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages: IAIChatMessage[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          preferredProvider: 'auto',
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
        setProviderUsed(data.providerUsed);
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: 'Sorry, I encountered an issue. How about a hot cup of coffee or a fresh Paneer Burger?',
          },
        ]);
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Network connection error. Please try asking again shortly!',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-neutral-300 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="bg-black text-white px-5 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide">Zaika AI Assistant</h3>
              <p className="text-[11px] text-teal-400 flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Powered by OpenAI & Google Gemini</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat message history */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-neutral-50 text-sm">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex items-start space-x-2 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser ? 'bg-black text-white' : 'bg-teal-600 text-white'
                  }`}
                >
                  {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-black text-white rounded-br-none shadow-sm'
                      : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-neutral-500 italic p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>Zaika AI is checking the campus menu...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="px-4 py-2 bg-white border-t border-neutral-200 flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full border border-neutral-300 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Provider badge */}
        {providerUsed && (
          <div className="px-4 py-1 bg-neutral-100 text-[10px] text-neutral-500 text-right">
            Active Provider: <span className="font-semibold capitalize text-teal-700">{providerUsed.replace('_', ' ')}</span>
          </div>
        )}

        {/* Input area */}
        <div className="p-3 bg-white border-t border-neutral-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for snacks, coffee, prep times..."
              className="flex-1 border border-neutral-300 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-black hover:bg-neutral-800 disabled:opacity-40 text-white p-2.5 rounded-full transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIChatDrawer;

