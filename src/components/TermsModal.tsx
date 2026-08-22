import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, ShieldCheck, AlertCircle, Scale, BookOpen, 
  Lock, Globe, FileText, CheckCircle2, UserCheck, ShieldAlert, Terminal
} from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ru' | 'en';
}

export default function TermsModal({ isOpen, onClose, lang }: TermsModalProps) {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState<number | null>(null);

  const terms = {
    title: {
      ru: 'ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ И УСЛОВИЯ ИСПОЛЬЗОВАНИЯ',
      en: 'USER AGREEMENT & TERMS OF SERVICE'
    },
    subtitle: {
      ru: 'ЮРИДИЧЕСКИЕ ПРАВИЛА И РЕГЛАМЕНТ ИСПОЛЬЗОВАНИЯ ПОРТАЛА RUSTY.LUB',
      en: 'LEGAL TERMS AND CONDITIONS GOVERNING USE OF RUSTY.LUB'
    },
    version: {
      ru: 'Редакция: 2.4 | Дата вступления в силу: 1 января 2025 г.',
      en: 'Version: 2.4 | Effective Date: January 1, 2025'
    },
    intro: {
      ru: 'Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между администрацией информационно-аналитического веб-сервиса Rusty.Lub (далее — «Сервис», «Администрация») и физическим лицом (далее — «Пользователь»), использующим любые функциональные возможности, базы данных, калькуляторы и интерактивные сервисы сайта. Начиная использование Сервиса или регистрируя учетную запись, Пользователь подтверждает, что полностью ознакомлен, согласен и безоговорочно принимает все условия настоящего Соглашения.',
      en: 'This User Agreement (hereinafter referred to as the "Agreement") governs the relationship between the administration of the Rusty.Lub informational and analytical web service (hereinafter "Service", "Administration") and any individual ("User") utilizing any tools, databases, calculators, or interactive services of the portal. By accessing the Service or registering an account, the User confirms that they have read, understood, and unconditionally agreed to all terms of this Agreement.'
    },
    sections: [
      {
        id: 1,
        icon: <FileText className="text-blue-400" size={18} />,
        title: {
          ru: '1. ОБЩИЕ ПОЛОЖЕНИЯ И СТАТУС СЕРВИСА',
          en: '1. GENERAL PROVISIONS & SERVICE STATUS'
        },
        paragraphs: [
          {
            ru: '1.1. Сервис Rusty.Lub является независимым общедоступным информационным ресурсом, созданным сообществом игроков для предоставления справочных калькуляторов, руководств, интерактивных схем и координации поиска команды.',
            en: '1.1. Rusty.Lub is an independent public web resource developed by the player community to provide reference calculators, guides, interactive diagrams, and team recruitment tools.'
          },
          {
            ru: '1.2. Сервис не является аффилированным лицом, партнером, спонсируемым проектом или официальным представителем компании Facepunch Studios Ltd. Товарные знаки, наименования предметов, текстуры и графические материалы игры Rust принадлежат их законному правообладателю — Facepunch Studios Ltd.',
            en: '1.2. The Service is not affiliated with, endorsed by, sponsored by, or officially associated with Facepunch Studios Ltd. Trademarks, item names, textures, and graphical assets of the game Rust are the property of their respective copyright holder, Facepunch Studios Ltd.'
          },
          {
            ru: '1.3. Использование Сервиса является добровольным. Если Пользователь не согласен с каким-либо из пунктов настоящего Соглашения, он обязан немедленно прекратить использование Сервиса.',
            en: '1.3. Use of the Service is strictly voluntary. If the User disagrees with any provision of this Agreement, they must immediately cease all use of the Service.'
          }
        ]
      },
      {
        id: 2,
        icon: <Lock className="text-[#ff2a4d]" size={18} />,
        title: {
          ru: '2. РЕГИСТРАЦИЯ, БЕЗОПАСНОСТЬ И УЧЕТНАЯ ЗАПИСЬ',
          en: '2. REGISTRATION, ACCOUNT SECURITY & ACCESS'
        },
        paragraphs: [
          {
            ru: '2.1. Для доступа к ряду функций (сохранение избранного, размещение анкет кланов, глобальный чат) Пользователю предлагается создать учетную запись, указав уникальный никнейм и пароль.',
            en: '2.1. Access to certain features (favorites storage, clan recruitment listings, global chat) requires creating an account with a unique username and password.'
          },
          {
            ru: '2.2. Пользователь несет полную единоличную ответственность за сохранение конфиденциальности своих аутентификационных данных. Все действия, совершенные под учетной записью Пользователя, признаются совершенными им лично.',
            en: '2.2. The User bears sole responsibility for maintaining the confidentiality of their credentials. All actions performed under the User’s account are deemed to have been executed by the User personally.'
          },
          {
            ru: '2.3. Администрация никогда не запрашивает пароли пользователей. Запрещается передавать данные учетной записи третьим лицам или использовать чужие учетные записи.',
            en: '2.3. Administration will never solicit user passwords. Sharing account credentials or unauthorized access to third-party accounts is strictly prohibited.'
          }
        ]
      },
      {
        id: 3,
        icon: <ShieldAlert className="text-amber-400" size={18} />,
        title: {
          ru: '3. ПРАВИЛА ПОВЕДЕНИЯ И ОГРАНИЧЕНИЯ ИСПОЛЬЗОВАНИЯ',
          en: '3. ACCEPTABLE USE POLICY & PROHIBITED CONDUCT'
        },
        paragraphs: [
          {
            ru: '3.1. При использовании интерактивных сервисов (чат, поиск тиммейтов, комментарии) Пользователю строго запрещается: публиковать вредоносное ПО, фишинговые ссылки, спам, материалы экстремистского, оскорбительного или дискриминационного характера.',
            en: '3.1. When using interactive features (chat, recruitment board, comments), Users are strictly forbidden from posting malware, phishing links, spam, abusive, discriminatory, or unlawful content.'
          },
          {
            ru: '3.2. Категорически запрещается реклама, продажа или распространение стороннего несанкционированного программного обеспечения для игры Rust (читов, скриптов компенсации отдачи, макросов, нарушающих правила Easy Anti-Cheat и Facepunch).',
            en: '3.2. Advertising, distributing, or selling unauthorized third-party software for Rust (cheats, recoil scripts, macro bypasses violating Easy Anti-Cheat or Facepunch policies) is strictly forbidden.'
          },
          {
            ru: '3.3. Запрещаются любые попытки нарушения целостности инфраструктуры Сервиса: эксплуатация уязвимостей, внедрение вредоносного кода, перегрузка API (DDoS), автоматический парсинг данных без письменного согласия Администрации.',
            en: '3.3. Any attempt to breach the Service infrastructure—exploiting vulnerabilities, injecting malicious scripts, API abuse, DDoS attacks, or automated data harvesting without prior written authorization—is prohibited.'
          }
        ]
      },
      {
        id: 4,
        icon: <Globe className="text-purple-400" size={18} />,
        title: {
          ru: '4. ИНТЕЛЛЕКТУАЛЬНАЯ СОБСТВЕННОСТЬ И ПРАВА НА КОНТЕНТ',
          en: '4. INTELLECTUAL PROPERTY & CONTENT RIGHTS'
        },
        paragraphs: [
          {
            ru: '4.1. Архитектура программного кода, алгоритмы калькуляторов, дизайн интерфейса, стили и база данных структурированных гайдов являются объектами интеллектуальной собственности Администрации и защищены законом.',
            en: '4.1. The software codebase, calculator algorithms, UI layouts, styling, and curated knowledge databases are the intellectual property of the Administration and protected by applicable copyright laws.'
          },
          {
            ru: '4.2. Пользовательский контент (тексты объявлений о наборе в клан, сообщения) остается собственностью Пользователя, однако размещая его, Пользователь предоставляет Сервису неисключительную безвозмездную лицензию на его отображение и обработку в рамках функционала платформы.',
            en: '4.2. User-generated content (clan listings, chat messages) remains the author’s property; however, posting grants the Service a non-exclusive, royalty-free license to display and process it within platform operations.'
          }
        ]
      },
      {
        id: 5,
        icon: <Scale className="text-emerald-400" size={18} />,
        title: {
          ru: '5. ОТКАЗ ОТ ГАРАНТИЙ И ОГРАНИЧЕНИЕ ОТВЕТСТВЕННОСТИ',
          en: '5. DISCLAIMER OF WARRANTIES & LIMITATION OF LIABILITY'
        },
        paragraphs: [
          {
            ru: '5.1. Все сервисы, калькуляторы и справочные материалы предоставляются на условиях «КАК ЕСТЬ» («AS IS») и «ПО МЕРЕ ДОСТУПНОСТИ» («AS AVAILABLE»). Администрация не гарантирует абсолютную безошибочность расчетов ввиду регулярных внутриигровых патчей Rust.',
            en: '5.1. All services, calculators, and reference materials are provided on an "AS IS" and "AS AVAILABLE" basis. Administration does not guarantee absolute calculation precision due to frequent in-game balance updates by Facepunch.'
          },
          {
            ru: '5.2. Администрация не несет ответственности за любые прямые, косвенные или случайные убытки, включая потерю игрового прогресса, ресурсов, блокировки учетных записей на сторонних игровых серверах или сбои сетевого подключения.',
            en: '5.2. Administration is not liable for direct, indirect, or consequential damages, including loss of in-game items, third-party server account suspensions, or network connectivity failures.'
          }
        ]
      },
      {
        id: 6,
        icon: <ShieldCheck className="text-cyan-400" size={18} />,
        title: {
          ru: '6. КОНФИДЕНЦИАЛЬНОСТЬ И ОБРАБОТКА ТЕХНИЧЕСКИХ ДАННЫХ',
          en: '6. PRIVACY & TECHNICAL DATA HANDLING'
        },
        paragraphs: [
          {
            ru: '6.1. Сервис осуществляет сбор исключительно минимального объема технических данных, необходимых для авторизации, сохранения настроек калькулятора и обеспечения стабильности работы веб-приложения.',
            en: '6.1. The Service collects only the minimal technical data strictly necessary for user authentication, calculator preference persistence, and application stability.'
          },
          {
            ru: '6.2. Сервис не осуществляет передачу персональных данных третьим лицам и не использует личные данные в рекламных целях без явного согласия Пользователя.',
            en: '6.2. The Service does not sell or transfer user personal data to third parties, nor does it monetize user telemetry without explicit consent.'
          }
        ]
      },
      {
        id: 7,
        icon: <Terminal className="text-zinc-400" size={18} />,
        title: {
          ru: '7. ИЗМЕНЕНИЕ УСЛОВИЙ И СРОК ДЕЙСТВИЯ СОГЛАШЕНИЯ',
          en: '7. AMENDMENTS & AGREEMENT DURATION'
        },
        paragraphs: [
          {
            ru: '7.1. Администрация оставляет за собой право вносить изменения в текст настоящего Соглашения в одностороннем порядке. Новая редакция вступает в силу с момента ее опубликования на данной странице.',
            en: '7.1. Administration reserves the right to amend this Agreement unilaterally. Revised versions become effective immediately upon publication on this page.'
          },
          {
            ru: '7.2. В случае выявления грубых нарушений положений Соглашения Администрация оставляет за собой право ограничить или полностью заблокировать доступ Пользователя к функциям портала без предварительного уведомления.',
            en: '7.2. In case of material violations of this Agreement, Administration reserves the right to restrict or terminate User access to portal features without prior notice.'
          }
        ]
      }
    ],
    footerNotice: {
      ru: 'Если у вас возникли юридические вопросы или предложения относительно условий использования, свяжитесь с нами через официальное сообщество.',
      en: 'For legal inquiries or questions regarding these terms, please contact the administration via our official community channels.'
    },
    acceptButton: {
      ru: 'ПОДТВЕРДИТЬ И ЗАКРЫТЬ',
      en: 'CONFIRM & CLOSE'
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-4xl bg-[#0c1017] border border-[#2a344a] p-0 relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-[#111722] border-b border-[#2a344a] p-4 sm:p-5 flex items-center justify-between relative shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 bg-[#ff2a4d]/10 border border-[#ff2a4d]/30 text-[#ff2a4d] shrink-0">
                <Scale size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-black text-white tracking-wider font-mono uppercase leading-tight truncate">
                  {terms.title[lang]}
                </h3>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                  <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                    {terms.subtitle[lang]}
                  </span>
                  <span className="text-[9px] text-[#ff2a4d] font-mono font-bold bg-[#ff2a4d]/10 px-2 py-0.2 border border-[#ff2a4d]/20">
                    {terms.version[lang]}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer border border-transparent hover:border-zinc-700 shrink-0 ml-3"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 bg-[#090c12]">
            {/* Preamble / Intro Box */}
            <div className="bg-[#111722]/80 border-l-3 border-[#ff2a4d] p-4 text-xs text-zinc-300 leading-relaxed font-sans shadow-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle size={16} className="text-[#ff2a4d] shrink-0 mt-0.5" />
                <p>{terms.intro[lang]}</p>
              </div>
            </div>

            {/* Structured Sections */}
            <div className="space-y-4">
              {terms.sections.map((section) => {
                const isExpanded = activeSection === null || activeSection === section.id;
                return (
                  <div
                    key={section.id}
                    className="p-4 bg-[#0e131c] border border-[#20293a] transition-all hover:border-[#2f3d54]"
                  >
                    <div className="flex items-center gap-2.5 mb-3 border-b border-[#1b2332] pb-2">
                      <div className="shrink-0">{section.icon}</div>
                      <h4 className="text-xs sm:text-sm font-black text-white font-mono uppercase tracking-wide">
                        {section.title[lang]}
                      </h4>
                    </div>

                    <div className="space-y-2.5 pl-1 sm:pl-7">
                      {section.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[12px] text-zinc-400 leading-relaxed font-sans"
                        >
                          {p[lang]}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 bg-[#111722] border-t border-[#2a344a] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
            <div className="text-[11px] text-zinc-400 font-sans leading-snug text-center sm:text-left flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400 shrink-0 hidden sm:block" />
              <span>{terms.footerNotice[lang]}</span>
            </div>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#cd412b] hover:bg-[#b53723] text-white font-black text-xs uppercase tracking-widest font-mono cursor-pointer transition-all border border-[#e6553f] shadow-md shadow-[#cd412b]/20 flex items-center justify-center gap-2 shrink-0"
            >
              <CheckCircle2 size={14} />
              <span>{terms.acceptButton[lang]}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
