import React, { useState } from 'react';
import type { Property, NavTab } from '../../types';
import { Bot, Send, ArrowUpRight, Sparkles } from 'lucide-react';
import { advisorService } from '../../services/advisorService';
import { useTranslation } from '../../context/LanguageContext';
import { formatInrLakhs } from '../../utils/currency';

interface AIAdvisorViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate?: (tab: NavTab) => void;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const { language, t } = useTranslation();
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; matchedProperty?: Property }[]
  >([
    {
      sender: 'ai',
      text: t.advisor_greeting,
    },
  ]);

  const suggestedPrompts = language === 'hi'
    ? [
        'व्हाइटफील्ड में 80 लाख के अंदर 2 बीएचके दिखाएं',
        'उच्चतम रेंटल यील्ड वाली संपत्तियां कौन सी हैं?',
        'क्या इंदिरानगर में निवेश करना सुरक्षित है?',
      ]
    : language === 'kn'
    ? [
        'ವೈಟ್‌ಫೀಲ್ಡ್‌ನಲ್ಲಿ 80 ಲಕ್ಷದೊಳಗಿನ ಮನೆಗಳನ್ನು ತೋರಿಸಿ',
        'ಹೆಚ್ಚು ಬಾಡಿಗೆ ಆದಾಯ ನೀಡುವ ಆಸ್ತಿಗಳು ಯಾವುವು?',
        'ಇಂದಿರಾನಗರದಲ್ಲಿ ಹೂಡಿಕೆ ಮಾಡುವುದು ಲಾಭದಾಯಕವೇ?',
      ]
    : [
        'Show 2 BHK properties under ₹80 Lakhs in Whitefield',
        'Which properties have the highest rental yield?',
        'What is the risk assessment for Whitefield luxury apartment?',
      ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const updated = [...messages, { sender: 'user' as const, text: query }];
    setMessages(updated);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    const { answer, matchedProperties } = await advisorService.query(query, language, properties);
    const matched = matchedProperties[0] || properties[0];

    setIsTyping(false);
    setMessages([
      ...updated,
      {
        sender: 'ai',
        text: answer,
        matchedProperty: matched,
      },
    ]);
  };

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t.advisor_title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t.advisor_subtitle}
        </p>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles size={14} className="text-blue-600 dark:text-blue-400" /> {t.suggested_prompts}
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] text-xs text-slate-700 dark:text-slate-300 font-medium hover:border-blue-500 dark:hover:border-blue-400 transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-5 rounded-3xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] shadow-sm space-y-4 min-h-[360px] max-h-[480px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-[#273449]'
              }`}
            >
              {msg.sender === 'user' ? 'YOU' : <Bot size={18} />}
            </div>

            <div className={`max-w-md space-y-2.5 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'bg-slate-50 dark:bg-[#172033] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#273449]'
                }`}
              >
                {msg.text}
              </div>

              {/* Matched Property Card */}
              {msg.matchedProperty && msg.sender === 'ai' && (
                <div
                  onClick={() => onSelectProperty(msg.matchedProperty!)}
                  className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-[#172033] hover:bg-blue-50 dark:hover:bg-[#1e2c47] transition-colors cursor-pointer text-left flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-blue-400">
                      {msg.matchedProperty.code} • {msg.matchedProperty.recommendation} ({msg.matchedProperty.confidenceScore}% {t.confidence})
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {msg.matchedProperty.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {formatInrLakhs(msg.matchedProperty.fairValueLakhs)} • {msg.matchedProperty.annualYield}% ROI
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-sm shrink-0">
                    {t.inspect_btn} <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
            Analyzing Bengaluru housing price models...
          </div>
        )}
      </div>

      {/* Query Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.ask_advisor_placeholder}
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 dark:border-[#273449] bg-white dark:bg-[#111827] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-blue-500/40 transition-all shadow-sm"
        />
        <button
          onClick={() => handleSend()}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send size={15} /> {t.send_btn}
        </button>
      </div>
    </div>
  );
};

