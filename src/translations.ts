import { APP_VERSION } from './types';

export const uiTranslations: Record<string, Record<'ru' | 'en', string>> = {
  logoSub: {
    ru: `SUVIVAL KIT ${APP_VERSION} • CLAN [EAC]`,
    en: `SURVIVAL KIT ${APP_VERSION} • CLAN [EAC]`
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
  'АДМИН': { ru: 'Администраторские', en: 'Administrator' },
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
  // Player binds
  'bind x forward;sprint': { category: 'УПРАВЛЕНИЕ', desc: 'Auto-run', explanation: 'Starts continuous forward movement and sprinting until normal movement input overrides it.' },
  'bind z duck': { category: 'УПРАВЛЕНИЕ', desc: 'Toggle crouch', explanation: 'Toggles crouching on each press.' },
  'bind [leftshift+k] kill': { category: 'УПРАВЛЕНИЕ', desc: 'Quick respawn / suicide', explanation: 'Kills your character and opens the respawn screen. You will drop carried items.' },
  'bind [leftshift+f11] attack': { category: 'УПРАВЛЕНИЕ', desc: 'Continuous primary attack', explanation: 'Starts continuous primary attack. Use your normal attack input to stop it.' },
  'bind leftalt +altlook': { category: 'PVP', desc: 'Free look', explanation: 'Look around without changing your movement direction.' },
  'bind mouse1 "+attack2;+input.sensitivity .45;input.sensitivity .2"': { category: 'PVP', desc: 'Lower sensitivity while aiming', explanation: 'Changes mouse sensitivity while aiming. Adjust .45 and .2 to suit your normal sensitivity.' },
  'bind mouse3 +lighttoggle;+attack2': { category: 'PVP', desc: 'Aim and toggle weapon light', explanation: 'Assigns aiming and weapon light or laser toggle to a side mouse button.' },
  'bind [rightshift+f11] attack;duck': { category: 'PVP', desc: 'Attack while crouching', explanation: 'Runs primary attack and crouch together.' },
  'bind h "craft.add -2072273936 1"': { category: 'МЕДИЦИНА', desc: 'Queue one bandage', explanation: 'Adds one medical bandage to the crafting queue. Required resources must be available.' },
  'bind mousewheelup "craft.add -2072273936 2"': { category: 'МЕДИЦИНА', desc: 'Queue two bandages', explanation: 'Adds two medical bandages to the crafting queue when scrolling up.' },
  'bind mouse4 +buttons.hoverloot': { category: 'ФАРМ', desc: 'Quick loot transfer', explanation: 'Hold the key and hover over items in an open inventory to transfer them quickly.' },
  'bind f1 consoletoggle;combatlog': { category: 'QOL', desc: 'Console with CombatLog', explanation: 'Toggles the console and displays the combat log.' },
  'bind f10 client.disconnect': { category: 'QOL', desc: 'Quick disconnect', explanation: 'Disconnects from the current server. Avoid assigning this to a key you press accidentally.' },
  'bind 7 chat.say "Hello everyone!"': { category: 'QOL', desc: 'Global chat message', explanation: 'Sends the configured text to global chat. Replace the sample message with your own.' },
  'bind 8 chat.teamsay "Hey Team!!"': { category: 'QOL', desc: 'Team chat message', explanation: 'Sends the configured text to your team chat. Replace the sample message with your own.' },
  'bind rightarrow ~graphics.vm_horizontal_flip 0;graphics.vm_horizontal_flip 1': { category: 'QOL', desc: 'Switch weapon viewmodel side', explanation: 'Cycles the held item viewmodel between its normal and horizontally flipped positions.' },
  'bind mouse2 +meta.if_true "fov 70";+meta.if_false "fov 80"': { category: 'QOL', desc: 'Hold-to-zoom', explanation: 'Sets FOV to 70 while held and returns it to 80 when released. Adjust both values to your preference.' },

  // Administrator keybinds — require appropriate server permissions
  'bind [leftshift+h] debugcamera': { category: 'АДМИН', desc: 'Free admin camera', explanation: 'Enables debugcamera for observing the world. It does not make your player character invisible.' },
  'bind [leftshift+t] teleport2marker': { category: 'АДМИН', desc: 'Teleport to map marker', explanation: 'Moves the administrator to the marker placed on the map.' },
  'bind p "ent kill"': { category: 'АДМИН', desc: 'Remove targeted entity', explanation: 'Deletes the entity under your crosshair. Use carefully; the action may be irreversible.' },
  'bind u "ent unlock"': { category: 'АДМИН', desc: 'Unlock targeted lock', explanation: 'Unlocks the selected lock.' },
  'bind l "ent lock"': { category: 'АДМИН', desc: 'Lock targeted lock', explanation: 'Locks the selected lock.' },
  'bind j noclip': { category: 'АДМИН', desc: 'Toggle noclip', explanation: 'Enables or disables noclip. Administrator permissions are required.' },
  'bind delete "layer.toggle Construction"': { category: 'АДМИН', desc: 'Toggle building layer', explanation: 'Toggles the Construction layer in administrator tools.' },
  'bind [leftshift+rightcontrol] "weather.load clear"': { category: 'АДМИН', desc: 'Clear server weather', explanation: 'Loads clear weather on the server. Administrator permissions are required.' }
};

export const weaponsTranslationMap: Record<string, string> = {
  c4: 'C4 (Timed Explosive Charge)',
  rocket: 'High Velocity Rocket',
  satchel: 'Satchel Charge',
  explosive_ammo: 'Explosive 5.56 Ammo (1 pc)',
  beancan: 'Beancan Grenade',
  propane: 'Propane Explosive Bomb',
  mlrs: 'MLRS Rocket'
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
  explosive_ammo: { ru: 'Разрывной патрон 5.56 (1 шт.)', en: '5.56 Explosive Ammo (1 round)' },
  beancan: { ru: 'Бобовая граната', en: 'Beancan Grenade' },
  propane: { ru: 'Пропановая бомба', en: 'Propane Explosive Bomb' },
  mlrs: { ru: 'Ракета MLRS', en: 'MLRS Rocket' },
  f1_grenade: { ru: 'Граната F1', en: 'F1 Grenade' },
  landmine: { ru: 'Самодельная мина', en: 'Homemade Landmine' },
  molotov: { ru: 'Коктейль Молотова', en: 'Molotov Cocktail' },
  hv_rocket: { ru: 'Скоростная ракета (HV)', en: 'High Velocity Rocket' }
};

export const targetTranslationMap: Record<string, Record<'ru' | 'en', string>> = {
  wood_wall: { ru: 'Деревянная стена / фундамент', en: 'Wood Wall / Foundation' },
  stone_wall: { ru: 'Каменная стена / фундамент', en: 'Stone Wall / Foundation' },
  sheet_wall: { ru: 'Металлическая стена', en: 'Sheet Metal Wall' },
  armored_wall: { ru: 'Бронированная стена (МВК)', en: 'Armored Wall (HQM)' },
  wood_floor: { ru: 'Деревянный пол / потолок', en: 'Wood Floor / Ceiling' },
  stone_floor: { ru: 'Каменный пол / потолок', en: 'Stone Floor / Ceiling' },
  sheet_floor: { ru: 'Металлический пол / потолок', en: 'Sheet Metal Floor / Ceiling' },
  armored_floor: { ru: 'Бронированный пол / потолок', en: 'Armored Floor / Ceiling' },
  high_stone_wall: { ru: 'Высокая внешняя каменная стена', en: 'High External Stone Wall' },
  high_wood_wall: { ru: 'Высокая внешняя деревянная стена', en: 'High External Wooden Wall' },
  wood_gate: { ru: 'Деревянные внешние ворота', en: 'External Wooden Gate' },
  stone_gate: { ru: 'Каменные внешние ворота', en: 'External Stone Gate' },
  wood_window_bars: { ru: 'Деревянная оконная решётка', en: 'Wooden Window Bars' },
  sheet_window_bars: { ru: 'Металлическая оконная решётка', en: 'Metal Window Bars' },
  armored_window_bars: { ru: 'Бронированная оконная решётка', en: 'Armored Window Bars' },
  reinforced_glass_window: { ru: 'Укреплённое стеклянное окно', en: 'Reinforced Glass Window' },
  strengthened_glass_window: { ru: 'Усиленное стеклянное окно', en: 'Strengthened Glass Window' },
  metal_embrasure: { ru: 'Металлическая бойница', en: 'Metal Embrasure' },
  chain_link_fence: { ru: 'Сетчатое ограждение', en: 'Chain Link Fence' },
  wood_door: { ru: 'Деревянная дверь', en: 'Wooden Door' },
  double_wood_door: { ru: 'Двойная деревянная дверь', en: 'Double Wooden Door' },
  sheet_door: { ru: 'Железная дверь (листовой металл)', en: 'Sheet Metal Door' },
  double_sheet_door: { ru: 'Двойная металлическая дверь', en: 'Double Sheet Metal Door' },
  garage_door: { ru: 'Гаражная дверь', en: 'Garage Door' },
  armored_door: { ru: 'Бронированная дверь (МВК)', en: 'Armored Door (HQM)' },
  double_armored_door: { ru: 'Двойная бронированная дверь', en: 'Double Armored Door' },
  armored_hatch: { ru: 'Бронированный люк', en: 'Armored Hatch' },
  ladder_hatch: { ru: 'Люк с лестницей', en: 'Ladder Hatch' },
  tc: { ru: 'Шкаф с инструментами (TC)', en: 'Tool Cupboard (TC)' },
  auto_turret: { ru: 'Автоматическая турель', en: 'Auto Turret' },
  guntrap: { ru: 'Дробовик-ловушка (Guntrap)', en: 'Shotgun Trap (Guntrap)' },
  flametrap: { ru: 'Огнемётная турель', en: 'Flame Turret' },
  floor_grill: { ru: 'Решётчатый настил', en: 'Floor Grill' },
  metal_shop_front: { ru: 'Металлическая витрина магазина', en: 'Metal Shop Front' },
  vending_machine: { ru: 'Торговый автомат', en: 'Vending Machine' }
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
