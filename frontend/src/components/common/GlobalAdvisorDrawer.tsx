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
  const { language } = useTranslation();

  const getInitialGreeting = () => {
    if (language === 'kn') {
      return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ರಿಯಲ್‌ವೆಸ್ಟ್ ಎಐ ಹೂಡಿಕೆ ಸಲಹೆಗಾರ**. ಬೆಂಗಳೂರಿನ ಆಸ್ತಿಗಳ ಬೆಲೆ, ಬಾಡಿಗೆ ಇಳುವರಿ ಅಥವಾ ಹೂಡಿಕೆ ಅವಕಾಶಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.";
    }
    if (language === 'hi') {
      return "नमस्ते! मैं आपका **रियलवेस्ट एआई निवेश सलाहकार** हूँ। बेंगलुरु की संपत्तियों, बाजार मूल्यांकन या किराये की आय के बारे में पूछें।";
    }
    return "Hello! I am your **RealVest AI Investment Advisor**. Ask me about Bengaluru micro-markets, fair valuations, rental yields, investment risks, or buy vs. rent decisions.";
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
        'What is the estimated monthly cash flow after EMI?',
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
      'Should I buy or rent a property in Bengaluru?',
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
      .slice(-6)
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
        setErrorMessage('Advisor is temporarily unreachable. Please check connection or try again.');
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
          className="fixed bottom-6 right-6 z-40 px-4 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white shadow-lg flex items-center gap-2.5 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 group border border-white/20 font-chat"
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
            'fixed z-50 bg-surface border border-line shadow-pop flex flex-col transition-all duration-300 rv-fade-in font-chat text-ink',
            isExpanded
              ? 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[620px] h-[92vh] sm:h-[720px] sm:rounded-2xl rounded-t-2xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[440px] h-[86vh] sm:h-[620px] sm:rounded-2xl rounded-t-2xl'
          )}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-line/80 flex items-center justify-between gap-2 bg-surface/90 backdrop-blur-md shrink-0 rounded-t-2xl">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Brain size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-xs sm:text-sm text-ink tracking-tight font-chat">
                    RealVest AI Advisor
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pos/10 text-pos text-[10px] font-semibold border border-pos/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-pos animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-[10.5px] text-ink-3 truncate">
                  Context: <span className="capitalize font-medium text-ink-2">{activeTab}</span>
                  {activeTab === 'analysis' && selectedProperty && ` · ${selectedProperty.title}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-soft flex items-center justify-center cursor-pointer transition-colors"
                title="New Chat (Reset conversation)"
                aria-label="New Chat"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-soft flex items-center justify-center cursor-pointer transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
                aria-label={isExpanded ? 'Collapse drawer' : 'Expand drawer'}
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface-soft flex items-center justify-center cursor-pointer transition-colors"
                title="Close Advisor"
                aria-label="Close Advisor"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          {activeTab === 'analysis' && selectedProperty && (
            <div className="px-4 py-1.5 bg-brand-soft/50 border-b border-line/60 text-[11px] text-ink-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 size={13} className="text-brand shrink-0" />
                <span className="font-medium text-ink truncate">{selectedProperty.title}</span>
                <span className="text-ink-3 font-mono text-[10px]">
                  (₹{selectedProperty.askingPriceLakhs}L · {selectedProperty.annualYield}% Yield)
                </span>
              </div>
            </div>
          )}

          {/* Chat Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-3.5 space-y-3.5 text-xs sm:text-sm">
            {/* Initial Welcome & Suggested Prompts (shown cleanly ONCE when chat hasn't started) */}
            {!hasUserMessages && (
              <div className="space-y-3.5 pt-1 rv-fade-in">
                {/* Assistant greeting bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot size={15} />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="bg-surface-soft/80 border border-line/70 rounded-2xl rounded-tl-sm px-4 py-3 shadow-xs">
                      <p className="text-[13.5px] leading-relaxed text-ink/90 font-chat">
                        {getInitialGreeting().replace(/\*\*/g, '')}
                      </p>
                      <div className="mt-2 text-[10.5px] text-ink-3 flex items-center gap-1.5 font-medium">
                        <span>RealVest Intelligence · Bengaluru</span>
                      </div>
                    </div>

                    {/* Single Clean Set of Suggested Prompt Cards */}
                    <div className="space-y-1.5 pt-1.5">
                      <span className="text-[10.5px] font-semibold text-ink-3 uppercase tracking-wider block">
                        Suggested questions
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {getSuggestedQuestions().slice(0, 4).map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            className="w-full text-left px-3.5 py-2.5 rounded-xl bg-surface border border-line/80 hover:border-brand/40 hover:bg-brand-soft/20 hover:text-brand text-[12.5px] text-ink-2 font-medium transition-all cursor-pointer shadow-xs leading-snug font-chat"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Conversation Messages */}
            {hasUserMessages &&
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={clsx(
                    'flex items-start gap-2.5',
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {/* Advisor Avatar */}
                  {msg.sender === 'advisor' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot size={15} />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={clsx(
                      'space-y-1.5 leading-relaxed shadow-xs',
                      msg.sender === 'user'
                        ? 'max-w-[85%] sm:max-w-[80%] bg-brand text-white rounded-2xl rounded-tr-sm px-4 py-2.5'
                        : 'max-w-[90%] sm:max-w-[85%] bg-surface-soft/80 border border-line/70 text-ink rounded-2xl rounded-tl-sm px-4 py-3'
                    )}
                  >
                    {/* Content */}
                    {msg.sender === 'advisor' ? (
                      <ChatMarkdown content={msg.text} />
                    ) : (
                      <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap font-chat font-normal">
                        {msg.text}
                      </p>
                    )}

                    {/* Metadata Footer */}
                    <div
                      className={clsx(
                        'flex items-center justify-between gap-2 pt-1 text-[10px]',
                        msg.sender === 'user'
                          ? 'text-white/70 justify-end'
                          : 'border-t border-line/40 text-ink-3'
                      )}
                    >
                      {msg.sender === 'advisor' && (
                        <div className="flex flex-wrap items-center gap-1 truncate text-[10.5px]">
                          {msg.sources && msg.sources.length > 0 ? (
                            <span className="truncate">Sources: {msg.sources.join(' · ')}</span>
                          ) : (
                            <span>RealVest Intelligence</span>
                          )}
                        </div>
                      )}
                      <span className="font-mono shrink-0">{msg.timestamp}</span>
                    </div>
                  </div>

                  {/* User Avatar */}
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-ink text-canvas flex items-center justify-center shrink-0 shadow-xs text-xs font-semibold">
                      <User size={13} />
                    </div>
                  )}
                </div>
              ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 rv-fade-in">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-brand to-indigo-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={15} />
                </div>
                <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-surface-soft/80 border border-line/70 text-ink-2 text-[13px] flex items-center gap-2.5 shadow-xs font-chat">
                  <Loader2 size={14} className="animate-spin text-brand" />
                  <span>Analyzing with RealVest & Gemini…</span>
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

          {/* Input Area (Clean Capsule with no clipped placeholder) */}
          <div className="p-3 border-t border-line/80 bg-surface shrink-0 rounded-b-2xl">
            <div className="relative flex items-center bg-surface-soft/70 border border-line/90 focus-within:border-brand focus-within:bg-surface focus-within:ring-2 focus-within:ring-brand/15 rounded-2xl transition-all shadow-xs pl-3.5 pr-11 py-1.5">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask RealVest about Bengaluru property..."
                className="w-full text-[13.5px] text-ink bg-transparent focus:outline-none placeholder:text-ink-3 resize-none max-h-24 min-h-[34px] py-1 leading-normal font-chat"
                rows={1}
                disabled={isLoading}
                aria-label="Ask RealVest Advisor"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-brand hover:bg-brand-hover active:scale-95 disabled:opacity-30 text-white transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-xs"
                title="Send message (Enter)"
                aria-label="Send message"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
            <div className="mt-1.5 px-1 flex items-center justify-between text-[10.5px] text-ink-3 font-chat">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Enter</kbd> to send · <kbd className="px-1 py-0.5 rounded bg-surface border border-line font-mono text-[9px]">Shift+Enter</kbd> for newline</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

