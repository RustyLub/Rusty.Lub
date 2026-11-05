import { ErrorItem, BindItem, RaidWeapon, RaidTarget, AdminCommandItem, WeaponStat } from './types';

export const errorDatabase: ErrorItem[] = [
  {
    category: 'critical',
    title: 'Steam not open?',
    desc: 'Rust не видит запущенный клиент Steam или не может корректно обратиться к Steam API. Ошибка появляется при запуске игры.',
    sols: [
      'Полностью закройте Rust и Steam, включая процессы Steam в системном трее, затем запустите Steam и Rust заново.',
      'Обновите клиент Steam: меню Steam → Проверить наличие обновлений клиента Steam.',
      'Если включено участие в бета-версиях Steam, временно выберите NONE — отказаться от всех бета-программ и перезапустите Steam.',
      'Если ошибка сохраняется, проверьте целостность файлов Rust через Steam. Переустановка — последний шаг, а не первое действие.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/360007597618-Rust-Steam-not-open-startup-errors',
    sourceLabel: 'Facepunch: Steam not open & startup errors'
  },
  {
    category: 'eac',
    title: 'EAC Authentication Timeout',
    desc: 'Easy Anti-Cheat не смог подтвердить подключение. Это может быть временный сбой авторизации, проблема локального кэша или блокировка соединения.',
    sols: [
      'Закройте Rust и подождите до 10 минут, затем попробуйте снова.',
      'Запускайте Rust только из библиотеки Steam, чтобы Easy Anti-Cheat корректно запускался вместе с игрой.',
      'В Steam проверьте целостность файлов Rust.',
      'В папке игры откройте EasyAntiCheat и выполните EasyAntiCheat_EOS_Setup.exe repair, подтвердив запрос Windows.',
      'Проверьте, не блокирует ли антивирус или брандмауэр EAC. Не отключайте защиту Windows целиком.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/360019318037-EAC-Authentication-Timeout',
    sourceLabel: 'Facepunch: EAC Authentication Timeout'
  },
  {
    category: 'eac',
    title: 'EAC: Disconnected',
    desc: 'Клиент не может связаться с серверами Easy Anti-Cheat, поэтому игровой сервер не может подтвердить работу античита.',
    sols: [
      'Запустите игру из библиотеки Steam, а не напрямую через RustClient.exe.',
      'Проверьте, что брандмауэр и антивирус не блокируют client.easyanticheat.net по HTTPS (порт 443) и HTTP (порт 80).',
      'Перезапустите Steam и сетевое оборудование, затем повторите подключение.',
      'Если проблема остаётся, проверьте статус сети и DNS у провайдера.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/214240585-EAC-Disconnected',
    sourceLabel: 'Facepunch: EAC Disconnected'
  },
  {
    category: 'eac',
    title: 'Disconnected: EAC: Client Integrity Violation',
    desc: 'Файлы Easy Anti-Cheat могли обновиться некорректно или повредиться. Сообщение относится к проверке целостности клиента.',
    sols: [
      'Закройте Rust и Steam.',
      'Откройте папку Rust через Steam → Свойства → Установленные файлы → Обзор.',
      'Удалите папку EasyAntiCheat в каталоге Rust.',
      'Запустите Steam от имени администратора и выполните проверку целостности файлов Rust — Steam загрузит недостающие файлы.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/9903859345565-Disconnected-EAC-Client-Integrity-Violation',
    sourceLabel: 'Facepunch: Client Integrity Violation'
  },
  {
    category: 'eac',
    title: 'Error: Start Service Failed',
    desc: 'Windows не смогла запустить службу Easy Anti-Cheat. Важен числовой код в скобках — причины у разных кодов отличаются.',
    sols: [
      'Запишите код в скобках и не применяйте случайные исправления: (1056) означает, что служба уже запущена — закройте лишние процессы Rust/EAC или перезагрузите ПК.',
      'Для кодов (5), (1053), (1058) и (1450) Facepunch указывает на возможные проблемы обновления Windows или блокировку EAC защитным ПО.',
      'Установите доступные обновления Windows и перезагрузите компьютер.',
      'Проверьте карантин антивируса и восстановите только официальные файлы EAC из установки Rust.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/213702209-Error-Start-Service-Failed',
    sourceLabel: 'Facepunch: Error Start Service Failed'
  },
  {
    category: 'eac',
    title: 'EAC Error 30005: CreateFile Failed',
    desc: 'Ошибка создания или доступа к файлу EAC. Нередко связана с заблокированным файлом, оставшимся процессом или вмешательством защитного ПО.',
    sols: [
      'Перезагрузите компьютер, чтобы завершить зависшие процессы EAC.',
      'Проверьте карантин антивируса и разрешите официальным компонентам Rust/EAC запускаться.',
      'В Steam выполните проверку целостности файлов Rust.',
      'Если проблема сохраняется, используйте восстановление EAC из папки игры. Не скачивайте отдельные DLL с посторонних сайтов.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/sections/203121909-EAC',
    sourceLabel: 'Facepunch: EAC support'
  },
  {
    category: 'eac',
    title: 'Untrusted System File',
    desc: 'EAC обнаружил системный или сторонний файл, который не прошёл проверку доверия. Само сообщение не доказывает наличие читов.',
    sols: [
      'Запишите точное имя и путь файла из сообщения EAC.',
      'Обновите Windows и драйвер, которому принадлежит указанный файл, используя сайт производителя устройства.',
      'Проверьте целостность файлов Rust в Steam.',
      'Закройте программы, которые внедряют оверлеи или изменяют графический вывод, и проверьте запуск снова.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/sections/203121909-EAC',
    sourceLabel: 'Facepunch: EAC support'
  },
  {
    category: 'eac',
    title: 'Network DNS Error (download.eac-cdn.com)',
    desc: 'Система не смогла разрешить DNS-адрес сервиса загрузки Easy Anti-Cheat. Причина может быть в локальном DNS или сети.',
    sols: [
      'Откройте командную строку Windows и выполните ipconfig /flushdns.',
      'Перезапустите Rust и Steam.',
      'Если ошибка повторяется, проверьте DNS-настройки и доступность сети; временно сравните результат с другим подключением.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/214240645-Network-DNS-Error',
    sourceLabel: 'Facepunch: Network DNS Error'
  },
  {
    category: 'network',
    title: 'Steam Auth Timeout',
    desc: 'Не удалось вовремя получить ответ от службы авторизации Steam. Причина может быть на стороне Steam, сети или локального клиента.',
    sols: [
      'Проверьте, работает ли Steam и загружен ли ваш аккаунт в онлайн-режиме.',
      'Полностью перезапустите Steam и Rust.',
      'Проверьте статус сервисов Steam и повторите попытку позже, если наблюдается сбой.',
      'Если проблема только в вашей сети, перезапустите роутер и проверьте подключение без VPN/прокси.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/360007597618-Rust-Steam-not-open-startup-errors',
    sourceLabel: 'Facepunch: startup troubleshooting'
  },
  {
    category: 'network',
    title: 'Disconnected: Connection Attempt Failed',
    desc: 'Клиент не смог установить соединение с выбранным сервером. Возможны неверный адрес/порт, недоступный сервер или блокировка трафика.',
    sols: [
      'Убедитесь, что сервер онлайн и адрес с портом указаны правильно.',
      'Попробуйте подключиться позже и проверьте, не находится ли сервер на перезапуске или обслуживании.',
      'Разрешите Rust и RustClient в брандмауэре Windows, если исходящее соединение блокируется.',
      'Если ошибка возникает только на одном сервере, передайте администратору точный текст ошибки и время попытки.'
    ],
    sourceUrl: 'https://wiki.facepunch.com/rust/FAQ_and_Troubleshooting',
    sourceLabel: 'Facepunch Rust Wiki: troubleshooting'
  },
  {
    category: 'network',
    title: 'Disconnected: Connection Timed Out',
    desc: 'Клиент не получил ответ от сервера за отведённое время. Это не всегда означает проблему с вашим интернетом: сервер также может быть перегружен или недоступен.',
    sols: [
      'Проверьте, можете ли вы подключиться к другим серверам Rust.',
      'Перезапустите игру и роутер; по возможности проверьте подключение через кабель.',
      'Отключите VPN/прокси для проверки маршрута, если они используются.',
      'Если таймаут возникает только на одном сервере, сообщите администратору — ему нужно проверить состояние сервера и сетевые порты.'
    ],
    sourceUrl: 'https://wiki.facepunch.com/rust/FAQ_and_Troubleshooting',
    sourceLabel: 'Facepunch Rust Wiki: troubleshooting'
  },
  {
    category: 'network',
    title: 'Disconnected: EAC: Authentication Failed',
    desc: 'Проверка авторизации EAC не завершилась успешно. Причину нужно определять по полному тексту сообщения и состоянию EAC.',
    sols: [
      'Перезапустите Steam и Rust, запускайте игру через библиотеку Steam.',
      'Проверьте системные дату и время Windows — они должны синхронизироваться автоматически.',
      'Проверьте целостность файлов Rust и восстановите EAC через установщик в папке игры.',
      'Не пытайтесь обходить проверку EAC: это не исправляет проблему авторизации.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/sections/203121909-EAC',
    sourceLabel: 'Facepunch: EAC support'
  },
  {
    category: 'critical',
    title: 'Rust не запускается после обновления',
    desc: 'После патча клиент может не стартовать из-за незавершённого обновления, повреждённых файлов или устаревшего клиента Steam.',
    sols: [
      'Дождитесь завершения загрузки обновления Rust в Steam.',
      'Перезапустите Steam и проверьте наличие обновлений клиента.',
      'Выполните проверку целостности файлов Rust.',
      'Если проблема появилась сразу после обновления и не устраняется, проверьте официальные объявления Facepunch о технических проблемах.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/360008398478-Verify-Rust-Files',
    sourceLabel: 'Facepunch: Verify Rust Files'
  },
  {
    category: 'critical',
    title: 'Unknown file version',
    desc: 'Steam обнаружил несовпадение или повреждение файлов игры. Ошибка часто устраняется повторной проверкой файлов.',
    sols: [
      'Закройте Rust.',
      'В библиотеке Steam откройте Rust → Свойства → Установленные файлы → Проверить целостность файлов игры.',
      'Дождитесь завершения проверки и загрузки заменённых файлов, затем перезапустите Steam.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/articles/360008398478-Verify-Rust-Files',
    sourceLabel: 'Facepunch: Verify Rust Files'
  },
  {
    category: 'graphics',
    title: 'UnityPlayer.dll crash / Rust вылетает на рабочий стол',
    desc: 'Это общий признак аварийного завершения Unity, а не единственная конкретная причина. Виновником могут быть драйвер, повреждённые файлы, нестабильный разгон или стороннее ПО.',
    sols: [
      'Проверьте целостность файлов Rust в Steam.',
      'Обновите драйвер видеокарты с официального сайта NVIDIA, AMD или Intel.',
      'Временно отключите сторонние оверлеи и программы внедрения графики, затем проверьте повторный запуск.',
      'Если используется разгон CPU/GPU/RAM, верните штатные настройки для проверки.',
      'Если вылет повторяется, сохраните crash dump и output_log.txt для дальнейшей диагностики.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/sections/360001189178-General',
    sourceLabel: 'Facepunch: General troubleshooting'
  },
  {
    category: 'graphics',
    title: 'Direct3D Device Lost / Graphics Device Removed',
    desc: 'Графическое устройство было сброшено или перестало отвечать во время работы игры. Это сообщение обычно связано с графическим стеком Windows или драйвером.',
    sols: [
      'Перезагрузите компьютер и установите стабильный драйвер видеокарты с сайта производителя.',
      'Уберите разгон или нестабильный undervolt видеокарты для проверки.',
      'Закройте приложения, создающие оверлеи или интенсивно использующие GPU.',
      'Если ошибка появилась после обновления драйвера, проверьте другой стабильный выпуск драйвера.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/sections/360001189178-General',
    sourceLabel: 'Facepunch: General troubleshooting'
  },
  {
    category: 'graphics',
    title: 'Чёрный экран при запуске Rust',
    desc: 'Игра запускается, но изображение не появляется или остаётся чёрным. Возможны проблемы режима отображения, драйвера или стороннего оверлея.',
    sols: [
      'Подождите завершения первого запуска после обновления и проверьте, реагирует ли игра.',
      'Перезапустите игру и Steam.',
      'Отключите оверлеи Steam, Discord и сторонних программ для проверки.',
      'Проверьте целостность файлов Rust и обновите драйвер видеокарты.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/sections/360001189178-General',
    sourceLabel: 'Facepunch: General troubleshooting'
  },
  {
    category: 'critical',
    title: 'Out of Memory / Недостаточно памяти',
    desc: 'Процесс Rust или Windows не смог выделить необходимую память. Причина может быть в нехватке RAM, системного файла подкачки или утечке памяти.',
    sols: [
      'Закройте приложения, которые потребляют много оперативной памяти, и перезапустите игру.',
      'Убедитесь, что на системном диске достаточно свободного места.',
      'Оставьте файл подкачки Windows включённым и предпочтительно в режиме управления системой.',
      'Если проблема повторяется, проверьте потребление RAM и файл подкачки в диспетчере задач во время загрузки.'
    ],
    sourceUrl: 'https://support.facepunchstudios.com/hc/en-us/sections/360001189178-General',
    sourceLabel: 'Facepunch: General troubleshooting'
  },
  {
    category: 'network',
    title: 'World Mismatch / World File Outdated',
    desc: 'Ошибка относится прежде всего к пользовательским картам: клиент пытается использовать локальную версию карты, которая не совпадает с версией сервера.',
    sols: [
      'Если ошибка возникает на пользовательской карте, сообщите администратору сервера название карты и полный текст сообщения.',
      'Администратору следует убедиться, что сервер раздаёт карту с уникальным именем после изменения её содержимого.',
      'Не удаляйте случайные файлы игры и не меняйте настройки сети: это не типичная ошибка интернет-соединения.'
    ],
    sourceUrl: 'https://wiki.facepunch.com/rust/FAQ_and_Troubleshooting',
    sourceLabel: 'Facepunch Rust Wiki: World Mismatch'
  },
  {
    category: 'critical',
    title: 'Server is full',
    desc: 'На сервере достигнут лимит подключённых игроков или свободных слотов нет с учётом резервирования.',
    sols: [
      'Подождите, пока освободится слот, и попробуйте подключиться снова.',
      'Проверьте, не использует ли сервер очередь подключения или резервные слоты для администрации/VIP.',
      'Если вы владелец сервера, проверьте лимит игроков и настройки очереди в панели хостинга.'
    ],
    sourceUrl: 'https://wiki.facepunch.com/rust/creating-a-server',
    sourceLabel: 'Facepunch Rust Wiki: server setup'
  }
];
export const bindsDatabase: BindItem[] = [
  // Core client-side binds based on the Facepunch Rust Keybinds reference.
  // Keys are examples and can be changed by the player.

  // --- MOVEMENT & CONTROL ---
  {
    category: 'УПРАВЛЕНИЕ',
    cmd: 'bind x forward;sprint',
    key: 'X',
    desc: 'Автоматический бег',
    explanation: 'Начинает непрерывный бег вперёд. Остановите его обычным управлением движением.'
  },
  {
    category: 'УПРАВЛЕНИЕ',
    cmd: 'bind z duck',
    key: 'Z',
    desc: 'Переключение приседа',
    explanation: 'Переключает приседание по нажатию. Повторное нажатие возвращает обычную стойку.'
  },
  {
    category: 'УПРАВЛЕНИЕ',
    cmd: 'bind [leftshift+k] kill',
    key: 'SHIFT + K',
    desc: 'Быстрое возрождение',
    explanation: 'Открывает экран смерти командой kill. Используйте только если действительно хотите погибнуть и потерять переносимый лут.'
  },
  {
    category: 'УПРАВЛЕНИЕ',
    cmd: 'bind [leftshift+f11] attack',
    key: 'SHIFT + F11',
    desc: 'Непрерывная атака',
    explanation: 'Запускает непрерывное действие основной атаки. Остановить его можно обычным нажатием атаки.'
  },
  // --- PVP ---
  {
    category: 'PVP',
    cmd: 'bind leftalt +altlook',
    key: 'LEFT ALT',
    desc: 'Свободный обзор',
    explanation: 'Позволяет осматриваться по сторонам, не меняя направление движения персонажа.'
  },
  {
    category: 'PVP',
    cmd: 'bind mouse1 "+attack2;+input.sensitivity .45;input.sensitivity .2"',
    key: 'ПКМ',
    desc: 'Снижение чувствительности при прицеливании',
    explanation: 'Меняет чувствительность мыши во время прицеливания. Значения .45 и .2 подберите под свою обычную чувствительность.'
  },
  {
    category: 'PVP',
    cmd: 'bind mouse3 +lighttoggle;+attack2',
    key: 'БОКОВАЯ КНОПКА МЫШИ',
    desc: 'Фонарик или лазер при прицеливании',
    explanation: 'Назначает прицеливание и переключение фонарика или лазера на боковую кнопку мыши. Убедитесь, что на ней нет другого важного действия.'
  },
  {
    category: 'PVP',
    cmd: 'bind [rightshift+f11] attack;duck',
    key: 'RIGHT SHIFT + F11',
    desc: 'Атака из приседа',
    explanation: 'Комбинация для одновременного запуска атаки и приседания.'
  },

  // --- MEDICINE & CRAFT ---
  {
    category: 'МЕДИЦИНА',
    cmd: 'bind h "craft.add -2072273936 1"',
    key: 'H',
    desc: 'Поставить в очередь один бинт',
    explanation: 'Добавляет один медицинский бинт в очередь крафта. Нужны необходимые ресурсы.'
  },
  {
    category: 'МЕДИЦИНА',
    cmd: 'bind mousewheelup "craft.add -2072273936 2"',
    key: 'КОЛЁСИКО ВВЕРХ',
    desc: 'Поставить в очередь два бинта',
    explanation: 'Добавляет два медицинских бинта в очередь крафта при прокрутке колёсика вверх.'
  },

  // --- LOOT & FARM ---
  {
    category: 'ФАРМ',
    cmd: 'bind mouse4 +buttons.hoverloot',
    key: 'БОКОВАЯ КНОПКА МЫШИ',
    desc: 'Быстрый перенос предметов',
    explanation: 'Удерживайте кнопку и наводите курсор на предметы в открытом инвентаре, чтобы быстро переносить их.'
  },

  // --- QUALITY OF LIFE ---
  {
    category: 'QOL',
    cmd: 'bind f1 consoletoggle;combatlog',
    key: 'F1',
    desc: 'Консоль вместе с CombatLog',
    explanation: 'Открывает консоль и одновременно выводит боевой журнал.'
  },
  {
    category: 'QOL',
    cmd: 'bind f10 client.disconnect',
    key: 'F10',
    desc: 'Быстрое отключение от сервера',
    explanation: 'Отключает клиента от текущего сервера. Не назначайте на клавишу, которую часто нажимаете случайно.'
  },
  {
    category: 'QOL',
    cmd: 'bind 7 chat.say "Hello everyone!"',
    key: '7',
    desc: 'Сообщение в общий чат',
    explanation: 'Отправляет заданный текст в глобальный чат. Замените Hello everyone! на своё сообщение.'
  },
  {
    category: 'QOL',
    cmd: 'bind 8 chat.teamsay "Hey Team!!"',
    key: '8',
    desc: 'Сообщение в командный чат',
    explanation: 'Отправляет заданный текст участникам своей команды. Замените Hey Team!! на своё сообщение.'
  },
  {
    category: 'QOL',
    cmd: 'bind rightarrow ~graphics.vm_horizontal_flip 0;graphics.vm_horizontal_flip 1',
    key: 'СТРЕЛКА ВПРАВО',
    desc: 'Переключение положения оружия',
    explanation: 'Поочерёдно переключает отображение предмета в руках между обычным и зеркальным положением.'
  },
  {
    category: 'QOL',
    cmd: 'bind mouse2 +meta.if_true "fov 70";+meta.if_false "fov 80"',
    key: 'НАЖАТИЕ КОЛЁСИКА',
    desc: 'Приближение камеры при удержании',
    explanation: 'Удерживайте кнопку для FOV 70; после отпускания возвращается FOV 80. При необходимости измените значения под себя.'
  }
];

export const raidWeapons: RaidWeapon[] = [
  {
    id: 'c4',
    name: 'C4 (Таймерная взрывчатка)',
    sulfurPer: 2200,
    charcoalPer: 3000,
    gpPer: 1000,
    metalPer: 200,
    icon: '💣'
  },
  {
    id: 'rocket',
    name: 'Боевая ракета',
    sulfurPer: 1400,
    charcoalPer: 1950,
    gpPer: 650,
    metalPer: 150,
    icon: '🚀'
  },
  {
    id: 'satchel',
    name: 'Сачель (Сумка со взрывчаткой)',
    sulfurPer: 480,
    charcoalPer: 720,
    gpPer: 240,
    metalPer: 80,
    icon: '🎒'
  },
  {
    id: 'explosive_ammo',
    name: 'Разрывной патрон 5.56 (1 шт)',
    sulfurPer: 25,
    charcoalPer: 30,
    gpPer: 10,
    metalPer: 5,
    icon: '⚡'
  },
  {
    id: 'beancan',
    name: 'Бобовая граната',
    sulfurPer: 120,
    charcoalPer: 180,
    gpPer: 60,
    metalPer: 20,
    icon: '🥫'
  },
  {
    id: 'propane',
    name: 'Пропановая бомба',
    sulfurPer: 900,
    charcoalPer: 1350,
    gpPer: 450,
    metalPer: 0,
    icon: '🛢️'
  },
  {
    id: 'mlrs',
    name: 'Ракета MLRS (Некрафтится)',
    sulfurPer: 0,
    charcoalPer: 0,
    gpPer: 0,
    metalPer: 0,
    icon: '🎯'
  }
];

export const raidTargets: RaidTarget[] = [
  // --- WALLS ---
  {
    id: 'wood_wall',
    name: 'Деревянная стена/фундамент',
    category: 'walls',
    icon: '🪵',
    hp: 250,
    c4: 1,
    rocket: 2,
    satchel: 3,
    explosive_ammo: 49,
    beancan: 13,
    propane: 2,
    mlrs: 1
  },
  {
    id: 'stone_wall',
    name: 'Каменная стена/фундамент',
    category: 'walls',
    icon: '🪨',
    hp: 500,
    c4: 2,
    rocket: 4,
    satchel: 10,
    explosive_ammo: 200,
    beancan: 46,
    propane: 7,
    mlrs: 3
  },
  {
    id: 'sheet_wall',
    name: 'Металлическая стена',
    category: 'walls',
    icon: '🔩',
    hp: 1000,
    c4: 4,
    rocket: 8,
    satchel: 23,
    explosive_ammo: 400,
    beancan: 112,
    propane: 13,
    mlrs: 6
  },
  {
    id: 'armored_wall',
    name: 'Бронированная стена (МВК)',
    category: 'walls',
    icon: '🛡',
    hp: 2000,
    c4: 8,
    rocket: 15,
    satchel: 46,
    explosive_ammo: 800,
    beancan: 223,
    propane: 25,
    mlrs: 12
  },
  {
    id: 'high_stone_wall',
    name: 'Высокая каменная стена',
    category: 'walls',
    icon: '🧱',
    hp: 500,
    c4: 2,
    rocket: 4,
    satchel: 10,
    explosive_ammo: 200,
    beancan: 46,
    propane: 7,
    mlrs: 3
  },
  {
    id: 'high_wood_wall',
    name: 'Высокая деревянная стена',
    category: 'walls',
    icon: '🪵',
    hp: 250,
    c4: 1,
    rocket: 2,
    satchel: 3,
    explosive_ammo: 49,
    beancan: 13,
    propane: 2,
    mlrs: 1
  },

  // --- DOORS ---
  {
    id: 'wood_door',
    name: 'Деревянная дверь',
    category: 'doors',
    icon: '🚪',
    hp: 200,
    c4: 1,
    rocket: 1,
    satchel: 2,
    explosive_ammo: 19,
    beancan: 6,
    propane: 1,
    mlrs: 1
  },
  {
    id: 'sheet_door',
    name: 'Железная дверь (Листовой металл)',
    category: 'doors',
    icon: '🔧',
    hp: 250,
    c4: 1,
    rocket: 2,
    satchel: 4,
    explosive_ammo: 63,
    beancan: 18,
    propane: 2,
    mlrs: 1
  },
  {
    id: 'garage_door',
    name: 'Гаражная дверь',
    category: 'doors',
    icon: '🏠',
    hp: 600,
    c4: 2,
    rocket: 3,
    satchel: 9,
    explosive_ammo: 150,
    beancan: 40,
    propane: 5,
    mlrs: 3
  },
  {
    id: 'armored_door',
    name: 'Бронированная дверь (МВК)',
    category: 'doors',
    icon: '🔒',
    hp: 800,
    c4: 2,
    rocket: 4,
    satchel: 12,
    explosive_ammo: 200,
    beancan: 56,
    propane: 8,
    mlrs: 4
  },
  {
    id: 'armored_hatch',
    name: 'Armored Hatch (HQM)',
    category: 'doors',
    icon: '⬛',
    hp: 800,
    c4: 2,
    rocket: 4,
    satchel: 12,
    explosive_ammo: 200,
    beancan: 56,
    propane: 8,
    mlrs: 4
  },

  // --- DEPLOYABLES ---
  {
    id: 'tc',
    name: 'Шкаф с инструментами (TC)',
    category: 'deployables',
    icon: '🗄',
    hp: 100,
    c4: 1,
    rocket: 1,
    satchel: 1,
    explosive_ammo: 10,
    beancan: 3,
    propane: 1,
    mlrs: 1
  },
  {
    id: 'auto_turret',
    name: 'Авто-турель',
    category: 'deployables',
    icon: '🤖',
    hp: 1000,
    c4: 1,
    rocket: 3,
    satchel: 3,
    explosive_ammo: 40,
    beancan: 12,
    propane: 3,
    mlrs: 2
  },
  {
    id: 'guntrap',
    name: 'Дробовик-ловушка (Guntrap)',
    category: 'deployables',
    icon: '💥',
    hp: 100,
    c4: 1,
    rocket: 1,
    satchel: 1,
    explosive_ammo: 10,
    beancan: 3,
    propane: 1,
    mlrs: 1
  },
  {
    id: 'flametrap',
    name: 'Огнеметная турель',
    category: 'deployables',
    icon: '🔥',
    hp: 150,
    c4: 1,
    rocket: 1,
    satchel: 1,
    explosive_ammo: 15,
    beancan: 4,
    propane: 1,
    mlrs: 1
  }
];

export const adminBindsDatabase: BindItem[] = [
  {
    category: 'АДМИН',
    cmd: 'bind [leftshift+h] debugcamera',
    key: 'SHIFT + H',
    desc: 'Свободная камера администратора',
    explanation: 'Включает debugcamera для наблюдения за миром. Это не делает персонажа невидимым.'
  },
  {
    category: 'АДМИН',
    cmd: 'bind [leftshift+t] teleport2marker',
    key: 'SHIFT + T',
    desc: 'Телепорт к своей метке',
    explanation: 'Перемещает администратора к установленной метке на карте.'
  },
  {
    category: 'АДМИН',
    cmd: 'bind p "ent kill"',
    key: 'P',
    desc: 'Удалить объект под прицелом',
    explanation: 'Удаляет сущность, на которую направлен прицел. Используйте осторожно: действие может быть необратимым.'
  },
  {
    category: 'АДМИН',
    cmd: 'bind u "ent unlock"',
    key: 'U',
    desc: 'Открыть замок под прицелом',
    explanation: 'Снимает блокировку с выбранного замка.'
  },
  {
    category: 'АДМИН',
    cmd: 'bind l "ent lock"',
    key: 'L',
    desc: 'Закрыть замок под прицелом',
    explanation: 'Блокирует выбранный замок.'
  },
  {
    category: 'АДМИН',
    cmd: 'bind j noclip',
    key: 'J',
    desc: 'Переключить режим полёта',
    explanation: 'Включает или выключает noclip. Требуются административные права.'
  },
  {
    category: 'АДМИН',
    cmd: 'bind delete "layer.toggle Construction"',
    key: 'DELETE',
    desc: 'Скрыть слой построек',
    explanation: 'Переключает отображение слоя Construction в инструментах администратора.'
  },
  {
    category: 'АДМИН',
    cmd: 'bind [leftshift+rightcontrol] "weather.load clear"',
    key: 'LEFT SHIFT + RIGHT CTRL',
    desc: 'Очистить погоду',
    explanation: 'Загружает ясную погоду на сервере. Требуются административные права.'
  }
];

export const adminCommandsDatabase: AdminCommandItem[] = [
  // --- УПРАВЛЕНИЕ ПРАВАМИ АДМИНИСТРАТОРА ---
  {
    category: 'ПРАВА',
    cmd: 'ownerid <Steam64ID> "<Имя>"',
    desc: 'Назначить владельца (Owner)',
    explanation: 'Выдает игроку максимальные права администратора (auth level 2) по его Steam64ID.'
  },
  {
    category: 'ПРАВА',
    cmd: 'moderatorid <Steam64ID> "<Имя>"',
    desc: 'Назначить модератора (Moderator)',
    explanation: 'Выдает игроку права модератора (auth level 1) по его Steam64ID.'
  },
  {
    category: 'ПРАВА',
    cmd: 'removeowner <Steam64ID>',
    desc: 'Снять права владельца',
    explanation: 'Лишает игрока прав администратора (auth level 2).'
  },
  {
    category: 'ПРАВА',
    cmd: 'removemoderator <Steam64ID>',
    desc: 'Снять права модератора',
    explanation: 'Лишает игрока прав модератора (auth level 1).'
  },
  {
    category: 'ПРАВА',
    cmd: 'server.writecfg',
    desc: 'Сохранить права в конфиг',
    explanation: 'Важно! Сохраняет все изменения прав администраторов и модераторов в конфигурационный файл сервера, чтобы они не сбросились после рестарта.'
  },

  // --- МОДЕРАЦИЯ ИГРОКОВ ---
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'ban "<Имя>" "<Причина>"',
    desc: 'Забанить игрока по имени',
    explanation: 'Навсегда блокирует доступ к серверу игроку с указанным именем.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'banid <Steam64ID> "<Причина>"',
    desc: 'Забанить игрока по SteamID',
    explanation: 'Блокирует игрока по его SteamID (работает, даже если игрока сейчас нет на сервере).'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'unban <Steam64ID>',
    desc: 'Разбанить игрока',
    explanation: 'Снимает блокировку с игрока по его SteamID.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'banlistex',
    desc: 'Список забаненных игроков',
    explanation: 'Выводит в консоль список всех заблокированных игроков с указанием причин бана.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'kick "<Имя>" "<Причина>"',
    desc: 'Кикнуть игрока с сервера',
    explanation: 'Принудительно отключает игрока от сервера с выводом причины на экран.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'kickall "<Причина>"',
    desc: 'Кикнуть всех игроков',
    explanation: 'Принудительно отключает ВСЕХ находящихся на сервере игроков.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'mutevoice <Steam64ID>',
    desc: 'Заглушить микрофон (Mute Voice)',
    explanation: 'Запрещает указанному игроку использовать голосовой чат.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'unmutevoice <Steam64ID>',
    desc: 'Включить микрофон (Unmute Voice)',
    explanation: 'Разрешает указанному игроку снова использовать голосовой чат.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'mutechat <Steam64ID>',
    desc: 'Заглушить текстовый чат (Mute Chat)',
    explanation: 'Запрещает указанному игроку отправлять текстовые сообщения в общий чат.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'unmutechat <Steam64ID>',
    desc: 'Включить текстовый чат (Unmute Chat)',
    explanation: 'Разрешает игроку снова писать в текстовый чат.'
  },
  {
    category: 'МОДЕРАЦИЯ',
    cmd: 'status',
    desc: 'Список игроков и статус сервера',
    explanation: 'Показывает подробный список игроков на сервере, их SteamID, пинг, IP-адрес и общие показатели сервера (также можно использовать команду players).'
  },

  // --- РЕЖИМЫ БОГА И ПОЛЁТА ---
  {
    category: 'РЕЖИМЫ',
    cmd: 'god true',
    desc: 'Включить режим Бога',
    explanation: 'Включает бессмертие. Персонаж не теряет здоровье, не испытывает голод и жажду (для выключения: god false).'
  },
  {
    category: 'РЕЖИМЫ',
    cmd: 'noclip',
    desc: 'Режим полета (Noclip)',
    explanation: 'Включает/выключает полет персонажа и позволяет проходить сквозь любые текстуры и стены.'
  },
  {
    category: 'РЕЖИМЫ',
    cmd: 'heal <Число>',
    desc: 'Вылечить себя',
    explanation: 'Мгновенно восстанавливает указанное количество очков здоровья (HP).'
  },
  {
    category: 'РЕЖИМЫ',
    cmd: 'refillvitals',
    desc: 'Восстановить все показатели',
    explanation: 'Полностью восстанавливает здоровье до 100%, а также шкалы еды и воды.'
  },

  // --- ТЕЛЕПОРТАЦИЯ ---
  {
    category: 'ТЕЛЕПОРТ',
    cmd: 'teleport "<Имя1>" "<Имя2>"',
    desc: 'Телепортировать игрока к игроку',
    explanation: 'Переносит первого указанного игрока к местоположению второго игрока.'
  },
  {
    category: 'ТЕЛЕПОРТ',
    cmd: 'teleport2me "<Имя>"',
    desc: 'Телепортировать игрока к себе',
    explanation: 'Мгновенно переносит указанного игрока к вам.'
  },
  {
    category: 'ТЕЛЕПОРТ',
    cmd: 'teleportpos <x> <y> <z>',
    desc: 'Телепортация по координатам',
    explanation: 'Переносит вашего персонажа в точную точку на карте по координатам X Y Z.'
  },
  {
    category: 'ТЕЛЕПОРТ',
    cmd: 'teleport2marker',
    desc: 'Телепорт к метке на карте',
    explanation: 'Мгновенно переносит вас к установленной вами метке на карте (ПКМ по карте).'
  },
  {
    category: 'ТЕЛЕПОРТ',
    cmd: 'teleportlos',
    desc: 'Телепорт по взгляду (LOS)',
    explanation: 'Телепортирует вашего персонажа точно на поверхность объекта или земли, на которую направлен ваш прицел.'
  },

  // --- ВЫДАЧА ПРЕДМЕТОВ И ЧЕРТЕЖЕЙ ---
  {
    category: 'ВЫДАЧА',
    cmd: 'inventory.give "<Предмет>" <Кол-во>',
    desc: 'Выдать предмет себе',
    explanation: 'Добавляет указанный предмет в ваш инвентарь.',
    example: 'inventory.give "rifle.ak" 1'
  },
  {
    category: 'ВЫДАЧА',
    cmd: 'inventory.giveto "<Имя>" "<Предмет>" <Кол-во>',
    desc: 'Выдать предмет игроку',
    explanation: 'Добавляет указанный предмет в инвентарь выбранного игрока.',
    example: 'inventory.giveto "Player1" "wood" 1000'
  },
  {
    category: 'ВЫДАЧА',
    cmd: 'inventory.giveall "<Предмет>" <Кол-во>',
    desc: 'Выдать предмет ВСЕМ игрокам',
    explanation: 'Выдает указанный предмет абсолютно всем игрокам, находящимся в данный момент в сети.',
    example: 'inventory.giveall "bandage" 5'
  },
  {
    category: 'ВЫДАЧА',
    cmd: 'inventory.givebp "<Предмет>"',
    desc: 'Выдать чертеж предмета',
    explanation: 'Выдает вам изученный рецепт (Blueprint) указанного предмета.',
    example: 'inventory.givebp "rifle.ak"'
  },
  {
    category: 'ВЫДАЧА',
    cmd: 'inventory.givebpall',
    desc: 'Изучить все чертежи',
    explanation: 'Мгновенно разблокирует и изучает абсолютно все существующие чертежи в игре для вашего персонажа.'
  },

  // --- УПРАВЛЕНИЕ МИРОМ ---
  {
    category: 'МИР',
    cmd: 'env.time <0-24>',
    desc: 'Установить время суток',
    explanation: 'Меняет время суток на сервере (например, env.time 12 — полдень, env.time 0 — полночь).'
  },
  {
    category: 'МИР',
    cmd: 'env.addtime <Часы>',
    desc: 'Добавить часы / Промотать время',
    explanation: 'Проматывает время на сервере вперед на указанное число часов.'
  },
  {
    category: 'МИР',
    cmd: 'weather.rain <0-1>',
    desc: 'Интенсивность дождя',
    explanation: 'Устанавливает силу дождя от 0 (нет дождя) до 1 (сильный дождь).'
  },
  {
    category: 'МИР',
    cmd: 'weather.fog <0-1>',
    desc: 'Плотность тумана',
    explanation: 'Устанавливает интенсивность тумана на сервере (0 - ясно, 1 - максимальный туман).'
  },
  {
    category: 'МИР',
    cmd: 'weather.wind <0-1>',
    desc: 'Сила ветра',
    explanation: 'Меняет силу ветра на сервере.'
  },
  {
    category: 'МИР',
    cmd: 'heli.call',
    desc: 'Вызвать патрульный вертолет',
    explanation: 'Принудительно запускает игровое событие с патрульным вертолетом (он летит на карту).'
  },
  {
    category: 'МИР',
    cmd: 'heli.calltome',
    desc: 'Вызвать вертолет к себе',
    explanation: 'Вызывает патрульный вертолет непосредственно к вашей текущей геопозиции.'
  },
  {
    category: 'МИР',
    cmd: 'bradley.quickrespawn',
    desc: 'Мгновенный респавн танка Bradley',
    explanation: 'Мгновенно спавнит танк Брэдли на космодроме (Launch Site).'
  },
  {
    category: 'МИР',
    cmd: 'supply.call',
    desc: 'Вызвать Air Drop (Самолет)',
    explanation: 'Вызывает грузовой самолет, который сбросит аирдроп на случайную точку карты (также можно использовать supply.drop).'
  },

  // --- УПРАВЛЕНИЕ СУЩНОСТЯМИ ---
  {
    category: 'СУЩНОСТИ',
    cmd: 'ent kill',
    desc: 'Удалить объект перед собой',
    explanation: 'Осторожно! Навсегда удаляет объект (стену, дверь, ящик, печку, шкаф, коптер), на который направлен ваш взгляд.'
  },
  {
    category: 'СУЩНОСТИ',
    cmd: 'ent who',
    desc: 'Узнать владельца объекта',
    explanation: 'Выводит в консоль SteamID и имя игрока, который установил или застроил объект перед вашим прицелом.'
  },
  {
    category: 'СУЩНОСТИ',
    cmd: 'ent lock',
    desc: 'Заблокировать замок/дверь',
    explanation: 'Принудительно закрывает/блокирует выбранный кодовый или ключевой замок (для разблокировки: ent unlock).'
  },
  {
    category: 'СУЩНОСТИ',
    cmd: 'spawn "<Сущность>"',
    desc: 'Заспавнить сущность',
    explanation: 'Спавнит выбранную сущность перед вами (например, животных, бочки, ящики, ученых).',
    example: 'spawn "bear"'
  },

  // --- СООБЩЕНИЯ И ИНФОРМАЦИЯ ---
  {
    category: 'ИНФО',
    cmd: 'say "<Текст>"',
    desc: 'Объявление от лица сервера (Say)',
    explanation: 'Отправляет в чат глобальное сообщение, стилизованное под серверное оповещение (выделяется красным цветом).'
  },
  {
    category: 'ИНФО',
    cmd: 'find "<Слово>"',
    desc: 'Поиск консольных команд',
    explanation: 'Помогает найти нужную консольную команду или переменную по ключевому слову.'
  },
  {
    category: 'ИНФО',
    cmd: 'serverinfo',
    desc: 'Системная информация о сервере',
    explanation: 'Выводит в консоль данные о времени непрерывной работы сервера (Uptime), текущем FPS, занятой оперативной памяти и количестве сущностей.'
  },
  {
    category: 'ИНФО',
    cmd: 'sv stats',
    desc: 'Статистика игроков',
    explanation: 'Выводит подробную игровую статистику игроков (убийства, смерти, время нахождения на сервере).'
  }
];

export const weaponStatsDatabase: WeaponStat[] = [
  { id: 'ak47', name: 'Assault Rifle', damage: 50, fireRate: 450, magSize: 30, range: 100, accuracy: 80, category: 'rifles', icon: 'ak47' },
  { id: 'lr300', name: 'LR-300 Assault Rifle', damage: 45, fireRate: 450, magSize: 30, range: 100, accuracy: 85, category: 'rifles', icon: 'lr300' },
  { id: 'mp5', name: 'MP5A4', damage: 35, fireRate: 600, magSize: 30, range: 50, accuracy: 70, category: 'smgs', icon: 'mp5' },
  { id: 'thompson', name: 'Thompson', damage: 37, fireRate: 500, magSize: 20, range: 45, accuracy: 65, category: 'smgs', icon: 'thompson' },
  { id: 'custom', name: 'Custom SMG', damage: 30, fireRate: 600, magSize: 24, range: 35, accuracy: 60, category: 'smgs', icon: 'custom' },
  { id: 'sar', name: 'Semi-Automatic Rifle', damage: 40, fireRate: 400, magSize: 16, range: 80, accuracy: 75, category: 'rifles', icon: 'sar' },
  { id: 'bolt', name: 'Bolt Action Rifle', damage: 80, fireRate: 30, magSize: 4, range: 150, accuracy: 95, category: 'snipers', icon: 'bolt' },
  { id: 'm249', name: 'M249', damage: 55, fireRate: 500, magSize: 100, range: 120, accuracy: 85, category: 'rifles', icon: 'm249' },
  { id: 'hmlmg', name: 'HMLMG', damage: 48, fireRate: 450, magSize: 60, range: 110, accuracy: 80, category: 'rifles', icon: 'hmlmg' }
];
