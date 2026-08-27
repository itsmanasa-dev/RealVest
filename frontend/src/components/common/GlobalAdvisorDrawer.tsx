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
  ChevronDown,
  Minimize2,
  Maximize2,
  MessageSquare,
} from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { advisorApi } from '../../services/api/advisorApi';
import { advisorService } from '../../services/advisorService';
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
      return "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **ರಿಯಲ್‌ವೆಸ್ಟ್ ಎಐ ಹೂಡಿಕೆ ಸಲಹೆಗಾರ**. ಬೆಂಗಳೂರಿನ ಆಸ್ತಿಗಳ ಬೆಲೆ, ಬಾಡಿಗೆ ಇಳುವರಿ, ಅಪಾಯಗಳು ಅಥವಾ ಹೂಡಿಕೆ ಅವಕಾಶಗಳ ಬಗ್ಗೆ ನನ್ನನ್ನು ಕೇಳಿ.";
    }
    if (language === 'hi') {
      return "नमस्ते! मैं आपका **रियलवेस्ट एआई निवेश सलाहकार** हूँ। बेंगलुरु की संपत्तियों, मूल्यांकन, किराये की आय, जोखिम या निवेश अवसरों के बारे में पूछें।";
    }
    return "Hello! I am your **RealVest AI Investment Advisor**. Ask me about Bengaluru localities, valuations, rental yields, risks, or scenario planning.";
  };

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'advisor',
        text: getInitialGreeting(),
        sources: [language === 'kn' ? "ರಿಯಲ್‌ವೆಸ್ಟ್ ಬೆಂಗಳೂರು ಇಂಟೆಲಿಜೆನ್ಸ್" : language === 'hi' ? "रियलवेस्ट बेंगलुरु इंटेलिजेंस" : "RealVest Bengaluru Intelligence"],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [language]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isLoading, isOpen]);

  // Contextual suggested questions based on current workspace and language
  const getSuggestedQuestions = () => {
    if (language === 'kn') {
      if (activeTab === 'analysis' && selectedProperty) {
        return [
          `ಈ ಆಸ್ತಿಯನ್ನು ಏಕೆ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ?`,
          "ಕೇಳಲಾದ ಬೆಲೆ ನ್ಯಾಯಯುತವಾಗಿದೆಯೇ?",
          "ಪ್ರಮುಖ ಅಪಾಯದ ಅಂಶಗಳು ಯಾವುವು?",
          "ನಿರೀಕ್ಷಿತ ಬಾಡಿಗೆ ಇಳುವರಿ ಎಷ್ಟು?",
        ];
      }
      if (activeTab === 'markets') {
        return [
          "ಬೆಂಗಳೂರಿನಲ್ಲಿ ಅತಿ ಹೆಚ್ಚು ಬೆಳವಣಿಗೆಯಾಗುತ್ತಿರುವ ಪ್ರದೇಶ ಯಾವುದು?",
          "ವೈಟ್‌ಫೀಲ್ಡ್ ಬಾಡಿಗೆ ಆದಾಯಕ್ಕೆ ಉತ್ತಮವೇ?",
          "2025-2026 HPI ಮುನ್ಸೂಚನೆ ವಿವರಿಸಿ.",
        ];
      }
      return [
        "₹50 ಲಕ್ಷ ಬಜೆಟ್‌ಗೆ ಎಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡಬೇಕು?",
        "ವೈಟ್‌ಫೀಲ್ಡ್ ಬಾಡಿಗೆಗೆ ಸೂಕ್ತವೇ?",
        "ಖರೀದಿಸಬೇಕೆ ಅಥವಾ ಬಾಡಿಗೆಗೆ ಇರಬೇಕೆ?",
      ];
    }
    if (language === 'hi') {
      if (activeTab === 'analysis' && selectedProperty) {
        return [
          `इस संपत्ति की सिफारिश क्यों की गई?`,
          "क्या मांगी गई कीमत उचित है?",
          "सबसे बड़े जोखिम कारक क्या हैं?",
        ];
      }
      if (activeTab === 'markets') {
        return [
          "बेंगलुरु में सबसे तेज विकास किस क्षेत्र में है?",
          "क्या व्हाइटफील्ड किराये के लिए अच्छा है?",
          "2025-2026 HPI पूर्वानुमान समझाएं।",
        ];
      }
      return [
        "₹50 लाख के बजट में कहाँ निवेश करें?",
        "क्या व्हाइटफील्ड किराये के लिए अच्छा है?",
        "खरीदें या किराये पर रहें?",
      ];
    }
    if (activeTab === 'analysis' && selectedProperty) {
      return [
        `Why was ${selectedProperty.title} recommended?`,
        "Is the asking price below fair market value?",
        "What are the biggest risk factors for this property?",
        "What is the expected rental yield?",
      ];
    }
    if (activeTab === 'markets') {
      return [
        "Which Bengaluru corridor has the strongest capital growth?",
        "Is Whitefield good for rental income?",
        "Explain the 2025-2026 Bengaluru HPI forecast.",
      ];
    }
    if (activeTab === 'simulator') {
      return [
        "Should I buy or rent in Bengaluru?",
        "How does a 0.5% interest rate hike impact my net yield?",
        "What is the recommended holding horizon for tax efficiency?",
      ];
    }
    if (activeTab === 'explore') {
      return [
        "Where should I invest ₹50 lakh in Bengaluru?",
        "Which verified listings offer above 5% gross yield?",
        "What can I afford with ₹30 lakh?",
      ];
    }
    return [
      "Where should I invest ₹50L?",
      "Is Whitefield good for rental income?",
      "Should I buy or rent?",
      "What are the biggest real estate risks in Bengaluru?",
    ];
  };


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

    // Build rich context payload based on current workspace
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

    // Build history payload (last 6 messages)
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
      console.warn('Backend live API fallback to built-in dataset engine:', err.message);
      try {
        const fallbackRes = await advisorService.query(query, language, properties, selectedProperty || undefined);
        const fallbackMsg: Message = {
          id: `advisor-${Date.now()}`,
          sender: 'advisor',
          text: fallbackRes.answer,
          sources: fallbackRes.sources || ["RealVest Built-in Intelligence"],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } catch (fallbackErr: any) {
        setErrorMessage("RealVest Advisor is temporarily unavailable. Please try again.");
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
    <>
      {/* Floating Trigger Button (Bottom-Right across all pages) */}
      {!isOpen && (
        <button
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl bg-brand hover:bg-brand-strong text-white shadow-pop flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer select-none group"
          title="Open RealVest AI Advisor"
          aria-label="Open AI Advisor"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <Brain size={18} className="shrink-0" />
          <span className="font-semibold text-xs tracking-tight">AI Advisor</span>
          {activeTab === 'analysis' && selectedProperty && (
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono truncate max-w-[100px]">
              {selectedProperty.title}
            </span>
          )}
        </button>
      )}

      {/* Floating Assistant Drawer / Panel */}
      {isOpen && (
        <div
          className={clsx(
            'fixed z-50 bg-surface border border-line shadow-pop flex flex-col transition-all duration-300 rv-fade-in',
            isExpanded
              ? 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[560px] h-[90vh] sm:h-[680px] sm:rounded-2xl rounded-t-2xl'
              : 'bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-[410px] h-[85vh] sm:h-[580px] sm:rounded-2xl rounded-t-2xl'
          )}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-line flex items-center justify-between gap-2 bg-surface-soft/80 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-sm">
                <Brain size={17} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-xs text-ink tracking-tight">RealVest AI Advisor</h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-brand-soft text-brand text-[9px] font-mono font-bold">
                    ONLINE
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
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg text-ink-3 hover:text-ink hover:bg-surface flex items-center justify-center cursor-pointer transition-colors"
                title="Close Advisor"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Active Context Banner */}
          {activeTab === 'analysis' && selectedProperty && (
            <div className="px-3.5 py-1.5 bg-brand-soft/50 border-b border-line text-[11px] text-ink-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <Building2 size={12} className="text-brand shrink-0" />
                <span className="font-semibold truncate">{selectedProperty.title}</span>
                <span className="text-ink-3 font-mono">({selectedProperty.annualYield}% Yield)</span>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={clsx(
                  'flex items-start gap-2.5',
                  msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                )}
              >
                <div
                  className={clsx(
                    'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white shadow-xs',
                    msg.sender === 'user' ? 'bg-ink' : 'bg-brand'
                  )}
                >
                  {msg.sender === 'user' ? <User size={13} /> : <Bot size={14} />}
                </div>

                <div
                  className={clsx(
                    'max-w-[85%] rounded-2xl p-3.5 space-y-1.5 text-xs leading-relaxed shadow-xs',
                    msg.sender === 'user'
                      ? 'bg-brand text-white rounded-tr-xs'
                      : 'bg-surface-soft border border-line text-ink rounded-tl-xs'
                  )}
                >
                  <div className="whitespace-pre-line font-sans">
                    {msg.text.split('\n').map((line, i) => {
                      if (line.startsWith('• ') || line.startsWith('* ')) {
                        return (
                          <div key={i} className="flex items-start gap-1.5 my-0.5">
                            <span className={msg.sender === 'user' ? 'text-white' : 'text-brand font-bold'}>•</span>
                            <span>{line.replace(/^[•*]\s*/, '')}</span>
                          </div>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <div key={i} className="font-bold text-ink mt-1">
                            {line.replace(/\*\*/g, '')}
                          </div>
                        );
                      }
                      return <p key={i}>{line}</p>;
                    })}
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="pt-1.5 border-t border-line/60 flex flex-wrap items-center gap-1">
                      <span className="text-[9px] font-mono text-ink-3 uppercase">Source:</span>
                      {msg.sources.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-surface text-[9px] font-mono text-ink-3 border border-line"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={clsx('text-[9px] font-mono text-right', msg.sender === 'user' ? 'text-white/70' : 'text-ink-3')}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-brand text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot size={14} />
                </div>
                <div className="p-3 rounded-2xl bg-surface-soft border border-line text-ink-3 text-xs flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="font-mono text-xs text-ink-2">RealVest is thinking…</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 rounded-xl bg-warn-soft text-warn text-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Contextual Suggested Questions */}
          <div className="px-3 py-1.5 border-t border-line bg-surface shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {getSuggestedQuestions().map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="px-2.5 py-1 rounded-full bg-surface-soft hover:bg-brand-soft hover:text-brand border border-line text-ink-2 text-[11px] font-medium whitespace-nowrap transition-colors cursor-pointer shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-line bg-surface shrink-0">
            <div className="flex items-center gap-2 p-1 rounded-xl border border-line bg-surface-soft focus-within:border-brand transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.ask_advisor_placeholder}
                className="flex-1 px-2.5 py-1.5 text-xs text-ink bg-transparent focus:outline-none placeholder:text-ink-3"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="px-3 py-1.5 rounded-lg bg-brand hover:bg-brand-strong disabled:opacity-40 text-white font-semibold text-xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{t.send_btn}</span>
                <Send size={12} />
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
