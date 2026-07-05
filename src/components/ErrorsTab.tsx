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
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-[#14171e]/90 p-5 rounded-none border border-[#2a2f3b] shadow-md relative overflow-hidden">
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600" />
        <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-600" />

        {/* Smart Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            id="error-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'en' ? "Smart search for solutions (e.g. Unity, Memory, Reset)..." : "Умный поиск решений (например: Unity, Memory, Сбрось)..."}
            className="w-full bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/70 focus:ring-1 focus:ring-[#cd412b]/30 text-[#e1e1e6] placeholder-gray-500 pl-11 pr-4 py-3 rounded-none outline-none transition-all text-sm font-sans font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-[10px] font-bold px-2 py-1 rounded-none bg-gray-800"
            >
              {lang === 'en' ? 'Reset' : 'Сброс'}
            </button>
          )}
        </div>

        {/* Categories Tab Pill */}
        <div className="flex flex-wrap gap-1.5 bg-[#0c0d10] p-1.5 rounded-none border border-[#2a2f3b]">
          {[
            { id: 'all', label: lang === 'en' ? 'All Errors' : 'Все ошибки' },
            { id: 'critical', label: lang === 'en' ? 'Critical' : 'Критические' },
            { id: 'network', label: lang === 'en' ? 'Network' : 'Сеть' },
            { id: 'eac', label: lang === 'en' ? 'EAC Anti-Cheat' : 'Античит EAC' },
            { id: 'graphics', label: lang === 'en' ? 'Graphics' : 'Графика' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-none text-xs font-bold transition-all cursor-pointer font-mono uppercase ${
                activeCategory === cat.id
                  ? 'bg-[#cd412b] text-white font-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Diagnostic Panel */}
      <div className="bg-[#14171e]/90 border-2 border-[#cd412b]/30 p-6 rounded-none shadow-xl space-y-4 relative overflow-hidden">
        {/* Tactical Corner Brackets */}
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        {/* Top diagonal stripe */}
        <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />
        
        {/* Decorative glowing gradient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#cd412b]/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-none bg-[#cd412b]/10 text-[#cd412b] border border-[#cd412b]/20 relative">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-[#cd412b]" />
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-widest flex items-center gap-2 font-teko uppercase text-xl">
              {lang === 'en' ? 'Expert AI Error Diagnostics' : 'Экспертный ИИ-Диагност Ошибок'}
              <span className="text-[9px] bg-[#cd412b] text-white px-1.5 py-0.5 rounded-none uppercase font-mono font-bold tracking-widest animate-pulse">
                Online
              </span>
            </h2>
            <p className="text-xs text-gray-400 font-sans font-medium">
              {lang === 'en' ? 'Instant diagnostics of absolutely any 300+ errors, crash codes, freezes, BSODs, or EAC issues.' : 'Диагностика абсолютно любых 300+ ошибок, кодов сбоев, вылетов, BSOD или проблем с античитом EAC.'}
            </p>
          </div>
        </div>

        {/* AI Input Form */}
        <div className="flex gap-2">
          <input
            type="text"
            id="ai-error-input"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAiSolve(aiQuery)}
            placeholder={lang === 'en' ? "Paste error code, crash log, or describe the issue (e.g. EAC Error 30005, crash on load)..." : "Вставьте код ошибки, лог вылета или опишите проблему (например: EAC Error 30005, вылет при загрузке)..."}
            className="flex-1 bg-[#0c0d10] border border-[#2a2f3b] focus:border-[#cd412b]/70 focus:ring-1 focus:ring-[#cd412b]/30 text-[#e1e1e6] placeholder-gray-500 px-4 py-3 rounded-none outline-none transition-all text-sm font-sans font-medium"
            disabled={aiLoading}
          />
          <button
            onClick={() => handleAiSolve(aiQuery)}
            disabled={aiLoading || !aiQuery.trim()}
            className="px-5 bg-[#cd412b] hover:bg-[#b03522] disabled:bg-gray-800 disabled:text-gray-500 font-bold text-white rounded-none text-sm transition-all flex items-center gap-2 cursor-pointer shadow-md uppercase font-mono tracking-wider border border-[#e6553f]/30"
          >
            {aiLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            <span>{lang === 'en' ? 'Diagnose' : 'Диагностировать'}</span>
          </button>
        </div>

        {/* AI History tags */}
        {aiHistory.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-gray-500 font-mono uppercase text-[10px] tracking-wider font-bold">{lang === 'en' ? 'Recent queries:' : 'Недавние запросы:'}</span>
            {aiHistory.map((hist, index) => (
              <button
                key={index}
                onClick={() => {
                  setAiQuery(hist);
                  handleAiSolve(hist);
                }}
                disabled={aiLoading}
                className="px-2.5 py-1 rounded-sm bg-[#0c0d10] hover:bg-[#2a2f3b] text-gray-400 hover:text-white border border-[#2a2f3b] transition-all flex items-center gap-1 cursor-pointer font-mono"
              >
                <Terminal size={10} className="text-[#cd412b]" />
                <span className="truncate max-w-[150px]">{hist}</span>
              </button>
            ))}
          </div>
        )}

        {/* AI Loading State */}
        <AnimatePresence>
          {aiLoading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#0c0d10] border border-[#2a2f3b] rounded-sm p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Loader2 size={18} className="animate-spin text-[#cd412b]" />
                <span className="text-xs text-gray-300 font-mono tracking-wide">{loadingStep}</span>
              </div>
              {/* Fake progress bar */}
              <div className="w-full bg-gray-800 h-1.5 rounded-sm overflow-hidden">
                <motion.div
                  initial={{ width: '5%' }}
                  animate={{ width: '90%' }}
                  transition={{ duration: 10, ease: 'easeOut' }}
                  className="bg-[#cd412b] h-full rounded-sm"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Result Panel */}
        <AnimatePresence>
          {aiResult && !aiLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0c0d10] border border-[#cd412b]/20 rounded-sm p-5 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-3">
                <div className="flex items-center gap-2 text-[#cd412b]">
                  <Wrench size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest font-mono">{lang === 'en' ? 'AI Diagnostics Solution' : 'Решение от ИИ-Диагноста'}</span>
                </div>
                <button
                  onClick={() => {
                    onCopy(aiResult);
                  }}
                  className="px-3 py-1 bg-gray-800 hover:bg-[#cd412b] text-gray-300 hover:text-white text-xs font-bold rounded-sm flex items-center gap-1.5 transition-all cursor-pointer border border-[#2a2f3b] uppercase font-mono"
                >
                  <Copy size={12} />
                  {lang === 'en' ? 'Copy Entire Solution' : 'Копировать всё решение'}
                </button>
              </div>

              {/* Markdown Rendered Content */}
              <div className="text-xs text-gray-300 leading-relaxed font-sans space-y-3 overflow-x-auto max-h-[350px] overflow-y-auto pr-2 custom-scrollbar font-medium">
                <div className="markdown-body">
                  <Markdown>{aiResult}</Markdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Error Panel */}
        <AnimatePresence>
          {aiError && !aiLoading && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-sm flex items-start gap-3"
            >
              <AlertTriangle className="flex-shrink-0 mt-0.5" size={16} />
              <div className="text-xs">
                <p className="font-bold uppercase font-mono tracking-wider text-[11px]">{lang === 'en' ? 'Diagnostic Error' : 'Ошибка диагностики'}</p>
                <p className="text-rose-300/80 mt-0.5 font-medium">{aiError}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="border-t border-[#2a2f3b]/50 my-6" />

      {/* Popular Offline Database Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white tracking-widest font-teko uppercase text-lg">
            {lang === 'en' ? `Popular Rust Error Database (${errorDatabase.length})` : `База популярных ошибок Rust (${errorDatabase.length})`}
          </h3>
          <p className="text-[11px] text-gray-500 font-sans font-medium">
            {lang === 'en' ? 'Offline list of the most common and known game issues with ready-to-use solutions.' : 'Офлайн-список самых распространенных и известных проблем игры с готовыми решениями.'}
          </p>
        </div>
        <div className="text-xs text-gray-500 font-sans flex items-center gap-1.5 font-medium">
          <HelpCircle size={14} className="text-[#cd412b]" />
          <span>{lang === 'en' ? 'Click on a solution to copy' : 'Нажмите на решение, чтобы скопировать'}</span>
        </div>
      </div>

      {/* Results grid */}
      <AnimatePresence mode="popLayout">
        {filteredErrors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredErrors.map((error, idx) => {
              const isExpanded = expandedIndex === idx;
              const trans = lang === 'en' ? (errorsTranslationMap[error.title] || error) : error;
              const title = trans.title;
              const desc = trans.desc;
              const sols = trans.sols;

              return (
                <motion.div
                  key={error.title}
                  layout="position"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.015, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="group bg-[#14171e]/90 border border-[#2a2f3b] hover:border-[#cd412b]/40 rounded-none p-5 flex flex-col justify-between shadow-xl relative overflow-hidden"
                >
                  {/* Tactical Corner Brackets */}
                  <div className="rust-bracket-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-bl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="rust-bracket-br opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[#cd412b] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

                  <div>
                    <div className="flex items-start justify-between gap-4 mb-3">
                      {getCategoryBadge(error.category)}
                      <button
                        onClick={() => toggleExpand(idx)}
                        className="text-gray-500 hover:text-white p-1 rounded-none hover:bg-[#0c0d10]"
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug mb-2 font-mono uppercase tracking-tight text-sm">
                      {title}
                    </h3>

                    {desc && (
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4 font-sans font-medium">
                        {desc}
                      </p>
                    )}

                    <div className="space-y-2 mt-2">
                      <div className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-2 text-[10px] font-mono">
                        {lang === 'en' ? `Ready solutions (${sols.length}):` : `Готовые решения (${sols.length}):`}
                      </div>
                      <div className="space-y-2">
                        {(isExpanded ? sols : [sols[0]]).map((sol, solIdx) => (
                          <motion.div
                            key={solIdx}
                            whileHover={{ scale: 1.015, x: 2 }}
                            whileTap={{ scale: 0.985 }}
                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                            onClick={() => onCopy(sol)}
                            className="group/item relative flex items-start gap-3 bg-[#0c0d10] hover:bg-[#1b1e26] hover:border-[#cd412b]/30 border border-[#2a2f3b]/30 p-3 rounded-none cursor-pointer"
                          >
                            <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-none bg-[#cd412b]/10 text-[#cd412b] text-[10px] font-mono font-bold mt-0.5 border border-[#cd412b]/20">
                              {solIdx + 1}
                            </span>
                            <p className="text-xs text-gray-300 leading-relaxed font-sans pr-6 font-medium">
                              {sol}
                            </p>
                            <Copy
                              size={12}
                              className="absolute right-3 top-3.5 opacity-0 group-hover/item:opacity-100 text-gray-500 group-hover/item:text-[#cd412b] transition-opacity"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!isExpanded && sols.length > 1 && (
                    <button
                      onClick={() => toggleExpand(idx)}
                      className="mt-4 w-full py-1.5 bg-[#0c0d10] hover:bg-[#1b1e26] rounded-none text-xs text-gray-400 font-bold flex items-center justify-center gap-1 border border-[#2a2f3b] transition-colors cursor-pointer uppercase font-mono"
                    >
                      {lang === 'en' ? `Show ${sols.length - 1} more solutions` : `Показать еще ${sols.length - 1} решения`} <ChevronDown size={12} />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-12 text-center bg-[#14171e]/90 border border-[#2a2f3b] rounded-none flex flex-col items-center justify-center p-6 relative overflow-hidden"
          >
            {/* Tactical Corner Brackets */}
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <div className="text-gray-600 text-4xl mb-3">🔍</div>
            <h3 className="text-gray-400 font-bold mb-1 font-mono uppercase tracking-wider text-sm">{lang === 'en' ? 'Nothing found in offline database' : 'Ничего не найдено в офлайн-базе'}</h3>
            <p className="text-xs text-gray-600 font-sans mb-4 font-medium">{lang === 'en' ? 'Try entering another search query or run AI Diagnostics for this error.' : 'Попробуйте ввести другой запрос или запустите ИИ-Диагностику для этой ошибки.'}</p>
            <button
              onClick={() => {
                setAiQuery(searchQuery);
                handleAiSolve(searchQuery);
              }}
              className="px-4 py-2 bg-[#cd412b] hover:bg-[#b03522] text-white text-xs font-bold rounded-none flex items-center gap-1.5 transition-all shadow-md cursor-pointer uppercase font-mono tracking-wider"
            >
              <Sparkles size={14} />
              {lang === 'en' ? `Run AI Diagnostics for "${searchQuery}"` : `Запустить ИИ-Диагностику по запросу "${searchQuery}"`}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
