import React, { useState } from 'react';
import type { Property, NavTab } from '../../types';
import { Bot, Send, ArrowUpRight, Sparkles } from 'lucide-react';
import { queryAdvisor } from '../../services/analyticsService';

interface AIAdvisorViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigate?: (tab: NavTab) => void;
}

export const AIAdvisorView: React.FC<AIAdvisorViewProps> = ({
  properties,
  onSelectProperty,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'ai'; text: string; matchedProperty?: Property }[]
  >([
    {
      sender: 'ai',
      text: 'Good day! I am RealVest AI Decision Advisor. Ask me anything about property valuations, projected ROIs, or market risks across target commercial and residential assets.',
    },
  ]);

  const suggestedPrompts = [
    'Why is The Vertex Hub a high confidence buy?',
    'Show commercial assets with projected ROI > 10%',
    'What is the risk assessment for Aura Residences?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const updated = [...messages, { sender: 'user' as const, text: query }];

    const { answer, matchedProperties } = queryAdvisor(query, properties);
    const matched = matchedProperties[0] || properties[0];

    updated.push({
      sender: 'ai',
      text: answer,
      matchedProperty: matched,
    });

    setMessages(updated);
    if (!textToSend) setInputQuery('');
  };

  return (
    <div className="space-y-5 pb-20 max-w-2xl mx-auto">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Decision Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ask questions in natural language. Answers are strictly grounded in RealVest models.
        </p>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles size={14} className="text-blue-600 dark:text-emerald-400" /> Prompts:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] text-xs text-slate-700 dark:text-slate-300 font-medium hover:border-blue-500 dark:hover:border-emerald-500 transition-colors shrink-0 cursor-pointer shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] shadow-sm space-y-4 min-h-[360px] max-h-[480px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-emerald-500/20 text-blue-600 dark:text-emerald-400'
              }`}
            >
              {msg.sender === 'user' ? 'YOU' : <Bot size={18} />}
            </div>

            <div className={`max-w-md space-y-2.5 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line text-left ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
                }`}
              >
                {msg.text}
              </div>

              {/* Matched Property Card */}
              {msg.matchedProperty && msg.sender === 'ai' && (
                <div
                  onClick={() => onSelectProperty(msg.matchedProperty!)}
                  className="p-3.5 rounded-2xl border border-blue-200 dark:border-emerald-500/30 bg-blue-50/40 dark:bg-emerald-500/5 hover:bg-blue-50 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer text-left flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase text-blue-600 dark:text-emerald-400">
                      {msg.matchedProperty.code} • {msg.matchedProperty.recommendation} ({msg.matchedProperty.confidenceScore}%)
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                      {msg.matchedProperty.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      ${(msg.matchedProperty.fairValueLakhs / 100).toFixed(1)}M • {msg.matchedProperty.annualYield}% ROI
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-xl bg-blue-600 dark:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-sm">
                    Inspect <ArrowUpRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Query Input Box */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Advisor about assets, valuations, or risks..."
          className="flex-1 px-4 py-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#102034] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:focus:ring-emerald-500/40 transition-all shadow-sm"
        />
        <button
          onClick={() => handleSend()}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 dark:shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Send size={15} /> Send
        </button>
      </div>
    </div>
  );
};
