import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, AlertTriangle, Scale, BookOpen, Info, Lock, Globe } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
}

export default function TermsModal({ isOpen, onClose, lang }: TermsModalProps) {
  if (!isOpen) return null;

  const terms = {
    title: {
      ru: 'ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ',
      en: 'USER AGREEMENT & TERMS OF SERVICE'
    },
    subtitle: {
      ru: 'ОФИЦИАЛЬНЫЙ ПРОТОКОЛ ИСПОЛЬЗОВАНИЯ ПОРТАЛА RUSTY.LUB',
      en: 'OFFICIAL USAGE PROTOCOLS FOR RUSTY.LUB PORTAL'
    },
    intro: {
      ru: 'Данное соглашение определяет правила взаимодействия пользователя с инструментами и сервисами Rusty.Lub. Использование портала означает ваше полное и безоговорочное согласие с данными правилами.',
      en: 'This agreement defines the rules for user interaction with Rusty.Lub tools and services. Use of the portal constitutes your full and unconditional acceptance of these terms.'
    },
    sections: [
      {
        icon: <Lock className="text-[#cd412b]" size={16} />,
        title: { ru: '1. УЧЕТНАЯ ЗАПИСЬ И БЕЗОПАСНОСТЬ', en: '1. ACCOUNT & SECURITY' },
        content: {
          ru: 'Пользователь несет единоличную ответственность за безопасность своего пароля и доступа к аккаунту. Администрация никогда не запрашивает ваш пароль. В случае взлома из-за слабого пароля или передачи данных третьим лицам, портал не несет ответственности за потерю данных.',
          en: 'The user is solely responsible for the security of their password and account access. Administration never requests your password. In case of a breach due to a weak password or data sharing, the portal is not liable for data loss.'
        }
      },
      {
        icon: <AlertTriangle className="text-amber-500" size={16} />,
        title: { ru: '2. ЗАПРЕЩЕННЫЕ ДЕЙСТВИЯ', en: '2. PROHIBITED ACTIONS' },
        content: {
          ru: 'Запрещается использование любых уязвимостей сайта, попытки взлома API, спам в чате, публикация оскорбительного контента или вредоносных ссылок. Пропаганда читов или продажа игровых ценностей вне официальных площадок может привести к перманентному бану.',
          en: 'Exploiting site vulnerabilities, attempting API breaches, chat spamming, publishing offensive content, or malicious links is strictly prohibited. Promoting cheats or selling in-game assets outside official platforms may result in a permanent ban.'
        }
      },
      {
        icon: <Globe className="text-blue-400" size={16} />,
        title: { ru: '3. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ', en: '3. INTELLECTUAL PROPERTY' },
        content: {
          ru: 'Весь дизайн, код и инструменты являются собственностью Rusty.Lub. Копирование элементов интерфейса или реверс-инжиниринг калькуляторов без разрешения владельцев запрещены. Пользовательский контент (описания профилей) остается за пользователем, но должен соответствовать нормам этики.',
          en: 'All design, code, and tools are the property of Rusty.Lub. Copying interface elements or reverse-engineering calculators without permission is prohibited. User content (profile bios) remains yours but must comply with ethical standards.'
        }
      },
      {
        icon: <Scale className="text-emerald-500" size={16} />,
        title: { ru: '4. ОТКАЗ ОТ ОТВЕТСТВЕННОСТЬ', en: '4. DISCLAIMER OF LIABILITY' },
        content: {
          ru: 'Все инструменты (рейд-калькулятор, схемы электрики, радар) предоставляются "как есть". Мы не гарантируем 100% точность расчетов в условиях постоянных обновлений игры. Мы не несем ответственности за ваши игровые поражения или потерю ресурсов.',
          en: 'All tools (raid calculator, electrical circuits, radar) are provided "as is". We do not guarantee 100% calculation accuracy given constant game updates. We are not responsible for your in-game losses or resource expenditure.'
        }
      },
      {
        icon: <ShieldCheck className="text-zinc-400" size={16} />,
        title: { ru: '5. ИЗМЕНЕНИЯ И ОБНОВЛЕНИЯ', en: '5. AMENDMENTS & UPDATES' },
        content: {
          ru: 'Администрация оставляет за собой право изменять данное соглашение в любое время без уведомления. Продолжение использования сайта после изменений означает согласие с новой редакцией.',
          en: 'Administration reserves the right to modify this agreement at any time without notice. Continued use of the site following changes constitutes acceptance of the new version.'
        }
      }
    ],
    footer: {
      ru: 'Ваша конфиденциальность важна для нас. Мы собираем только технические данные, необходимые для работы вашего профиля и сохранения настроек.',
      en: 'Your privacy is important to us. We only collect technical data necessary for your profile functionality and saving your preferences.'
    },
    closeBtn: {
      ru: 'ОЗНАКОМЛЕН И СОГЛАСЕН',
      en: 'ACKNOWLEDGED & AGREED'
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="w-full max-w-3xl bg-[#0d0f14] border border-[#2a2f3b] p-0 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
      >
        {/* Tactical Header */}
        <div className="bg-[#14171e] border-b border-[#2a2f3b] p-5 flex items-center justify-between relative">
          <div className="absolute top-0 left-0 right-0 h-1 rust-hazard opacity-50" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#cd412b]/10 border border-[#cd412b]/30">
              <BookOpen className="text-[#cd412b]" size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-widest font-teko uppercase leading-none">
                {terms.title[lang]}
              </h3>
              <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-[0.2em] mt-1 block">
                {terms.subtitle[lang]}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 text-zinc-500 hover:text-white transition-all cursor-pointer border border-transparent hover:border-zinc-800"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-[#cd412b]/5 border-l-2 border-[#cd412b] p-4">
            <p className="text-xs text-zinc-300 leading-relaxed font-sans italic opacity-90">
              {terms.intro[lang]}
            </p>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
            {terms.sections.map((section, idx) => (
              <div key={idx} className="space-y-2 border-b border-zinc-800/50 pb-4 last:border-0">
                <div className="flex items-center gap-2">
                  {section.icon}
                  <span className="text-[11px] font-black text-zinc-400 uppercase tracking-wider font-mono">
                    {section.title[lang]}
                  </span>
                </div>
                <p className="text-[12px] text-zinc-500 leading-relaxed font-sans pl-6">
                  {section.content[lang]}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 flex items-center gap-3 opacity-60">
              <Info size={14} className="text-zinc-400 shrink-0" />
              <p className="text-[10px] text-zinc-500 font-mono leading-tight">
                {terms.footer[lang]}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 bg-[#cd412b] hover:bg-[#b03825] text-white font-black text-xs uppercase tracking-widest font-mono cursor-pointer shadow-lg transition-all border border-[#cd412b]/50 hover:border-white whitespace-nowrap"
            >
              {terms.closeBtn[lang]}
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-32 h-[1px] bg-gradient-to-r from-[#cd412b] to-transparent opacity-30" />
        <div className="absolute top-0 right-0 w-[1px] h-32 bg-gradient-to-b from-[#cd412b] to-transparent opacity-20" />
      </motion.div>
    </div>
  );
}
