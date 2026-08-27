import React, { useState, useRef, useEffect } from 'react';
import type { Property, NavTab } from '../../types';
import {
  Send,
  Sparkles,
  Building2,
  MapPin,
  Bot,
  User,
  AlertCircle,
  X,
  TrendingUp,
  Target,
  ShieldCheck,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { advisorApi } from '../../services/api/advisorApi';
import { advisorService } from '../../services/advisorService';
import { formatInrLakhs } from '../../utils/currency';
import { Button } from '../ui/Button';
import { Badge, recommendationTone } from '../ui/Badge';
import { clsx } from 'clsx';

interface Message {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  sources?: string[];
  timestamp: string;
}

interface AIAdvisorViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate: (tab: NavTab) => void;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  properties,
  onSelectProperty,
  onNavigate,
}) => {
  const { t, language } = useTranslation();

  const [activeProperty, setActiveProperty] = useState<Property | null>(properties[0] || null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'advisor',
      text: "Hello! I am your **RealVest AI Investment Assistant**. Ask me about Bengaluru localities, rental cash flow, market fair values, or buy vs. rent decisions.",
      sources: ["RealVest Bengaluru Intelligence Engine"],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "Where should I invest ₹50L?",
    "Is Whitefield good for rental income?",
    "Buy vs rent?",
    "What are the biggest risks?",
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setErrorMessage(null);

    const contextPayload: Record<string, any> = {};
    if (activeProperty) {
      contextPayload.property_id = activeProperty.id;
      contextPayload.location = activeProperty.location;
      contextPayload.asking_price_lakhs = activeProperty.askingPriceLakhs;
      contextPayload.fair_value_lakhs = activeProperty.fairValueLakhs;
      contextPayload.annual_yield = activeProperty.annualYield;
      contextPayload.investment_score = activeProperty.investmentScore;
    }

    const historyPayload = messages.slice(-6).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
      content: m.text,
    }));

    try {
      const response = await advisorApi.sendMessage(query, contextPayload, historyPayload);
      const advisorMsg: Message = {
        id: `advisor-${Date.now()}`,
        sender: 'advisor',
        text: response.reply,
        sources: response.sources || ["RealVest Dataset"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err: any) {
      console.warn('Advisor API backend offline or unreachable, utilizing built-in intelligence fallback:', err.message);
      try {
        const fallbackRes = await advisorService.query(query, language, properties, activeProperty);
        const fallbackMsg: Message = {
          id: `advisor-${Date.now()}`,
          sender: 'advisor',
          text: fallbackRes.answer,
          sources: fallbackRes.sources || ["RealVest Built-in Intelligence"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } catch (fallbackErr: any) {
        setErrorMessage("Advisor service is temporarily unavailable. Please try again in a moment.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[560px] max-w-4xl mx-auto pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line shrink-0">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center shrink-0">
              <Bot size={19} />
            </span>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-ink leading-tight">RealVest Advisor</h1>
              <p className="text-xs text-ink-3">Ask about Bengaluru properties, markets, and investment decisions.</p>
            </div>
          </div>
        </div>

        {activeProperty && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-line text-xs rv-fade-in self-start sm:self-auto">
            <Building2 size={14} className="text-brand shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wide text-ink-3 block leading-none">Analyzing</span>
              <span className="font-semibold text-ink block truncate max-w-[200px]">{activeProperty.title}</span>
            </div>
            <button onClick={() => setActiveProperty(null)} className="text-ink-3 hover:text-neg cursor-pointer" aria-label="Clear context">
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={clsx('flex items-start gap-3', msg.sender === 'user' && 'flex-row-reverse')}>
            <div
              className={clsx(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                msg.sender === 'user' ? 'bg-ink text-canvas' : 'bg-brand text-white'
              )}
            >
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={16} />}
            </div>

            <div
              className={clsx(
                'max-w-[85%] sm:max-w-[75%] text-sm leading-relaxed px-4 py-3',
                msg.sender === 'user'
                  ? 'bg-ink text-canvas rounded-xl rounded-tr-sm font-medium'
                  : 'bg-surface border border-line rounded-xl rounded-tl-sm text-ink-2'
              )}
            >
              <div className="whitespace-pre-line">
                {msg.text.split('\n').map((line, i) => {
                  if (line.startsWith('• ')) {
                    return (
                      <div key={i} className="flex items-start gap-1.5 my-1">
                        <span className="text-brand font-bold mt-px">•</span>
                        <span>{line.replace(/^•\s*/, '')}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <div key={i} className="font-semibold text-ink mt-1">
                        {line.replace(/\*\*/g, '')}
                      </div>
                    );
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>

              {msg.sources && msg.sources.length > 0 && msg.sender === 'advisor' && (
                <div className="pt-2 mt-2 border-t border-line flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase tracking-wide text-ink-3">Sources</span>
                  {msg.sources.map((src, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-surface-soft text-ink-2 text-[10px] font-medium">
                      {src}
                    </span>
                  ))}
                </div>
              )}

              <div className={clsx('mt-1 text-[10px] text-ink-3', msg.sender === 'user' && 'text-canvas/60')}>{msg.timestamp}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center shrink-0"><Bot size={16} /></div>
            <div className="bg-surface border border-line rounded-xl px-4 py-3 text-sm text-ink-3 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.3s]" />
              </div>
              RealVest is thinking…
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-lg bg-warn-soft text-warn text-sm flex items-center gap-2 rv-fade-in">
            <AlertCircle size={15} className="shrink-0" /> {errorMessage}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts + input */}
      <div className="pt-2 border-t border-line shrink-0 space-y-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5 pt-1">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full bg-surface border border-line text-ink-2 hover:border-brand hover:text-brand text-xs font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-xl border border-line bg-surface shadow-card focus-within:border-brand transition-colors">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about properties, valuations, or investment decisions…"
            className="flex-1 px-3 py-2 text-sm text-ink bg-transparent focus:outline-none placeholder:text-ink-3"
            disabled={isLoading}
            aria-label="Ask the advisor"
          />
          <Button onClick={() => handleSendMessage()} disabled={!inputText.trim() || isLoading} className="!px-4 shrink-0">
            <span className="hidden sm:inline">Send</span>
            <Send size={15} />
          </Button>
        </div>
      </div>
    </div>
  );
};
