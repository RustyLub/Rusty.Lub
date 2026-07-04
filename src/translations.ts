export const uiTranslations: Record<string, Record<'ru' | 'en', string>> = {
  logoSub: {
    ru: 'SUVIVAL KIT v2.4 • CLAN [EAC]',
    en: 'SURVIVAL KIT v2.4 • CLAN [EAC]'
  },
  navHome: {
    ru: 'Главная',
    en: 'Home'
  },
  navErrors: {
    ru: 'Ошибки',
    en: 'Errors'
  },
  navBinds: {
    ru: 'Бинды',
    en: 'Binds'
  },
  navFps: {
    ru: 'Оптимизация FPS',
    en: 'FPS Boost'
  },
  navRaid: {
    ru: 'Рейд Калькулятор',
    en: 'Raid Calc'
  },
  discordBtn: {
    ru: 'Наш Discord',
    en: 'Our Discord'
  },
  discordBtnFull: {
    ru: '💬 Открыть Discord',
    en: '💬 Open Discord'
  },
  grandSubtitle: {
    ru: 'УЛЬТИМАТИВНЫЙ СПРАВОЧНИК 2026',
    en: 'ULTIMATE HANDBOOK 2026'
  },
  grandDesc: {
    ru: 'Добро пожаловать на профессиональный портал помощи игрокам Rust. Здесь собраны подробные алгоритмы устранения критических ошибок, ультимативные макро-бинды, интерактивный калькулятор рейда с Сачелями и Бобовыми гранатами, а также тонкие настройки для повышения FPS.',
    en: 'Welcome to the professional Rust player handbook. Here you will find detailed solutions for critical errors, ultimate macro binds, an interactive raid calculator, and advanced settings for boosting your FPS.'
  },
  btnErrorSolutions: {
    ru: '📖 Решения Ошибок',
    en: '📖 Error Fixes'
  },
  btnUsefulBinds: {
    ru: '⌨️ Полезные Бинды',
    en: '⌨️ Useful Binds'
  },
  btnStartRaidCalc: {
    ru: '💣 Начать Рейд Расчет',
    en: '💣 Start Raid Calc'
  },
  clanLeaderTitle: {
    ru: 'Основатель клана [EAC]',
    en: 'Founder of Clan [EAC]'
  },
  clanLeaderBio: {
    ru: 'Привет, боец! Этот проект был собран ветераном Rust с суммарным опытом более 12 000 часов на официальных и кастомных серверах. Вся информация в справочнике выверена на практике, а калькулятор идеально считает расходы ресурсов для рейда любого строения.',
    en: 'Hello, survivor! This project was built by a Rust veteran with over 12,000 hours of total playtime on official and custom servers. All information in the handbook is field-tested, and the calculator precisely estimates the cost of raiding any structure.'
  },
  hoursInGame: {
    ru: 'Часов в игре',
    en: 'Hours in-game'
  },
  eacStatus: {
    ru: 'Статус EAC',
    en: 'EAC Status'
  },
  eacStatusValue: {
    ru: 'Чист (EAC Safe)',
    en: 'Clean (EAC Safe)'
  },
  wipesPlayed: {
    ru: 'Сыграно вайпов',
    en: 'Wipes Played'
  },
  copyright: {
    ru: 'Разработчик &copy; 2026. Все права на ассеты принадлежат Facepunch.',
    en: 'Developer &copy; 2026. All rights to assets belong to Facepunch.'
  },
  joinClanLink: {
    ru: 'Присоединиться к клану',
    en: 'Join the Clan'
  },
  discordCommunityTitle: {
    ru: 'Наше Rust-Сообщество',
    en: 'Our Rust Community'
  },
  discordCommunityDesc: {
    ru: 'Присоединяйтесь к нашему Discord-серверу для поиска тиммейтов, обсуждения последних обновлений игры, клановых наборов или получения индивидуальной технической помощи!',
    en: 'Join our Discord server to find teammates, discuss the latest game updates, apply for clan recruitment, or get individual technical support!'
  },
  feature1Title: {
    ru: 'Умная База Ошибок',
    en: 'Smart Error Base'
  },
  feature1Desc: {
    ru: 'Решения вылетов Unity, зависаний, ошибок EAC и оптимизации видеопамяти.',
    en: 'Fixes for Unity crashes, freezes, EAC issues, and memory optimizations.'
  },
  feature2Title: {
    ru: 'Макро-Бинды',
    en: 'Macro Binds'
  },
  feature2Desc: {
    ru: 'Стрельба сидя, автоатака, быстрый шприц, hoverloot и мгновенные улучшения стен.',
    en: 'Crouch shooting, auto-attack, quick syringe, hoverloot, and instant wall upgrades.'
  },
  feature3Title: {
    ru: 'Буст Кадров (FPS)',
    en: 'FPS Boost'
  },
  feature3Desc: {
    ru: 'Сбалансированные параметры запуска Steam и консольные команды для повышения FPS.',
    en: 'Balanced Steam launch parameters and console commands to boost FPS.'
  },
  feature4Title: {
    ru: 'Калькулятор Рейда',
    en: 'Raid Calculator'
  },
  feature4Desc: {
    ru: 'Интерактивный расчет серы, угля и пороха под любой выбранный арсенал взрывчатки.',
    en: 'Interactive calculation of sulfur, charcoal, and gunpowder for any explosive arsenal.'
  },
  toastCopied: {
    ru: 'Скопировано',
    en: 'Copied'
  },
  toastCopyFailed: {
    ru: 'Не удалось скопировать в буфер обмена',
    en: 'Failed to copy to clipboard'
  },
  languageToggleBtn: {
    ru: 'English',
    en: 'Русский'
  }
};

// Translate Binds Categories
export const bindsCategoryMap: Record<string, Record<'ru' | 'en', string>> = {
  all: { ru: 'Все бинды', en: 'All Binds' },
  PVP: { ru: 'PVP', en: 'PVP' },
  'МЕДИЦИНА': { ru: 'Медицина', en: 'Medical' },
  'ФАРМ': { ru: 'Фарм', en: 'Farming' },
  'СТРОЙКА': { ru: 'Стройка', en: 'Building' },
  'УПРАВЛЕНИЕ': { ru: 'Управление', en: 'Controls' },
  'QOL': { ru: 'QoL / Комфорт', en: 'QoL / Comfort' },
  'МОДОВЫЕ': { ru: 'Модовые', en: 'Modded' },
  // Admin Categories
  'ПРАВА': { ru: '👑 Права', en: '👑 Permissions' },
  'МОДЕРАЦИЯ': { ru: '🚨 Модерация', en: '🚨 Moderation' },
  'РЕЖИМЫ': { ru: '🧙‍♂️ Режимы', en: '🧙‍♂️ Modes' },
  'ТЕЛЕПОРТ': { ru: '💫 Телепорт', en: '💫 Teleport' },
  'ВЫДАЧА': { ru: '🎁 Выдача', en: '🎁 Give Items' },
  'МИР': { ru: '🌦️ Мир', en: '🌦️ World' },
  'СУЩНОСТИ': { ru: '⚙️ Сущности', en: '⚙️ Entities' },
  'ИНФО': { ru: '📢 Инфо', en: '📢 Chat & Info' }
};

// Translate Binds Data
export const bindsTranslationMap: Record<string, { desc: string; explanation?: string; category: string; example?: string }> = {
  'bind <клавиша>': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Check key binding',
    explanation: 'Shows in the console what command is currently bound to the specified key.'
  },
  'unbind <клавиша>': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Remove key bind',
    explanation: 'Completely deletes the command assigned to the specified key.'
  },
  'bind <клавиша> ""': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Clear key bind',
    explanation: 'Clears the bind on a key (alternative to "bind <key> clear").'
  },
  'bind x "forward;sprint"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Auto-sprint (alternative on X)',
    explanation: 'Automatic running forward. Press X to toggle, and press W to stop.'
  },
  'bind j "buttons.forward; buttons.sprint; buttons.jump"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Auto-swimming',
    explanation: 'Forces the character to automatically swim forward and float on the water surface.'
  },
  'bind c "~duck;+duck"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Crouch hold toggle',
    explanation: 'Toggles between crouching and standing on pressing the C key.'
  },
  'bind z "attack;duck"': {
    category: 'PVP',
    desc: 'Auto-attack + crouch',
    explanation: 'The character crouches down and starts continuously attacking/firing.'
  },
  'bind z "+attack;+duck"': {
    category: 'PVP',
    desc: 'Hold key to auto-attack + crouch',
    explanation: 'While holding down the Z key, the character crouches and fires continuously.'
  },
  'bind p "+attack; +jump"': {
    category: 'PVP',
    desc: 'Auto-attack with jumping',
    explanation: 'Continuously jumps and attacks at the same time.'
  },
  'bind r "reload; attack; duck"': {
    category: 'PVP',
    desc: 'Shoot with auto-reload',
    explanation: 'Automatically crouches and attacks while performing weapon reloads.'
  },
  'bind mouse1 "+attack2;+input.sensitivity .45;input.sensitivity .2"': {
    category: 'PVP',
    desc: 'Low mouse sensitivity during ADS',
    explanation: 'Lowers mouse sensitivity when aiming down sights (holding Right Mouse Button) for precise recoil control.'
  },
  'bind mouse1 "+lighttoggle;+attack2"': {
    category: 'PVP',
    desc: 'Toggle flashlight/laser during ADS',
    explanation: 'Automatically activates weapon flashlight or laser sight only while aiming.'
  },
  'bind x "graphics.vm_horizontal_flip true"': {
    category: 'PVP',
    desc: 'Switch weapon hand (left/right)',
    explanation: 'Switches the weapon model to the left hand. Use "false" to return it to the right hand.'
  },
  'bind g "+map;+focusmap"': {
    category: 'QOL',
    desc: 'Open map with autofocus',
    explanation: 'Opens the map and instantly centers the camera on your current position.'
  },
  'bind c "cinematic_view 1;cinematic_view 0"': {
    category: 'QOL',
    desc: 'Disable HUD (Cinematic View)',
    explanation: 'Hides all UI elements for beautiful, immersive screenshots or video clips.'
  },
  'bind f9 "streamermode true;streamermode false"': {
    category: 'QOL',
    desc: 'Streamer Mode toggle',
    explanation: 'Hides server information, player names, and other sensitive details.'
  },
  'bind mouse3 "+buttons.hoverloot"': {
    category: 'ФАРМ',
    desc: 'Quick hoverloot on Middle Click',
    explanation: 'Hold down the middle mouse button (scroll wheel click) to quickly transfer items from boxes/corpses.'
  },
  'bind c "+buttons.hoverloot; +altlook"': {
    category: 'PVP',
    desc: 'Quick gear equip',
    explanation: 'Allows you to immediately equip clothes and armor from an open crate.'
  },
  'bind 3 "+buttons.slot3; +buttons.attack"': {
    category: 'МЕДИЦИНА',
    desc: 'Quick item use from Slot 3',
    explanation: 'Instantly selects and activates (e.g. injects syringe) the item located in hotbar slot 3.'
  },
  'bind h "craft.add -2072273936 1"': {
    category: 'МЕДИЦИНА',
    desc: 'Quick craft 1 bandage',
    explanation: 'Instantly adds one medical bandage to your craft queue.'
  },
  'bind h "craft.add -2072273936 10"': {
    category: 'МЕДИЦИНА',
    desc: 'Quick craft 10 bandages',
    explanation: 'Puts 10 medical bandages into the craft queue instantly.'
  },
  'bind c "craft.add 1079279582 1"': {
    category: 'МЕДИЦИНА',
    desc: 'Quick craft medical syringe',
    explanation: 'Immediately starts crafting one medical syringe.'
  },
  'bind p "craft.add -946369541 1"': {
    category: 'ФАРМ',
    desc: 'Quick craft beancan grenade',
    explanation: 'Puts one beancan grenade into your craft queue.'
  },
  'bind u "craft.add 1248356124 1"': {
    category: 'СТРОЙКА',
    desc: 'Quick craft C4 charge',
    explanation: 'Instantly starts crafting one Timed Explosive Charge (C4).'
  },
  'bind y "craft.add -265876753 999"': {
    category: 'ФАРМ',
    desc: 'Quick craft gunpowder (999)',
    explanation: 'Enqueues crafting of gunpowder up to the maximum limit (999 units).'
  },
  'bind j "craft.add -1211166256 100"': {
    category: 'PVP',
    desc: 'Quick craft 100x 5.56 ammo',
    explanation: 'Adds 100 pieces of 5.56 rifle ammunition to the craft queue.'
  },
  'bind n "craft.add -592016202 100"': {
    category: 'СТРОЙКА',
    desc: 'Quick craft explosives (100)',
    explanation: 'Starts crafting 100 units of military-grade explosives.'
  },
  'bind f1 "consoletoggle;combatlog;ping"': {
    category: 'QOL',
    desc: 'Console + CombatLog + Ping',
    explanation: 'Opens the console and displays combat logs and network ping at the same time.'
  },
  'bind f2 "consoletoggle;combatlog_outgoing;ping"': {
    category: 'QOL',
    desc: 'Outgoing CombatLog + Ping',
    explanation: 'Displays only the damage hits you have dealt, plus your network ping.'
  },
  'bind f3 "perf 1"': {
    category: 'QOL',
    desc: 'Show FPS (F3 key)',
    explanation: 'Displays the internal frames-per-second (FPS) counter and ping overlay.'
  },
  'bind p "disconnect"': {
    category: 'QOL',
    desc: 'Quick disconnect from server',
    explanation: 'Instantly disconnects you from the server and goes back to the main menu.'
  },
  'bind k "kill"': {
    category: 'QOL',
    desc: 'Respawn / Suicide',
    explanation: 'Instantly commits suicide so you can respawn at a sleeping bag or bed.'
  },
  'bind o "pool.clear_assets;pool.clear_memory;pool.clear_prefabs;gc.collect"': {
    category: 'QOL',
    desc: 'Flush cache and memory (FPS boost)',
    explanation: 'Clears Unity assets, prefabs, and unused RAM to fix microstutters and improve performance.'
  },
  'bind k "audio.master 0.1"': {
    category: 'QOL',
    desc: 'Lower game volume to 10%',
    explanation: 'Instantly dims the master volume so you can hear your teammates on Discord during loud mini flights or raids.'
  },
  'bind l "audio.master 0.8"': {
    category: 'QOL',
    desc: 'Restore game volume to 80%',
    explanation: 'Restores master audio level back to default high volume.'
  },
  'bind L "~meta.exec \\"client.lookatradius 0\\" \\"chat.add 0 0 MIN\\"; meta.exec \\"client.lookatradius 0.2\\" \\"chat.add 0 0 DEFAULT\\"; meta.exec \\"client.lookatradius 10\\" \\"chat.add 0 0 MAX\\""': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Interactive lookup radius toggle',
    explanation: 'Switches look-at interaction distance between minimum, default, and maximum.'
  },
  'bind j "+graphics.fov 90; +graphics.hud 1; graphics.fov 70; graphics.hud 0"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Zoom in (Press J)',
    explanation: 'A quick field-of-view toggle to zoom in on targets for distant scouting or long-range shooting.'
  },
  'bind insert "~fps.limit 2;fps.limit 5;fps.limit -1"': {
    category: 'QOL',
    desc: 'FPS Limit toggle',
    explanation: 'Allows switching frame limits on insert keypress.'
  },
  'bind f12 "~audio.master 0.1;audio.master 0.5"': {
    category: 'QOL',
    desc: 'Quick volume step toggle',
    explanation: 'Toggles master volume directly between 10% and 50%.'
  },
  'bind h "chat.say \\"/home home\\""': {
    category: 'МОДОВЫЕ',
    desc: 'Teleport Home (/home)',
    explanation: 'Automatically types the home teleportation command into global chat.'
  },
  'bind t "chat.say \\"/tpa\\""': {
    category: 'МОДОВЫЕ',
    desc: 'Accept teleport request (/tpa)',
    explanation: 'Quickly accepts pending teleportation requests from other players.'
  },
  'bind c "chat.say \\"/tpc\\""': {
    category: 'МОДОВЫЕ',
    desc: 'Cancel teleport request (/tpc)',
    explanation: 'Cancels your active teleportation countdown.'
  },
  'bind k "chat.say \\"/kit\\""': {
    category: 'МОДОВЫЕ',
    desc: 'Open Kits Menu (/kit)',
    explanation: 'Automatically sends /kit command to chat to open the kits selection interface.'
  },
  'bind r "chat.say \\"/remove\\""': {
    category: 'МОДОВЫЕ',
    desc: 'Enable remove mode (/remove)',
    explanation: 'Activates or deactivates structural blocks removal mode.'
  },
  'bind u "building.upgrade"': {
    category: 'МОДОВЫЕ',
    desc: 'Instant full building upgrade',
    explanation: 'Upgrades the targeted structure block to the maximum available tier instantly.'
  },
  'bind z "attack"': {
    category: 'PVP',
    desc: 'Automatic continuous attack (AFK attack)',
    explanation: 'Activate a continuous attack with standard melee weapons or firearms without holding down your mouse button.'
  },
  'bind x "input.attack; input.duck"': {
    category: 'PVP',
    desc: 'Autofire from crouch position',
    explanation: 'Perfect for shooting weapons with heavy vertical recoil (like AK-47). Automatically crouches and fires, providing maximum stability.'
  },
  'bind c "+duck; +attack"': {
    category: 'PVP',
    desc: 'Crouch and continuous attack',
    explanation: 'Locks you in a crouched position while constantly attacking, freeing your hands for farming or cover fire.'
  },
  'bind mouse1 "+lighttoggle; +attack"': {
    category: 'PVP',
    desc: 'Flashlight/Laser activation while shooting',
    explanation: 'Automatically turns on your weapon flashlight or laser sight when you start firing, and turns it off when you stop. Prevents giving away your position early.'
  },
  'bind mouse2 "+attack2;+lighttoggle"': {
    category: 'PVP',
    desc: 'Flashlight/Laser activation while aiming',
    explanation: 'Turns on your weapon flashlight or laser sight only when you hold down the right mouse button to aim.'
  },
  'bind mouse2 "+attack2;+input.sensitivity 0.15;input.sensitivity 0.35"': {
    category: 'PVP',
    desc: 'Dynamic mouse sensitivity when aiming',
    explanation: 'Halves your mouse sensitivity (to 0.15) when aiming down sights for high precision, and restores standard sensitivity (0.35) when hip firing.'
  },
  'bind mouse2 "+attack2;+graphics.compass 1;graphics.compass 0"': {
    category: 'PVP',
    desc: 'Compass HUD when aiming',
    explanation: 'Automatically displays the compass at the top of your screen when aiming, helping you immediately call out enemy bearings to your teammates.'
  },
  'bind mouse1 "+attack;+graphics.drawdistance 2500;graphics.drawdistance 1000"': {
    category: 'PVP',
    desc: 'Dynamic render distance while shooting',
    explanation: 'Increases render distance to maximum (2500) while firing to clearly track distant bullet tracers, returning to 1000 for better FPS when idle.'
  },
  'bind h "consoletoggle;combatlog"': {
    category: 'PVP',
    desc: 'Rapid Combat Log display (Classic)',
    explanation: 'Instantly toggles console and loads combat log to see damage details.'
  },
  'bind leftalt "+altlook"': {
    category: 'PVP',
    desc: 'Standard free look',
    explanation: 'Look around without changing your movement direction.'
  },
  'bind mouse4 "inventory.slotuse 5"': {
    category: 'МЕДИЦИНА',
    desc: 'Instant item use in Active Slot 5 (Quick Heal)',
    explanation: 'Instantly applies the item in slot 5 (usually syringe or bandage) with one click without manually switching your active weapon slot.'
  },
  'bind mouse5 "inventory.slotuse 4"': {
    category: 'МЕДИЦИНА',
    desc: 'Instant item use in Active Slot 4 (Quick Heal)',
    explanation: 'Instantly applies the item in active slot 4. Recommended for quick bandages during intense firefights.'
  },
  'bind keypad5 "inventory.slotuse 1; inventory.slotuse 2"': {
    category: 'МЕДИЦИНА',
    desc: 'Double item use (Bandage + Syringe)',
    explanation: 'Consumes bandage from slot 1 and syringe from slot 2 simultaneously to stop bleeding and restore health rapidly in one keypress.'
  },
  'bind v "inventory.slotuse 3"': {
    category: 'МЕДИЦИНА',
    desc: 'Instant item use in Active Slot 3',
    explanation: 'Instantly triggers slot 3 items like medical kits, barricades, or water bottles.'
  },
  'bind b "inventory.slotuse 6"': {
    category: 'МЕДИЦИНА',
    desc: 'Instant item use in Active Slot 6',
    explanation: 'Instantly uses the item located in active slot 6.'
  },
  'bind f6 "+attack; +duck"': {
    category: 'ФАРМ',
    desc: 'Farming resources on crouch',
    explanation: 'Keeps you crouched and constantly swinging your tool for quiet, comfortable resource farming.'
  },
  'bind h "+hoverloot"': {
    category: 'ФАРМ',
    desc: 'Quick loot transfer (Auto-loot)',
    explanation: 'Hold "H" and hover your mouse over container or corpse cells — resources will transfer to your inventory instantly.'
  },
  'bind keypadslash "attack"': {
    category: 'ФАРМ',
    desc: 'Endless AFK Melee Attack',
    explanation: 'Locks attack on. Extremely useful for AFK raiding of stone walls with picks or cutting down forests.'
  },
  'bind j "+attack;+forward"': {
    category: 'ФАРМ',
    desc: 'Auto-attack while moving forward',
    explanation: 'Moves forward and swings tools continuously. Excellent for farming roadside barrels.'
  },
  'bind k "+attack;+duck;+forward"': {
    category: 'ФАРМ',
    desc: 'Auto-farm crouched while moving',
    explanation: 'Character slowly sneaks forward on crouch and swings. Perfect for quiet barrel farming.'
  },
  'bind y "building.upgrade_stone"': {
    category: 'СТРОЙКА',
    desc: 'Instant upgrade to Stone',
    explanation: 'Hover hammer over a wood/twig wall and press "Y" to instantly upgrade it to stone without opening the build radial menu.'
  },
  'bind u "building.upgrade_metal"': {
    category: 'СТРОЙКА',
    desc: 'Instant upgrade to Sheet Metal',
    explanation: 'Upgrades targeted build element to iron (Metal tier) with a single keypress when holding a hammer.'
  },
  'bind i "building.upgrade_toptier"': {
    category: 'СТРОЙКА',
    desc: 'Instant upgrade to Armored (HQM)',
    explanation: 'Instantly upgrades a wall to high-quality armored tier. Crucial for sealing breaches under raid fire.'
  },
  'bind t "building.upgrade_wood"': {
    category: 'СТРОЙКА',
    desc: 'Instant upgrade to Wood',
    explanation: 'Upgrades selected building element to wood tier on pressing "T".'
  },
  'bind r "building.rotate"': {
    category: 'СТРОЙКА',
    desc: 'Instant wall rotation',
    explanation: 'Quickly rotates wall or door facing direction when pointing with a hammer.'
  },
  'bind q "forward;sprint"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Automatic sprint forward',
    explanation: 'Saves your pinky and W finger during long runs across the map. Press once to run. Move back or press W/S to cancel.'
  },
  'bind f3 "physics.steps 60; steps 60"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Increase jump height (Physics sync)',
    explanation: 'Sets maximum physical simulation ticks. Allows jumping slightly higher and climbing rocks or launch site structures more easily.'
  },
  'bind [ "graphics.fov 70"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Narrow field of view (Zoom effect)',
    explanation: 'Limits FOV to 70, magnifying objects in front of you. A perfect free alternative to binoculars or weapon zoom.'
  },
  'bind ] "graphics.fov 90"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Restore standard field of view',
    explanation: 'Restores the standard wide FOV (90) for comfortable peripheral vision.'
  },
  'bind keyplus "+jump;forward"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Auto-surface while swimming',
    explanation: 'Forces character to constantly paddle upward to stay on top of the water surface. Great for long channel crossings.'
  },
  'bind caps-lock "duck"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Toggle constant crouch (Stealth)',
    explanation: 'Locks you in crouched position without holding down CTRL, enabling hands-free stealth walking.'
  },
  'bind keypadplus "+voice"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Voice communication toggle (Hands-free mic)',
    explanation: 'Toggles your microphone open permanently on pressing "Num +" and closes it when pressed again.'
  },
  'bind space "+jump;+duck"': {
    category: 'УПРАВЛЕНИЕ',
    desc: 'Auto jump-and-crouch (Knee tuck)',
    explanation: 'Tucks your knees when jumping, making it much easier to climb through windows or mount high obstacles.'
  },
  'bind f2 "consoletoggle;combatlog"': {
    category: 'QOL',
    desc: 'Quick Combat Log viewer',
    explanation: 'Opens console and automatically pulls up your combat log showing hit registrations, damage, range, and latency.'
  },
  'bind p "audio.master 0"': {
    category: 'QOL',
    desc: 'Mute game sound instantly',
    explanation: 'Mutes all in-game sound immediately. Great for protecting your hearing during loud minicopter flights or scrap recycling.'
  },
  'bind o "audio.master 1"': {
    category: 'QOL',
    desc: 'Unmute game sound',
    explanation: 'Restores master volume to full level after using the mute bind.'
  },
  'bind l "quit"': {
    category: 'QOL',
    desc: 'Emergency client quit',
    explanation: 'Closes Rust instantly. Crucial when your client freezes or you need to exit the game immediately.'
  },
  'bind f10 "gc.collect"': {
    category: 'QOL',
    desc: 'Force garbage collection (Clean RAM)',
    explanation: 'Cleans unused cache memory from the Unity engine. Eliminates stuttering and micro-freezes before gunfights.'
  },
  'bind f5 "perf 1"': {
    category: 'QOL',
    desc: 'Show FPS on-screen',
    explanation: 'Enables a clean, small built-in overlay showing current frames per second (FPS) and network ping.'
  },
  'bind f4 "perf 0"': {
    category: 'QOL',
    desc: 'Hide FPS counters',
    explanation: 'Hides all performance overlays from your screen for a cleaner HUD.'
  },
  'bind delete "chat.clear"': {
    category: 'QOL',
    desc: 'Clear chat instantly',
    explanation: 'Deletes all visible chat message history in your current session. Useful for streamers.'
  },
  'bind f11 "client.reconnect"': {
    category: 'QOL',
    desc: 'Quick reconnect to last server',
    explanation: 'Quickly reconnects you to the server you just disconnected or crashed from, bypassing the main menu.'
  },
  'bind n "net.graph 1;net.graph 0"': {
    category: 'QOL',
    desc: 'Toggle network graph overlay',
    explanation: 'Shows and hides detailed real-time packet stability statistics in a single on-screen graph.'
  },
  'bind kp_multiply "disconnect"': {
    category: 'QOL',
    desc: 'Emergency server disconnect',
    explanation: 'Disconnects you from the server instantly, returning you to the main lobby on pressing "*".'
  },
  // --- ADMIN COMMANDS TRANSLATIONS ---
  'ownerid <Steam64ID> "<Имя>"': {
    category: 'ПРАВА',
    desc: 'Grant Owner Permissions (auth level 2)',
    explanation: 'Promotes specified player to server owner using their Steam64ID.'
  },
  'moderatorid <Steam64ID> "<Имя>"': {
    category: 'ПРАВА',
    desc: 'Grant Moderator Permissions (auth level 1)',
    explanation: 'Promotes specified player to server moderator using their Steam64ID.'
  },
  'removeowner <Steam64ID>': {
    category: 'ПРАВА',
    desc: 'Remove Owner Permissions',
    explanation: 'Demotes specified server owner back to regular player.'
  },
  'removemoderator <Steam64ID>': {
    category: 'ПРАВА',
    desc: 'Remove Moderator Permissions',
    explanation: 'Demotes specified server moderator back to regular player.'
  },
  'server.writecfg': {
    category: 'ПРАВА',
    desc: 'Save Permissions to Config',
    explanation: 'Saves current active admins and moderators list to the server configuration files so they persist after reboots.'
  },
  'ban "<Имя>" "<Причина>"': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Ban Player by Username',
    explanation: 'Permanently bans a player with the specified nickname from the server.'
  },
  'banid <Steam64ID> "<Причина>"': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Ban Player by SteamID',
    explanation: 'Bans a player by Steam64ID (works even if they are currently offline).'
  },
  'unban <Steam64ID>': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Unban Player by SteamID',
    explanation: 'Pardons a banned player and restores their access to the server.'
  },
  'banlistex': {
    category: 'МОДЕРАЦИЯ',
    desc: 'View Banned Players List',
    explanation: 'Prints a complete list of all banned accounts alongside their ban reasons to the console.'
  },
  'kick "<Имя>" "<Причина>"': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Kick Player from Server',
    explanation: 'Forces player disconnect with a custom reason shown on their screen.'
  },
  'kickall "<Причина>"': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Kick All Active Players',
    explanation: 'Forces disconnect for every player currently active on the server.'
  },
  'mutevoice <Steam64ID>': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Mute Voice Chat',
    explanation: 'Restricts the selected player from transmitting voice chat.'
  },
  'unmutevoice <Steam64ID>': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Unmute Voice Chat',
    explanation: 'Restores voice chat permissions for the selected player.'
  },
  'mutechat <Steam64ID>': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Mute Text Chat',
    explanation: 'Restricts the selected player from sending text chat messages.'
  },
  'unmutechat <Steam64ID>': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Unmute Text Chat',
    explanation: 'Restores text chat permissions for the selected player.'
  },
  'status': {
    category: 'МОДЕРАЦИЯ',
    desc: 'Server Status & Active Players',
    explanation: 'Prints a detailed status report including uptime, active count, SteamID list, IP addresses, and ping (alternative: players).'
  },
  'god true': {
    category: 'РЕЖИМЫ',
    desc: 'Enable God Mode',
    explanation: 'Enables invincibility. Prevents HP loss, hunger, and dehydration (disable via "god false").'
  },
  'noclip': {
    category: 'РЕЖИМЫ',
    desc: 'Toggle Noclip Flight',
    explanation: 'Toggles flight mode, allowing you to fly and pass through solid terrain or walls.'
  },
  'heal <Число>': {
    category: 'РЕЖИМЫ',
    desc: 'Heal Yourself',
    explanation: 'Restores specified amount of health points (HP) immediately.'
  },
  'refillvitals': {
    category: 'РЕЖИМЫ',
    desc: 'Refill All Vital Stats',
    explanation: 'Instantly restores health, hunger, and hydration to 100% capacity.'
  },
  'teleport "<Имя1>" "<Имя2>"': {
    category: 'ТЕЛЕПОРТ',
    desc: 'Teleport Player to Player',
    explanation: 'Moves the first specified player directly to the location of the second player.'
  },
  'teleport2me "<Имя>"': {
    category: 'ТЕЛЕПОРТ',
    desc: 'Teleport Player to Yourself',
    explanation: 'Instantly summons the specified player to your current position.'
  },
  'teleportpos <x> <y> <z>': {
    category: 'ТЕЛЕПОРТ',
    desc: 'Teleport to Exact Coordinates',
    explanation: 'Transports your character to the precise X Y Z space coordinates on the map.'
  },
  'teleport2marker': {
    category: 'ТЕЛЕПОРТ',
    desc: 'Teleport to Map Marker',
    explanation: 'Instantly warps you to the location marked on your map (Right Click on Map screen).'
  },
  'teleportlos': {
    category: 'ТЕЛЕПОРТ',
    desc: 'Teleport to Line of Sight (LOS)',
    explanation: 'Warps you directly to the precise surface or object your crosshair is pointing at.'
  },
  'inventory.give "<Предмет>" <Кол-во>': {
    category: 'ВЫДАЧА',
    desc: 'Give Item to Yourself',
    explanation: 'Spawns the specified item in your personal inventory.',
    example: 'inventory.give "rifle.ak" 1'
  },
  'inventory.giveto "<Имя>" "<Предмет>" <Кол-во>': {
    category: 'ВЫДАЧА',
    desc: 'Give Item to Selected Player',
    explanation: 'Spawns the specified item inside the inventory of the chosen player.',
    example: 'inventory.giveto "Player1" "wood" 1000'
  },
  'inventory.giveall "<Предмет>" <Кол-во>': {
    category: 'ВЫДАЧА',
    desc: 'Give Item to All Active Players',
    explanation: 'Spawns the specified item in the inventories of all players currently connected to the server.',
    example: 'inventory.giveall "bandage" 5'
  },
  'inventory.givebp "<Предмет>"': {
    category: 'ВЫДАЧА',
    desc: 'Give Item Blueprint',
    explanation: 'Unlocks and teaches you the blueprint item recipe for crafting.',
    example: 'inventory.givebp "rifle.ak"'
  },
  'inventory.givebpall': {
    category: 'ВЫДАЧА',
    desc: 'Learn All Blueprints',
    explanation: 'Instantly unlocks every single crafting blueprint item for your character.'
  },
  'env.time <0-24>': {
    category: 'МИР',
    desc: 'Set World Time',
    explanation: 'Changes current time on the server (e.g. env.time 12 for noon, env.time 0 for midnight).'
  },
  'env.addtime <Часы>': {
    category: 'МИР',
    desc: 'Fast Forward Time',
    explanation: 'Speeds up the server time forward by the specified amount of hours.'
  },
  'weather.rain <0-1>': {
    category: 'МИР',
    desc: 'Set Rain Density',
    explanation: 'Controls server rain intensity from 0 (clear skies) to 1 (pouring rain).'
  },
  'weather.fog <0-1>': {
    category: 'МИР',
    desc: 'Set Fog Density',
    explanation: 'Controls fog intensity on the server (0 for none, 1 for dense mist).'
  },
  'weather.wind <0-1>': {
    category: 'МИР',
    desc: 'Set Wind Speed',
    explanation: 'Changes current wind strength on the server.'
  },
  'heli.call': {
    category: 'МИР',
    desc: 'Call Patrol Helicopter',
    explanation: 'Triggers the standard server-wide Patrol Helicopter event.'
  },
  'heli.calltome': {
    category: 'МИР',
    desc: 'Call Helicopter directly to Yourself',
    explanation: 'Spawns and forces the Patrol Helicopter event straight to your current coordinates.'
  },
  'bradley.quickrespawn': {
    category: 'МИР',
    desc: 'Instant Bradley APC Respawn',
    explanation: 'Instantly respawns the Bradley APC tank at the Launch Site monument.'
  },
  'supply.call': {
    category: 'МИР',
    desc: 'Call Cargo Airdrop Plane',
    explanation: 'Summons a cargo transport aircraft to deliver an airdrop crate to a random map spot (alternative: supply.drop).'
  },
  'ent kill': {
    category: 'СУЩНОСТИ',
    desc: 'Delete Highlighted Entity',
    explanation: 'Warning! Permanently destroys the target asset (wall, chest, sleeping bag, door, mini) you are looking at.'
  },
  'ent who': {
    category: 'СУЩНОСТИ',
    desc: 'Identify Entity Placer/Owner',
    explanation: 'Prints the Steam64ID and name of the player who placed or owns the targeted building block or deployable.'
  },
  'ent lock': {
    category: 'СУЩНОСТИ',
    desc: 'Force Lock/Unlock Entity Lock',
    explanation: 'Locks the targeted door or lock system instantly (unlock via "ent unlock").'
  },
  'spawn "<Сущность>"': {
    category: 'СУЩНОСТИ',
    desc: 'Spawn Game Asset / Entity',
    explanation: 'Spawns chosen entity directly in front of you (animals, barrels, scientist NPCs, etc.).',
    example: 'spawn "bear"'
  },
  'say "<Текст>"': {
    category: 'ИНФО',
    desc: 'Server Chat Broadcast',
    explanation: 'Sends a global server announcement message directly to the global text chat (highlighted in red).'
  },
  'find "<Слово>"': {
    category: 'ИНФО',
    desc: 'Search Server Commands',
    explanation: 'Helps locate specific console commands or parameters matching your keyword.'
  },
  'serverinfo': {
    category: 'ИНФО',
    desc: 'Get Detailed Server Performance Info',
    explanation: 'Displays server system status including active uptime, current tickrate FPS, allocated memory, and loaded entities.'
  },
  'sv stats': {
    category: 'ИНФО',
    desc: 'Print Player Stats Tracker',
    explanation: 'Prints a comprehensive leaderboard/statistics overview of players kills, deaths, and session uptimes.'
  }
};

// Translate Raid Weapons
export const weaponsTranslationMap: Record<string, string> = {
  c4: 'C4 (Timed Explosive Charge)',
  rocket: 'High Velocity Rocket',
  satchel: 'Satchel Charge',
  explosive_ammo: 'Explosive 5.56 Ammo (1 pc)',
  beancan: 'Beancan Grenade'
};

// Translate Raid Targets
export const targetsTranslationMap: Record<string, string> = {
  wood_wall: 'Wooden Wall / Foundation',
  stone_wall: 'Stone Wall / Foundation',
  sheet_wall: 'Sheet Metal Wall',
  armored_wall: 'Armored Wall (HQM)',
  high_stone_wall: 'High External Stone Wall',
  high_wood_wall: 'High External Wooden Wall',
  wood_door: 'Wooden Door',
  sheet_door: 'Sheet Metal Door',
  garage_door: 'Garage Door',
  armored_door: 'Armored Door (HQM)',
  tc: 'Tool Cupboard (TC)',
  auto_turret: 'Auto Turret',
  guntrap: 'Shotgun Trap (Guntrap)',
  flametrap: 'Flame Turret'
};

// Translate Error Categories
export const errorCategoryMap: Record<string, Record<'ru' | 'en', string>> = {
  all: { ru: 'Все категории', en: 'All Categories' },
  critical: { ru: 'Критические вылеты', en: 'Critical Crashes' },
  network: { ru: 'Сетевые проблемы', en: 'Network & Auth' },
  eac: { ru: 'Ошибки EAC античита', en: 'EAC Anti-Cheat' },
  graphics: { ru: 'Оптимизация и графика', en: 'Graphics & Tuning' }
};

// Translate Errors Data
export const errorsTranslationMap: Record<string, { title: string; desc: string; sols: string[] }> = {
  'Unity 2019.4.40f1_e1823a8b27f5 Crash': {
    title: 'Unity 2019.4.40f1_e1823a8b27f5 Crash',
    desc: 'A sudden crash to desktop during load or gameplay with a Unity Engine error window. Often caused by driver conflicts, unstable RAM overclock, or hardware overheating.',
    sols: [
      'Completely uninstall GPU drivers using DDU (Display Driver Uninstaller) and install the latest stable driver version.',
      'Disable Hardware Acceleration in Discord, Steam, and your web browser while playing.',
      'Delete temporary Unity cache files: clear the folder at %userprofile%\\AppData\\LocalLow\\Facepunch Studios\\Rust.',
      'Add Steam launch options: -force-vulkan or -window-mode exclusive.',
      'Reset RAM overclocking profiles (XMP/EXPO) in BIOS to test stability.'
    ]
  },
  'Зависание на этапе "Cleaning Up" / "Loading Warmup"': {
    title: 'Hanging on "Cleaning Up" / "Loading Warmup"',
    desc: 'Infinite load or complete game process freeze during the final stage of server connection ("Cleaning Up" or "Loading Warmup").',
    sols: [
      'Press Alt+Enter during loading to switch to windowed mode (reduces load on rendering threads).',
      'Open Task Manager and force close: taskkill /f /im RustClient.exe, then start again.',
      'Clear shader cache in Nvidia Control Panel / AMD Radeon Settings.',
      'Open F1 console before connecting and enter assetwarmup 0 to skip pre-loading some assets.'
    ]
  },
  'Out of Memory / Нехватка памяти при загрузке': {
    title: 'Out of Memory / Low RAM on Load',
    desc: 'Game crashes due to insufficient operating memory during map loading or asset warmup. Most common on setups with 16GB RAM or less.',
    sols: [
      'Add launch option: -gc.buffer 4096 (or 2048 if you have 8GB RAM) to increase Garbage Collection thresholds.',
      'Manually configure your Windows Pagefile: set it on an SSD with a size of 24576 - 32768 MB (24-32 GB).',
      'Close all background software consuming memory (browsers, launchers, third-party overlays).',
      'Lower "Texture Quality" in graphics options to "1" or "0".'
    ]
  },
  'Exception in Coroutine / NullReferenceException': {
    title: 'Exception in Coroutine / NullReferenceException',
    desc: 'Incompatibility between game client version and server scripts, or script errors during object spawning.',
    sols: [
      'Verify integrity of game files in Steam (Properties -> Installed Files -> Verify integrity of game files).',
      'Delete the "cfg" folder in your Rust directory (Steam\\steamapps\\common\\Rust\\cfg) to reset corrupt configs to defaults.',
      'Make sure custom system overlays (ReShade, RivaTuner, Overwolf) are fully disabled.'
    ]
  },
  'UnityPlayer.dll Access Violation (Вылет на рабочий стол)': {
    title: 'UnityPlayer.dll Access Violation (Silent Crash)',
    desc: 'The game closes suddenly without any error windows right during gameplay. Triggered when the process accesses an invalid memory address.',
    sols: [
      'Disable Discord, GeForce Experience, MSI Afterburner, and Steam overlays.',
      'Check system RAM for errors using TestMem5 or Windows Memory Diagnostic.',
      'Remove any custom CPU or GPU overclocking (undervolt/restore stock clock speeds).',
      'Run Steam as Administrator before booting Rust.'
    ]
  },
  'Зависание на этапе "Loading Asset Bundle" / "Loading Level"': {
    title: 'Freeze on "Loading Asset Bundle" / "Loading Level"',
    desc: 'Loading halts entirely at a specific asset package or level segment, and the client stops responding.',
    sols: [
      'Move the game to a solid-state drive (SSD). Running Rust on an HDD often causes load timeouts.',
      'Reset download cache in Steam settings.',
      'Add the game folder to exclusions in Windows Defender / local antivirus software.',
      'Disable other launchers (Epic Games, EA App, Ubisoft Connect) while playing.'
    ]
  },
  'Красные ошибки в консоли и углу экрана (Script Overflow)': {
    title: 'Red Console Errors in Screen Corner (Script Overflow)',
    desc: 'A sudden stream of red text on screen due to rendering exceptions in shaders, UI, or skin animation assets.',
    sols: [
      'Open console (F1) and type "graphics.hud 0" then "graphics.hud 1" to fully reload the HUD.',
      'Type "global.skinwarmup 0" in console to prevent the game from loading skins on the fly.',
      'Restart Steam and reconnect to the server.',
      'Lower visual effects and post-processing in graphics options to absolute minimum.'
    ]
  },
  'Вылет при сворачивании (Alt+Tab Fullscreen Crash)': {
    title: 'Alt+Tab Fullscreen Crash',
    desc: 'Game crashes or freezes entirely when attempting to minimize via Alt+Tab during load or active play.',
    sols: [
      'Set display mode to "Borderless/Windowed" instead of "Exclusive Fullscreen" in video settings.',
      'Ensure your Windows desktop resolution exactly matches the resolution set inside Rust.',
      'Disable "Fullscreen Optimizations" in properties of RustClient.exe.',
      'Remove third-party frame rate limiters that conflict with window focus changes.'
    ]
  },
  'Steam API Failed to Initialize': {
    title: 'Steam API Failed to Initialize',
    desc: 'Rust cannot connect to the local Steam API service. Launch halts at the very first loading frame.',
    sols: [
      'Run the Steam client as Administrator.',
      'Make sure Steam is not set to Offline Mode.',
      'Verify you are launching via the Steam Library, not directly via RustClient.exe in folder.',
      'Restart your computer and log back into your Steam account.'
    ]
  },
  'Синий экран смерти (BSOD) при запуске Rust (KMODE_EXCEPTION)': {
    title: 'Blue Screen of Death (BSOD) on Launch (KMODE_EXCEPTION)',
    desc: 'PC instantly crashes with a BSOD on booting Rust. Usually related to anti-cheat drivers or memory conflicts.',
    sols: [
      'Remove CPU, GPU, and RAM overclocking in BIOS (revert to factory defaults).',
      'Update your motherboard BIOS firmware to the latest version.',
      'Reinstall Easy Anti-Cheat (EAC) using the repair tool located in your game directory.',
      'Uninstall old virtual drivers for sound cards or macro mice.'
    ]
  },
  'Ошибка "Pagefile limit reached" (Малый файл подкачки)': {
    title: '"Pagefile limit reached" Error (Low Virtual Memory)',
    desc: 'Game aborts crash due to exhausted virtual memory pool, even on PCs with 16GB or 32GB of physical RAM.',
    sols: [
      'Increase virtual memory size (Pagefile) manually in Windows on your SSD to at least 20-25 GB.',
      'Never fully disable the Pagefile as Unity requires address reservation even on 32GB+ configurations.',
      'Free up space on your system drive C: and your game installation drive to allow virtual cache reservation.'
    ]
  },
  'Ошибка "Unsupported Graphics Card" / DirectX 12 Crash': {
    title: '"Unsupported Graphics Card" / DirectX 12 Crash',
    desc: 'Launch crash claiming the graphics card does not support the required DirectX feature level.',
    sols: [
      'Verify your GPU physically supports DirectX 11 or DirectX 12 feature levels.',
      'If playing on a laptop, ensure the game is running on the dedicated GPU (Nvidia/AMD), not the integrated processor core.',
      'Install the latest DirectX runtime packages via official Microsoft web setup.'
    ]
  },
  'Steam Auth Timeout': {
    title: 'Steam Auth Timeout',
    desc: 'Authorization failure through Steam API due to Steam backend downtime, package loss, or unstable routing.',
    sols: [
      'Restart Steam completely via Task Manager or the Exit menu option.',
      'Clear Steam download cache (Settings -> Downloads -> Clear download cache).',
      'Use Cloudflare WARP 1.1.1.1 or VPN to route connection through different Facepunch auth paths.',
      'Flush DNS and reset winsock: run cmd as admin, type "ipconfig /flushdns" and "netsh winsock reset".',
      'Check Steam server status (Steam servers frequently go down for maintenance on Tuesdays/Wednesdays).'
    ]
  },
  'Disconnected: EAC Sandbox Violation': {
    title: 'Disconnected: EAC Sandbox Violation',
    desc: 'Kicked from server due to anti-cheat sandbox compromise, usually triggered by background services blocking the EAC service.',
    sols: [
      'Ensure you launch the game via Steam, not directly via RustClient.exe in your directories.',
      'Temporarily disable Windows Defender or other antivirus that could trigger false positives on EAC files.',
      'Close software that emulates gamepads, macros, or virtual systems (e.g. vJoy, Cheat Engine, Process Hacker).',
      'Disable Core Isolation / Memory Integrity in Windows Defender security options.'
    ]
  },
  'Disconnected: RPC Error in...': {
    title: 'Disconnected: RPC Error',
    desc: 'Disconnected due to Remote Procedure Call data sync mismatch. Often caused by high packet loss or outdated game patch.',
    sols: [
      'Ensure your Rust client is updated to the latest version in Steam.',
      'Avoid gaming over unstable Wi-Fi; connect via a wired LAN cable to eliminate packet loss.',
      'Restart your home router/modem (power cycle for 30 seconds).'
    ]
  },
  'Disconnected: Connection Attempt Failed': {
    title: 'Disconnected: Connection Attempt Failed',
    desc: 'Failed to connect to game server. Client cannot establish a stable UDP/TCP handshaking protocol with host.',
    sols: [
      'Allow Rust port (default 28015) in your Windows Firewall outbound rules.',
      'Verify your ISP is not blocking UDP gaming protocols.',
      'Connect directly via F1 console: "client.connect IP:PORT".',
      'Restart network router and pause any background torrent downloads.'
    ]
  },
  'Disconnected: Packet Flooding / Client Flooding': {
    title: 'Disconnected: Packet Flooding / Client Flooding',
    desc: 'Kicked by server firewall because your client is transmitting an abnormally high volume of network requests.',
    sols: [
      'Turn off high-speed autoclickers, macro boards, or buy-bind scripts.',
      'Stabilize your latency. Sudden lag spikes store up packets and fire them simultaneously, triggering flooding protection.',
      'Cap network traffic in console (F1): "net.limit 100".',
      'Swap wireless Wi-Fi for a stable Ethernet LAN connection.'
    ]
  },
  'Timed out waiting for steam/response': {
    title: 'Timed out waiting for steam/response',
    desc: 'Client lost connection to Steam verification network while loading or active on a server.',
    sols: [
      'Exit Steam, restart it, and verify your connection status is Online.',
      'Disable Steam Family Sharing if playing on a shared account.',
      'Verify your Steam Download Region matches your actual geographical location.',
      'Connect directly using the F1 console: "client.connect IP:PORT".'
    ]
  },
  'Disconnected: Flyhack Violation / Flyhack Kick': {
    title: 'Disconnected: Flyhack Violation / Flyhack Kick',
    desc: 'The server kicked you because the anti-cheat system detected illegal flight or jump vectors, usually triggered by lag, desync, or sliding down cliffs.',
    sols: [
      'Avoid sliding along irregular rock formations or cliff edges during lag spikes.',
      'Do not stand on top of open garage doors or dynamic elevator platforms during server lag.',
      'If your network ping is extremely high, reconnect to a closer region with lower latency.'
    ]
  },
  'Disconnected: Packet Loss / High Ping Desync': {
    title: 'Disconnected: Packet Loss / High Ping Desync',
    desc: 'Kicked due to extreme packet loss. The server stopped receiving position synchronization frames from your client.',
    sols: [
      'Plug in a physical LAN cable instead of using Wi-Fi.',
      'Disable cloud synchronization, game downloads, or background video streaming.',
      'Run a speedtest to check your jitter and packet loss to regional servers.'
    ]
  },
  'Disconnected: Steam ticket is invalid': {
    title: 'Disconnected: Steam ticket is invalid',
    desc: 'Your Steam login token has expired or is invalid. Often occurs if your steam account is logged in elsewhere.',
    sols: [
      'Completely close Steam, log out of your profile, and log back in.',
      'Ensure nobody else is accessing your Steam library at the moment.',
      'Verify your system clock is fully synchronized with internet time.'
    ]
  },
  'Disconnected: Protocol version mismatch': {
    title: 'Disconnected: Protocol version mismatch',
    desc: 'The server protocol version does not match your client version. The server or your client needs an update.',
    sols: [
      'Restart Steam to trigger the latest Rust update queue.',
      'If the game updated recently, wait a few minutes for your favorite server to update to the same version.'
    ]
  },
  'EAC Error 30005: CreateFile Failed with 32': {
    title: 'EAC Error 30005: CreateFile Failed with 32',
    desc: 'Easy Anti-Cheat service cannot start because a key service file is locked by another process (antivirus or system lock).',
    sols: [
      'Restart your PC. This unlocks files held by stale background services.',
      'Disable Windows Defender real-time protection temporarily to check if it blocks the driver.',
      'Delete the "EasyAntiCheat.sys" file located inside "C:\\Program Files (x86)\\EasyAntiCheat" and let Rust repair it on launch.'
    ]
  },
  'EAC Error 10011 / 20006: Failed to initialize / Driver load error': {
    title: 'EAC Error 10011 / 20006: Failed to initialize',
    desc: 'The Easy Anti-Cheat service failed to load its kernel-level driver due to system permission blocks.',
    sols: [
      'Open the "EasyAntiCheat" folder in your Rust installation folder and run "EasyAntiCheat_Setup.exe" as Admin to repair it.',
      'Enable "EasyAntiCheat" service in Windows Services (services.msc) and set Startup type to Manual.',
      'Uninstall third-party antivirus software like Avast, AVG, or Kaspersky which lock kernel driver registrations.'
    ]
  },
  'Untrusted System File (e.g., d3d11.dll, dxgi.dll)': {
    title: 'Untrusted System File Error',
    desc: 'EAC blocks launch because a system DLL has failed integrity checks or is modified (by injectors, ReShade, or custom themes).',
    sols: [
      'Uninstall ReShade, SweetFX, or any other graphics injectors from your Rust folder.',
      'Run command prompt (cmd) as Admin and execute "sfc /scannow" to restore corrupt Windows system files.',
      'Make sure you do not have any active game trainers or memory modifiers running.'
    ]
  },
  'Easy Anti-Cheat is not installed': {
    title: 'Easy Anti-Cheat is not installed',
    desc: 'Rust fails to launch because the required Easy Anti-Cheat service is fully missing from the system registrations.',
    sols: [
      'Go to the game directory, enter the "EasyAntiCheat" folder, and run "EasyAntiCheat_Setup.exe" to perform a clean install.',
      'Verify Rust files in Steam to redownload any missing anti-cheat executables.'
    ]
  },
  'EAC: Integrity Check Failed': {
    title: 'EAC: Integrity Check Failed',
    desc: 'The anti-cheat service detected modified or corrupted game binaries or assets.',
    sols: [
      'Verify integrity of Rust files through Steam library.',
      'Delete the "RustClient_Data" folder and verify files to force a clean download of essential assets.'
    ]
  },
  'Disconnected: EAC Peer to Peer authentication failed': {
    title: 'EAC Peer to Peer authentication failed',
    desc: 'Failed to establish secure peer-to-peer validation between your client and the server.',
    sols: [
      'Restart both Rust and Steam completely.',
      'Check if your router firewall blocks P2P network traffic.',
      'Flush DNS and reset network adapter parameters.'
    ]
  },
  'EAC Error: Game Security Violation Detected': {
    title: 'EAC Error: Game Security Violation Detected',
    desc: 'Easy Anti-Cheat closed the game because a blacklisted process (debugging tools, macros, lighting control software) was active.',
    sols: [
      'Close RGB lighting tools (RGB Fusion, ASUS Aura, Corsair iCUE) which use vulnerable drivers.',
      'Disable macro execution software in mouse utilities.',
      'Check Task Manager for debugging utilities and kill them.'
    ]
  },
  'EAC Error: Certificate verification failed': {
    title: 'EAC Error: Certificate verification failed',
    desc: 'EAC could not verify the digital certificates of game assets due to network routing or missing SSL updates.',
    sols: [
      'Run Windows Update to install the latest Root Certificate updates.',
      'Ensure your system clock is accurate.',
      'Disable custom DNS servers and revert to automatic ISP configuration.'
    ]
  },
  'EAC Error: Driver signature enforcement disabled': {
    title: 'Driver signature enforcement disabled',
    desc: 'Easy Anti-Cheat blocks launch because Windows Driver Signature Enforcement is turned off, which is a major exploit window.',
    sols: [
      'Open Command Prompt as Admin and run: "bcdedit -set TESTSIGNING OFF" and "bcdedit -set NOINTEGRITYCHECKS OFF".',
      'Restart your computer to apply secure kernel verification modes.'
    ]
  },
  'Direct3D Device Lost / Graphics Device Removed': {
    title: 'Direct3D Device Lost / GPU Removed',
    desc: 'The game engine lost communication with your graphics card. This occurs if your GPU drivers crash under heavy loads or when a hardware overclock is unstable.',
    sols: [
      'Lower your in-game graphics quality, specifically "Texture Quality" and "Shadow Quality".',
      'Reset any custom GPU core or memory overclock using MSI Afterburner.',
      'Increase the TDR delay (Timeout Detection and Recovery) in Windows Registry if the crash repeats under high loads.'
    ]
  },
  'Черный экран при запуске игры': {
    title: 'Black Screen on Launch',
    desc: 'Rust boots into a permanent black screen. Typically a video mode resolution conflict or audio output bug.',
    sols: [
      'Force windowed mode by adding "-window-mode borderless" to Steam launch options.',
      'Disconnect external VR headsets or duplicate monitor cables.',
      'Update your graphics card drivers.'
    ]
  },
  'Stuttering on Mouse Movement (Фризы при поворотах камеры)': {
    title: 'Stuttering on Mouse Movement',
    desc: 'Severe framerate stuttering and lag spikes occurring only when turning the camera/moving your mouse.',
    sols: [
      'Lower your mouse Polling Rate from 1000Hz/8000Hz to 500Hz or 250Hz in your mouse driver software.',
      'Disable raw input options in game menus or check overlay hooks.'
    ]
  },
  'Vulkan driver not found / DX11 interface error': {
    title: 'Vulkan Driver Not Found',
    desc: 'The engine cannot initialize Vulkan API or DirectX 11. Drivers are corrupt or missing.',
    sols: [
      'Perform a clean install of the latest Nvidia/AMD drivers.',
      'Remove "-force-vulkan" from Steam launch options if you had it on.'
    ]
  },
  'Низкий FPS на мощных ПК / Плохая загрузка GPU': {
    title: 'Low FPS on High-End PCs',
    desc: 'Rust runs at poor frame rates and GPU usage remains low (under 50%), meaning CPU bottlenecking or bad thread utilization.',
    sols: [
      'Enable "Smt" or "Hyper-Threading" in BIOS to ensure all cores are active.',
      'Increase graphics settings (Texture Quality, Shadows) to shift load from CPU to GPU.',
      'Use performance launch options like "-high" to prioritize threads.'
    ]
  },
  'Размытое изображение / Сильное мыло на экране': {
    title: 'Blurry Image / Heavy Antialiasing',
    desc: 'The screen looks heavily blurred, making it hard to see enemies at distance.',
    sols: [
      'Disable "Depth of Field" and "Motion Blur" in your graphics menu.',
      'Change Anti-Aliasing from "TSSAA" to "SMAA" or turn it off entirely.'
    ]
  },
  'Пропадание текстур и прозрачные стены': {
    title: 'Missing Textures / Transparent Walls',
    desc: 'Game textures fail to load, resulting in invisible walls, grounds, or structures. Usually SSD read error.',
    sols: [
      'Verify integrity of files on Steam.',
      'Move the game files to a high-speed SSD. HDD reading is too slow.'
    ]
  },
  'Зависание игры при первом выстреле или взрыве': {
    title: 'Screen Freeze on First Gunshot or Explosion',
    desc: 'A severe stutter or 1-2 second freeze the very first time a gun is fired or an explosion goes off in a session.',
    sols: [
      'Turn off any active RAM-cleaning utilities.',
      'Pre-load weapon skins and asset effects using "global.skinwarmup 1" in console.',
      'Move the game to SSD.'
    ]
  },
  'Сброс настроек графики и управления после перезапуска': {
    title: 'Settings Reset on Restart',
    desc: 'All custom keybinds and graphic options reset to default values every time Rust is relaunched.',
    sols: [
      'Ensure the game directory and "cfg" folder are not marked "Read-only" in file properties.',
      'Run Steam as Administrator to allow configuration saving.'
    ]
  }
};

export const weaponTranslationMap: Record<string, Record<'ru' | 'en', string>> = {
  c4: { ru: 'C4 (Таймерная взрывчатка)', en: 'C4 (Timed Explosive)' },
  rocket: { ru: 'Боевая ракета', en: 'Rocket' },
  satchel: { ru: 'Сачель (Сумка со взрывчаткой)', en: 'Satchel Charge' },
  explosive_ammo: { ru: 'Разрывной патрон 5.56 (1 шт)', en: '5.56 Explosive Ammo (1 pc)' },
  beancan: { ru: 'Бобовая граната', en: 'Beancan Grenade' }
};

export const targetTranslationMap: Record<string, Record<'ru' | 'en', string>> = {
  wood_wall: { ru: 'Деревянная стена/фундамент', en: 'Wooden Wall / Foundation' },
  stone_wall: { ru: 'Каменная стена/фундамент', en: 'Stone Wall / Foundation' },
  sheet_wall: { ru: 'Металлическая стена', en: 'Sheet Metal Wall' },
  armored_wall: { ru: 'Бронированная стена (МВК)', en: 'Armored Wall (HQM)' },
  high_stone_wall: { ru: 'Высокая каменная стена', en: 'High External Stone Wall' },
  high_wood_wall: { ru: 'Высокая деревянная стена', en: 'High External Wooden Wall' },
  wood_door: { ru: 'Деревянная дверь', en: 'Wooden Door' },
  sheet_door: { ru: 'Железная дверь (Листовой металл)', en: 'Sheet Metal Door' },
  garage_door: { ru: 'Гаражная дверь', en: 'Garage Door' },
  armored_door: { ru: 'Бронированная дверь (МВК)', en: 'Armored Door (HQM)' },
  tc: { ru: 'Шкаф с инструментами (TC)', en: 'Tool Cupboard (TC)' },
  auto_turret: { ru: 'Авто-турель', en: 'Auto Turret' },
  guntrap: { ru: 'Дробовик-ловушка (Guntrap)', en: 'Shotgun Trap (Guntrap)' },
  flametrap: { ru: 'Огнеметная турель', en: 'Flame Turret' }
};

export const fpsTranslationMap: Record<string, Record<'ru' | 'en', string>> = {
  title: {
    ru: 'Ультимативная Оптимизация Производительности Rust',
    en: 'Ultimate Rust Performance Optimization'
  },
  desc: {
    ru: 'Комплексный гайд по увеличению FPS, устранению микрофризов и минимизации задержки ввода (Input Lag) на любой конфигурации компьютера от лидера клана [EAC].',
    en: 'A comprehensive guide to boosting FPS, resolving microstutters, and minimizing Input Lag on any computer configuration, curated by the clan leader of [EAC].'
  },
  generatorTitle: {
    ru: '1. Умный генератор параметров запуска Steam',
    en: '1. Smart Steam Launch Parameters Generator'
  },
  generatorDesc: {
    ru: 'Выберите объем оперативной памяти вашего компьютера, чтобы сгенерировать оптимальные параметры выделения памяти и буферизации для движка Unity.',
    en: 'Choose your computer\'s RAM size to generate optimal memory allocation and buffering parameters for the Unity engine.'
  },
  ramLabel: {
    ru: 'ОЗУ / RAM',
    en: 'RAM'
  },
  generatedLabel: {
    ru: 'Сгенерированная строка параметров:',
    en: 'Generated launch parameter string:'
  },
  howToInsert: {
    ru: 'Куда вставить?',
    en: 'Where to insert?'
  },
  howToInsertDesc: {
    ru: 'Откройте Steam → Библиотека → Правый клик на Rust → Свойства → Вкладка "Общие" → Поле "Параметры запуска".',
    en: 'Open Steam &rarr; Library &rarr; Right click on Rust &rarr; Properties &rarr; "General" tab &rarr; "Launch Options" field.'
  },
  consoleCommandsTitle: {
    ru: '2. Оптимизирующие консольные команды (F1 Console)',
    en: '2. Optimizing Console Commands (F1 Console)'
  },
  consoleCommandsDesc: {
    ru: 'Кликните по любой команде, чтобы скопировать её. Рекомендуется ввести их один раз в консоли игры для отключения тяжелых визуальных эффектов.',
    en: 'Click on any command to copy it. It is recommended to enter them once in the in-game console to disable demanding visual effects.'
  },
  windowsTitle: {
    ru: '3. Настройки операционной системы Windows',
    en: '3. Windows Operating System Settings'
  },
  windowsTweak1Title: {
    ru: 'Включите планирование графического процессора (HAGS)',
    en: 'Enable Hardware-Accelerated GPU Scheduling (HAGS)'
  },
  windowsTweak1Desc: {
    ru: 'В Windows откройте Настройки -> Система -> Дисплей -> Настройки графики. Включите пункт "Планирование графического процессора с аппаратным ускорением". Перезагрузите ПК. Снижает нагрузку на CPU в Rust.',
    en: 'In Windows, open Settings -> System -> Display -> Graphics settings. Turn on "Hardware-accelerated GPU scheduling". Restart your PC. Reduces CPU bottlenecking in Rust.'
  },
  windowsTweak2Title: {
    ru: 'Настройте файл подкачки (Обязательно на SSD)',
    en: 'Configure Pagefile (Mandatory on SSD)'
  },
  windowsTweak2Desc: {
    ru: 'Не выключайте файл подкачки, даже если у вас 32 ГБ ОЗУ! Установите для системного SSD диска (где установлена игра) размер виртуальной памяти вручную: минимум 20480 МБ, максимум 30720 МБ.',
    en: 'Do not disable the pagefile, even if you have 32 GB RAM! Set the virtual memory size for your system SSD manually: minimum 20480 MB, maximum 30720 MB.'
  },
  windowsTweak3Title: {
    ru: 'Активируйте игровой режим (Game Mode)',
    en: 'Activate Game Mode'
  },
  windowsTweak3Desc: {
    ru: 'Зайдите в Параметры Windows -> Игры -> Игровой режим. Переведите тумблер в активное положение. Это запретит сторонним обновлениям фоновых приложений мешать игре.',
    en: 'Go to Windows Settings -> Gaming -> Game Mode. Toggle the switch to "On". This prevents background apps or Windows Updates from interrupting your session.'
  }
};

export const f1CommandsTranslationMap: Record<string, { desc: Record<'ru' | 'en', string>; impact: Record<'ru' | 'en', string>; reason: Record<'ru' | 'en', string> }> = {
  'graphics.shadowmode 0': {
    desc: { ru: 'Полное отключение динамических теней', en: 'Disable dynamic shadows completely' },
    impact: { ru: 'До +15% FPS', en: 'Up to +15% FPS' },
    reason: { ru: 'Тени в Rust отнимают огромное количество вычислительной мощности видеокарты и процессора.', en: 'Shadows in Rust consume huge amounts of CPU and GPU rendering throughput.' }
  },
  'global.freezes 0': {
    desc: { ru: 'Отключение системного замерзания интерфейса', en: 'Disable UI frame freezes' },
    impact: { ru: 'Убирает фризы', en: 'Prevents freezes' },
    reason: { ru: 'Предотвращает мелкие зависания игры во время резких экшн-сцен или загрузки элементов окружения.', en: 'Prevents micro-stutters during heavy combat action scenes or raw asset streaming.' }
  },
  'client.lookatradius 0': {
    desc: { ru: 'Ускорение рендеринга объектов при наведении', en: 'Optimize interactive object hover radius' },
    impact: { ru: 'До +5% FPS', en: 'Up to +5% FPS' },
    reason: { ru: 'Уменьшает радиус детальной прорисовки объектов перед глазами, снижая нагрузку на процессор.', en: 'Reduces the precision trace sphere for looking at objects, saving valuable CPU cycles.' }
  },
  'physics.steps 60': {
    desc: { ru: 'Синхронизация физического движка с частотой сервера', en: 'Sync physics engine rate with tickrate' },
    impact: { ru: 'Стабильность', en: 'Stability' },
    reason: { ru: 'Помогает плавнее преодолевать преграды, паркурить и избавляет от телепортаций назад.', en: 'Enables smoother traversal over terrain obstacles, climbing, and eliminates rubberbanding.' }
  },
  'grass.displacement 0': {
    desc: { ru: 'Отключение приминания травы ногами', en: 'Disable grass bending on footsteps' },
    impact: { ru: 'До +3% FPS', en: 'Up to +3% FPS' },
    reason: { ru: 'Трава больше не будет динамически рассчитывать коллизию с моделями игроков.', en: 'Grass blades will no longer run dynamic collision calculations against players.' }
  },
  'decor.quality 0': {
    desc: { ru: 'Качество декораций (мелкие камушки, кусты)', en: 'Decorative ground details quality' },
    impact: { ru: 'До +7% FPS', en: 'Up to +7% FPS' },
    reason: { ru: 'Отключает рендеринг миллионов мелких бесполезных 3D-объектов на земле.', en: 'Disables rendering of millions of microscopic stones, sticks, and ground clutter.' }
  },
  'playercull.enabled true': {
    desc: { ru: 'Включение скрытия дальних моделей игроков', en: 'Enable distance player model culling' },
    impact: { ru: 'До +10% FPS', en: 'Up to +10% FPS' },
    reason: { ru: 'Игра перестает рендерить игроков, находящихся вне вашего поля зрения или слишком далеко.', en: 'Stops rendering players that are far outside your visual sector or obscured by landscape.' }
  },
  'playercull.maxdist 50': {
    desc: { ru: 'Уменьшение дистанции прорисовки невидимых игроков', en: 'Reduce hidden player render distance' },
    impact: { ru: 'Оптимизация ЦП', en: 'CPU Optimization' },
    reason: { ru: 'В связке с playercull убирает лаги в крупных клановых баталиях на рейде.', en: 'Combined with playercull, significantly minimizes CPU frame-time spikes during large raid encounters.' }
  }
};
