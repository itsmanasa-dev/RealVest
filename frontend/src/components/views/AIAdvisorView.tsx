import React, { useState } from 'react';
import type { Property, NavTab } from '../../types';
import { Bot, Send, ArrowUpRight, Sparkles } from 'lucide-react';

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
      text: 'Good day, Investor. I am RealVest AI Advisor. Ask me anything about property valuations, risk parameters, or yield expectations across your target markets.',
    },
  ]);

  const suggestedPrompts = [
    'Why is Austin ATX-442 a high confidence buy?',
    'Show properties under $40M with cap rate > 6.5%',
    'What is the price risk for Miami multi-family assets?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    // Add User Message
    const updated = [...messages, { sender: 'user' as const, text: query }];

    // Simple Data Matching AI Engine logic
    const matched = properties.find(
      (p) =>
        query.toLowerCase().includes(p.city.toLowerCase()) ||
        query.toLowerCase().includes(p.code.toLowerCase()) ||
        query.toLowerCase().includes(p.title.toLowerCase())
    ) || properties[0];

    // Add AI Response
    updated.push({
      sender: 'ai',
      text: `Based on RealVest ML models for ${matched.title} (${matched.code}): Estimated Fair Value is $${(matched.estimatedValue / 1000000).toFixed(1)}M with projected ${matched.projectedRoi}% ROI. Recommendation: ${matched.recommendation} (${matched.confidenceScore}% Confidence).`,
      matchedProperty: matched,
    });

    setMessages(updated);
    if (!textToSend) setInputQuery('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono text-[11px] font-bold uppercase tracking-wider">
            NATURAL LANGUAGE INTELLIGENCE
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          AI Decision Advisor
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ask questions in natural language. Answers are strictly grounded in RealVest backend valuation models.
        </p>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles size={14} className="text-emerald-500" /> Prompts:
        </span>
        {suggestedPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] text-xs text-slate-700 dark:text-slate-300 font-medium hover:border-emerald-500 hover:text-emerald-500 transition-all shrink-0 cursor-pointer shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] shadow-sm space-y-4 min-h-[380px] max-h-[500px] overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
              }`}
            >
              {msg.sender === 'user' ? 'YOU' : <Bot size={18} />}
            </div>

            <div className={`max-w-xl space-y-3 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50'
                }`}
              >
                {msg.text}
              </div>

              {/* Matched Property Card Attachment if available */}
              {msg.matchedProperty && msg.sender === 'ai' && (
                <div
                  onClick={() => onSelectProperty(msg.matchedProperty!)}
                  className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors cursor-pointer text-left flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="text-[10px] font-mono font-bold uppercase text-emerald-500">
                      {msg.matchedProperty.code} • {msg.matchedProperty.recommendation} ({msg.matchedProperty.confidenceScore}%)
                    </div>
                    <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {msg.matchedProperty.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      ${(msg.matchedProperty.estimatedValue / 1000000).toFixed(1)}M • {msg.matchedProperty.projectedRoi}% ROI
                    </div>
                  </div>
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1 shadow-md">
                    Inspect <ArrowUpRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Query Input Box */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Advisor about properties, valuations, or local market risks..."
          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102034] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
        >
          <Send size={16} /> Send
        </button>
      </div>
    </div>
  );
};
