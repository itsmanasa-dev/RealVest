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
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-4xl mx-auto pb-4 font-chat text-ink">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <Brain size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-ink font-chat">RealVest AI Advisor</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-pos/10 text-pos text-[10px] font-semibold border border-pos/20">
                <span className="w-1.5 h-1.5 rounded-full bg-pos animate-pulse" />
                Gemini 3.5 Live
              </span>
            </div>
            <p className="text-xs text-ink-3">Institutional real estate intelligence and grounded decision support.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeProperty && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-line text-xs rv-fade-in shadow-xs">
              <Building2 size={14} className="text-brand shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-semibold tracking-wide text-ink-3 block leading-none">Active Context</span>
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
            className="px-3.5 py-1.5 rounded-xl bg-surface border border-line hover:border-brand/40 text-ink-2 hover:text-ink text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            title="Start a new conversation"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm">
        {/* Welcome Empty State Card (Shown once before conversation starts) */}
        {!hasUserMessages && (
          <div className="p-6 rounded-2xl bg-surface border border-line shadow-card text-ink space-y-4 my-2 rv-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shadow-xs">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-ink font-chat">Bengaluru Decision Intelligence</h3>
                <p className="text-xs text-ink-3">Grounded in verified historical transaction records & rental indices</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
              Ask anything about micro-market price realism, ML estimated fair values, gross rental yields, down payment sensitivity, or compare Bengaluru localities.
            </p>

            <div className="pt-2 border-t border-line/70">
              <span className="text-[10.5px] uppercase font-semibold tracking-wider text-ink-3 block mb-2.5">
                Suggested Questions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="text-left p-3 rounded-xl bg-surface-soft hover:bg-brand-soft/30 hover:border-brand/40 hover:text-brand border border-line/80 text-[12.5px] font-medium text-ink-2 transition-all cursor-pointer leading-snug font-chat shadow-xs"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Entries */}
        {hasUserMessages &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className={clsx('flex items-start gap-3', msg.sender === 'user' ? 'justify-end' : 'justify-start')}
            >
              {/* Advisor Avatar */}
              {msg.sender === 'advisor' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={16} />
                </div>
              )}

              {/* Content Bubble */}
              <div
                className={clsx(
                  'space-y-1.5 leading-relaxed shadow-xs',
                  msg.sender === 'user'
                    ? 'max-w-[85%] sm:max-w-[78%] bg-brand text-white rounded-2xl rounded-tr-sm px-4 py-2.5'
                    : 'max-w-[90%] sm:max-w-[82%] bg-surface-soft/80 border border-line/70 text-ink rounded-2xl rounded-tl-sm px-4 py-3.5'
                )}
              >
                {msg.sender === 'advisor' ? (
                  <ChatMarkdown content={msg.text} />
                ) : (
                  <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap font-chat font-normal">
                    {msg.text}
                  </p>
                )}

                {/* Metadata */}
                <div
                  className={clsx(
                    'flex items-center justify-between gap-2 pt-1 text-[10.5px]',
                    msg.sender === 'user' ? 'text-white/70 justify-end' : 'border-t border-line/40 text-ink-3'
                  )}
                >
                  {msg.sender === 'advisor' && (
                    <div className="flex flex-wrap items-center gap-1.5 truncate">
                      {msg.sources && msg.sources.length > 0 ? (
                        <span className="truncate">Sources: {msg.sources.join(' · ')}</span>
                      ) : (
                        <span>RealVest Bengaluru Database</span>
                      )}
                    </div>
                  )}
                  <span className="font-mono shrink-0">{msg.timestamp}</span>
                </div>
              </div>

              {/* User Avatar */}
              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-ink text-canvas flex items-center justify-center shrink-0 shadow-xs text-xs font-semibold">
                  <User size={14} />
                </div>
              )}
            </div>
          ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 rv-fade-in">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot size={16} />
            </div>
            <div className="bg-surface-soft/80 border border-line/70 rounded-2xl rounded-tl-sm px-4 py-3 text-xs sm:text-sm text-ink-2 flex items-center gap-2.5 shadow-xs font-chat">
              <Loader2 size={16} className="animate-spin text-brand" />
              <span>Analyzing Bengaluru market metrics with Gemini…</span>
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

      {/* Input Area (Clean Capsule) */}
      <div className="pt-2 border-t border-line/80 shrink-0 space-y-1.5">
        <div className="relative flex items-center bg-surface-soft/70 border border-line/90 focus-within:border-brand focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand/15 rounded-2xl transition-all shadow-xs pl-4 pr-12 py-2">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask RealVest about Bengaluru property, yields, or valuations..."
            className="w-full text-xs sm:text-sm text-ink bg-transparent focus:outline-none placeholder:text-ink-3 resize-none max-h-28 min-h-[36px] py-1 leading-normal font-chat"
            rows={1}
            disabled={isLoading}
            aria-label="Ask RealVest Advisor"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand hover:bg-brand-hover active:scale-95 disabled:opacity-30 text-white transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-xs"
            title="Send message (Enter)"
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>

        <div className="px-1 flex items-center justify-between text-[11px] text-ink-3 font-chat">
          <span>Press <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Shift+Enter</kbd> for newline</span>
          <span className="hidden sm:inline">Powered by Gemini & RealVest Housing Model</span>
        </div>
      </div>
    </div>
  );
};
