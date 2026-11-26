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
  pageMode?: boolean;
}

export default function TermsModal({ isOpen, onClose, lang, pageMode = false }: TermsModalProps) {
  if (!isOpen && !pageMode) return null;

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
      ru: 'Редакция: 2.8 | Дата обновления: 26 ноября 2026 г.',
      en: 'Version: 2.8 | Updated: November 26, 2026'
    },
    intro: {
      ru: 'Настоящее соглашение регулирует использование Rusty.Lub — независимого справочника и набора инструментов для игроков Rust. Оно распространяется на калькуляторы рейдов и гниения, руководства, бинды, игровые справочные материалы, сохранённые расчёты, избранное, чат и функции сообщества. Регистрация означает согласие с этими условиями. Аккаунт нужен для персональных функций и не является игровым аккаунтом Rust или Facepunch.',
      en: 'These terms govern the use of Rusty.Lub, an independent reference and toolkit for Rust players. They cover raid and decay calculators, guides, binds, game reference material, saved calculations, favorites, chat, and community features. Registering means accepting these terms. A Rusty.Lub account is for this service only and is not a Rust or Facepunch game account.'
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
            ru: '1.2. Rusty.Lub — независимый фанатский справочный ресурс. Сервис не является аффилированным лицом, партнером, спонсируемым проектом или официальным представителем Facepunch Studios Ltd. Упоминание Rust и использование игровых материалов не означает одобрения или поддержки со стороны Facepunch.',
            en: '1.2. Rusty.Lub is an independent fan reference resource. The Service is not affiliated with, endorsed by, sponsored by, or officially associated with Facepunch Studios Ltd. References to Rust and use of game-related materials do not imply endorsement or support by Facepunch.'
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
            ru: '2.1. Для доступа к персональным функциям (сохранение расчётов и избранного, участие в чате и функциях сообщества) Пользователь создаёт аккаунт, указывая логин, пароль и отображаемый никнейм. Логин используется для входа; никнейм отображается другим пользователям там, где это предусмотрено интерфейсом.',
            en: '2.1. Personal features (saved calculations and favorites, chat, and community tools) require an account with a login, password, and display nickname. The login is used to sign in; the nickname is shown to other users where the interface supports it.'
          },
          {
            ru: '2.2. Пользователь несет полную единоличную ответственность за сохранение конфиденциальности своих аутентификационных данных. Все действия, совершенные под учетной записью Пользователя, признаются совершенными им лично.',
            en: '2.2. The User bears sole responsibility for maintaining the confidentiality of their credentials. All actions performed under the User’s account are deemed to have been executed by the User personally.'
          },
          {
            ru: '2.3. Не используйте пароль от других сервисов. Не передавайте данные аккаунта третьим лицам и не пытайтесь входить в чужие аккаунты. Не указывайте в никнейме чужие персональные данные, оскорбления или имитацию официального представителя проекта.',
            en: '2.3. Do not reuse passwords from other services, share account credentials, or access someone else\'s account. Nicknames must not expose another person\'s private information, contain abusive content, or impersonate project staff.'
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
            ru: '4.1. Оригинальный программный код Rusty.Lub, самостоятельно созданные тексты, алгоритмы калькуляторов и элементы интерфейса охраняются законодательством об интеллектуальной собственности. Администрация заявляет права только на те материалы, исключительные права на которые действительно принадлежат ей или переданы ей. Это положение не распространяется на материалы и обозначения третьих лиц.',
            en: '4.1. Original Rusty.Lub source code, independently created text, calculator logic and interface elements are protected by applicable intellectual property laws. The Administration claims rights only in materials it actually owns or has been licensed or assigned. This does not extend to third-party materials or marks.'
          },
          {
            ru: '4.2. Пользовательский контент (тексты объявлений о наборе в клан, сообщения и другие материалы) остается собственностью Пользователя. Размещая его, Пользователь предоставляет Сервису неисключительную безвозмездную лицензию на хранение, техническую обработку и отображение контента в рамках работы платформы.',
            en: '4.2. User-generated content (clan listings, messages and other materials) remains the User’s property. By posting it, the User grants the Service a non-exclusive, royalty-free license to store, technically process and display the content as needed to operate the platform.'
          },
          {
            ru: '4.3. Название Rust, логотипы и товарные знаки Rust, игровые изображения, модели, текстуры, звуки, элементы интерфейса и иные материалы игры принадлежат Facepunch Studios Ltd. или соответствующим правообладателям и лицензиарам. Rusty.Lub не заявляет исключительных прав на эти материалы. Их использование в справочных и фанатских целях не передает Сервису право собственности на них.',
            en: '4.3. The Rust name, Rust logos and trademarks, game images, models, textures, sounds, interface elements and other game materials belong to Facepunch Studios Ltd. or their respective rights holders and licensors. Rusty.Lub does not claim ownership of these materials. Their use for reference and fan-content purposes does not transfer ownership to the Service.'
          },
          {
            ru: '4.4. Правила Facepunch допускают независимые сообщества и фанатские сайты, но отдельно ограничивают способы монетизации фанатского контента: монетизация за пределами обычной рекламы/доходов видеоплатформ требует письменного одобрения Facepunch. Поэтому добровольные донаты через DonationAlerts, даже без VIP-статуса и иных преимуществ для доноров, не считаются автоматически разрешённым исключением. До получения письменного подтверждения правообладателя не следует считать такую схему согласованной с правилами Facepunch.',
            en: '4.4. Facepunch permits independent community websites and fan content but restricts monetization methods: monetization beyond ordinary video-platform advertising/revenue requires Facepunch’s written approval. Therefore, voluntary DonationAlerts support, even without VIP status or other donor benefits, is not automatically an approved exception. Until written confirmation is obtained from the rights holder, this arrangement should not be treated as cleared under Facepunch’s guidelines.'
          },
          {
            ru: '4.5. Если Пользователь или правообладатель считает, что материал на Сервисе нарушает его права, он может направить обращение на rusty.lub-slq@inbox.ru с указанием спорного материала, его адреса на Сервисе, подтверждения прав и контактных данных. Администрация проверит обращение и при наличии оснований ограничит доступ к материалу или удалит его.',
            en: '4.5. If a user or rights holder believes that material on the Service infringes their rights, they may contact rusty.lub-slq@inbox.ru with the material, its location on the Service, evidence of rights and contact details. The Administration will review the request and, where justified, restrict access to or remove the material.'
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
            ru: '6.1. Сервис обрабатывает данные, необходимые для работы аккаунта, пользовательских функций, настроек и безопасности. Для отдельных функций используются Firebase/Google, Discord, Enum.gg и другие технические поставщики; при обращении к ним могут передаваться технические данные запроса. Подробности о технологиях хранения и внешних сервисах приведены в Политике Cookies и конфиденциальности.',
            en: '6.1. The Service processes data needed to provide accounts, user features, preferences and security. Some features rely on Firebase/Google, Discord, Enum.gg and other technical providers; technical request data may be transmitted when the browser contacts them. Details about device storage and external services are described in the Cookie & Privacy Policy.'
          },
          {
            ru: '6.2. Сервис не заявляет об отсутствии передачи технических данных сторонним поставщикам: такие обращения описаны в Политике Cookies и конфиденциальности. В проверенном исходном коде рекламные трекеры и активная аналитика не обнаружены.',
            en: '6.2. The Service does not claim that no technical data is ever shared with third-party providers: these requests are described in the Cookie & Privacy Policy. No advertising trackers or active analytics were identified in the inspected source code.'
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
      },
      {
        id: 8,
        icon: <Globe className="text-sky-400" size={18} />,
        title: {
          ru: '8. ВНЕШНИЕ ССЫЛКИ И РЕКЛАМНЫЕ МАТЕРИАЛЫ',
          en: '8. EXTERNAL LINKS & ADVERTISING MATERIALS'
        },
        paragraphs: [
          {
            ru: '8.1. На Сервисе могут размещаться ссылки на сторонние сайты и платформы, а также обычные дружеские упоминания знакомых проектов. Такие ресурсы управляются третьими лицами; Rusty.Lub не контролирует их содержание, условия и политику обработки данных. За дружеские упоминания и ссылки, о которых идёт речь в настоящем пункте, Администрация не получает оплату, товары, услуги или иное вознаграждение; они не публикуются по рекламному договору или обязательству. Само по себе безвозмездное упоминание не означает платного рекламного размещения; оценка конкретной публикации зависит от её содержания и обстоятельств.',
            en: '8.1. The Service may link to third-party websites and platforms or include ordinary friendly mentions of acquaintances’ projects. These resources are operated by third parties; Rusty.Lub does not control their content, terms or data practices. Rusty.Lub receives no payment, goods, services or other compensation for the friendly mentions and links described in this clause; they are not published under an advertising agreement or obligation. An unpaid mention alone does not constitute a paid advertising placement; the assessment of a particular publication depends on its content and circumstances.'
          },
          {
            ru: '8.2. Поддержка через DonationAlerts добровольна и не предоставляет донору товар, подписку, услугу, VIP-статус, игровые преимущества, специальные права или дополнительный доступ. При этом DonationAlerts описывает свою роль как посредника/агента по сбору и перечислению средств и применяет собственные комиссии и правила выплат и возвратов. Платёжные реквизиты вводятся на стороне платформы и её платёжных партнёров; Rusty.Lub не должен запрашивать их на своём сайте. Перед переводом средств пользователь должен ознакомиться с действующими условиями DonationAlerts.',
            en: '8.2. Support through DonationAlerts is voluntary and does not provide the donor with goods, a subscription, a service, VIP status, gameplay advantages, special rights or additional access. DonationAlerts describes its role as an intermediary/agent collecting and remitting funds and applies its own fees and payout/refund rules. Payment credentials are entered on the platform and its payment partners’ side; Rusty.Lub should not request them on its own website. Users should review DonationAlerts’ current terms before sending funds.'
          },
          {
            ru: '8.3. На дату редакции платные рекламные и партнерские размещения на Сервисе не осуществляются. Если такая деятельность появится в будущем, материалы должны быть отделены от обычной справочной информации и оформлены с учетом применимых требований закона: маркировка «реклама», сведения о рекламодателе, идентификатор рекламы и передача сведений через оператора рекламных данных, когда это требуется. До размещения необходимо проверить, возникают ли обязанности рекламораспространителя и обязательные отчисления.',
            en: '8.3. As of this version, the Service does not publish paid advertising or affiliate placements. If such activity is introduced in the future, the materials must be distinguished from ordinary reference information and handled in accordance with applicable legal requirements: an advertising label, advertiser details, an advertising identifier and reporting through an advertising data operator where required. Before publication, any duties of the advertising distributor and mandatory contributions must be assessed.'
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
      <div className={pageMode ? "w-full min-h-[65vh] px-0 py-2 sm:py-4" : "fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"}>
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ duration: 0.2 }}
          className={`w-full ${pageMode ? "max-w-none border-0 border-t border-[#2a344a] bg-transparent shadow-none" : "max-w-4xl border bg-[#0c1017] shadow-[0_0_60px_rgba(0,0,0,0.25)]"} p-0 relative overflow-hidden flex flex-col ${pageMode ? "min-h-[65vh]" : "max-h-[90vh]"}`}
        >
          {/* Header */}
          <div className={`border-b border-[#2a344a] p-4 sm:p-5 flex items-center justify-between relative shrink-0 ${pageMode ? "bg-transparent" : "bg-[#111722]"}`}>
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
            {!pageMode && <button onClick={onClose} className="p-2 hover:bg-white/5 text-zinc-400 hover:text-white transition-all cursor-pointer border border-transparent hover:border-zinc-700 shrink-0 ml-3"><X size={20} /></button>}
          </div>

          {/* Body Content */}
          <div className={`p-4 sm:p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1 ${pageMode ? "bg-transparent" : "bg-[#090c12]"}`}>
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
