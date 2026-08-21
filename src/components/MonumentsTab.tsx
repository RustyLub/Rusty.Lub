import React, { useState } from 'react';
import { Search, MapPin, Key, Zap, ShieldAlert, Package, Camera, ExternalLink, Check, Copy, Flame, Clock, Radio, ChevronRight, AlertTriangle } from 'lucide-react';
import { ItemImageOrFallback } from './IconUtils';

interface MonumentsTabProps {
  lang: 'ru' | 'en';
}

export interface Monument {
  id: string;
  name: { ru: string; en: string };
  tier: 'tier0' | 'tier1' | 'tier2' | 'tier3';
  cardsRequired: ('green' | 'blue' | 'red')[];
  fusesRequired: number;
  hazmatRequired: boolean;
  minRadProtection: number;
  cctvCodes?: string[];
  description: { ru: string; en: string };
  keycardSteps: { ru: string[]; en: string[] };
  crates: {
    type: { ru: string; en: string };
    count: string;
    iconId: string;
  }[];
  recyclerCount: number;
  oilRigTimer?: string;
}

const MONUMENTS_DATA: Monument[] = [
  {
    id: 'power_plant',
    name: { ru: 'Электростанция (Power Plant - Grid Hub)', en: 'Power Plant (Grid Hub)' },
    tier: 'tier3',
    cardsRequired: ['green', 'blue', 'red'],
    fusesRequired: 2,
    hazmatRequired: true,
    minRadProtection: 15,
    cctvCodes: ['POWERPLANT1', 'POWERPLANT2'],
    description: {
      ru: '⚡ [ОБНОВЛЕНО 06.08] Главный энергоузел острова. Содержит новый Красный Утилизатор (100% эффективность переработки!), требует Heavy Fuse для запитывания высоковольтных подстанций и новую Красную Комнату с Элитными ящиками.',
      en: '⚡ [UPDATED AUG 6] Main island power grid hub. Features the new 100% Red Recycler, requires Heavy Fuses for high-voltage grid activation, and houses a new Red Keycard room with Elite Crates.'
    },
    keycardSteps: {
      ru: [
        'Вставьте Heavy Fuse в главный трансформатор у высоковольтной башни.',
        'Активируйте переключатель подачи питания на распределительный щит.',
        'Используйте Зеленую и Синюю карточки для последовательного открытия подстанций.',
        'Проведите Красную карточку в центральном блоке генерации для доступа к Красной Комнате и Красному Утилизатору (100% выгода!)'
      ],
      en: [
        'Insert Heavy Fuse into main transformer near powerlines.',
        'Flip the main power distribution grid switch.',
        'Swipe Green and Blue keycards sequentially across sub-stations.',
        'Swipe Red Keycard in central generator building to access the 100% Red Recycler & Elite Crates!'
      ]
    },
    crates: [
      { type: { ru: 'Элитный Ящик (Красная Комната)', en: 'Elite Crate (Red Room)' }, count: '2-3x', iconId: 'ak47' },
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '5-6x', iconId: 'rifle_body' },
      { type: { ru: 'Красный Утилизатор (100%)', en: 'Red Recycler (100%)' }, count: '1x', iconId: 'scrap' }
    ],
    recyclerCount: 2
  },
  {
    id: 'launch_site',
    name: { ru: 'Космодром (Launch Site)', en: 'Launch Site' },
    tier: 'tier3',
    cardsRequired: ['green', 'red'],
    fusesRequired: 2,
    hazmatRequired: true,
    minRadProtection: 25,
    cctvCodes: ['LAUNCHSITE1', 'LAUNCHSITE2'],
    description: {
      ru: '🚀 [ОБНОВЛЕНО 06.08] Крупнейший монумент. Добавлена консоль запуска ивента «Падение Спутника» (Satellite Crash). Патрулируется танком Брэдли (Bradley APC). В главном здании смертельная радиация (Hazmat + вода).',
      en: '🚀 [UPDATED AUG 6] Largest land monument. Features the Satellite Crash orbital event activation console. Guarded by Bradley APC. Main rocket building has lethal radiation.'
    },
    keycardSteps: {
      ru: [
        'Включите первый переключатель в небольшом здании у забора.',
        'Пройдите к переключателю около пусковой вышки, вставьте предохранитель.',
        'Проведите Красную карточку у центрального входа главного здания.',
        'Поднимитесь на крышу по лестницам, постоянно принимая воду для сбивания радиации.',
        'На крыше заберите лут из Элитных ящиков и активируйте терминал Падения Спутника!'
      ],
      en: [
        'Flip the first switch in the small transformer building near fence.',
        'Move to rocket launcher tower switch and insert fuse.',
        'Head to main Rocket Building and swipe Red Keycard at main entrance.',
        'Climb to roof via stairwells while chugging water to clear high rads.',
        'Loot Elite Crates on roof and activate the Satellite Crash orbital terminal!'
      ]
    },
    crates: [
      { type: { ru: 'Элитный Ящик (Крыша)', en: 'Elite Crate (Roof)' }, count: '2-3x', iconId: 'c4' },
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '4-6x', iconId: 'rifle_body' },
    ],
    recyclerCount: 1
  },
  {
    id: 'dome',
    name: { ru: 'Сфера (The Dome)', en: 'The Dome' },
    tier: 'tier2',
    cardsRequired: [],
    fusesRequired: 0,
    hazmatRequired: false,
    minRadProtection: 10,
    cctvCodes: ['DOME1', 'DOME2'],
    description: {
      ru: '🛢️ [ОБНОВЛЕНО 06.08] Огромный шар. Внизу добавлена рабочая станция откачки сырой нефти (Crude Oil) из наземных резервуаров! Паркур на вершину дает 4 Военных Ящика.',
      en: '🛢️ [UPDATED AUG 6] Giant sphere. Added a crude oil pumping station at the base to pump oil directly into barrels/modular trucks! Climb to top for 4 Military Crates.'
    },
    keycardSteps: {
      ru: [
        'Подключите топливо/питание к нижнему насосу для качки сырой нефти.',
        'Поднимитесь по внешней желтой трубе на вершину сферы.',
        'Аккуратно перепрыгните через провалы по металлическим балкам.',
        'Заберитесь на вершину и залутайте 4 зеленых военных ящика!'
      ],
      en: [
        'Power up lower crude oil pump station to fill fuel canisters.',
        'Climb up outer yellow pipe.',
        'Carefully parkour across pipe gaps.',
        'Reach top catwalks and loot 4 Military Crates!'
      ]
    },
    crates: [
      { type: { ru: 'Военный Ящик (Наверху)', en: 'Military Crate (Top)' }, count: '4x', iconId: 'semibody' },
      { type: { ru: 'Станция Сырой Нефти', en: 'Crude Oil Pump' }, count: '1x', iconId: 'lowgradefuel' }
    ],
    recyclerCount: 1
  },
  {
    id: 'oxums_gas_station',
    name: { ru: 'Заправка Oxum (Oxum\'s Gas Station)', en: 'Oxum\'s Gas Station' },
    tier: 'tier1',
    cardsRequired: ['green'],
    fusesRequired: 1,
    hazmatRequired: false,
    minRadProtection: 0,
    description: {
      ru: '🚗 [ОБНОВЛЕНО 06.08] Начальный монумент. В гараже теперь установлен функциональный автомобильный подъемник (Car Lift) с возможностью подзарядки аккумуляторов и модификации модульных авто!',
      en: '🚗 [UPDATED AUG 6] Starter monument. The garage bay now features a fully functional Car Lift for repairing, battery charging, and customizing modular vehicles!'
    },
    keycardSteps: {
      ru: [
        'Зеленая карточка лежит на столе в главном офисе заправки.',
        'Вставьте предохранитель в подсобке за гаражом для открытия задней двери.',
        'Используйте Car Lift в гараже для обслуживания авто.'
      ],
      en: [
        'Green keycard is located on the desk inside the main gas station office.',
        'Insert fuse in back utility room to open rear blue loot room.',
        'Use garage Car Lift to repair and modify vehicles.'
      ]
    },
    crates: [
      { type: { ru: 'Ящик с Едой / Медикаментами', en: 'Food / Medical Crate' }, count: '2-3x', iconId: 'cloth' },
      { type: { ru: 'Обычный Ящик', en: 'Regular Crate' }, count: '3x', iconId: 'scrap' }
    ],
    recyclerCount: 1
  },
  {
    id: 'supermarket',
    name: { ru: 'Заброшенный Супермаркет (Abandoned Supermarket)', en: 'Abandoned Supermarket' },
    tier: 'tier1',
    cardsRequired: ['green'],
    fusesRequired: 1,
    hazmatRequired: false,
    minRadProtection: 0,
    description: {
      ru: '❄️ [ОБНОВЛЕНО 06.08] Популярный зеленый монумент. Добавлены пищевые морозильники (Food Freezers), сохраняющие свежесть продуктов и охлаждающие напитки при подключении питания от электросети.',
      en: '❄️ [UPDATED AUG 6] Popular Tier 1 monument. Features new powered Food Freezers that keep food fresh and spawn high-calorie rations.'
    },
    keycardSteps: {
      ru: [
        'Зеленая карточка лежит в офисе администратора на столе.',
        'Подключите питание к морозильникам для получения элитных рационов питания.',
        'Вставьте предохранитель в подвале для доступа к закрытой комнате.'
      ],
      en: [
        'Green keycard spawns on office admin desk.',
        'Connect power grid line to freezers to unlock chilled rations.',
        'Insert fuse in basement room for keycard puzzle room.'
      ]
    },
    crates: [
      { type: { ru: 'Пищевой Морозильник', en: 'Food Freezer' }, count: '2x', iconId: 'cloth' },
      { type: { ru: 'Обычный Ящик', en: 'Regular Crate' }, count: '3x', iconId: 'scrap' }
    ],
    recyclerCount: 1
  },
  {
    id: 'powerline_poles',
    name: { ru: 'Опоры ЛЭП (Powerline Poles)', en: 'Powerline Poles & Grid' },
    tier: 'tier1',
    cardsRequired: [],
    fusesRequired: 1,
    hazmatRequired: false,
    minRadProtection: 0,
    description: {
      ru: '⚡ [НОВЫЙ МОНУМЕНТ 06.08] Вдоль дорог острова возведены забираемые опоры ЛЭП с лестницами и трансформаторными щитками. Позволяют перенаправлять энергию острова и подключать полевые утилизаторы.',
      en: '⚡ [NEW FEATURE AUG 6] High-voltage powerline poles lining island roads. Players can climb ladders to access junction boxes, rerouting power to boost nearby recyclers.'
    },
    keycardSteps: {
      ru: [
        'Заберитесь по встроенной лестнице на верхний ярус опоры ЛЭП.',
        'Подключите Heavy Fuse в распределитель для подачи тока на соседние подстанции.'
      ],
      en: [
        'Climb side ladders to upper pole catwalk.',
        'Insert Heavy Fuse into junction box to energize local grid branch.'
      ]
    },
    crates: [
      { type: { ru: 'Ящик с Предохранителями', en: 'Electrical Crate' }, count: '1-2x', iconId: 'gears' }
    ],
    recyclerCount: 0
  },
  {
    id: 'oil_rig_large',
    name: { ru: 'Большая Нефтяная Вышка (Large Oil Rig)', en: 'Large Oil Rig' },
    tier: 'tier3',
    cardsRequired: ['green', 'blue', 'red'],
    fusesRequired: 2,
    hazmatRequired: false,
    minRadProtection: 0,
    cctvCodes: ['OILRIG1', 'OILRIG2', 'OILRIG2L1', 'OILRIG2L2'],
    oilRigTimer: '15:00 min',
    description: {
      ru: 'Крупнейший монумент в море. Содержит заблокированный ящик (Locked Crate), вызывающий вертолет тяжелых ученых (Heavy Scientists). Требует все 3 карточки.',
      en: 'The largest offshore monument. Contains a Locked Crate that triggers Heavy Scientists chinook event. Requires Green, Blue, and Red keycards.'
    },
    keycardSteps: {
      ru: [
        'Вставьте предохранитель на 1-м этаже и включите переключатель.',
        'Используйте Зеленую карточку для входа в узел связи (Green Room).',
        'Внутри Зеленой комнаты активируйте переключатель для Синей двери.',
        'Откройте Синюю дверь на 3-м этаже, активируйте питание для Красной комнаты.',
        'Поднимитесь на верхний уровень, проведите Красную карточку, чтобы войти в центр управления.',
        'Запустите взлом Заблокированного Ящика (15 минут) и приготовьтесь к бою с Heavy Scientists!'
      ],
      en: [
        'Insert fuse on Level 1 and flip the switch.',
        'Use Green Keycard to access the communications room.',
        'Inside Green Room, flip the switch for the Blue door.',
        'Swipe Blue Keycard on Level 3, activate power for the Red room.',
        'Reach the top level, swipe Red Keycard to access the command room.',
        'Start hacking the Locked Crate (15 min) and defend against Heavy Scientists!'
      ]
    },
    crates: [
      { type: { ru: 'Заблокированный Ящик (Locked Crate)', en: 'Locked Crate' }, count: '1x', iconId: 'c4' },
      { type: { ru: 'Элитный Ящик (Elite Crate)', en: 'Elite Crate' }, count: '3-4x', iconId: 'ak47' },
      { type: { ru: 'Военный Ящик (Military Crate)', en: 'Military Crate' }, count: '6-8x', iconId: 'm249' },
    ],
    recyclerCount: 1
  },
  {
    id: 'oil_rig_small',
    name: { ru: 'Малая Нефтяная Вышка (Small Oil Rig)', en: 'Small Oil Rig' },
    tier: 'tier3',
    cardsRequired: ['green', 'blue', 'red'],
    fusesRequired: 1,
    hazmatRequired: false,
    minRadProtection: 0,
    cctvCodes: ['OILRIG1L1', 'OILRIG1L2'],
    oilRigTimer: '15:00 min',
    description: {
      ru: 'Компактная морская вышка с заблокированным ящиком и отделением для вызова вертолета.',
      en: 'Compact offshore rig with a locked crate and chinook heavy scientist response.'
    },
    keycardSteps: {
      ru: [
        'Вставьте предохранитель под первой лестницей.',
        'Откройте Синию или Зеленую дверь для активации питания Red Room.',
        'Поднимитесь на верхнюю палубу и проведите Красную карточку.',
        'Взломайте Locked Crate и занимите укрытие от высадки спецназа.'
      ],
      en: [
        'Insert fuse beneath the lower staircase.',
        'Open Blue or Green door to empower Red Room keycard reader.',
        'Head to upper deck and swipe Red Keycard.',
        'Hack Locked Crate and take position to fight Heavy Scientists.'
      ]
    },
    crates: [
      { type: { ru: 'Заблокированный Ящик', en: 'Locked Crate' }, count: '1x', iconId: 'c4' },
      { type: { ru: 'Элитный Ящик', en: 'Elite Crate' }, count: '2x', iconId: 'lr300' },
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '4x', iconId: 'smg_body' },
    ],
    recyclerCount: 1
  },
  {
    id: 'launch_site',
    name: { ru: 'Космодром (Launch Site)', en: 'Launch Site' },
    tier: 'tier3',
    cardsRequired: ['green', 'red'],
    fusesRequired: 2,
    hazmatRequired: true,
    minRadProtection: 25,
    cctvCodes: ['LAUNCHSITE1', 'LAUNCHSITE2'],
    description: {
      ru: 'Самый опасный монумент на суше. Патрулируется Брэдли (Bradley APC). В главном здании находится смертельный уровень радиации (требуется Hazmat + вода) и до 3 Элитных Ящиков.',
      en: 'The most lucrative land monument. Guarded by Bradley APC. Main rocket building has lethal radiation (Hazmat suit + water required) and up to 3 Elite Crates on roof.'
    },
    keycardSteps: {
      ru: [
        'Включите первый переключатель в небольшом здании у забора.',
        'Пройдите к переключателю около пусковой вышки, вставьте предохранитель.',
        'Пройдите к главному зданию ракеты и проведите Красную карточку у центрального входа.',
        'Поднимитесь на крышу по лестницам, постоянно принимая воду для сбивания смертельной радиации.',
        'На крыше заберите лут из Элитных ящиков и заберите Зеленую карточку в офисе.'
      ],
      en: [
        'Flip the first switch in the small transformer building near fence.',
        'Move to rocket launcher tower switch and insert fuse.',
        'Head to main Rocket Building and swipe Red Keycard at main entrance.',
        'Climb to roof via stairwells while chugging water to clear high rads.',
        'Loot Elite Crates on roof and grab Green Keycard in top office.'
      ]
    },
    crates: [
      { type: { ru: 'Элитный Ящик (Крыша)', en: 'Elite Crate (Roof)' }, count: '2-3x', iconId: 'c4' },
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '4-6x', iconId: 'rifle_body' },
    ],
    recyclerCount: 1
  },
  {
    id: 'military_tunnels',
    name: { ru: 'Военные Тоннели (Military Tunnels)', en: 'Military Tunnels' },
    tier: 'tier3',
    cardsRequired: ['green', 'blue', 'red'],
    fusesRequired: 1,
    hazmatRequired: true,
    minRadProtection: 15,
    description: {
      ru: 'Подземный комплекс с озлобленными учеными. Содержит элитный лут, красный и синий пазлы.',
      en: 'Underground bunker filled with aggressive scientists. Contains high tier loot, red and blue card rooms.'
    },
    keycardSteps: {
      ru: [
        'Зачистите ученых у входа в тоннели.',
        'Вставьте предохранитель в щиток в центральном вагончике.',
        'Проведите Зеленую карточку, пройдите внутри к двери Синей карточки.',
        'Проведите Синюю карточку и заберите элитный лут в лаборатории и Red Room.'
      ],
      en: [
        'Clear scientists near tunnel entry.',
        'Insert fuse into fuse box inside central train wagon.',
        'Swipe Green keycard, proceed to Blue door.',
        'Swipe Blue keycard to enter Red Room & lab section.'
      ]
    },
    crates: [
      { type: { ru: 'Элитный Ящик', en: 'Elite Crate' }, count: '2-3x', iconId: 'ak47' },
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '5-7x', iconId: 'semibody' },
    ],
    recyclerCount: 1
  },
  {
    id: 'airfield',
    name: { ru: 'Аэродром (Airfield)', en: 'Airfield' },
    tier: 'tier2',
    cardsRequired: ['green', 'blue'],
    fusesRequired: 2,
    hazmatRequired: false,
    minRadProtection: 10,
    cctvCodes: ['AIRFIELD1', 'AIRFIELD2'],
    description: {
      ru: 'Обширный монумент с ангарами, вышкой и подземным бункером с синей карточкой.',
      en: 'Sprawling monument with hangars, control tower, and underground blue card bunker.'
    },
    keycardSteps: {
      ru: [
        'Зайдите в здание с вышкой, вставьте предохранитель на 1-м этаже и щелкните тумблер.',
        'Бегите в подземный тоннель (вход у взлетной полосы).',
        'Проведите Зеленую карточку у подземной двери.',
        'Внутри вставьте второй предохранитель, проведите Синюю карточку и заберите Красную карточку со стола!'
      ],
      en: [
        'Enter main hangar building, insert fuse on 1st floor and flip switch.',
        'Run to underground tunnel entrance on runway.',
        'Swipe Green keycard at underground door.',
        'Insert second fuse inside, swipe Blue keycard and grab Red Keycard on table!'
      ]
    },
    crates: [
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '4-5x', iconId: 'smgbody' },
      { type: { ru: 'Обычный Ящик', en: 'Regular Crate' }, count: '8x', iconId: 'metalpipe' },
    ],
    recyclerCount: 2
  },
  {
    id: 'water_treatment',
    name: { ru: 'Водоочистные Сооружения (Water Treatment)', en: 'Water Treatment Plant' },
    tier: 'tier2',
    cardsRequired: ['blue'],
    fusesRequired: 1,
    hazmatRequired: false,
    minRadProtection: 10,
    description: {
      ru: 'Легкий Синий Пазл. Не требует Зеленой карточки, дает сразу Красную карточку и много лута.',
      en: 'Easy Blue Card puzzle. Does not require a Green Card, grants Red Card directly and good loot.'
    },
    keycardSteps: {
      ru: [
        'Найдите синее двухэтажное здание с колесом.',
        'Поднимитесь на 2-й этаж, вставьте предохранитель и включите тумблер.',
        'Спуститесь и пробегите к главному зданию станции.',
        'Проведите Синюю карточку на входе и заберите Красную карточку со стола.'
      ],
      en: [
        'Locate the blue 2-story wheel building.',
        'Go to 2nd floor, insert fuse and turn switch on.',
        'Run across to main facility building.',
        'Swipe Blue keycard at entry door and collect Red keycard on desk.'
      ]
    },
    crates: [
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '3-4x', iconId: 'semibody' },
      { type: { ru: 'Обычный Ящик', en: 'Regular Crate' }, count: '6x', iconId: 'gears' },
    ],
    recyclerCount: 1
  },
  {
    id: 'train_yard',
    name: { ru: 'Депо (Train Yard)', en: 'Train Yard' },
    tier: 'tier2',
    cardsRequired: ['green', 'blue'],
    fusesRequired: 1,
    hazmatRequired: false,
    minRadProtection: 10,
    description: {
      ru: 'Железнодорожное депо с высокой башней. Требует включить 2 тумблера перед дверью.',
      en: 'Rail yard monument featuring a high crane tower. Requires flipping switches across buildings.'
    },
    keycardSteps: {
      ru: [
        'Заберитесь на 3-й этаж 4-этажного здания и включите первый тумблер.',
        'Бегите к главному зданию депо, вставьте предохранитель и щелкните второй тумблер.',
        'Поднимитесь на 2-й этаж депо и проведите Синюю карточку.'
      ],
      en: [
        'Climb 3rd floor of red 4-story building and turn switch ON.',
        'Run to main train hall, insert fuse and flip second switch.',
        'Climb to 2nd floor of train hall and swipe Blue Keycard.'
      ]
    },
    crates: [
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '4-5x', iconId: 'riflebody' },
      { type: { ru: 'Обычный Ящик', en: 'Regular Crate' }, count: '5x', iconId: 'metalspring' },
    ],
    recyclerCount: 1
  },
  {
    id: 'sewer_branch',
    name: { ru: 'Канализационная Станция (Sewer Branch)', en: 'Sewer Branch' },
    tier: 'tier1',
    cardsRequired: ['green'],
    fusesRequired: 1,
    hazmatRequired: false,
    minRadProtection: 10,
    description: {
      ru: 'Лучший зеленый пазл для старта игры. Дает Синюю карточку и ценный лут.',
      en: 'Best starter green puzzle. Grants Blue Keycard and great early components.'
    },
    keycardSteps: {
      ru: [
        'Зайдите в кирпичное здание с переключателем.',
        'Вставьте предохранитель и включите тумблер.',
        'Спуститесь в подземный люк в центре монумента.',
        'Проведите Зеленую карточку и заберите Синюю карточку со стола!'
      ],
      en: [
        'Enter brick power building.',
        'Insert fuse and flip switch.',
        'Drop down into central sewer hole.',
        'Swipe Green keycard and grab Blue keycard on table!'
      ]
    },
    crates: [
      { type: { ru: 'Военный Ящик', en: 'Military Crate' }, count: '1-2x', iconId: 'smgbody' },
      { type: { ru: 'Обычный Ящик', en: 'Regular Crate' }, count: '4-5x', iconId: 'scrap' },
    ],
    recyclerCount: 1
  },
  {
    id: 'dome',
    name: { ru: 'Сфера (The Dome)', en: 'The Dome' },
    tier: 'tier2',
    cardsRequired: [],
    fusesRequired: 0,
    hazmatRequired: false,
    minRadProtection: 10,
    cctvCodes: ['DOME1', 'DOME2'],
    description: {
      ru: 'Огромный гигантский шар. Не требует карточек и предохранителей, но требует паркура на вершину, где стоят 4 Военных Ящика.',
      en: 'Giant rust sphere. No keycards or fuses needed! Requires parkour up the pipes to reach 4 Military Crates on top.'
    },
    keycardSteps: {
      ru: [
        'Поднимитесь по внешней желтой трубе.',
        'Аккуратно перепрыгните через провалы по металлическим балкам.',
        'Заберитесь на вершину и залутайте 4 зеленых военных ящика!'
      ],
      en: [
        'Climb up outer yellow pipe.',
        'Carefully parkour across pipe gaps.',
        'Reach top catwalks and loot 4 Military Crates!'
      ]
    },
    crates: [
      { type: { ru: 'Военный Ящик (Наверху)', en: 'Military Crate (Top)' }, count: '4x', iconId: 'semibody' },
    ],
    recyclerCount: 1
  },
  {
    id: 'outpost',
    name: { ru: 'Мирный Город (Outpost)', en: 'Outpost (Safe Zone)' },
    tier: 'tier0',
    cardsRequired: [],
    fusesRequired: 0,
    hazmatRequired: false,
    minRadProtection: 0,
    description: {
      ru: 'Безопасная зона. Здесь находятся переработчики, обменники ресурсов, верстаки I и II уровня, а также продажа оружия.',
      en: 'Safe zone. Features recyclers, resource exchanges, Level I & II workbenches, and NPC vendors.'
    },
    keycardSteps: {
      ru: ['Безопасная зона — не доставайте оружие 5 секунд перед входом!'],
      en: ['Safe Zone — do not holstered weapons for 5 seconds before entering!']
    },
    crates: [],
    recyclerCount: 3
  }
];

export default function MonumentsTab({ lang }: MonumentsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedMonument, setSelectedMonument] = useState<Monument | null>(MONUMENTS_DATA[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const filteredMonuments = MONUMENTS_DATA.filter(m => {
    const matchesSearch = m.name.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'all' || m.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 text-gray-200 font-sans">
      {/* Banner */}
      <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 sm:p-6 shadow-xl relative overflow-hidden rust-metal-pattern">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#cd412b]/20 text-[#cd412b] border border-[#cd412b]/40 rounded-sm">
                <MapPin size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
                {lang === 'ru' ? 'Гайд по Монументам и Карточкам' : 'Monuments & Keycards Interactive Guide'}
              </h2>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-3xl">
              {lang === 'ru'
                ? 'Полный интерактивный справочник по монументам Rust: порядок прохождения зеленых, синих и красных пазлов, необходимые предохранители, таймеры Locked Crate, камеры CCTV и спавн лута.'
                : 'Complete interactive Rust monuments guide: Green, Blue, and Red card puzzle walkthroughs, required fuses, radiation limits, CCTV codes, and loot spawn tables.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-sm flex items-center gap-1.5">
              <Key size={12} />
              <span>{lang === 'ru' ? 'Все 3 Уровня Пазлов' : 'All 3 Keycard Tiers'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Monuments List & Selected Monument Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar: Monuments Filter & List */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#14171e] border border-[#2a2f3b] p-3 space-y-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'ru' ? 'Поиск монумента...' : 'Search monument...'}
                className="w-full bg-[#0c0d10] border border-[#2a2f3b] pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#cd412b]"
              />
            </div>

            {/* Tier Filters */}
            <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
              {[
                { id: 'all', label: { ru: 'Все', en: 'All' } },
                { id: 'tier0', label: { ru: 'Safe Zones', en: 'Safe Zones' } },
                { id: 'tier1', label: { ru: 'Tier 1 (Зеленые)', en: 'Tier 1 (Green)' } },
                { id: 'tier2', label: { ru: 'Tier 2 (Синие)', en: 'Tier 2 (Blue)' } },
                { id: 'tier3', label: { ru: 'Tier 3 (Красные)', en: 'Tier 3 (Red)' } },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTier(t.id)}
                  className={`px-2.5 py-1 font-bold uppercase rounded-sm cursor-pointer whitespace-nowrap ${
                    selectedTier === t.id
                      ? 'bg-[#cd412b] text-white'
                      : 'bg-[#1b1e26] text-gray-400 hover:text-white border border-[#2a2f3b]'
                  }`}
                >
                  {t.label[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* List of Monuments */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredMonuments.map(monument => {
              const isSelected = selectedMonument?.id === monument.id;
              return (
                <div
                  key={monument.id}
                  onClick={() => setSelectedMonument(monument)}
                  className={`p-3.5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#1c202b] border-[#cd412b] shadow-md'
                      : 'bg-[#14171e] border-[#2a2f3b] hover:border-[#cd412b]/50'
                  }`}
                >
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-xs font-bold text-white font-sans truncate">{monument.name[lang]}</p>
                    
                    {/* Keycard Badges */}
                    <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold">
                      {monument.cardsRequired.includes('green') && (
                        <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded-xs">
                          GREEN
                        </span>
                      )}
                      {monument.cardsRequired.includes('blue') && (
                        <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded-xs">
                          BLUE
                        </span>
                      )}
                      {monument.cardsRequired.includes('red') && (
                        <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded-xs">
                          RED
                        </span>
                      )}
                      {monument.cardsRequired.length === 0 && (
                        <span className="px-1.5 py-0.5 bg-gray-500/20 text-gray-400 border border-gray-500/40 rounded-xs">
                          NO CARDS
                        </span>
                      )}
                      {monument.fusesRequired > 0 && (
                        <span className="px-1.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-xs">
                          {monument.fusesRequired} FUSE
                        </span>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={16} className={isSelected ? 'text-[#cd412b]' : 'text-gray-600'} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Monument Detailed Walkthrough */}
        <div className="lg:col-span-7 space-y-5">
          {selectedMonument ? (
            <div className="bg-[#14171e] border border-[#2a2f3b] p-5 space-y-6 relative overflow-hidden">
              {/* Header */}
              <div className="border-b border-[#2a2f3b] pb-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-white font-sans uppercase">
                    {selectedMonument.name[lang]}
                  </h3>
                  <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-sm">
                    {selectedMonument.tier.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {selectedMonument.description[lang]}
                </p>
              </div>

              {/* Requirements Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0c0d10] border border-[#2a2f3b] p-3 text-xs font-mono">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase">{lang === 'ru' ? 'Предохранители' : 'Fuses Req.'}</p>
                  <p className="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <Zap size={13} />
                    <span>{selectedMonument.fusesRequired}x Fuse</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 uppercase">{lang === 'ru' ? 'Мин. Защита Радиации' : 'Min Radiation'}</p>
                  <p className={`font-bold flex items-center gap-1 mt-0.5 ${selectedMonument.minRadProtection > 0 ? 'text-rose-400' : 'text-green-400'}`}>
                    <ShieldAlert size={13} />
                    <span>{selectedMonument.minRadProtection}% Rad</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 uppercase">{lang === 'ru' ? 'Переработчики' : 'Recyclers'}</p>
                  <p className="font-bold text-sky-400 flex items-center gap-1 mt-0.5">
                    <Package size={13} />
                    <span>{selectedMonument.recyclerCount}x Recycler</span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 uppercase">{lang === 'ru' ? 'Карточки Доступа' : 'Keycards'}</p>
                  <p className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Key size={13} className="text-[#cd412b]" />
                    <span>{selectedMonument.cardsRequired.join(', ').toUpperCase() || 'None'}</span>
                  </p>
                </div>
              </div>

              {/* Step-by-Step Walkthrough */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <ChevronRight size={14} className="text-[#cd412b]" />
                  <span>{lang === 'ru' ? 'Пошаговый Инструктаж Пазла:' : 'Step-by-Step Puzzle Walkthrough:'}</span>
                </h4>

                <div className="space-y-2 font-sans text-xs">
                  {selectedMonument.keycardSteps[lang].map((step, idx) => (
                    <div key={idx} className="bg-[#1b1e26] border border-[#2a2f3b] p-3 flex items-start gap-3">
                      <span className="w-5 h-5 bg-[#cd412b] text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 rounded-xs">
                        {idx + 1}
                      </span>
                      <p className="text-gray-200 leading-relaxed pt-0.5">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loot Tables */}
              {selectedMonument.crates.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <Package size={14} className="text-emerald-400" />
                    <span>{lang === 'ru' ? 'Доступные Ящики с Лутом:' : 'Available Loot Crates:'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedMonument.crates.map((crate, i) => (
                      <div key={i} className="bg-[#1b1e26] border border-[#2a2f3b] p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-black/40 border border-[#2a2f3b] flex items-center justify-center shrink-0">
                          <ItemImageOrFallback id={crate.iconId} lang={lang} size={32} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{crate.type[lang]}</p>
                          <p className="text-[11px] font-mono text-emerald-400 font-bold">{crate.count}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CCTV Camera Codes if available */}
              {selectedMonument.cctvCodes && selectedMonument.cctvCodes.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#2a2f3b]">
                  <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <Camera size={14} className="text-sky-400" />
                    <span>{lang === 'ru' ? 'Коды Камер CCTV:' : 'CCTV Camera Identifiers:'}</span>
                  </h4>

                  <div className="flex flex-wrap gap-2 font-mono text-xs">
                    {selectedMonument.cctvCodes.map(code => (
                      <button
                        key={code}
                        onClick={() => handleCopyCode(code)}
                        className="px-3 py-1.5 bg-[#0c0d10] hover:bg-[#cd412b]/20 border border-[#2a2f3b] hover:border-[#cd412b]/50 text-sky-300 hover:text-white rounded-sm transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <span>{code}</span>
                        {copiedCode === code ? <Check size={12} className="text-green-400" /> : <Copy size={12} className="text-gray-500" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#14171e] border border-[#2a2f3b] p-8 text-center text-gray-500 text-xs font-mono">
              {lang === 'ru' ? 'Выберите монумент слева' : 'Select a monument on the left'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
