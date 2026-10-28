import { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, onSnapshot, doc, setDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { NewsItem } from '../types';
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
  Info,
  Send,
  Bell
} from 'lucide-react';

const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  // ==========================================
  // ОКТЯБРЬ 2026 (OCTOBER 2026)
  // ==========================================
  {
    id: 'rust-october-2026-halloween-event',
    category: 'events',
    title: {
      ru: '🎃 Хэллоуин в Rust 2026: Порталы в Подземелья, Охота за Конфетами и Франкенштейн',
      en: '🎃 Rust Halloween Event 2026: Dungeon Portals, Trick or Treat & Frankenstein Pet'
    },
    date: '2026-10-22T18:00:00.000Z',
    author: 'Facepunch Studios',
    badge: {
      ru: 'ИВЕНТ ХЭЛЛОУИН',
      en: 'HALLOWEEN EVENT'
    },
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'Стартовал грандиозный Хэллоуин в Rust! Жуткие порталы с боссами в подземельях, конфетный блиц (Trick or Treat), оживление ручного Франкенштейна, бродячие мумии и лимитированные скины мастерской.',
      en: 'The annual Rust Halloween event has arrived! Spooky dungeon portals, Trick or Treat candy blitz, Frankenstein pet assembly, wandering mummies, and limited-time workshop skins.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Порталы в Подземелья и Конфетная Охота:',
          text: 'По всему острову открылись мистические порталы, ведущие в заброшенные катакомбы:',
          highlights: [
            'Порталы в подземелья (Dungeon Portals): зачищайте склепы от мумий и получайте лут высшего тира',
            'Каждые два игровых дня начинается событие «Trick or Treat» — сбор конфет за 3 минуты с призами',
            'Улучшение конфетных корзин от малых до золотых с оружием, ресурсами и гранатами'
          ]
        },
        {
          sectionTitle: 'Стол Франкенштейна и Ручной Питомец:',
          text: 'Соберите собственного монстра-защитника базы на медицинском столе:',
          highlights: [
            'Охотьтесь на пугал и зомби, чтобы добыть голову, туловище и ноги монстра',
            'Соберите чудовище Франкенштейна и управляйте им клавишами команд (атака, следование, охрана шкафа)',
            'Питомец обладает высоким здоровьем и помогает отбивать оффлайн-рейды'
          ]
        },
        {
          sectionTitle: 'Хэллоуинские Рецепты и Декорации:',
          text: 'Эксклюзивные праздничные предметы для базы:',
          highlights: [
            'Ведьмин котёл для быстрого создания целебных отваров и чаёв',
            'Деревянные гробы повышенной вместимости (замена большим сундукам)',
            'Светящиеся резные тыквы и паутина для маскировки турелей'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Dungeon Portals & Candy Blitz:',
          text: 'Mystic portals have opened across the island leading to forgotten underground crypts:',
          highlights: [
            'Dungeon Portals: clear mummy crypts to claim high-tier sulfur and weapon loot',
            'Every two in-game days, the 3-minute Trick or Treat event triggers across the map',
            'Upgrade candy baskets from small up to gold tier for top weapons and explosives'
          ]
        },
        {
          sectionTitle: 'Frankenstein Table & Monster Pet:',
          text: 'Assemble your own base guard creature at the operating table:',
          highlights: [
            'Hunt wandering scarecrows and mummies to harvest head, torso, and legs parts',
            'Bring Frankenstein monster to life and issue radial commands (Attack, Guard TC, Follow)',
            'Monster pet features large health pool and assists in defending against raiders'
          ]
        },
        {
          sectionTitle: 'Spooky Craftables & Base Items:',
          text: 'Exclusive seasonal holiday decor and storage:',
          highlights: [
            'Witch Cauldron for brewing potent pure healing teas and potions',
            'Large wooden coffins offering expanded item storage capacity',
            'Glowing jack-o-lanterns and spiderwebs useful for camouflaging auto-turrets'
          ]
        }
      ]
    }
  },
  {
    id: 'rust-october-2026-siege-defense-patch',
    category: 'updates',
    title: {
      ru: '🛡️ Октябрьский патч Rust: Баланс Осадных Орудий, Ремонт Фундаментов и Клановые Метки',
      en: '🛡️ October Rust Patch: Siege Balance, Foundation Repair Overhaul & Clan Pings'
    },
    date: '2026-10-03T19:00:00.000Z',
    author: 'Facepunch Studios',
    badge: {
      ru: 'ПАТЧ 03.10',
      en: 'PATCH OCT 03'
    },
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'Октябрьский глобальный вайп: введена система экстренного ремонта фундаментов киянкой, тактические компасные метки для кланов, оптимизировано ночное освещение и акустика выстрелов.',
      en: 'October global wipe introduces emergency foundation repair with hammer, tactical clan compass ping system, night vision lighting optimizations, and improved bullet acoustic propagation.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Ремонт Фундаментов и Защита Баз:',
          text: 'Критические улучшения баланса защиты построек во время рейда:',
          highlights: [
            'Устранена блокировка ремонта фундамента при наличии соответствующих материалов в инвентаре',
            'Исправлен эксплойт с прохождением сквозь треугольные крыши (Triangle Roof Fix)',
            'Увеличен запас сопротивления бронированных МВК-дверей против зажигательных ракет'
          ]
        },
        {
          sectionTitle: 'Клановые Тактические Метки (Ping System 2.0):',
          text: 'Обновленная система целеуказания для командной игры:',
          highlights: [
            'Радиальное меню пингов: Враг, Лут, Опасность, Сбор и Движение на компасе',
            'Синхронизация меток в мобильном приложении Rust+ и на внутриигровой карте',
            'Отображение точной дистанции в метрах для снайперской стрельбы'
          ]
        },
        {
          sectionTitle: 'Освещение и Акустика Выстрелов:',
          text: 'Переработка визуальных и звуковых эффектов ночного боя:',
          highlights: [
            'Увеличен эффективный радиус подсветки факелов и тактических фонарей оружия',
            'Реалистичное эхо выстрелов в каньонах и внутри монументов'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Foundation Repair & Base Defense:',
          text: 'Critical balance tweaks for defensive base upkeep during active raids:',
          highlights: [
            'Removed cooldown block on foundation repair when carrying required upkeep materials',
            'Patched clipping exploit through triangle roofs (Triangle Roof Fix)',
            'Boosted armored door resistance against incendiary rockets'
          ]
        },
        {
          sectionTitle: 'Tactical Clan Ping System 2.0:',
          text: 'Upgraded target designation for squad coordination:',
          highlights: [
            'Radial ping wheel: Enemy, Loot, Danger, Regroup, and Move on compass header',
            'Instant ping synchronization with Rust+ companion app and in-game map',
            'Direct distance readout in meters for precision sniper engagements'
          ]
        },
        {
          sectionTitle: 'Night Optics & Ballistic Acoustics:',
          text: 'Reworked visual and spatial audio cues:',
          highlights: [
            'Expanded effective glow radius for weapon flashlights and torches',
            'Realistic gunfire echo propagation across canyons and monument interiors'
          ]
        }
      ]
    }
  },

  // ==========================================
  // СЕНТЯБРЬ 2026 (SEPTEMBER 2026)
  // ==========================================
  {
    id: 'rust-september-2026-world-biome-overhaul',
    category: 'updates',
    title: {
      ru: '🌿 Сентябрьское обновление: Переработка Биомов, Реки с Водопадами и Военные Туннели',
      en: '🌿 September Rust Update: Biome World Overhaul, Waterfalls & Military Tunnels Rework'
    },
    date: '2026-09-05T19:00:00.000Z',
    author: 'Facepunch Studios',
    badge: {
      ru: 'ПАТЧ 05.09',
      en: 'PATCH SEP 05'
    },
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'Генерация процедурной карты получила масштабный апдейт: новые реалистичные водопады, извилистые реки для лодок, густая растительность джунглей и переработанные ученые в Military Tunnels.',
      en: 'Procedural map generation receives a massive overhaul with realistic waterfalls, winding boat-navigable rivers, lush canopy vegetation, and revamped scientist AI inside Military Tunnels.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Динамическая Сеть Рек и Водопадов:',
          text: 'Природные водные артерии острова полностью трансформированы:',
          highlights: [
            'Глубоководные извилистые реки позволяют перемещаться на моторных лодках и каяках через всю карту',
            'Величественные водопады со скрытыми за водяной завесой пещерами для секретных баз',
            'Естественные источники чистой пресной воды для полива ферм без опреснителей'
          ]
        },
        {
          sectionTitle: 'Переработка Военных Туннелей (Military Tunnels 2.0):',
          text: 'Один из самых опасных монументов стал ещё более тактическим:',
          highlights: [
            'Новый патрульный Тяжёлый Учёный (Heavy Scientist) у центрального реактора',
            'Альтернативный дренажный туннель для побега с зелёными и синими ключ-картами',
            'Лут в элитных ящиках монумента увеличен на 25%'
          ]
        },
        {
          sectionTitle: 'Флора и Оптимизация Скинов:',
          text: 'Изменения в сборе ресурсов и производительности клиента:',
          highlights: [
            'Увеличен спавн диких кустов конопли в лесных и речных биомах',
            'Мгновенная прогрузка скинов дверей и ящиков без падения FPS'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Dynamic River Networks & Waterfalls:',
          text: 'Island waterways have been completely revitalized:',
          highlights: [
            'Deep navigable riverways allow cross-island travel via motorboats and kayaks',
            'Majestic waterfalls featuring hidden caves behind the water curtain for stealth base building',
            'Natural freshwater sources for direct crop hydration without purifiers'
          ]
        },
        {
          sectionTitle: 'Military Tunnels Overhaul (Military Tunnels 2.0):',
          text: 'One of the deadliest monuments receives upgraded tactical depth:',
          highlights: [
            'New patrol Heavy Scientist defending the central reactor corridor',
            'Alternative drainage maintenance escape route requiring green and blue keycards',
            'Elite crate item yields increased by 25%'
          ]
        },
        {
          sectionTitle: 'Flora & Workshop Skin Optimization:',
          text: 'Gathering and client performance polish:',
          highlights: [
            'Increased wild hemp plant density throughout temperate and river biomes',
            'Instantaneous door and storage skin streaming eliminating frame rate hiccups'
          ]
        }
      ]
    }
  },
  {
    id: 'rust-september-2026-devblog-netcode',
    category: 'blogs',
    title: {
      ru: '🛠️ Девблог Facepunch #264: Сетевой код, Тикрейт Серверов и Борьба со Статтерами',
      en: '🛠️ Facepunch Devblog #264: Netcode Overhaul, Server Tickrates & Stutter Fixes'
    },
    date: '2026-09-18T14:00:00.000Z',
    author: 'Facepunch Devs',
    badge: {
      ru: 'ДЕВБЛОГ #264',
      en: 'DEVBLOG #264'
    },
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'Инженеры Facepunch раскрыли архитектурные детали переработки системы сетевой репликации сущностей, устранения микрофризов вблизи огромных клан-баз и снижения пинга на заполненных серверах.',
      en: 'Facepunch engineers break down the deep network entity replication rework, eliminating frame drops near massive clan compounds and drastically cutting map load times.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Entity Pooling 3.0 и Экономия Видеопамяти:',
          text: 'Оптимизация рендеринга тысяч построек и предметов:',
          highlights: [
            'Экономия до 2 ГБ видеопамяти при приближении к крупным клановым деревням',
            'Асинхронная выгрузка неиспользуемых текстур при перемещении между биомами',
            'Устранение микростаттеров при открытии больших инвентарей'
          ]
        },
        {
          sectionTitle: 'Сжатие Трафика и Регистрация Попаданий:',
          text: 'Сетевые оптимизации для высоконагруженных перестрелок:',
          highlights: [
            'Сжатие сетевых пакетов на 40% во время плотного огня из пулемётов М249 и HMG',
            'Улучшена точность серверной регистрации попаданий (Hit Registration) по движущимся целям'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Entity Pooling 3.0 & VRAM Optimization:',
          text: 'Massive rendering enhancements for large compounds:',
          highlights: [
            'Saves up to 2 GB of VRAM when approaching mega clan bases',
            'Asynchronous unloading of dormant textures between biomes',
            'Eliminated stutter spikes when opening high-capacity inventories'
          ]
        },
        {
          sectionTitle: 'Traffic Compression & Hit Registration:',
          text: 'High-octane gunfight networking tweaks:',
          highlights: [
            '40% network packet compression during heavy M249 and HMG sustained fire',
            'Enhanced server hit validation precision against moving players and vehicles'
          ]
        }
      ]
    }
  },

  // ==========================================
  // АВГУСТ 2026 (AUGUST 2026)
  // ==========================================
  {
    id: 'rust-august-6-power-trip-update',
    category: 'updates',
    title: {
      ru: '⚡ Глобальное обновление Rust: «Power Trip» и Электросеть Острова',
      en: '⚡ Global Rust Update: "Power Trip" & Island Electrical Grid'
    },
    date: '2026-08-06T19:00:00.000Z',
    author: 'Facepunch Studios',
    badge: {
      ru: 'ПАТЧ 06.08',
      en: 'PATCH AUG 06'
    },
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'В патче добавлена единая электросеть острова, переработано Энергодепо (Power Plant) с красным утилизатором 100%, событие с падением спутника на Космодроме, заправка нефти на Сфере, насос заправки и пищевые морозильники!',
      en: 'The August update introduces the island interconnected power grid, Power Plant overhaul with 100% Red Recycler, Satellite Crash event at Launch Site, Dome crude oil pump, functional car lifts, and powered freezers!'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Единая Электросеть Острова & Power Plant Overhaul:',
          text: 'Монументы острова теперь соединены линиями ЛЭП. Главный узел сети — переработанная Электростанция (Power Plant).',
          highlights: [
            'Новый Предохранитель (Heavy Fuse) — запуск подстанций высоковольтных линий',
            'Новая Красная Комната и Красный Утилизатор (Red Recycler) с 100% эффективностью переработки',
            'Подъём по линиям ЛЭП и подключение кабелей на вершинах опор'
          ]
        },
        {
          sectionTitle: 'Событие Падения Спутника & Обновление Монументов:',
          text: 'Новые ивенты и механизмы на ключевых точках карты:',
          highlights: [
            'Космодром (Launch Site): терминал вызова события «Падение Спутника» (Satellite Crash)',
            'Сфера (The Dome): функционирующая станция откачки сырой нефти (Crude Oil) из цистерн',
            'Заправка Oxum\'s: подъемник для авто в гараже с бесплатной заправкой аккумов',
            'Заброшенный Супермаркет: электрические пищевые морозильники (Food Freezers)'
          ]
        },
        {
          sectionTitle: 'Баланс, Постройки и Авто-Турели:',
          text: 'Изменения в экономике и защите баз:',
          highlights: [
            'Высокие Внешние Стены и Ворота теперь требуют содержания (Upkeep) в шкафу (TC) и гниют при его отсутствии',
            'Крафт Авто-турели увеличен до 25 МВК (HQM) + 1 Техно-мусор',
            'Утилизаторы в Безопасных Зонах работают на 80% (налог на безопасность), а запитанные на монументах — на 60% с ускорением'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Island Electrical Grid & Power Plant Overhaul:',
          text: 'Monuments across the map are now hooked into the island high-voltage grid with Power Plant as the hub.',
          highlights: [
            'New Heavy Fuse item required to power up grid sub-stations',
            'Power Plant Red Room & Red Recycler featuring 100% yield efficiency',
            'Climbable powerline poles with junction boxes'
          ]
        },
        {
          sectionTitle: 'Satellite Crash Event & Monument Enhancements:',
          text: 'New events and mechanics introduced across monuments:',
          highlights: [
            'Launch Site: launch terminal to trigger the orbital Satellite Crash event',
            'The Dome: Crude Oil pump extraction station at the base of the sphere',
            'Oxum\'s Gas Station: working car lift in garage bay',
            'Abandoned Supermarket: powered food freezers preserving perishables'
          ]
        },
        {
          sectionTitle: 'Building Balance & Auto Turrets:',
          text: 'Updates to upkeep and raiding items:',
          highlights: [
            'High External Walls and Gates now require TC upkeep and decay if TC is depleted',
            'Auto Turret craft cost increased to 25 HQM + 1 Tech Trash',
            'Safe Zone Recyclers operate at 80% (tax), powered Field Recyclers run at 60% with speed boost'
          ]
        }
      ]
    }
  },
  {
    id: 'rust-lfg-bot-news',
    category: 'events',
    title: {
      ru: '🤖 Новый бот для поиска команды в Rust',
      en: '🤖 New Teammate & Clan Finder Bot for Rust'
    },
    date: '2026-08-06T12:00:00.000Z',
    author: 'RustLFG',
    badge: {
      ru: 'TELEGRAM БОТ',
      en: 'TELEGRAM BOT'
    },
    isFeatured: false,
    coverImage: '/images/rust_lfg_bot.png',
    summary: {
      ru: '@RustLFGBot — теперь находить тиммейтов и кланы стало проще. Бот работает прямо в Telegram.',
      en: '@RustLFGBot makes finding teammates and clans easier than ever, right inside Telegram.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Как это работает:',
          text: 'Быстрый и удобный сервис поиска соратников и кланов с системой взаимных лайков и свайпов:',
          highlights: [
            'Создаёте анкету с возрастом, микрофоном, часовым поясом и целями (тиммейт/клан/набор игроков)',
            'Листаете анкеты других игроков со свайпами ❤️ или ⛔',
            'При взаимном интересе бот уведомляет — остаётся только написать'
          ]
        },
        {
          sectionTitle: 'Для кого:',
          text: 'Универсальное решение для различных категорий игроков и сообществ Rust:',
          highlights: [
            'Игроки в поиске пары, трио или клана',
            'Кланы, которые набирают людей',
            'Те, кто хочет просто найти компанию'
          ]
        },
        {
          sectionTitle: 'Как начать:',
          text: 'Перейдите в бота → @RustLFGBot, напишите /start, выберите язык и заполните анкету.',
          highlights: [
            'Бесплатно. 24/7. Русский и английский языки.',
            'https://t.me/RustLFGBot'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'How it works:',
          text: 'Convenient Telegram service for fast teammate and clan matchmaking with swipes and mutual matches:',
          highlights: [
            'Create a profile with your age, mic status, timezone, and goals (teammate/clan/recruiting)',
            'Browse profiles of other players with swipes ❤️ or ⛔',
            'Get notified instantly when there is a mutual match — just message them'
          ]
        },
        {
          sectionTitle: 'Who it is for:',
          text: 'Universal tool for all kinds of Rust players and teams:',
          highlights: [
            'Players looking for a duo, trio, or clan',
            'Clans actively recruiting players',
            'Anyone wanting to find friendly company for wipe'
          ]
        },
        {
          sectionTitle: 'How to get started:',
          text: 'Go to bot → @RustLFGBot, type /start, choose language and fill out your profile.',
          highlights: [
            'Free. 24/7. Russian and English languages.',
            'https://t.me/RustLFGBot'
          ]
        }
      ]
    }
  },
  {
    id: 'rust-august-2026-global-warfare-tournament',
    category: 'events',
    title: {
      ru: '🏆 Итоги турнира Global Warfare 4 и Эксклюзивные Twitch Drops',
      en: '🏆 Global Warfare 4 Tournament Results & Exclusive Twitch Drops Campaign'
    },
    date: '2026-08-03T18:00:00.000Z',
    author: 'Facepunch Community',
    badge: {
      ru: 'ТУРНИР & DROPS',
      en: 'TOURNAMENT & DROPS'
    },
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'Завершилось грандиозное киберспортивное сражение Global Warfare 4! Победители турнира, хайлайты финального рейда мейн-базы и уникальная коллекция наградных скинов Twitch Drops.',
      en: 'The epic Global Warfare 4 tournament has concluded! Champions crowned, breakdown of the final base raid, and limited-time Twitch Drops rewards.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Хайлайты Финала и Статистика Рейдов:',
          text: 'Кульминация трёхдневного турнира с участием лучших кланов мира:',
          highlights: [
            'Потрачено свыше 450 ракет за 40 минут финального штурма главной крепости',
            'Победа сборной EU в ожесточенной защите шкафа на 5 этаже',
            'Рекорд одновременного онлайна зрителей на Twitch'
          ]
        },
        {
          sectionTitle: 'Наградные Twitch Drops Скины:',
          text: 'Коллекция эксклюзивных предметов события:',
          highlights: [
            'Светящийся в темноте скин на автомат Калашникова (AK-47 «Global Warfare»)',
            'Бронированная дверь и металлический шлем с символикой чемпионов'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Final Highlights & Raid Breakdown:',
          text: 'The culmination of a 3-day battle featuring the world\'s best Rust squads:',
          highlights: [
            'Over 450 rockets fired within 40 minutes of intense main fortress siege',
            'EU squad clinches victory defending the 5th floor tool cupboard core',
            'New all-time concurrent viewership peak across Rust Twitch category'
          ]
        },
        {
          sectionTitle: 'Exclusive Twitch Drops Rewards:',
          text: 'Commemorative event skins available to claim:',
          highlights: [
            'Glow-in-the-dark AK-47 "Global Warfare" assault rifle skin with illuminated sights',
            'Armored single door and metal facemask sporting tournament crest'
          ]
        }
      ]
    }
  },

  // ==========================================
  // ИЮЛЬ 2026 (JULY 2026)
  // ==========================================
  {
    id: 'rust-july-2026-bikes-roadways-update',
    category: 'updates',
    title: {
      ru: '🏍️ Июльское обновление: Велосипеды, Мотоциклы с Коляской и Наручники',
      en: '🏍️ July Rust Update: Bicycles, Sidecar Motorbikes & Handcuffs'
    },
    date: '2026-07-04T19:00:00.000Z',
    author: 'Facepunch Studios',
    badge: {
      ru: 'ПАТЧ 04.07',
      en: 'PATCH JUL 04'
    },
    isFeatured: true,
    coverImage: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'На Остров прибыл легкий двухколесный транспорт: горные велосипеды без топлива, быстрые мотоциклы и мотоциклы с коляской для напарника! Добавлены наручники и мешки на голову для захвата пленных.',
      en: 'Light two-wheeled transport arrives in Rust: pedal bicycles requiring no fuel, high-speed motorbikes, and sidecar rigs for a teammate! Plus handcuffs and prisoner hoods for taking captives.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Двухколесный Транспорт: Велосипеды и Мотоциклы:',
          text: 'Новые средства быстрого и тихого передвижения по суше:',
          highlights: [
            'Горный велосипед (Bicycle): бесшумная езда без затрат топлива, педальный разгон и прыжки через препятствия',
            'Мотоцикл (Motorbike): скорость до 90 км/ч, двигатель на топливе низкого качества',
            'Мотоцикл с люлькой (Sidecar): напарник в коляске может вести огонь из автоматов и РПГ на ходу'
          ]
        },
        {
          sectionTitle: 'Захват Пленников: Наручники и Мешок на Голову:',
          text: 'Новые ролевые и тактические инструменты контроля врагов:',
          highlights: [
            'Наручники (Handcuffs): сковывают поверженного врага, блокируя доступ к инвентарю и оружию',
            'Мешок на голову (Prisoner Hood): полностью ослепляет пленника черным экраном',
            'Возможность конвоировать пленника на веревке или перевозить в транспорте'
          ]
        },
        {
          sectionTitle: 'Шоссейные Трассы и Рампы:',
          text: 'Дорожное строительство и каскадерские трюки:',
          highlights: [
            'Широкие асфальтированные трассы с дорожной разметкой, соединяющие монументы',
            'Деревянные рампы и трамплины для прыжков на мотоциклах'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Two-Wheeled Transport: Bikes & Motorbikes:',
          text: 'Brand new agile surface locomotion options:',
          highlights: [
            'Mountain Bicycle: silent pedal power requiring zero fuel, bunny-hop jumps over obstacles',
            'Motorbike: speeds reaching up to 90 km/h powered by Low Grade Fuel',
            'Sidecar Rig: passenger in the sidecar can fire assault rifles and RPGs on the run'
          ]
        },
        {
          sectionTitle: 'Prisoner Mechanics: Handcuffs & Hoods:',
          text: 'Tactical non-lethal hostage capture systems:',
          highlights: [
            'Handcuffs: restrain downed players, locking them out of their weapons and inventory',
            'Prisoner Hood: entirely obscures the captive\'s screen with black cloth',
            'Escort prisoners via rope lead or load them into vehicle passenger seats'
          ]
        },
        {
          sectionTitle: 'Paved Highways & Stunt Ramps:',
          text: 'Roadway expansion across the island:',
          highlights: [
            'Wide asphalt highway networks with road markings linking major monuments',
            'Craftable wooden stunt ramps for high-flying motorcycle maneuvers'
          ]
        }
      ]
    }
  },
  {
    id: 'rust-july-2026-devblog-summer-balance',
    category: 'blogs',
    title: {
      ru: '☀️ Летний Девблог Facepunch #262: Перебалансировка Цен Вендоров и Abyss Pack',
      en: '☀️ Summer Facepunch Devblog #262: Vendor Economy Rebalance & Abyss Pack'
    },
    date: '2026-07-18T15:00:00.000Z',
    author: 'Facepunch Devs',
    badge: {
      ru: 'ДЕВБЛОГ #262',
      en: 'DEVBLOG #262'
    },
    isFeatured: false,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
    summary: {
      ru: 'Масштабная ревизия экономики мирных зон: пересмотрены лимиты скупки дерева и камня за скрап в Аванпосте, обновлены подводные миссии дайвинга и визуальные эффекты летнего солнца.',
      en: 'Major overhaul of safe-zone economies: rebalanced scrap-to-stone and scrap-to-wood trade quotas in Outpost, deep-sea diving missions, and updated summer sun and ocean shaders.'
    },
    content: {
      ru: [
        {
          sectionTitle: 'Экономика Аванпоста и Города Бандитов:',
          text: 'Борьба с абьюзом бесконечного фарма через вендоров:',
          highlights: [
            'Введен динамический кулдаун на массовую скупку древесины за камень в мирном городе',
            'Снижена стоимость патронов и револьверов у NPC-торговцев на 15%'
          ]
        },
        {
          sectionTitle: 'Глубоководные Миссии и Подводные Контейнеры:',
          text: 'Расширение морского контента:',
          highlights: [
            'Миссии на подъём затонувших грузовых контейнеров с помощью надувных буев',
            'Новый подводный фонарь и скоростной подводный гарпун'
          ]
        }
      ],
      en: [
        {
          sectionTitle: 'Outpost & Bandit Camp Economy:',
          text: 'Restraining endless safe-zone trade exploitation:',
          highlights: [
            'Dynamic cooldown limits on bulk scrap-to-wood and stone-to-wood trading',
            '15% price cut on basic ammo and revolver purchases from NPC vendors'
          ]
        },
        {
          sectionTitle: 'Deep Sea Salvage Missions & Abyss Pack:',
          text: 'Underwater exploration expansion:',
          highlights: [
            'Missions to float sunken shipping containers using inflatable salvage bags',
            'High-power underwater tactical dive light and speargun enhancements'
          ]
        }
      ]
    }
  }
];

// Robust helper component that falls back to stylized placeholder art if Facepunch CDN is unstable or blocked
function NewsImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(true);

  const fallbackSrc = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"; 
  
  return (
    <div className={`relative bg-[#0c0d10] border border-[#2a2f3b] overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#171a22] animate-pulse">
          <div className="text-[9px] font-mono text-[#f97316]/60 uppercase tracking-widest animate-pulse">
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
  onOpenNotifications?: () => void;
}

export default function NewsTab({ lang, onOpenNotifications }: NewsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'updates' | 'blogs' | 'events'>('all');
  const [selectedMonth, setSelectedMonth] = useState<'all' | '10' | '09' | '08' | '07'>('all');
  const [activeNewsId, setActiveNewsId] = useState<string>('rust-october-2026-halloween-event');
  const [newsItems, setNewsItems] = useState<NewsItem[]>(DEFAULT_NEWS_ITEMS);

  console.log('NewsTab render - activeNewsId:', activeNewsId, 'newsItems count:', newsItems.length);

  const categories = [
    { id: 'all', label: { ru: 'Все публикации', en: 'All Posts' } },
    { id: 'updates', label: { ru: 'Обновления', en: 'Game Updates' } },
    { id: 'blogs', label: { ru: 'Блоги разработчиков', en: 'Devblogs' } },
    { id: 'events', label: { ru: 'События', en: 'Events' } }
  ];

  const months = [
    { id: 'all', label: { ru: 'Все месяцы', en: 'All Months' } },
    { id: '10', label: { ru: '🎃 Октябрь', en: '🎃 October' } },
    { id: '09', label: { ru: '🌿 Сентябрь', en: '🌿 September' } },
    { id: '08', label: { ru: '⚡ Август', en: '⚡ August' } },
    { id: '07', label: { ru: '🏍️ Июль', en: '🏍️ July' } }
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'news'), (snapshot) => {
        const dbItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NewsItem));
        
        // Merge db items with default items if not present in DB
        const mergedMap = new Map<string, NewsItem>();
        DEFAULT_NEWS_ITEMS.forEach(item => mergedMap.set(item.id, item));
        dbItems.forEach(item => mergedMap.set(item.id, item));

        const combined = Array.from(mergedMap.values());
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setNewsItems(combined);
        if (combined.length > 0 && (!activeNewsId || !combined.some(i => i.id === activeNewsId))) {
            setActiveNewsId(combined[0].id);
        }

        // Auto seed default news to firestore if missing in DB
        if (!dbItems.some(item => item.id === 'rust-october-2026-halloween-event')) {
          setDoc(doc(db, 'news', 'rust-october-2026-halloween-event'), DEFAULT_NEWS_ITEMS[0]).catch(() => {});
        }
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'news');
    });
    return () => unsubscribe();
  }, []);

  const filteredNews = newsItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    if (!matchesCat) return false;
    if (selectedMonth === 'all') return true;
    const m = new Date(item.date).toISOString().substring(5, 7);
    return m === selectedMonth;
  });

  const activeItem = newsItems.find(item => item.id === activeNewsId) || filteredNews[0] || newsItems[0];

  const handleCategoryChange = (catId: 'all' | 'updates' | 'blogs' | 'events') => {
    setSelectedCategory(catId);
    const matched = newsItems.filter(item => {
      const matchCat = catId === 'all' || item.category === catId;
      if (!matchCat) return false;
      if (selectedMonth === 'all') return true;
      const m = new Date(item.date).toISOString().substring(5, 7);
      return m === selectedMonth;
    });
    if (matched.length > 0 && !matched.some(item => item.id === activeNewsId)) {
      setActiveNewsId(matched[0].id);
    }
  };

  const handleMonthChange = (monthId: 'all' | '10' | '09' | '08' | '07') => {
    setSelectedMonth(monthId);
    const matched = newsItems.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;
      if (monthId === 'all') return true;
      const m = new Date(item.date).toISOString().substring(5, 7);
      return m === monthId;
    });
    if (matched.length > 0 && !matched.some(item => item.id === activeNewsId)) {
      setActiveNewsId(matched[0].id);
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
            <span id="news-desk-header" className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">
              {lang === 'ru' ? 'Служба новостей Facepunch' : 'Facepunch News Desk'}
            </span>
          </div>
          <h2 id="news-desk-title" className="text-2xl sm:text-3xl font-black text-white font-teko uppercase tracking-wider leading-none">
            {lang === 'ru' ? 'НОВОСТИ И ОБНОВЛЕНИЯ RUST' : 'RUST NEWS & UPDATES'}
          </h2>
          <p id="news-desk-body" className="text-xs text-gray-400 font-medium max-w-xl">
            {lang === 'ru' 
              ? 'Официальные патчноуты, изменения баланса, киберспортивные анонсы и девблоги напрямую с передовой разработки выживания.' 
              : 'Official patch logs, balancing, esports announcements, and devblogs straight from the frontlines of survival development.'}
          </p>
        </div>

        {/* Categories & Push Notification Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-300 rounded-sm font-mono cursor-pointer transition-all shadow-sm"
              title={lang === 'ru' ? 'Получать Web Push уведомления о свежих патчах' : 'Get Web Push alerts on new patches'}
            >
              <Bell size={12} className="text-amber-400 animate-pulse" />
              <span>{lang === 'ru' ? 'Оповещения о новостях' : 'News Alerts'}</span>
            </button>
          )}

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
      </div>

      {/* Month Quick Filter Chips Bar */}
      <div className="bg-[#14171e]/90 border border-[#2a2f3b] p-3 flex flex-wrap items-center justify-between gap-3 shadow-md relative overflow-hidden">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-br" />
        <div className="flex items-center gap-2">
          <Calendar size={13} className="text-[#f97316]" />
          <span className="text-[10px] font-mono font-bold uppercase text-zinc-400 tracking-wider">
            {lang === 'ru' ? 'ФИЛЬТР ПО МЕСЯЦАМ (2026):' : 'MONTH FILTER (2026):'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {months.map((m) => {
            const isSelected = selectedMonth === m.id;
            return (
              <button
                key={m.id}
                onClick={() => handleMonthChange(m.id as any)}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#f97316] border-[#f97316] text-white shadow-md shadow-[#f97316]/25'
                    : 'bg-[#1b1e26] border-[#2a2f3b] text-zinc-400 hover:text-white hover:border-zinc-500'
                }`}
              >
                {m.label[lang]}
              </button>
            );
          })}
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
                    {activeItem.badge ? activeItem.badge[lang] : (lang === 'ru' ? 'НОВОСТЬ' : 'NEWS')}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 font-bold">
                    <Calendar size={12} />
                    {new Date(activeItem.date).toLocaleDateString()}
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
                  {activeItem.summary ? activeItem.summary[lang] : ''}
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
                      {sec.highlights?.map((h, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5 text-[11px] text-gray-300 font-sans font-medium">
                          <CheckCircle2 size={13} className="text-purple-400 shrink-0 mt-0.5" />
                          <span>
                            {h.startsWith('BUTTON:') ? (
                              <button 
                                onClick={() => {
                                    console.log('Button clicked, setting activeNewsId to:', h.split(':')[2]);
                                    setActiveNewsId(h.split(':')[2]);
                                }}
                                className="text-blue-400 hover:text-blue-300 underline font-bold cursor-pointer"
                              >
                                {h.split(':')[1]}
                              </button>
                            ) : h.startsWith('http') ? (
                              <a 
                                href={h} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-bold font-mono bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-sm transition-colors mt-1"
                              >
                                <Send size={12} className="text-sky-400" />
                                <span>{h.includes('t.me') ? (lang === 'ru' ? 'Открыть бота @RustLFGBot в Telegram' : 'Open @RustLFGBot in Telegram') : h}</span>
                                <ArrowRight size={10} />
                              </a>
                            ) : (
                              h
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
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
              {filteredNews.filter(n => activeItem && n.id !== activeItem.id).map((item, idx) => (
                <div 
                  key={`${item.id}-${idx}`}
                  onClick={() => setActiveNewsId(item.id)}
                  className="p-4 bg-[#1b1e26]/40 hover:bg-[#1b1e26]/80 border border-[#2a2f3b] hover:border-gray-600 transition-all cursor-pointer relative group"
                >
                  {/* Subtle side pointer bar on hover */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-red-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />

                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-1.5 py-0.5 bg-gradient-to-r from-blue-500/10 to-red-500/10 text-purple-400 border border-purple-500/20 text-[8px] font-bold font-mono uppercase tracking-wider">
                      {item.badge ? item.badge[lang] : (lang === 'ru' ? 'НОВОСТЬ' : 'NEWS')}
                    </span>
                    <span className="text-[9px] font-mono text-gray-500 font-medium">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors uppercase tracking-wide leading-snug">
                    {item.title[lang]}
                  </h4>

                  <p className="text-[10.5px] text-gray-400 mt-1.5 leading-relaxed line-clamp-2">
                    {item.summary ? item.summary[lang] : ''}
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
