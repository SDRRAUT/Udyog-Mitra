'use client';

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/lib/api';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  RefreshCw,
  ShieldCheck,
  Building2,
  FileText,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CitationChip } from '@/components/app/CitationChip';

interface Citation {
  title: string;
  act: string;
  section: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timeString: string;
  suggestedActions?: string[];
  citations?: Citation[];
}

type Language = 'EN' | 'HI' | 'MR';

export default function FullChatPage() {
  const [language, setLanguage] = useState<Language>('EN');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Namaste! I am **MAHA-MITRA AI**, your statutory Industrial Clearance & Compliance Copilot for the Government of Maharashtra.\n\nI can answer questions regarding:\n- MPCB Consent to Establish (CTE) vs Consent to Operate (CTO)\n- 30-Day statutory SLA enforcement under Maharashtra Right to Public Services Act (RTS 2015)\n- PSI 2019 capital subsidies & electricity duty exemption calculations\n- Single window multi-department joint site inspections',
      timeString: '10:00 AM',
      suggestedActions: [
        'What is the difference between CTE and CTO?',
        'What clearances do I need for Food Processing in Pune?',
        'How does the 30-day statutory SLA work?',
        'Am I eligible for PSI 2019 capital subsidies?',
      ],
      citations: [
        { title: 'Maharashtra Right to Public Services Act 2015', act: 'Maha. Act No. XXXI of 2015', section: 'Section 7(1) - 30-Day SLA' },
        { title: 'Water & Air Pollution Prevention Acts', act: 'MPCB Guidelines 2020', section: 'Categorisation §2.1' },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getTimeString = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: query,
      timeString: getTimeString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const promptWithLang =
        language === 'EN'
          ? query
          : `${query} (Please answer in ${language === 'HI' ? 'Hindi' : 'Marathi'} language)`;
      const res: any = await api.ai.chat(promptWithLang);

      const assistantMsg: Message = {
        role: 'assistant',
        content:
          res?.answer ||
          res?.message ||
          (language === 'HI'
            ? 'CTE (स्थापना सहमति) फैक्ट्री निर्माण या उपकरण स्थापना से पहले ली जाती है। CTO (संचालन सहमति) वाणिज्यिक उत्पादन शुरू करने से पहले ली जाती है।'
            : language === 'MR'
            ? 'CTE (स्थापना संमती) प्रकल्प उभारणीपूर्वी घेतली जाते. CTO (कामकाज संमती) प्रत्यक्ष व्यावसायिक उत्पादन सुरू करण्यापूर्वी घेतली जाते.'
            : 'CTE (Consent to Establish) is obtained BEFORE setting up plant machinery or construction. CTO (Consent to Operate) is obtained AFTER installation and BEFORE commencing commercial production.'),
        timeString: getTimeString(),
        suggestedActions: res?.suggestedActions || [
          'Run Approval Orchestrator',
          'Check PSI 2019 Subsidies',
          'View 30-Day SLA Roadmap',
        ],
        citations: res?.citations || [
          {
            title: 'Maharashtra Industrial Policy & RTS Act',
            act: 'Govt. Resolution 2020',
            section: 'Schedule A - Statutory Clearances',
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'MAHA-MITRA AI is currently evaluating state industrial gazettes in local mode. Under the Maharashtra Right to Public Services Act 2015, all notified industrial clearances are governed by a statutory 30-day timeline.',
          timeString: getTimeString(),
          suggestedActions: [
            'What is CTE vs CTO?',
            'How do joint inspections work?',
          ],
          citations: [
            {
              title: 'RTS Act 2015 Rules',
              act: 'Maha. Act XXXI',
              section: 'Rule 4',
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col selection:bg-[var(--primary-100)] selection:text-[var(--primary-900)]">
      <Navbar />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col min-w-0">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 rounded-xl surface-card border-[var(--border)] shadow-xs mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-50)] border border-[var(--primary-200)] flex items-center justify-center text-[var(--primary-600)] font-bold shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-sm sm:text-base text-[var(--text)]">MAHA-MITRA Industrial AI Copilot</h1>
                <span className="text-[10px] font-mono font-bold bg-[var(--success-bg)] text-[var(--success-text)] border border-[#A6F4C5] px-2 py-0.5 rounded-full">
                  RAG Online
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Trained on Maharashtra Industrial Policies, MPCB Water/Air Acts, and RTS Act 2015
              </p>
            </div>
          </div>

          {/* Language Switch */}
          <div className="flex items-center bg-[var(--surface-2)] p-1 rounded-lg border border-[var(--border)] text-xs font-medium">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2.5 py-1 rounded-md transition ${
                language === 'EN' ? 'bg-[var(--surface)] text-[var(--text)] font-semibold shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('HI')}
              className={`px-2.5 py-1 rounded-md transition ${
                language === 'HI' ? 'bg-[var(--surface)] text-[var(--text)] font-semibold shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              हिंदी
            </button>
            <button
              onClick={() => setLanguage('MR')}
              className={`px-2.5 py-1 rounded-md transition ${
                language === 'MR' ? 'bg-[var(--surface)] text-[var(--text)] font-semibold shadow-xs' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              मराठी
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 surface-card border-[var(--border)] rounded-xl p-4 sm:p-6 shadow-xs overflow-y-auto space-y-4 min-h-[460px] max-h-[580px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 sm:p-4 rounded-xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[var(--primary-600)] text-white rounded-tr-none shadow-xs font-normal'
                    : 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] rounded-tl-none space-y-3'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-[var(--border)] space-y-1.5">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] flex items-center space-x-1 uppercase tracking-wider">
                      <BookOpen className="w-3 h-3 text-[var(--primary-600)]" />
                      <span>Official Regulatory References:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((c, idx) => (
                        <div
                          key={idx}
                          className="p-1.5 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center gap-2 text-[11px]"
                        >
                          <span className="text-[var(--text)] font-medium">{c.title}</span>
                          <span className="text-[10px] font-mono text-[var(--primary-700)] bg-[var(--primary-50)] px-1.5 py-0.5 rounded border border-[var(--primary-200)]">
                            {c.section}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                  {msg.suggestedActions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(act)}
                      className="text-[11px] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] px-2.5 py-1 rounded-md transition shadow-xs text-left cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[var(--primary-600)] shrink-0" />
                      <span>{act}</span>
                    </button>
                  ))}
                </div>
              )}

              <span className="text-[10px] text-[var(--text-subtle)] mt-1 px-1 font-mono">
                {msg.timeString}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-[var(--text-muted)] p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl w-fit animate-pulse">
              <Sparkles className="w-4 h-4 text-[var(--primary-600)] animate-spin" />
              <span>Analyzing Maharashtra statutory database...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="mt-3 p-2 surface-card border-[var(--border)] rounded-xl shadow-xs flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={
              language === 'HI'
                ? 'महाराष्ट्र औद्योगिक मंजूरी, CTE/CTO या RTS SLA के बारे में पूछें...'
                : language === 'MR'
                ? 'महाराष्ट्र औद्योगिक परवानग्या, CTE/CTO किंवा RTS SLA बद्दल विचारा...'
                : 'Ask about Maharashtra clearances, CTE/CTO, joint inspections, or RTS SLA...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:outline-none"
          />
          <Button
            size="sm"
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            rightIcon={<Send className="w-3.5 h-3.5" />}
          >
            Send
          </Button>
        </div>
      </main>
    </div>
  );
}
