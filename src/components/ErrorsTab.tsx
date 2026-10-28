import { useState, useEffect } from 'react';
import { errorDatabase } from '../data';
import { ErrorItem } from '../types';
import { 
  Search, 
  AlertTriangle, 
  Cpu, 
  Wifi, 
  ShieldAlert, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Sparkles, 
  Wrench, 
  Send, 
  Loader2, 
  Terminal, 
  Check, 
  Code, 
  Flame, 
  Info,
  ExternalLink,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { errorCategoryMap, errorsTranslationMap } from '../translations';
import { auth } from '../firebase';

interface ErrorsTabProps {
  onCopy: (text: string) => void;
  lang: 'ru' | 'en';
  appTheme?: 'dark' | 'light';
}

// Helper to extract console commands, launch parameters, or paths from solution text
function extractCommandOrSnippet(text: string): { command: string; type: 'console' | 'launch' | 'cli' | 'path' } | null {
  // Steam launch parameters e.g. -force-vulkan, -gc.buffer 4096, -window-mode exclusive
  const launchMatch = text.match(/(-[a-zA-Z0-9_\.]+(\s+[0-9a-zA-Z_\-]+)?)/);
  if (launchMatch && launchMatch[1]) {
    return { command: launchMatch[1].trim(), type: 'launch' };
  }

  // Windows command line (e.g. taskkill /f /im RustClient.exe)
  const cliMatch = text.match(/(taskkill\s+[^\,\.\n\)]+)/i);
  if (cliMatch && cliMatch[1]) {
    return { command: cliMatch[1].trim(), type: 'cli' };
  }

  // In-game F1 Console commands (assetwarmup 0, client.connect ..., net.disconnect, fps.limit 144)
  const cmdMatch = text.match(/\b(assetwarmup\s+\d+|client\.connect\s+[^\s\,\)]+|net\.disconnect|fps\.limit\s+\d+|perf\s+\d+|gc\.buffer\s+\d+)/i);
  if (cmdMatch && cmdMatch[1]) {
    return { command: cmdMatch[1].trim(), type: 'console' };
  }

  // System environment path (e.g. %userprofile%\AppData\...)
  const pathMatch = text.match(/(%[a-zA-Z0-9_]+%[^\s\,\)]+)/i);
  if (pathMatch && pathMatch[1]) {
    return { command: pathMatch[1].trim(), type: 'path' };
  }

  return null;
}

export default function ErrorsTab({ onCopy, lang, appTheme = 'dark' }: ErrorsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  const handleCopyText = (text: string, id: string) => {
    onCopy(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId((prev) => (prev === id ? null : prev));
    }, 2000);
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

  const getCategoryConfig = (cat: ErrorItem['category']) => {
    switch (cat) {
      case 'critical':
        return {
          label: lang === 'en' ? 'CRITICAL CRASH' : 'КРИТИЧЕСКИЙ ВЫЛЕТ',
          color: 'text-orange-500',
          badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
          borderAccent: 'border-l-red-600',
          icon: <AlertTriangle size={13} className="text-orange-500 shrink-0" />
        };
      case 'network':
        return {
          label: lang === 'en' ? 'NETWORK & AUTH' : 'СЕТЬ & АВТОРИЗАЦИЯ',
          color: 'text-cyan-400',
          badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
          borderAccent: 'border-l-cyan-500',
          icon: <Wifi size={13} className="text-cyan-400 shrink-0" />
        };
      case 'eac':
        return {
          label: lang === 'en' ? 'EAC ANTI-CHEAT' : 'АНТИЧИТ EAC',
          color: 'text-purple-400',
          badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          borderAccent: 'border-l-purple-500',
          icon: <ShieldAlert size={13} className="text-purple-400 shrink-0" />
        };
      case 'graphics':
        return {
          label: lang === 'en' ? 'GRAPHICS / GPU' : 'ГРАФИКА & ДРАЙВЕРЫ',
          color: 'text-amber-400',
          badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          borderAccent: 'border-l-amber-500',
          icon: <Cpu size={13} className="text-amber-400 shrink-0" />
        };
    }
  };

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4">
      {/* Search and Category Filter Header (Rust Industrial Military Styling) */}
      <div className="bg-[#121620] border border-[#222938] p-3.5 sm:p-4 relative overflow-hidden shadow-lg rust-metal-pattern rounded-xl w-full max-w-full">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex flex-col gap-3 relative z-10 w-full min-w-0">
          {/* Smart Search Bar */}
          <div className="relative w-full min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={15} />
            <input
              type="text"
              id="error-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? "Search errors, EAC codes, crash logs, or commands..." : "Поиск по ошибкам, кодам EAC, вылетам или консольным командам..."}
              className="w-full bg-[#090b10] border border-[#2a3447] focus:border-[#f97316] text-neutral-100 placeholder-neutral-500 pl-10 pr-8 py-2.5 rounded-lg text-xs font-mono outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs font-mono font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs (Scrollable on small viewports so buttons never exceed boundaries) */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 w-full max-w-full">
            {[
              { id: 'all', label: lang === 'en' ? 'All Errors' : 'Все ошибки', count: errorDatabase.length },
              { id: 'critical', label: lang === 'en' ? 'Critical' : 'Критические', count: errorDatabase.filter(e => e.category === 'critical').length },
              { id: 'eac', label: lang === 'en' ? 'EAC Anti-Cheat' : 'Античит EAC', count: errorDatabase.filter(e => e.category === 'eac').length },
              { id: 'network', label: lang === 'en' ? 'Network' : 'Сеть & Auth', count: errorDatabase.filter(e => e.category === 'network').length },
              { id: 'graphics', label: lang === 'en' ? 'Graphics' : 'Графика', count: errorDatabase.filter(e => e.category === 'graphics').length }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-500 shadow-sm shadow-red-600/30'
                    : 'bg-[#090b10] hover:bg-[#181f2c] border-[#222938] text-neutral-400 hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  activeCategory === cat.id ? 'bg-black/30 text-white' : 'bg-white/5 text-neutral-400'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Line */}
        <div className="mt-3 pt-2.5 border-t border-[#1c2230] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 w-full min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{lang === 'en' ? 'DATABASE: VERIFIED 2026' : 'БАЗА: 2026 АКТУАЛЬНО'}</span>
          </div>
          <div>
            {lang === 'en' ? `${filteredErrors.length} verified fixes` : `Найдено ${filteredErrors.length} решений`}
          </div>
        </div>
      </div>

      {/* AI Diagnostic Panel (Rust Tactical Console) */}
      <div className="bg-[#121620] border border-[#2a3447] p-3.5 sm:p-4 relative overflow-hidden shadow-lg rust-metal-pattern rounded-xl w-full max-w-full">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-black text-orange-500 uppercase tracking-widest min-w-0 truncate">
            <Sparkles size={15} className="text-[#f97316] shrink-0" />
            <span className="truncate">{lang === 'en' ? 'AI ERROR DIAGNOSTIC' : 'ИИ-ДИАГНОСТ ОШИБОК'}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-orange-500/10 border border-orange-500/20 text-orange-400 rounded shrink-0">
            v2.6
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full min-w-0">
          <div className="relative flex-1 min-w-0">
            <Terminal className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSolve(aiQuery)}
              placeholder={lang === 'en' ? "Paste error code, crash log line, or dialog..." : "Вставьте код ошибки или строку вылета из консоли..."}
              className="w-full bg-[#090b10] border border-[#2a3447] focus:border-[#f97316] text-neutral-100 placeholder-neutral-500 pl-10 pr-3 py-2 rounded-lg text-xs font-mono outline-none"
              disabled={aiLoading}
            />
          </div>
          <button
            onClick={() => handleAiSolve(aiQuery)}
            disabled={aiLoading || !aiQuery.trim()}
            className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            {aiLoading ? <Loader2 size={13} className="animate-spin" /> : <Wrench size={13} />}
            <span>{aiLoading ? (lang === 'en' ? 'Analyzing...' : 'Диагностика...') : (lang === 'en' ? 'Diagnose' : 'Найти фикс')}</span>
          </button>
        </div>

        {aiLoading && (
          <div className="mt-2.5 p-2.5 bg-[#090b10] border border-[#2a3447] rounded-lg flex items-center gap-2 text-xs font-mono text-cyan-400 min-w-0">
            <Loader2 size={13} className="animate-spin text-orange-500 shrink-0" />
            <span className="truncate">{loadingStep}</span>
          </div>
        )}

        {aiError && (
          <div className="mt-2.5 p-2.5 bg-red-950/30 border border-orange-500/30 rounded-lg text-xs font-mono text-orange-400 flex items-center gap-2 min-w-0">
            <AlertTriangle size={13} className="shrink-0" />
            <span className="break-words">{aiError}</span>
          </div>
        )}

        {aiResult && !aiLoading && (
          <div className="mt-3 bg-[#090b10] border border-[#2a3447] p-3 rounded-lg text-xs text-neutral-200 font-mono space-y-2 relative max-w-full overflow-hidden">
            <div className="flex items-center justify-between pb-1.5 border-b border-neutral-800 text-[10px] text-neutral-400 font-bold uppercase">
              <span>{lang === 'en' ? 'AI Diagnostic Solution' : 'Результат диагностики'}</span>
              <button
                onClick={() => handleCopyText(aiResult, 'ai-diag')}
                className="flex items-center gap-1 text-orange-400 hover:text-white cursor-pointer"
              >
                {copiedId === 'ai-diag' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                <span>{copiedId === 'ai-diag' ? (lang === 'en' ? 'Copied' : 'Скопировано') : (lang === 'en' ? 'Copy Fix' : 'Скопировать')}</span>
              </button>
            </div>
            <div className="prose prose-invert prose-xs max-w-full break-words overflow-x-auto">
              <Markdown>{aiResult}</Markdown>
            </div>
          </div>
        )}
      </div>

      {/* RUST-THEMED ERROR CARDS GRID (1 column on mobile/tablet, 2 on desktop to guarantee zero overflow) */}
      {filteredErrors.length === 0 ? (
        <div className="bg-[#121620] border border-[#222938] p-8 text-center rounded-xl font-mono space-y-2 w-full max-w-full">
          <AlertTriangle size={28} className="mx-auto text-neutral-600 mb-1" />
          <p className="text-sm font-bold text-neutral-300 uppercase">
            {lang === 'en' ? 'No matching errors found' : 'Ошибок по запросу не найдено'}
          </p>
          <p className="text-xs text-neutral-500">
            {lang === 'en' ? 'Try searching by a broader keyword or use AI diagnostics above.' : 'Попробуйте изменить запрос или вставьте код ошибки в ИИ-диагност выше.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full">
          {filteredErrors.map((error, idx) => {
            const trans = lang === 'en' ? (errorsTranslationMap[error.title] || error) : error;
            const catConfig = getCategoryConfig(error.category);
            const isExpanded = expandedIndex === idx;

            // Search for primary command across solutions
            let detectedCmd: { command: string; type: 'console' | 'launch' | 'cli' | 'path' } | null = null;
            for (const s of trans.sols) {
              const res = extractCommandOrSnippet(s);
              if (res) {
                detectedCmd = res;
                break;
              }
            }

            const primarySolutionText = trans.sols[0] || '';
            const allSolutionsFormatted = trans.sols.map((s, i) => `${i + 1}. ${s}`).join('\n\n');

            return (
              <div
                key={error.title}
                className={`relative bg-[#10141d] border transition-all duration-200 group flex flex-col justify-between rounded-xl overflow-hidden min-w-0 max-w-full w-full ${
                  isExpanded
                    ? 'border-[#f97316] shadow-[0_6px_25px_rgba(205,65,43,0.22)] ring-1 ring-[#f97316]/50'
                    : 'border-[#222938] hover:border-[#f97316]/90 hover:shadow-[0_4px_20px_rgba(205,65,43,0.16)]'
                }`}
              >
                {/* Tactical Corner Brackets */}
                <div className="rust-bracket-tr opacity-40 group-hover:opacity-100 transition-opacity" />
                <div className="rust-bracket-bl opacity-40 group-hover:opacity-100 transition-opacity" />

                {/* Left Colored Accent Notch for Category */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${
                  error.category === 'critical' ? 'bg-red-600' :
                  error.category === 'network' ? 'bg-cyan-500' :
                  error.category === 'eac' ? 'bg-purple-500' : 'bg-amber-500'
                } opacity-80 group-hover:w-2 group-hover:opacity-100 transition-all`} />

                {/* Card Inner Content Container */}
                <div className="p-3.5 sm:p-4 pl-4.5 sm:pl-5 space-y-3 flex-1 flex flex-col min-w-0 max-w-full overflow-hidden">
                  {/* Top Metadata Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-[#1c2230] pb-2 min-w-0">
                    {/* Category Label with Icon */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold tracking-wider min-w-0 truncate">
                      {catConfig.icon}
                      <span className={`truncate ${catConfig.color}`}>{catConfig.label}</span>
                    </div>

                    {/* Solutions Count & Error ID */}
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 shrink-0">
                      <span className="bg-[#181f2c] border border-[#273244] px-1.5 py-0.5 rounded text-neutral-300 font-bold">
                        {trans.sols.length} {lang === 'en' ? (trans.sols.length === 1 ? 'STEP' : 'STEPS') : (trans.sols.length === 1 ? 'ШАГ' : 'ШАГА')}
                      </span>
                      <span className="opacity-50">#{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1 flex-1 min-w-0">
                    <h3 className="text-sm font-black text-neutral-100 group-hover:text-orange-400 transition-colors uppercase tracking-wide leading-snug break-words">
                      {trans.title}
                    </h3>
                    {trans.desc && (
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans break-words line-clamp-2 group-hover:line-clamp-none transition-all">
                        {trans.desc}
                      </p>
                    )}
                  </div>

                  {/* Console Command / Launch Option Box (if detected in solutions) */}
                  {detectedCmd && (
                    <div className="bg-[#07090e] border border-[#1d2535] group-hover:border-[#f97316]/40 p-2 sm:p-2.5 rounded-lg flex items-center justify-between gap-2 font-mono transition-colors min-w-0 max-w-full overflow-hidden">
                      <div className="flex items-center gap-1.5 text-xs min-w-0 overflow-hidden flex-1">
                        <Terminal size={12} className="text-orange-500 shrink-0" />
                        <span className="text-orange-500 font-black select-none shrink-0">&gt;</span>
                        <span className="text-emerald-400 font-bold truncate break-all selection:bg-emerald-500/30 selection:text-white">
                          {detectedCmd.command}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyText(detectedCmd!.command, `cmd-${error.title}`);
                        }}
                        className={`px-2 py-1 text-[10px] font-mono font-bold uppercase rounded transition-all cursor-pointer flex items-center gap-1 shrink-0 border ${
                          copiedId === `cmd-${error.title}`
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                            : 'bg-orange-500/10 hover:bg-red-600 text-orange-400 hover:text-white border-orange-500/30 hover:border-red-600'
                        }`}
                        title={lang === 'en' ? 'Copy command to clipboard' : 'Скопировать команду в буфер'}
                      >
                        {copiedId === `cmd-${error.title}` ? (
                          <>
                            <Check size={10} className="text-emerald-400" />
                            <span>{lang === 'en' ? 'COPIED' : 'ОК'}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={10} />
                            <span>{lang === 'en' ? 'COPY CMD' : 'КОМАНДА'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Primary Solution Preview (First Step) */}
                  {!isExpanded && (
                    <div className="bg-[#151a24]/70 border border-[#222938] p-2.5 rounded-lg text-xs text-neutral-300 font-mono flex items-start gap-2 min-w-0 max-w-full overflow-hidden">
                      <span className="text-orange-500 font-bold shrink-0">01.</span>
                      <p className="line-clamp-2 leading-relaxed text-neutral-300 break-words flex-1 min-w-0">
                        {primarySolutionText}
                      </p>
                    </div>
                  )}

                  {/* Expanded Step-by-Step Checklist */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 pt-2 border-t border-[#1c2230] min-w-0 max-w-full overflow-hidden"
                      >
                        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                          <Layers size={11} className="text-orange-500 shrink-0" />
                          <span>{lang === 'en' ? 'VERIFIED FIX STEPS:' : 'ПОШАГОВОЕ РЕШЕНИЕ:'}</span>
                        </div>

                        {trans.sols.map((sol, stepIdx) => {
                          const stepCmd = extractCommandOrSnippet(sol);
                          const stepCopyId = `step-${error.title}-${stepIdx}`;
                          return (
                            <div
                              key={stepIdx}
                              className="bg-[#0b0e14] border border-[#202736] hover:border-[#2f394e] p-2.5 rounded-lg text-xs font-mono space-y-1.5 transition-colors min-w-0 max-w-full overflow-hidden"
                            >
                              <div className="flex items-start justify-between gap-2 min-w-0">
                                <div className="flex items-start gap-1.5 min-w-0 flex-1">
                                  <span className="text-orange-500 font-bold shrink-0">
                                    {String(stepIdx + 1).padStart(2, '0')}.
                                  </span>
                                  <span className="text-neutral-200 leading-relaxed font-sans text-xs break-words min-w-0 flex-1">
                                    {sol}
                                  </span>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyText(sol, stepCopyId);
                                  }}
                                  className="text-neutral-500 hover:text-white p-1 rounded shrink-0 transition-colors"
                                  title={lang === 'en' ? 'Copy step text' : 'Скопировать текст шага'}
                                >
                                  {copiedId === stepCopyId ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                                </button>
                              </div>

                              {/* If this step has an explicit command, provide direct command copy */}
                              {stepCmd && (
                                <div className="bg-[#05070a] border border-[#1a202c] px-2 py-1 rounded flex items-center justify-between gap-2 text-[11px] text-emerald-400 min-w-0 max-w-full overflow-hidden">
                                  <code className="truncate break-all min-w-0 flex-1">{stepCmd.command}</code>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyText(stepCmd.command, `step-cmd-${stepIdx}`);
                                    }}
                                    className="text-[10px] text-orange-400 hover:text-white uppercase font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                                  >
                                    {copiedId === `step-cmd-${stepIdx}` ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                                    <span>{copiedId === `step-cmd-${stepIdx}` ? (lang === 'en' ? 'COPIED' : 'ОК') : (lang === 'en' ? 'COPY' : 'КОПИЯ')}</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Card Action Footer */}
                <div className="p-2.5 sm:p-3 bg-[#0a0d14] border-t border-[#1c2230] flex items-center justify-between gap-2 min-w-0 max-w-full">
                  {/* Master Copy Solution Button */}
                  <button
                    onClick={() => handleCopyText(allSolutionsFormatted, `full-${error.title}`)}
                    className={`flex-1 min-w-0 py-2 px-2.5 sm:px-3 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 border truncate ${
                      copiedId === `full-${error.title}`
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-xs'
                        : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-orange-500 hover:to-orange-500 text-white border-orange-500/40 shadow-sm shadow-red-600/25 active:scale-[0.98]'
                    }`}
                    title={lang === 'en' ? 'Copy all solution steps to clipboard' : 'Скопировать полное решение в буфер обмена'}
                  >
                    {copiedId === `full-${error.title}` ? (
                      <>
                        <Check size={12} className="text-emerald-400 shrink-0" />
                        <span className="truncate">{lang === 'en' ? 'COPIED!' : 'СКОПИРОВАНО!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} className="shrink-0" />
                        <span className="truncate">{lang === 'en' ? 'COPY SOLUTION' : 'СКОПИРОВАТЬ РЕШЕНИЕ'}</span>
                      </>
                    )}
                  </button>

                  {/* Expand / Collapse All Steps Button */}
                  <button
                    onClick={() => toggleExpand(idx)}
                    className={`py-2 px-2.5 sm:px-3 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 border shrink-0 ${
                      isExpanded
                        ? 'bg-[#181f2c] text-white border-[#2e3b50]'
                        : 'bg-[#10141d] hover:bg-[#181f2c] text-neutral-400 hover:text-white border-[#222938]'
                    }`}
                    title={isExpanded ? (lang === 'en' ? 'Collapse steps' : 'Свернуть шаги') : (lang === 'en' ? 'Expand all steps' : 'Развернуть все шаги')}
                  >
                    <span>{isExpanded ? (lang === 'en' ? 'LESS' : 'СВЕРНУТЬ') : (lang === 'en' ? 'STEPS' : 'ШАГИ')}</span>
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
