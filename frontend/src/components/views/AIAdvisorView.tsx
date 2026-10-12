import React, { useState, useRef, useEffect } from 'react';
import type { Property, NavTab } from '../../types';
import {
  Send,
  Sparkles,
  Building2,
  Bot,
  User,
  AlertCircle,
  X,
  RotateCcw,
  Loader2,
  Brain,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { advisorApi } from '../../services/api/advisorApi';
import { advisorService } from '../../services/advisorService';
import { ChatMarkdown } from '../common/ChatMarkdown';
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

  const createInitialMessage = (): Message => ({
    id: 'welcome',
    sender: 'advisor',
    text: "Hello! I am your **RealVest AI Investment Advisor** powered by Gemini. Ask me anything about Bengaluru micro-markets, ML fair valuations, rental yields, investment risks, or buy vs. rent decisions.",
    sources: ["RealVest Bengaluru Housing Database", "Google Gemini Intelligence Engine"],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const [messages, setMessages] = useState<Message[]>([createInitialMessage()]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const suggestedQuestions = [
    "Where should I invest ₹50 lakh in Bengaluru?",
    "Is Whitefield suitable for rental income?",
    "Should I buy or rent a property?",
    "What are the main risks of investing in Bengaluru?",
  ];

  const handleClearChat = () => {
    setMessages([createInitialMessage()]);
    setErrorMessage(null);
    setInputText('');
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
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
      contextPayload.recommendation = activeProperty.recommendation;
    }

    // Exclude initial welcome message from LLM conversation history
    const historyPayload = messages
      .filter((m) => m.id !== 'welcome')
      .slice(-8)
      .map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

    try {
      const response = await advisorApi.sendMessage(query, contextPayload, historyPayload);
      const advisorMsg: Message = {
        id: `advisor-${Date.now()}`,
        sender: 'advisor',
        text: response.reply,
        sources: response.sources && response.sources.length > 0
          ? response.sources
          : ["RealVest Bengaluru Housing Database", "Google Gemini Intelligence Engine"],
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
          sources: fallbackRes.sources || ["RealVest Built-in Intelligence Engine"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } catch (fallbackErr: any) {
        setErrorMessage("Advisor service is temporarily unavailable. Please verify your connection or try again.");
      }
    } finally {
      setIsLoading(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const hasUserMessages = messages.some((m) => m.sender === 'user');

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-4xl mx-auto pb-4 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-sm shadow-brand/20">
            <Brain size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-ink font-display">RealVest AI Advisor</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-soft text-brand text-[10px] font-medium border border-brand/20">
                <span className="w-1.5 h-1.5 rounded-full bg-pos animate-pulse" />
                Gemini Live
              </span>
            </div>
            <p className="text-xs text-ink-3">Institutional real estate intelligence and grounded decision support.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeProperty && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-line text-xs rv-fade-in">
              <Building2 size={14} className="text-brand shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-semibold tracking-wide text-ink-3 block leading-none">Context</span>
                <span className="font-semibold text-ink block truncate max-w-[160px] sm:max-w-[200px] text-xs">
                  {activeProperty.title}
                </span>
              </div>
              <button
                onClick={() => setActiveProperty(null)}
                className="text-ink-3 hover:text-neg cursor-pointer p-0.5 rounded transition-colors"
                title="Clear property context"
                aria-label="Clear property context"
              >
                <X size={13} />
              </button>
            </div>
          )}

          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-lg bg-surface border border-line hover:border-brand/40 text-ink-2 hover:text-ink text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            title="Start a new conversation"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm">
        {/* Welcome Empty State Card */}
        {!hasUserMessages && (
          <div className="p-6 rounded-2xl bg-surface border border-line shadow-card text-ink space-y-4 my-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center shadow-sm">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-ink font-display">Bengaluru Decision Intelligence</h3>
                <p className="text-xs text-ink-3">Grounded in verified historical transaction records & rental indices</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Ask anything about micro-market price realism, ML estimated fair values, gross rental yields, down payment sensitivity, or compare Bengaluru localities.
            </p>

            <div className="pt-2 border-t border-line">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-3 block mb-2">Suggested Questions</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-left p-3 rounded-xl bg-surface-soft hover:bg-brand-soft hover:text-brand border border-line text-xs font-medium text-ink-2 transition-all cursor-pointer leading-snug"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Entries */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx('flex items-start gap-3', msg.sender === 'user' && 'flex-row-reverse')}
          >
            {/* Avatar */}
            <div
              className={clsx(
                'w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-xs',
                msg.sender === 'user'
                  ? 'bg-ink text-canvas font-semibold'
                  : 'bg-brand text-white shadow-brand/20'
              )}
            >
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={16} />}
            </div>

            {/* Content Bubble */}
            <div
              className={clsx(
                'max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 space-y-2 text-xs sm:text-sm leading-relaxed shadow-xs',
                msg.sender === 'user'
                  ? 'bg-brand text-white rounded-tr-xs font-medium'
                  : 'bg-surface border border-line text-ink rounded-tl-xs shadow-card'
              )}
            >
              {msg.sender === 'advisor' ? (
                <ChatMarkdown content={msg.text} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.text}</p>
              )}

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && msg.sender === 'advisor' && (
                <div className="pt-2 mt-2 border-t border-line flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-3">Sources:</span>
                  {msg.sources.map((src, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-full bg-surface-soft text-[10px] font-medium text-ink-2 border border-line"
                    >
                      {src}
                    </span>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              <div
                className={clsx(
                  'text-[10px] font-mono text-right',
                  msg.sender === 'user' ? 'text-white/70' : 'text-ink-3'
                )}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 rv-fade-in">
            <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot size={16} />
            </div>
            <div className="bg-surface border border-line rounded-2xl rounded-tl-xs px-4 py-3 text-xs sm:text-sm text-ink-3 flex items-center gap-2.5 shadow-xs">
              <Loader2 size={16} className="animate-spin text-brand" />
              <span className="font-medium text-ink-2">Analyzing your question with Gemini…</span>
            </div>
          </div>
        )}

        {/* Error message banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-neg-soft/80 border border-neg/20 text-neg text-xs sm:text-sm flex items-center justify-between gap-2 rv-fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-neg font-bold cursor-pointer hover:underline text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts chips bar */}
      <div className="pt-2 border-t border-line shrink-0 space-y-2">
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

        {/* Multiline Chat Input */}
        <div className="flex items-end gap-2 p-1.5 rounded-xl border border-line bg-surface shadow-card focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about Bengaluru properties, valuations, rental yields, or investment decisions…"
            className="flex-1 px-3 py-2 text-xs sm:text-sm text-ink bg-transparent focus:outline-none placeholder:text-ink-3 resize-none max-h-28 min-h-[40px]"
            rows={1}
            disabled={isLoading}
            aria-label="Ask RealVest Advisor"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 rounded-lg bg-brand hover:bg-brand-hover active:scale-95 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
            title="Send message (Enter)"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <span className="hidden sm:inline">Send</span>
                <Send size={15} />
              </>
            )}
          </button>
        </div>

        <div className="px-1 flex items-center justify-between text-[10px] text-ink-3">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Shift+Enter</kbd> for a new line</span>
          <span>Powered by Gemini 3.5 & RealVest Housing Model</span>
        </div>
      </div>
    </div>
  );
};
