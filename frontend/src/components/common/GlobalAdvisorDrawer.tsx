import React, { useState, useRef, useEffect } from 'react';
import type { Property, NavTab } from '../../types';
import {
  Brain,
  Send,
  Sparkles,
  X,
  Bot,
  User,
  AlertCircle,
  Building2,
  Minimize2,
  Maximize2,
  RotateCcw,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { advisorApi } from '../../services/api/advisorApi';
import { advisorService } from '../../services/advisorService';
import { ChatMarkdown } from './ChatMarkdown';
import { clsx } from 'clsx';

interface Message {
  id: string;
  sender: 'user' | 'advisor';
  text: string;
  sources?: string[];
  timestamp: string;
}

interface GlobalAdvisorDrawerProps {
  activeTab: NavTab;
  selectedProperty?: Property | null;
  properties?: Property[];
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const GlobalAdvisorDrawer: React.FC<GlobalAdvisorDrawerProps> = ({
  activeTab,
  selectedProperty,
  properties = [],
  isOpen,
  onClose,
  onOpen,
}) => {
  const { language, t } = useTranslation();

  const getInitialGreeting = () => {
    if (language === 'kn') {
      return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ರಿಯಲ್‌ವೆಸ್ಟ್ ಎಐ ಹೂಡಿಕೆ ಸಲಹೆಗಾರ**. ಬೆಂಗಳೂರಿನ ಆಸ್ತಿಗಳ ಬೆಲೆ, ಬಾಡಿಗೆ ಇಳುವರಿ, ಮಾರುಕಟ್ಟೆ ಅಪಾಯಗಳು ಅಥವಾ ಹೂಡಿಕೆ ಅವಕಾಶಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.";
    }
    if (language === 'hi') {
      return "नमस्ते! मैं आपका **रियलवेस्ट एआई निवेश सलाहकार** हूँ। बेंगलुरु की संपत्तियों, बाजार मूल्यांकन, किराये की आय या निवेश जोखिमों के बारे में पूछें।";
    }
    return "Hello! I am your **RealVest AI Investment Advisor** powered by Gemini. Ask me about Bengaluru micro-markets, ML fair valuations, rental yields, investment risks, or buy vs. rent decisions.";
  };

  const createInitialMessage = (): Message => ({
    id: 'welcome',
    sender: 'advisor',
    text: getInitialGreeting(),
    sources: [
      language === 'kn'
        ? 'ರಿಯಲ್‌ವೆಸ್ಟ್ ಬೆಂಗಳೂರು ಇಂಟೆಲಿಜೆನ್ಸ್'
        : language === 'hi'
        ? 'रियलवेस्ट बेंगलुरु इंटेलिजेंस'
        : 'RealVest Intelligence Engine',
    ],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  const [messages, setMessages] = useState<Message[]>([createInitialMessage()]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  // Contextual suggested questions based on current workspace
  const getSuggestedQuestions = () => {
    if (activeTab === 'analysis' && selectedProperty) {
      return [
        `Why is ${selectedProperty.title} recommended?`,
        'Is the asking price below fair market value?',
        'What are the key investment risks for this property?',
        'What is the estimated monthly cash flow after loan EMI?',
      ];
    }
    if (activeTab === 'simulator') {
      return [
        'Should I buy or rent in Bengaluru?',
        'How does a 0.5% interest rate hike impact my net yield?',
        'What is the recommended holding horizon for tax efficiency?',
      ];
    }
    if (activeTab === 'explore') {
      return [
        'Where should I invest ₹50 lakh in Bengaluru?',
        'Which verified listings offer above 5% gross yield?',
        'Is Whitefield suitable for rental income?',
      ];
    }
    return [
      'Where should I invest ₹50 lakh in Bengaluru?',
      'Is Whitefield suitable for rental income?',
      'Should I buy or rent a property?',
      'What are the main risks of investing in Bengaluru?',
    ];
  };

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

    // Build rich context payload
    const contextPayload: Record<string, any> = {
      active_tab: activeTab,
    };

    if (activeTab === 'analysis' && selectedProperty) {
      contextPayload.property_id = selectedProperty.id;
      contextPayload.location = selectedProperty.location;
      contextPayload.asking_price_lakhs = selectedProperty.askingPriceLakhs;
      contextPayload.fair_value_lakhs = selectedProperty.fairValueLakhs;
      contextPayload.annual_yield = selectedProperty.annualYield;
      contextPayload.investment_score = selectedProperty.investmentScore;
      contextPayload.recommendation = selectedProperty.recommendation;
    } else if (selectedProperty) {
      contextPayload.location = selectedProperty.location;
    }

    // Filter out initial canned welcome message from conversational history
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
          : ['RealVest Bengaluru Housing Database', 'Google Gemini Intelligence Engine'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, advisorMsg]);
    } catch (err: any) {
      console.warn('Backend live API fallback to built-in dataset engine:', err.message);
      try {
        const fallbackRes = await advisorService.query(query, language, properties, selectedProperty || undefined);
        const fallbackMsg: Message = {
          id: `advisor-${Date.now()}`,
          sender: 'advisor',
          text: fallbackRes.answer,
          sources: fallbackRes.sources || ['RealVest Built-in Intelligence Engine'],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } catch (fallbackErr: any) {
        setErrorMessage('Advisor is temporarily unreachable. Please verify your connection or try again.');
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
    <>
      {/* Floating Pill Trigger (when closed) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white shadow-lg flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group border border-white/20"
          title="Open RealVest AI Advisor"
          aria-label="Open RealVest AI Advisor"
        >
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles size={12} className="text-white" />
          </div>
          <span className="font-semibold text-xs tracking-tight">AI Advisor</span>
          <span className="w-2 h-2 rounded-full bg-pos animate-pulse" />
        </button>
      )}

      {/* Floating Assistant Drawer / Panel */}
      {isOpen && (
        <div
          className={clsx(
            'fixed z-50 bg-surface border border-line shadow-pop flex flex-col transition-all duration-300 rv-fade-in font-sans',
            isExpanded
              ? 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[620px] h-[92vh] sm:h-[720px] sm:rounded-2xl rounded-t-2xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[440px] h-[86vh] sm:h-[620px] sm:rounded-2xl rounded-t-2xl'
          )}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-line flex items-center justify-between gap-2 bg-surface-soft/90 backdrop-blur-sm shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-sm shadow-brand/20">
                <Brain size={17} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-xs sm:text-sm text-ink tracking-tight font-display">
                    RealVest AI Advisor
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-soft text-brand text-[10px] font-medium border border-brand/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-pos animate-pulse" />
                    Gemini Live
                  </span>
                </div>
                <p className="text-[10px] text-ink-3 truncate">
                  Context: <span className="capitalize font-medium text-ink-2">{activeTab}</span>
                  {activeTab === 'analysis' && selectedProperty && ` · ${selectedProperty.title}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                title="New Chat (Reset conversation)"
                aria-label="New Chat"
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
                aria-label={isExpanded ? 'Collapse drawer' : 'Expand drawer'}
              >
                {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                title="Close Advisor"
                aria-label="Close Advisor"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          {activeTab === 'analysis' && selectedProperty && (
            <div className="px-3.5 py-1.5 bg-brand-soft/40 border-b border-line text-[11px] text-ink-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 size={12} className="text-brand shrink-0" />
                <span className="font-semibold truncate">{selectedProperty.title}</span>
                <span className="text-ink-3 font-mono text-[10px]">
                  (₹{selectedProperty.askingPriceLakhs}L · {selectedProperty.annualYield}% Yield)
                </span>
              </div>
            </div>
          )}

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 text-xs">
            {/* Empty Welcome Card if conversation hasn't started */}
            {!hasUserMessages && (
              <div className="p-4 rounded-xl bg-surface-soft/60 border border-line text-ink space-y-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-brand text-white flex items-center justify-center text-xs">
                    <Sparkles size={13} />
                  </div>
                  <span className="font-semibold text-xs text-ink">Bengaluru Decision Intelligence</span>
                </div>
                <p className="text-xs text-ink-2 leading-relaxed">
                  Ask questions about micro-markets, rental potential, valuation discounts, or buy vs. rent comparisons.
                </p>
                <div className="pt-1 flex flex-col gap-1.5">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-ink-3">Suggested Prompts</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {getSuggestedQuestions().slice(0, 4).map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-left p-2 rounded-lg bg-surface border border-line hover:border-brand/40 hover:bg-surface-soft text-[11px] text-ink-2 transition-all cursor-pointer font-medium leading-snug"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Message Bubble List */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'flex items-start gap-2.5',
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                {/* Avatar */}
                <div
                  className={clsx(
                    'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 shadow-xs text-xs',
                    msg.sender === 'user'
                      ? 'bg-ink text-canvas font-semibold'
                      : 'bg-brand text-white shadow-brand/20'
                  )}
                >
                  {msg.sender === 'user' ? <User size={13} /> : <Bot size={14} />}
                </div>

                {/* Message Body */}
                <div
                  className={clsx(
                    'max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed shadow-xs',
                    msg.sender === 'user'
                      ? 'bg-brand text-white rounded-tr-xs font-medium'
                      : 'bg-surface border border-line text-ink rounded-tl-xs'
                  )}
                >
                  {/* Markdown Renderer for Advisor / Pre-line for User */}
                  {msg.sender === 'advisor' ? (
                    <ChatMarkdown content={msg.text} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  )}

                  {/* Sources Tag Section */}
                  {msg.sources && msg.sources.length > 0 && msg.sender === 'advisor' && (
                    <div className="pt-2 mt-2 border-t border-line flex flex-wrap items-center gap-1.5">
                      <span className="text-[9px] uppercase font-semibold tracking-wider text-ink-3">Sources:</span>
                      {msg.sources.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-surface-soft text-[10px] font-medium text-ink-2 border border-line"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={clsx(
                      'text-[9px] font-mono text-right',
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
              <div className="flex items-start gap-2.5 rv-fade-in">
                <div className="w-7 h-7 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={14} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-surface border border-line text-ink-3 text-xs flex items-center gap-2.5 shadow-xs">
                  <Loader2 size={14} className="animate-spin text-brand" />
                  <span className="font-medium text-ink-2">Analyzing your question with Gemini…</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-neg-soft/80 border border-neg/20 text-neg text-xs flex items-center justify-between gap-2 rv-fade-in">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-neg font-bold cursor-pointer hover:underline text-[11px]"
                >
                  Dismiss
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Contextual Suggested Chips (Horizontal Scroll) */}
          <div className="px-3 py-1.5 border-t border-line bg-surface shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {getSuggestedQuestions().map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-surface-soft hover:bg-brand-soft hover:text-brand border border-line text-ink-2 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-40"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-line bg-surface shrink-0 rounded-b-2xl">
            <div className="flex items-end gap-2 p-1.5 rounded-xl border border-line bg-surface-soft focus-within:border-brand focus-within:ring-1 focus-within:ring-brand/20 transition-all shadow-xs">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.ask_advisor_placeholder || 'Ask about properties, valuations, or investment decisions…'}
                className="flex-1 px-2.5 py-1.5 text-xs sm:text-sm text-ink bg-transparent focus:outline-none placeholder:text-ink-3 resize-none max-h-24 min-h-[36px]"
                rows={1}
                disabled={isLoading}
                aria-label="Ask RealVest Advisor"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-2 rounded-lg bg-brand hover:bg-brand-hover active:scale-95 disabled:opacity-40 text-white font-semibold transition-all flex items-center justify-center cursor-pointer shrink-0"
                title="Send message (Enter)"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
            <div className="mt-1 px-1 flex items-center justify-between text-[10px] text-ink-3">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Shift+Enter</kbd> for new line</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
