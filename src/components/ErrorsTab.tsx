import { useState, useEffect } from 'react';
import { errorDatabase } from '../data';
import { ErrorItem } from '../types';
import { Search, AlertTriangle, Cpu, Wifi, ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Copy, Sparkles, Wrench, Send, Loader2, RefreshCw, Terminal, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { errorCategoryMap, errorsTranslationMap } from '../translations';
import { auth } from '../firebase';

interface ErrorsTabProps {
  onCopy: (text: string) => void;
  lang: 'ru' | 'en';
}

export default function ErrorsTab({ onCopy, lang }: ErrorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // AI Troubleshooter State
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiHistory, setAiHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rust_hub_ai_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loadingStep, setLoadingStep] = useState(lang === 'en' ? 'Analyzing error code...' : 'Анализируем код ошибки...');

  // Save history to localstorage
  useEffect(() => {
    localStorage.setItem('rust_hub_ai_history', JSON.stringify(aiHistory));
  }, [aiHistory]);

  // Loading steps animation
  useEffect(() => {
    if (!aiLoading) return;
    const steps = lang === 'en' ? [
      'Analyzing error code...',
      'Checking Facepunch log databases...',
      'Searching for known fixes in Steam & Reddit...',
      'Compiling step-by-step fix guide...',
      'Formatting results...'
    ] : [
      'Анализируем код ошибки...',
      'Проверяем базу данных логов Facepunch...',
      'Поиск известных фиксов в сообществе Steam & Reddit...',
      'Компилируем пошаговое руководство по исправлению...',
      'Форматируем результаты...'
    ];
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % steps.length;
      setLoadingStep(steps[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, [aiLoading, lang]);

  const handleAiSolve = async (query: string) => {
    if (!query.trim()) return;
    setAiLoading(true);
    setAiResult(null);
    setAiError(null);

    // Add to history
    if (!aiHistory.includes(query.trim())) {
      setAiHistory(prev => [query.trim(), ...prev].slice(0, 5));
    }

    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/gemini/solve', {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`
         },
         body: JSON.stringify({ errorQuery: query, lang })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setAiResult(data.result);
      } else {
        setAiError(data.error || (lang === 'en' ? 'Failed to get a response from AI diagnostics.' : 'Не удалось получить ответ от ИИ-диагноста.'));
      }
    } catch (err) {
      setAiError(lang === 'en' ? 'AI server connection error. Please check your network.' : 'Ошибка соединения с сервером ИИ. Проверьте подключение к сети.');
    } finally {
      setAiLoading(false);
    }
  };

  // Filter errors by search query and category
  const filteredErrors = errorDatabase.filter((error) => {
    const matchesCategory = activeCategory === 'all' || error.category === activeCategory;
    const trans = lang === 'en' ? (errorsTranslationMap[error.title] || error) : error;
    const matchesSearch =
      trans.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (trans.desc && trans.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      trans.sols.some((sol) => sol.toLowerCase().includes(searchQuery.toLowerCase())) ||
      error.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryBadge = (cat: ErrorItem['category']) => {
    switch (cat) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
            <AlertTriangle size={12} />
            {lang === 'en' ? 'CRITICAL' : 'КРИТИЧЕСКАЯ'}
          </span>
        );
      case 'network':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
            <Wifi size={12} />
            {lang === 'en' ? 'NETWORK' : 'СЕТЕВАЯ'}
          </span>
        );
      case 'eac':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono">
            <ShieldAlert size={12} />
            {lang === 'en' ? 'ANTI-CHEAT EAC' : 'АНТИЧИТ EAC'}
          </span>
        );
      case 'graphics':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
            <Cpu size={12} />
            {lang === 'en' ? 'GRAPHICS' : 'ГРАФИКА'}
          </span>
        );
    }
  };

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row gap-3 bg-[#14171e] p-4 border border-[#cd412b]/50 shadow-[0_0_10px_rgba(205,65,43,0.3),_0_0_10px_rgba(59,130,246,0.3)]">
        {/* Smart Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            id="error-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? "Search..." : "Поиск..."}
            className="w-full bg-[#0c0d10] border border-[#cd412b]/30 text-[#e1e1e6] placeholder-gray-600 pl-10 pr-3 py-2 rounded text-sm outline-none transition-all"
          />
        </div>

        {/* Categories Tab Pill */}
        <div className="flex flex-wrap gap-1">
          {[
            { id: 'all', label: lang === 'en' ? 'All' : 'Все' },
            { id: 'critical', label: lang === 'en' ? 'Critical' : 'Крит' },
            { id: 'network', label: lang === 'en' ? 'Network' : 'Сеть' },
            { id: 'eac', label: lang === 'en' ? 'EAC' : 'EAC' },
            { id: 'graphics', label: lang === 'en' ? 'Graphics' : 'Графика' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs uppercase ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-[#cd412b] to-[#3b82f6] text-white'
                  : 'text-gray-400 hover:text-white bg-[#1b1e26]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Diagnostic Panel */}
      <div className="bg-[#14171e] border-2 border-[#cd412b]/50 shadow-[0_0_15px_rgba(205,65,43,0.3),_0_0_15px_rgba(59,130,246,0.3)] p-5 space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-[#cd412b]" />
          <div>
            <h2 className="text-sm font-bold text-white uppercase">
              {lang === 'en' ? 'AI Error Diagnostics' : 'ИИ-Диагностика'}
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            placeholder={lang === 'en' ? "Paste error code..." : "Вставьте код ошибки..."}
            className="flex-1 bg-[#0c0d10] border border-[#cd412b]/30 text-[#e1e1e6] placeholder-gray-600 px-3 py-2 rounded text-sm outline-none"
            disabled={aiLoading}
          />
          <button
            onClick={() => handleAiSolve(aiQuery)}
            disabled={aiLoading || !aiQuery.trim()}
            className="px-4 bg-gradient-to-r from-[#cd412b] to-[#3b82f6] text-white text-sm font-bold disabled:bg-gray-800"
          >
            {aiLoading ? <Loader2 size={16} className="animate-spin" /> : (lang === 'en' ? 'Diagnose' : 'Диагностировать')}
          </button>
        </div>

        {aiResult && !aiLoading && (
          <div className="bg-[#0c0d10] border border-[#cd412b]/30 p-4 text-xs text-gray-300">
            <Markdown>{aiResult}</Markdown>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredErrors.map((error, idx) => {
          const trans = lang === 'en' ? (errorsTranslationMap[error.title] || error) : error;
          return (
            <div key={error.title} className="bg-[#14171e] border-2 border-[#cd412b]/50 shadow-[0_0_15px_rgba(205,65,43,0.5),_0_0_15px_rgba(59,130,246,0.5)] p-4 flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white mb-2">{trans.title}</h3>
              <p className="text-xs text-gray-400 mb-3">{trans.desc}</p>
              <button
                onClick={() => onCopy(trans.sols[0])}
                className="text-[10px] text-[#cd412b] border border-[#cd412b]/30 px-2 py-1 uppercase"
              >
                {lang === 'en' ? 'Copy Solution' : 'Скопировать решение'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
