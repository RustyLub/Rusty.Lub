import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { motion } from 'motion/react';
import { CustomUser } from '../types';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  Copy, 
  Check, 
  MessageSquare, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Award
} from 'lucide-react';

interface FeedbackTabProps {
  lang: 'ru' | 'en';
  user: CustomUser | null;
  onToast: (message: string, type: 'success' | 'error') => void;
}

export default function FeedbackTab({ lang, user, onToast }: FeedbackTabProps) {
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    type: 'general',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const handleCopy = (text: string, type: 'email' | 'discord') => {
    navigator.clipboard.writeText(text).then(() => {
      onToast(
        lang === 'ru' 
          ? `${type === 'email' ? 'Почта' : 'Никнейм Discord'} скопирован в буфер!` 
          : `${type === 'email' ? 'Email' : 'Discord username'} copied to clipboard!`,
        'success'
      );
      if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else {
        setCopiedDiscord(true);
        setTimeout(() => setCopiedDiscord(false), 2000);
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      onToast(lang === 'ru' ? 'Пожалуйста, введите сообщение.' : 'Please enter your message.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedbacks'), {
        name: formData.name,
        email: formData.email,
        type: formData.type,
        message: formData.message,
        userId: user?.uid || 'anonymous',
        createdAt: serverTimestamp()
      });

      setIsSuccess(true);
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        type: 'general',
        message: ''
      });
      onToast(
        lang === 'ru' ? 'Отзыв успешно отправлен! Спасибо за обратную связь.' : 'Feedback submitted successfully! Thank you.',
        'success'
      );
    } catch (err) {
      console.error('Error submitting feedback:', err);
      onToast(
        lang === 'ru' ? 'Ошибка отправки отзыва. Попробуйте еще раз.' : 'Failed to submit feedback. Please try again.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tactical Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#171a22] to-[#1a1f29] border border-[#2a2f3b] p-6 shadow-xl relative rust-metal-pattern">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />
        <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 bg-[#cd412b] rounded-full animate-ping" />
              <span className="text-[10px] font-mono font-black text-[#cd412b] tracking-widest uppercase">
                {lang === 'ru' ? 'СЕКТОР СВЯЗИ / FEEDBACK_PROTOCOL_v1.0' : 'COMMUNICATIONS SECTOR / FEEDBACK_PROTOCOL_v1.0'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white font-teko uppercase tracking-wider">
              {lang === 'ru' ? 'Обратная связь & Контакты' : 'Feedback & Contacts'}
            </h1>
            <p className="text-xs text-gray-400 max-w-2xl font-sans mt-1 leading-relaxed">
              {lang === 'ru' 
                ? 'Прямая линия связи с администрацией портала RUSTY.LUB и основателями клана [EAC]. Мы ценим ваши предложения по улучшению симуляторов, калькуляторов и исправлению багов.'
                : 'Direct line of communication with RUSTY.LUB administration and [EAC] clan leadership. We appreciate your suggestions for improving calculators, simulators, and bug reports.'}
            </p>
          </div>
          
          <div className="hidden lg:flex flex-col items-end shrink-0 font-mono text-[9px] text-zinc-500">
            <span>TX_STATION: OFFLINE_COMMS</span>
            <span>SECURE_ROUTE: true</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Contact Methods */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#11131a] border border-[#2a2f3b] p-5 relative overflow-hidden flex flex-col justify-between">
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            
            <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-sm">📞</span>
              <span>{lang === 'ru' ? 'ПРЯМЫЕ КОНТАКТЫ' : 'DIRECT CONTACTS'}</span>
            </h2>

            <div className="space-y-4">
              {/* Discord Contact Card */}
              <div className="bg-black/20 border border-zinc-800/60 p-4 hover:border-indigo-500/30 transition-all group relative">
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-zinc-700" />
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                    💬
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-indigo-400 font-bold tracking-widest uppercase">DISCORD CLIENT</span>
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    </div>
                    <span className="block text-sm font-mono font-bold text-zinc-200 mt-0.5 select-all">eaccheater</span>
                    <p className="text-[10px] text-zinc-500 font-sans mt-1 leading-snug">
                      {lang === 'ru' 
                        ? 'Быстрый ответ по вопросам сотрудничества, багам в коде или вступлению в клан [EAC].'
                        : 'Quick response for partnerships, developer queries, or joining the [EAC] clan.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800/40">
                  <button
                    onClick={() => handleCopy('eaccheater', 'discord')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 p-1.5 border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all text-[8px] font-bold font-mono uppercase tracking-widest cursor-pointer bg-black/20"
                  >
                    {copiedDiscord ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    <span>{copiedDiscord ? (lang === 'ru' ? 'СКОПИРОВАНО' : 'COPIED') : (lang === 'ru' ? 'КОПИРОВАТЬ' : 'COPY USERNAME')}</span>
                  </button>
                </div>
              </div>

              {/* Email Contact Card */}
              <div className="bg-black/20 border border-zinc-800/60 p-4 hover:border-amber-500/30 transition-all group relative">
                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-zinc-700" />
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
                    📧
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono text-amber-400 font-bold tracking-widest uppercase">EMAIL DIRECT</span>
                    </div>
                    <span className="block text-sm font-mono font-bold text-zinc-200 mt-0.5 select-all truncate">rusty.lub_offers@bk.ru</span>
                    <p className="text-[10px] text-zinc-500 font-sans mt-1 leading-snug">
                      {lang === 'ru' 
                        ? 'Официальный ящик для деловых предложений, рекламы и долгосрочного сотрудничества.'
                        : 'Official inbox for commercial proposals, advertisement, and long-term collaboration.'}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3 pt-3 border-t border-zinc-800/40">
                  <button
                    onClick={() => handleCopy('rusty.lub_offers@bk.ru', 'email')}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 p-1.5 border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all text-[8px] font-bold font-mono uppercase tracking-widest cursor-pointer bg-black/20"
                  >
                    {copiedEmail ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                    <span>{copiedEmail ? (lang === 'ru' ? 'СКОПИРОВАНО' : 'COPIED') : (lang === 'ru' ? 'КОПИРОВАТЬ' : 'COPY EMAIL')}</span>
                  </button>
                  <a
                    href="mailto:rusty.lub_offers@bk.ru"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 p-1.5 border border-zinc-800 hover:border-zinc-500 text-zinc-400 hover:text-white transition-all text-[8px] font-bold font-mono uppercase tracking-widest bg-black/20 text-center"
                  >
                    <Mail size={10} />
                    <span>{lang === 'ru' ? 'НАПИСАТЬ' : 'SEND EMAIL'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Tactical Reminder Block */}
            <div className="mt-5 p-3 bg-[#cd412b]/5 border border-[#cd412b]/20 text-[9px] font-mono text-zinc-400 leading-normal relative">
              <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-[#cd412b]" />
              <div className="font-bold text-[#cd412b] mb-1 uppercase tracking-wider">
                ⚠️ {lang === 'ru' ? 'ВАЖНОЕ ПРИМЕЧАНИЕ' : 'CRITICAL NOTE'}
              </div>
              {lang === 'ru'
                ? 'Администрация никогда не запрашивает пароли от ваших аккаунтов Steam или пароли безопасности внутри игры. Все контакты осуществляются только по указанным выше реквизитам.'
                : 'Administration will never ask for your Steam account passwords or in-game credentials. All official communication is limited strictly to the accounts listed above.'}
            </div>
          </div>
        </div>

        {/* Right Column: Feedback Form */}
        <div className="md:col-span-7">
          <div className="bg-[#11131a] border border-[#2a2f3b] p-5 relative overflow-hidden h-full">
            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <h2 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-sm">📝</span>
              <span>{lang === 'ru' ? 'ОТПРАВИТЬ СЛУЖЕБНУЮ ЗАПИСКУ' : 'TRANSMIT MESSAGE SECURELY'}</span>
            </h2>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10 space-y-4"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <div>
                  <h3 className="font-teko font-black text-xl text-white uppercase tracking-wider">
                    {lang === 'ru' ? 'ПЕРЕДАЧА ЗАВЕРШЕНА!' : 'TRANSMISSION COMPLETE!'}
                  </h3>
                  <p className="text-xs text-zinc-400 max-w-sm mt-1 mx-auto leading-relaxed">
                    {lang === 'ru'
                      ? 'Ваш пакет данных успешно передан и сохранен в базе данных выживших. Мы рассмотрим его в ближайшее время.'
                      : 'Your packet has been safely delivered and stored in the database. Our team will review your dispatch shortly.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                >
                  {lang === 'ru' ? 'ОТПРАВИТЬ ЕЩЕ ОДНО' : 'TRANSMIT ANOTHER MESSAGE'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row: Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                      {lang === 'ru' ? 'ВАШЕ ИМЯ (ОПЦИОНАЛЬНО)' : 'YOUR NAME (OPTIONAL)'}
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={lang === 'ru' ? 'Выживший' : 'Survivor'}
                      className="w-full bg-black/30 border border-[#2a2f3b] focus:border-[#cd412b] p-2 text-xs font-mono text-zinc-200 placeholder-zinc-700 outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                      {lang === 'ru' ? 'ПОЧТА ДЛЯ СВЯЗИ (ОПЦИОНАЛЬНО)' : 'REPLY EMAIL (OPTIONAL)'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="survivor@rust.com"
                      className="w-full bg-black/30 border border-[#2a2f3b] focus:border-[#cd412b] p-2 text-xs font-mono text-zinc-200 placeholder-zinc-700 outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Feedback Type Selector */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                    {lang === 'ru' ? 'ТИП ОБРАЩЕНИЯ' : 'MESSAGE CATEGORY'}
                  </label>
                  <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full bg-[#11131a] border border-[#2a2f3b] focus:border-[#cd412b] p-2 text-xs font-mono text-zinc-200 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="general">{lang === 'ru' ? '💡 Общие вопросы / Предложения' : '💡 General Suggestion'}</option>
                      <option value="bug">{lang === 'ru' ? '🐛 Отчет об ошибке / Баге' : '🐛 Bug Report'}</option>
                      <option value="partnership">{lang === 'ru' ? '🤝 Реклама / Сотрудничество' : '🤝 Ads & Partnership'}</option>
                      <option value="clan">{lang === 'ru' ? '⚔️ Вступление в клан [EAC]' : '⚔️ Clan [EAC] Recruitment'}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500 text-[10px] font-mono">
                      ▼
                    </div>
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-1.5">
                  <label className="block text-[8px] font-mono text-zinc-500 uppercase tracking-wider">
                    {lang === 'ru' ? 'ТЕКСТ СООБЩЕНИЯ *' : 'MESSAGE BODY *'}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={lang === 'ru' ? 'Напишите ваше предложение или опишите найденный баг во всех подробностях...' : 'Describe your suggestion or technical error in detail...'}
                    className="w-full bg-black/30 border border-[#2a2f3b] focus:border-[#cd412b] p-2 text-xs font-mono text-zinc-200 placeholder-zinc-700 outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 py-3 bg-[#cd412b] hover:bg-[#b03825] disabled:bg-[#cd412b]/40 text-white font-mono font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md shadow-black/25 relative overflow-hidden`}
                >
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white/55" />
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white/55" />
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{lang === 'ru' ? 'ПЕРЕДАЧА СИГНАЛА...' : 'ENCRYPTING & TRANSMITTING...'}</span>
                    </>
                  ) : (
                    <>
                      <Send size={13} />
                      <span>{lang === 'ru' ? 'ОТПРАВИТЬ СООБЩЕНИЕ' : 'TRANSMIT BROADCAST'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
