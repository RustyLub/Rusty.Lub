import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  Calendar, 
  User, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight,
  Info
} from 'lucide-react';

// Robust helper component that falls back to stylized placeholder art if Facepunch CDN is unstable or blocked
function NewsImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackSrc = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; 
  
  return (
    <div className={`relative bg-[#0c0d10] border border-[#2a2f3b] overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#171a22] animate-pulse">
          <div className="text-[9px] font-mono text-[#cd412b]/60 uppercase tracking-widest animate-pulse">
            SYS_RETRIEVING_ASSET...
          </div>
        </div>
      )}
      <img
        src={hasError ? fallbackSrc : src}
        alt={alt}
        onLoad={() => setLoading(false)}
        onError={() => {
          setHasError(true);
          setLoading(false);
        }}
        className={`w-full h-full object-cover transition-all duration-700 ${loading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
}

interface NewsTabProps {
  lang: 'ru' | 'en';
}

export default function NewsTab({ lang }: NewsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'updates' | 'blogs' | 'events'>('all');
  const [activeNewsId, setActiveNewsId] = useState<string>('july-update-2022');

  const categories = [
    { id: 'all', label: { ru: 'Все публикации', en: 'All Posts' } },
    { id: 'updates', label: { ru: 'Обновления', en: 'Game Updates' } },
    { id: 'blogs', label: { ru: 'Блоги разработчиков', en: 'Devblogs' } },
    { id: 'events', label: { ru: 'События', en: 'Events' } }
  ];

  const newsItems = [
    {
      id: 'july-update-2022',
      category: 'updates',
      title: {
        ru: 'Июльское обновление: Надземные поезда и оптимизация загрузки',
        en: 'July Update: Above-Ground Trains & Fast Load Times'
      },
      date: '07.07.2022',
      author: 'Facepunch Staff',
      badge: { ru: 'Крупный патч', en: 'Major Patch' },
      isFeatured: true,
      coverImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg',
      summary: {
        ru: 'Главной темой июльского обновления Rust стали надземные поезда с новой механикой сцепки вагонов, масштабная оптимизация скорости загрузки игры, а также QoL-улучшения для зиплайнов, тонкая калибровка новой отдачи оружия и встроенные фильтры чата.',
        en: 'The July update brings above-ground trains with a brand new railway coupling system, massive game load-time optimizations, zipline quality-of-life additions, weapon recoil follow-up adjustments, and optional chat filters.'
      },
      content: {
        ru: [
          {
            sectionTitle: '🚂 НАДЗЕМНЫЕ ЖЕЛЕЗНЫЕ ДОРОГИ И СЦЕПКА ВАГОНОВ',
            text: 'В этом месяце мы вывели поезда на надземные рельсы острова! Для первой итерации были адаптированы существующие ассеты, чтобы вы могли опробовать механику. Дизельный локомотив (Work Cart) теперь оснащен магнитными сцепными устройствами с обоих концов, что позволяет формировать полноценные составы, толкая или притягивая различные типы вагонов (пассажирские, грузовые, цистерны). Сцепка происходит автоматически при медленном столкновении локомотива с вагоном.',
            highlights: [
              'Вагоны сцепляются автоматически при медленном сближении составов.',
              'Вы можете расцепить вагоны вручную, подойдя к стыку и нажав кнопку разблокировки на буфере.',
              'Управление поездами надземной сети аналогично подземным локомотивам, но требует повышенной бдительности на переездах.'
            ]
          },
          {
            sectionTitle: '⚡ МОДЕРНИЗАЦИЯ СИСТЕМЫ ЗИПЛАЙНОВ (ZIPLINE QOL)',
            text: 'Зиплайны теперь генерируются гораздо более органично на процедурных картах, подключаясь к опорным линиям электропередач. Игроки получили возможность соединять несколько зиплайнов в цепочку для непрерывного быстрого перемещения на огромные дистанции. Кроме того, добавлены новые элементы управления скоростью во время скольжения.',
            highlights: [
              'Удерживайте W, чтобы значительно ускориться во время скольжения.',
              'Удерживайте S, чтобы замедлить скольжение или подготовиться к безопасному приземлению.',
              'Исправлены резкие рывки камеры при переходе между соединенными линиями.'
            ]
          },
          {
            sectionTitle: '🎯 КАЛИБРОВКА ОТДАЧИ И БАЛАНС PVP',
            text: 'Вслед за крупным июньским изменением перестрелок, мы внесли пакет доработок на основе отзывов сообщества. Скорректирована кривая отдачи для штурмовой винтовки SAR, пулемета M249, пистолетов-пулеметов Custom SMG и Thompson, а также уменьшена горизонтальная тряска при ведении затяжного огня.',
            highlights: [
              'Уменьшена базовая дисперсия пуль (bloom) для штурмовых винтовок.',
              'Добавлены гибкие настройки прицела (толщина линий, цвет, масштаб перекрестия).',
              'Улучшена читаемость прицельных сеток holo-sights на фоне ярких текстур окружения.'
            ]
          },
          {
            sectionTitle: '🚀 ЭКСТРЕМАЛЬНОЕ УСКОРЕНИЕ ЗАГРУЗКИ',
            text: 'Проведена титаническая работа по оптимизации процесса подключения к серверам. За счет оптимизации файлового ввода-вывода, распараллеливания декомпрессии ассетов на все доступные потоки процессора и предварительного кэширования префабов, время загрузки "Asset Warmup" сократилось почти в два раза.',
            highlights: [
              'Время ожидания на этапе Asset Warmup сокращено в среднем на 40-50% на большинстве систем.',
              'Оптимизирована память при подгрузке текстур в процессе игры, что убирает микро-фризы при быстром беге.',
              'Исправлен баг, при котором игра могла аварийно завершиться при загрузке монументов.'
            ]
          }
        ],
        en: [
          {
            sectionTitle: '🚂 ABOVE-GROUND RAILWAYS & TRAIN COUPLING',
            text: 'We wanted to get some trains onto the above-ground rails this month. For this initial release, we are reusing existing assets so players can get a feel for the mechanics. The above-ground Work Cart (locomotive) closely resembles the underground one, but now has magnetic coupling points at each end. This allows players to couple up a chain of carriages (passenger cars, coal/ore beds, fuel wagons) by simply driving into them slowly.',
            highlights: [
              'Carts couple automatically upon a slow collision between carriages.',
              'Uncouple cars manually by interacting with the coupling lever on the physical bumper.',
              'Added shunting and cab controls for high-speed railway logistics.'
            ]
          },
          {
            sectionTitle: '⚡ ZIPLINE QUALITY OF LIFE OVERHAUL',
            text: 'Ziplines have received some major generation upgrades and now link directly onto electrical power poles. Players can now seamlessly ride multi-stage connected ziplines over great distances. Additional movement controls have been added to give players options during transit.',
            highlights: [
              'Hold W while riding to speed up slide velocity.',
              'Hold S to decelerate or prepare for a strategic, safe dismount.',
              'Smoothed camera rotation sweeps at connection junctions.'
            ]
          },
          {
            sectionTitle: '🎯 WEAPON RECOIL FOLLOW-UP ADJUSTMENTS',
            text: 'Following June\'s combat overhaul, we have rolled out a balanced suite of adjustments. Handled specific weapon recoil curve feedback for the Semi-Automatic Rifle (SAR), Custom SMG, Thompson, and M249 to make sustained firing patterns feel more consistent and skill-rewarding.',
            highlights: [
              'SAR & Custom SMG: Reduced early horizontal sway during full spray bursts.',
              'Crosshairs: Expanded support for custom thickness, gap, and color options.',
              'Iron Sights: Adjusted center alignment coordinates on selected models.'
            ]
          },
          {
            sectionTitle: '🚀 SIGNIFICANT LOAD TIME REDUCTIONS',
            text: 'We have made a massive push on optimizing server joining times. By parallelizing asset file decompression across multiple CPU threads, streaming static textures, and preloading high-frequency prefabs, the infamous "Asset Warmup" stage is now twice as fast.',
            highlights: [
              'Asset Warmup phase speeds boosted by 40-50% depending on SSD specifications.',
              'Streamlined memory garbage collection to avoid micro-stutters during high-speed travel.',
              'Fixed client freeze issues that would occasionally cause crashes while loading large monuments.'
            ]
          }
        ]
      }
    },
    {
      id: 'rust-security-protocols',
      category: 'blogs',
      title: {
        ru: 'Улучшения EAC и борьба с запрещенным ПО в 2026 году',
        en: 'EAC Anti-Cheat Advancements & Security Roadmap 2026'
      },
      date: '28.06.2026',
      author: 'Facepunch Security',
      badge: { ru: 'Безопасность', en: 'Security' },
      isFeatured: false,
      coverImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg',
      summary: {
        ru: 'Обзор новых серверных алгоритмов проверки траектории пуль и автоматического выявления мышек с аппаратной эмуляцией отдачи.',
        en: 'Overview of new server-authoritative bullet trajectory verification algorithms and automatic detection of recoil-emulating hardware mice.'
      },
      content: {
        ru: [
          {
            sectionTitle: '🛡️ АНАЛИЗ ТРАЕКТОРИИ ПУЛЬ НА СЕРВЕРЕ (SERVER-AUTHORITATIVE)',
            text: 'Мы внедрили глубокий анализ векторов стрельбы на стороне сервера. Раньше часть проверок доверялась клиенту, что создавало уязвимости для сложного ПО. Теперь каждый выстрел просчитывается и валидируется сервером в реальном времени с учетом пинга, преград и баллистики.',
            highlights: [
              'Полностью исключены мгновенные убийства сквозь стены (magic bullet).',
              'Погрешность сетевой задержки теперь динамически компенсируется без ложных срабатываний.',
              'Автоматическая блокировка аккаунтов при систематическом несовпадении хитбоксов.'
            ]
          },
          {
            sectionTitle: '🖱️ АППАРАТНАЯ ЭМУЛЯЦИЯ И СВЕРХМАКРОСЫ',
            text: 'Особое внимание в этом обновлении уделено устройствам, эмулирующим ввод мыши на физическом уровне (платы сцепления, специальные скрипты). Наша новая эвристическая модель анализирует микро-задержки и паттерны перемещения курсора, безошибочно выявляя идеальные зажимы отдачи.',
            highlights: [
              'Обнаружение скрытых виртуальных портов ввода.',
              'Анализ случайного разброса (jitter) для разделения человека от алгоритма.',
              'Специальные маркеры "Shadow-Ban" для калибровки точности детекта на серверах.'
            ]
          }
        ],
        en: [
          {
            sectionTitle: '🛡️ SERVER-AUTHORITATIVE BULLET TRAJECTORY',
            text: 'We have fully migrated bullet validation steps to be server-authoritative. Previously, partial verifications relied on client predictions, which opened doors to sophisticated cheating software. Every single shot is now recalculated and validated on the server side in real time, accounting for network ping, geometric covers, and ballistic drop.',
            highlights: [
              'Completely eliminated "magic bullet" scenarios where players are shot through solid terrain.',
              'Network latency corrections are now dynamically applied, ensuring clean register without false flags.',
              'Automated bans triggered upon consistent server-client alignment mismatch.'
            ]
          },
          {
            sectionTitle: '🖱️ HARDWARE MOUSE EMULATION & SCRIPT MITIGATION',
            text: 'Our primary focus with this security patch is physical input hardware (like emulation boards or macro-injected controller devices). The updated heuristic model observes micro-delays between packets and tracks uniform cursor positioning, identifying superhuman recoil patterns.',
            highlights: [
              'Detection of masked virtual COM/HID interfaces.',
              'Dynamic jitter and entropy analysis to differentiate human fingers from programmatic scripts.',
              'Temporary shadow-ban pools for profiling anomalous combat behaviors without false bans.'
            ]
          }
        ]
      }
    },
    {
      id: 'twitch-drops-gw4',
      category: 'events',
      title: {
        ru: 'Твич Дропсы к турниру Global Warfare 4: Как получить скины',
        en: 'Global Warfare 4 Twitch Drops: Exclusive Skins Campaign'
      },
      date: '25.06.2026',
      author: 'Community Team',
      badge: { ru: 'Дропсы', en: 'Drops' },
      isFeatured: false,
      coverImage: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252490/header.jpg',
      summary: {
        ru: 'Официальные награды за просмотр стримов турнира. Уникальный спальный мешок, железная дверь с подсветкой и кастомный худи лидера клана.',
        en: 'Official rewards for watching the tournament streams. Claim a glowing metal door, a tactical sleeping bag, and a unique leader hoodie.'
      },
      content: {
        ru: [
          {
            sectionTitle: '🎁 ТВИЧ ДРОПСЫ К ТУРНИРУ GLOBAL WARFARE 4',
            text: 'Очередной этап легендарного турнира Global Warfare возвращается на экраны! Вас ждут 9 уникальных скинов, которые можно получить абсолютно бесплатно, просто просматривая трансляции официальных стримеров. Подключите свой Facepunch аккаунт к Twitch и приготовьтесь забирать награды.',
            highlights: [
              'Общие дропсы доступны на любом стриме в категории Rust.',
              'Эксклюзивные скины стримеров выдаются за просмотр определенных каналов в течение 2-3 часов.',
              'Все награды автоматически зачисляются в ваш инвентарь Steam после клейма.'
            ]
          },
          {
            sectionTitle: '🎒 СПИСОК ДОСТУПНЫХ НАГРАД И СРОКИ ПРОВЕДЕНИЯ',
            text: 'Кампания продлится с 25 июня по 2 июля. Не упустите шанс украсить свой инвентарь редкими предметами, которые больше никогда не будут доступны для покупки или обмена.',
            highlights: [
              'Светящаяся железная дверь (3 часа просмотра официального канала).',
              'Тактический спальный мешок GW4 (2 часа просмотра общих трансляций).',
              'Кастомная толстовка лидера клана с уникальной вышивкой на спине.'
            ]
          },
          {
            sectionTitle: '🎮 ПОШАГОВАЯ ИНСТРУКЦИЯ: КАК ПОЛУЧИТЬ ДРОПСЫ',
            text: 'Чтобы ваши часы просмотра корректно засчитывались, а скины без проблем добавились в Steam, выполните следующие шаги:',
            highlights: [
              'Шаг 1: Авторизуйтесь под своим Steam-аккаунтом, на котором куплена игра Rust, на официальном портале Twitch Drops.',
              'Шаг 2: Подключите ваш личный Twitch-аккаунт на этой же странице, чтобы связать профили.',
              'Шаг 3: Нажмите кнопку «Activate Drops» для запуска отслеживания прогресса просмотра на Twitch.',
              'Шаг 4: Смотрите трансляции стримеров по игре Rust с включенной отметкой «Drops Enabled» (прогресс можно проверять в меню профиля).',
              'Шаг 5: По достижении 100% времени зайдите в Инвентарь Drops на Twitch и обязательно нажмите кнопку «Получить» (Claim).',
              'Шаг 6: Зайдите в игру. Если предмет не пришел в течение 10 минут, зайдите на сайт связки и нажмите «Check for Missing Drops».'
            ]
          }
        ],
        en: [
          {
            sectionTitle: '🎁 TWITCH DROPS: GLOBAL WARFARE 4 EVENT',
            text: 'The legendary Global Warfare tournament is back on our screens! This season features 9 brand new, custom-designed item skins that you can claim for free by simply watching participating streamers. Link your Facepunch account to your Twitch profile and start earning rewards.',
            highlights: [
              'General drops can be earned on any active stream in the Rust directory.',
              'Streamer-specific rewards require 2-3 hours of watch time on their designated channels.',
              'Drops are transferred straight to your Steam Inventory once claimed in the Twitch inventory.'
            ]
          },
          {
            sectionTitle: '🎒 REWARDS POOL & DATES',
            text: 'The Twitch Drops campaign runs from June 25 to July 2. Grab these limited-edition skins while you can, as they will never be sold or tradable on the Steam Community Market.',
            highlights: [
              'Glowing Sheet Metal Door (3 hours watch time on official main stream).',
              'GW4 Tactical Sleeping Bag (2 hours watch time on any participating channel).',
              'Custom Clan Leader Hoodie with high-contrast shoulder emblems.'
            ]
          },
          {
            sectionTitle: '🎮 STEP-BY-STEP CLAIM GUIDE',
            text: 'To ensure your watch time is tracked accurately and rewards are successfully delivered to your Steam library, follow these instructions:',
            highlights: [
              'Step 1: Sign in with your Steam account (where you own Rust) on the official Rust Twitch Drops web portal.',
              'Step 2: Link your personal Twitch account on the same interface to pair the profiles.',
              'Step 3: Click the "Activate Drops" button to authorize progress tracking on Twitch.',
              'Step 4: Watch participating Rust channels with the active "Drops Enabled" tag.',
              'Step 5: Once 100% progress is reached, navigate to your Twitch Drops Inventory and click "Claim" on earned items.',
              'Step 6: Launch Rust. If items fail to appear within 10 minutes, click the "Check for Missing Drops" button on the link page.'
            ]
          }
        ]
      }
    }
  ];

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const activeItem = newsItems.find(item => item.id === activeNewsId) || newsItems[0];

  const handleCategoryChange = (catId: 'all' | 'updates' | 'blogs' | 'events') => {
    setSelectedCategory(catId);
    const matched = catId === 'all'
      ? newsItems
      : newsItems.filter(item => item.category === catId);
    if (matched.length > 0) {
      // If activeNewsId is not part of the newly selected category, set active to first item in category
      if (!matched.some(item => item.id === activeNewsId)) {
        setActiveNewsId(matched[0].id);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#1a1c23] to-[#0c0d10] border border-[#2a2f3b] p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />
        
        <div className="absolute top-0 left-0 bottom-0 w-1.5 rust-hazard" />

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-gradient-to-r from-blue-500/10 to-red-500/10 text-purple-400 border border-purple-500/20">
              <Compass size={16} />
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
              {lang === 'ru' ? 'Служба новостей Facepunch' : 'Facepunch News Desk'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-teko uppercase tracking-wider leading-none">
            {lang === 'ru' ? 'НОВОСТИ И ОБНОВЛЕНИЯ RUST' : 'RUST NEWS & UPDATES'}
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-xl">
            {lang === 'ru' 
              ? 'Официальные патчноуты, изменения баланса, киберспортивные анонсы и девблоги напрямую с передовой разработки выживания.' 
              : 'Official patch logs, balancing, esports announcements, and devblogs straight from the frontlines of survival development.'}
          </p>
        </div>

        {/* Categories Selectors */}
        <div className="flex flex-wrap gap-1.5 bg-[#08090d] p-1 border border-[#1f232e] rounded-sm self-stretch md:self-auto justify-start">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as any)}
              className={`px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider transition-all duration-150 rounded-sm font-mono cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-[#ff4d30] text-white shadow-sm font-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Side Featured, Right Side list */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Selected News Detail */}
        <div className="lg:col-span-8 space-y-6">
          {activeItem ? (
            <div 
              key={activeItem.id} 
              className="bg-[#14171e]/90 border-2 border-[#2a2f3b] rounded-none p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden rust-metal-pattern"
            >
              <div className="rust-bracket-tl" />
              <div className="rust-bracket-tr" />
              <div className="rust-bracket-bl" />
              <div className="rust-bracket-br" />

              {/* Decorative side accent */}
              <div className="absolute top-0 right-0 w-32 h-32 rust-hazard-dark pointer-events-none opacity-25" />
              <div className="absolute top-0 left-0 right-0 h-1 rust-hazard" />

              {/* Meta row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#2a2f3b] pb-4">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500/10 to-red-500/10 border border-purple-500/30 text-[9px] font-black uppercase tracking-widest text-purple-400 font-mono">
                    {activeItem.badge[lang]}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 font-bold">
                    <Calendar size={12} />
                    {activeItem.date}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] font-mono text-gray-500 font-bold uppercase">
                  <User size={12} className="text-purple-400" />
                  BY {activeItem.author}
                </span>
              </div>

              {/* Main Cover Image */}
              {activeItem.coverImage && (
                <NewsImage 
                  src={activeItem.coverImage} 
                  alt={activeItem.title[lang]} 
                  className="w-full aspect-video md:h-80 max-h-96 object-cover border-2 border-[#2a2f3b] shadow-inner" 
                />
              )}

              {/* Title */}
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans uppercase leading-tight">
                  {activeItem.title[lang]}
                </h3>
                <div className="relative text-sm text-gray-300 leading-relaxed font-sans font-medium bg-[#0c0d10] p-4 pl-5 border-y border-r border-[#2a2f3b]">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-red-500" />
                  {activeItem.summary[lang]}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-6 pt-2">
                {activeItem.content && activeItem.content[lang] && activeItem.content[lang].map((sec, sIdx) => (
                  <div key={sIdx} className="space-y-4 bg-[#171a22]/60 p-5 border border-[#2a2f3b]/70 relative">
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-gray-600" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-gray-600" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-gray-600" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-gray-600" />

                    <h4 className="text-xs font-mono font-black tracking-widest bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent uppercase inline-block">
                      {sec.sectionTitle}
                    </h4>

                    <p className="text-xs text-gray-400 leading-relaxed font-sans font-medium">
                      {sec.text}
                    </p>

                    <ul className="space-y-2 pt-2">
                      {sec.highlights.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5 text-[11px] text-gray-300 font-sans font-medium">
                          <CheckCircle2 size={13} className="text-purple-400 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Interactive bottom notice */}
              <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 p-4 font-mono text-[11px] text-amber-500">
                <Info size={16} className="shrink-0" />
                <p className="font-bold">
                  {lang === 'ru' 
                    ? 'Внимание: Данные изменения уже применились на всех официальных серверах Facepunch и Rustoria. Перезагрузите клиент игры для скачивания патча.'
                    : 'Notice: These changes have already taken effect across all official Facepunch and Rustoria servers. Restart your client to download the patch.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-12 bg-[#14171e] border border-[#2a2f3b] text-gray-500 font-mono text-xs uppercase">
              {lang === 'ru' ? 'Крупные обновления в этой категории отсутствуют' : 'No major updates found in this category'}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar List of other news */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 shadow-xl relative overflow-hidden">

            <div className="rust-bracket-tl" />
            <div className="rust-bracket-tr" />
            
            <h3 className="text-xs font-mono font-black tracking-widest uppercase border-b border-[#2a2f3b] pb-3 mb-4 flex items-center justify-between">
              <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">{lang === 'ru' ? 'ДРУГИЕ ПУБЛИКАЦИИ' : 'OTHER POSTS'}</span>
              <span className="text-[9px] text-gray-500 tracking-normal uppercase">FEED v1.2</span>
            </h3>

            <div className="space-y-4">
              {filteredNews.filter(n => n.id !== activeItem.id).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => setActiveNewsId(item.id)}
                  className="p-4 bg-[#1b1e26]/40 hover:bg-[#1b1e26]/80 border border-[#2a2f3b] hover:border-gray-600 transition-all cursor-pointer relative group"
                >
                  {/* Subtle side pointer bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-red-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-500/10 to-red-500/10 text-purple-400 border border-purple-500/20 text-[8px] font-bold font-mono uppercase tracking-wider">
                      {item.badge[lang]}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 font-medium">
                      {item.date}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-wide leading-snug">
                    {item.title[lang]}
                  </h4>

                  <p className="text-[10.5px] text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                    {item.summary[lang]}
                  </p>

                  <div className="mt-3 flex items-center gap-1 text-[9px] text-purple-400 font-bold font-mono tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{lang === 'ru' ? 'ЧИТАТЬ ПОЛНОСТЬЮ' : 'READ MORE'}</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}

              {filteredNews.filter(n => n.id !== activeItem.id).length === 0 && (
                <div className="text-center py-6 text-gray-500 font-mono text-[10px] uppercase">
                  {lang === 'ru' ? 'Нет дополнительных публикаций' : 'No secondary posts found'}
                </div>
              )}
            </div>
          </div>

          {/* Steam Community Spotlight Section */}
          <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 shadow-xl relative overflow-hidden">
            <div className="rust-bracket-bl" />
            <div className="rust-bracket-br" />

            <h3 className="text-xs font-mono font-black tracking-widest uppercase border-b border-[#2a2f3b] pb-3 mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text text-transparent">{lang === 'ru' ? 'ОТ КЛИЕНТА ДО СЕРВЕРА' : 'CLIENT TO SERVER'}</span>
            </h3>

            <div className="bg-black/30 p-4 border border-[#2a2f3b] text-center space-y-3 relative">
              <div className="absolute top-1 left-1.5 text-[8px] font-mono text-gray-600">SYS_V: 242.0</div>
              <Cpu size={24} className="text-purple-400 mx-auto animate-pulse" />
              <div className="space-y-1">
                <span className="block text-[11px] text-gray-300 font-sans font-bold">
                  {lang === 'ru' ? 'Принудительный вайп карты' : 'Forced Map Wipe'}
                </span>
                <span className="block text-[9px] font-mono text-gray-500 font-bold uppercase">
                  {lang === 'ru' ? 'КАЖДЫЙ ПЕРВЫЙ ЧЕТВЕРГ МЕСЯЦА' : 'EVERY FIRST THURSDAY OF THE MONTH'}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans leading-relaxed">
                {lang === 'ru' 
                  ? 'Все официальные серверверы Rust проходят глобальную очистку баз и чертежей в день выпуска ежемесячного обновления.'
                  : 'All official Rust servers undergo a global map & blueprints reset on the release hour of monthly update logs.'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
