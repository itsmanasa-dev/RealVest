import React, { useState, useRef, useEffect } from 'react';
import type { Property, NavTab } from '../../types';
import {
  Brain,
  Send,
  Sparkles,
  Building2,
  MapPin,
  Bot,
  User,
  AlertCircle,
  X,
  ArrowRight,
  TrendingUp,
  Scale,
  DollarSign,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { advisorApi } from '../../services/api/advisorApi';
import { advisorService } from '../../services/advisorService';
import { formatInrLakhs } from '../../utils/currency';

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
  
  // Active property context
  const [activeProperty, setActiveProperty] = useState<Property | null>(properties[0] || null);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'advisor',
      text: "Hello! I am your **RealVest AI Property & Investment Assistant**. Ask me about Bengaluru localities, rental cash flow, market fair values, or buy vs. rent decisions.",
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
    "Why was this property recommended?",
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

    // Build context payload
    const contextPayload: Record<string, any> = {};
    if (activeProperty) {
      contextPayload.property_id = activeProperty.id;
      contextPayload.location = activeProperty.location;
      contextPayload.asking_price_lakhs = activeProperty.askingPriceLakhs;
      contextPayload.fair_value_lakhs = activeProperty.fairValueLakhs;
      contextPayload.annual_yield = activeProperty.annualYield;
      contextPayload.investment_score = activeProperty.investmentScore;
    }

    try {
      const response = await advisorApi.sendMessage(query, contextPayload);
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
      // Seamless built-in fallback
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
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-4xl mx-auto pb-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-[#273449] shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
              <Sparkles size={11} /> AI INVESTMENT ASSISTANT
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            AI Advisor
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask about properties, investments, or Bengaluru markets.
          </p>
        </div>

        {/* Selected Property Context Selector */}
        {activeProperty && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs shadow-sm self-start sm:self-auto">
            <Building2 size={13} className="text-emerald-500 shrink-0" />
            <div className="truncate max-w-[200px]">
              <span className="font-mono text-[10px] text-slate-400 uppercase">Context: </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{activeProperty.title}</span>
            </div>
            <button
              onClick={() => setActiveProperty(null)}
              className="text-slate-400 hover:text-rose-500 p-0.5 rounded cursor-pointer transition-colors"
              title="Clear Property Context"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white'
                  : 'bg-emerald-500 text-white shadow-emerald-500/20'
              }`}
            >
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={16} />}
            </div>

            {/* Message Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 shadow-sm space-y-2 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 dark:bg-emerald-600 text-white rounded-tr-sm font-medium'
                  : 'bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-slate-800 dark:text-slate-200 rounded-tl-sm'
              }`}
            >
              <div className="whitespace-pre-line font-sans">
                {msg.text.split('\n').map((line, i) => {
                  if (line.startsWith('• ')) {
                    return (
                      <div key={i} className="flex items-start gap-1.5 my-1">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{line.replace(/^•\s*/, '')}</span>
                      </div>
                    );
                  }
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <div key={i} className="font-extrabold text-slate-900 dark:text-white mt-1">
                        {line.replace(/\*\*/g, '')}
                      </div>
                    );
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>

              {/* Sources tags if available */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="pt-2 border-t border-slate-100 dark:border-[#273449]/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] font-mono uppercase text-slate-400">Sources:</span>
                  {msg.sources.map((src, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#172033] text-[9px] font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-[#273449]"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}

              <div
                className={`text-[9px] font-mono ${
                  msg.sender === 'user' ? 'text-slate-300' : 'text-slate-400'
                } text-right`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
              <Bot size={16} />
            </div>
            <div className="p-3.5 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="font-mono text-xs">RealVest is thinking...</span>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (Quick Pills) */}
      <div className="py-2 shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-full bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#273449] hover:border-emerald-500 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-medium whitespace-nowrap transition-all shadow-xs cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Input Area */}
      <div className="pt-2 border-t border-slate-200 dark:border-[#273449] shrink-0">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm focus-within:border-emerald-500 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask RealVest anything about Bengaluru properties, valuations, or investments..."
            className="flex-1 px-3 py-2 text-xs text-slate-900 dark:text-white bg-transparent focus:outline-none placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/20 cursor-pointer"
          >
            <span>Send</span>
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
