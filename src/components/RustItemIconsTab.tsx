import React, { useState, useEffect } from 'react';
import { Search, Copy, Check, Download, Folder, Code, Terminal, Image as ImageIcon, ExternalLink, ShieldCheck, Cpu, Database, HardDrive, RefreshCw, Trash2, Zap } from 'lucide-react';
import { ItemImageOrFallback, getIconCache, clearIconCache, getRustLabsIconUrls, cacheImageAsBase64 } from './IconUtils';

interface RustItemIconsTabProps {
  lang: 'ru' | 'en';
}

const COMMON_RUST_ITEMS = [
  { shortname: 'rifle.ak', id: 'ak47', name: { ru: 'Штурмовая винтовка (AK-47)', en: 'Assault Rifle (AK-47)' }, category: 'weapons' },
  { shortname: 'rifle.lr300', id: 'lr300', name: { ru: 'Винтовка LR-300', en: 'LR-300 Assault Rifle' }, category: 'weapons' },
  { shortname: 'smg.mp5', id: 'mp5', name: { ru: 'Пистолет-пулемет MP5A4', en: 'MP5A4 SMG' }, category: 'weapons' },
  { shortname: 'smg.thompson', id: 'thompson', name: { ru: 'Автомат Томпсона', en: 'Thompson SMG' }, category: 'weapons' },
  { shortname: 'smg.2', id: 'custom', name: { ru: 'Самодельный ПП', en: 'Custom SMG' }, category: 'weapons' },
  { shortname: 'rifle.semiauto', id: 'sar', name: { ru: 'Полуавтоматическая винтовка (SAR)', en: 'Semi-Automatic Rifle' }, category: 'weapons' },
  { shortname: 'lmg.m249', id: 'm249', name: { ru: 'Пулемет M249', en: 'M249 Light Machine Gun' }, category: 'weapons' },
  { shortname: 'hmlmg', id: 'hmlmg', name: { ru: 'Тяжелый пулемет HMLMG', en: 'HMLMG Light Machine Gun' }, category: 'weapons' },
  { shortname: 'rifle.bolt', id: 'bolt', name: { ru: 'Болтовая винтовка (Bolt)', en: 'Bolt Action Rifle' }, category: 'weapons' },
  { shortname: 'rifle.l96', id: 'l96', name: { ru: 'Снайперская винтовка L96', en: 'L96 Rifle' }, category: 'weapons' },
  { shortname: 'shotgun.pump', id: 'pump_shotgun', name: { ru: 'Помповый дробовик', en: 'Pump Shotgun' }, category: 'weapons' },
  { shortname: 'shotgun.double', id: 'double_barrel', name: { ru: 'Двустволка', en: 'Double Barrel Shotgun' }, category: 'weapons' },
  { shortname: 'pistol.m92', id: 'm92', name: { ru: 'Пистолет M92', en: 'M92 Pistol' }, category: 'weapons' },
  { shortname: 'pistol.python', id: 'python', name: { ru: 'Револьвер Питон', en: 'Python Revolver' }, category: 'weapons' },
  { shortname: 'pistol.semiauto', id: 'sap', name: { ru: 'P250 / SAP', en: 'Semi-Automatic Pistol' }, category: 'weapons' },
  { shortname: 'crossbow', id: 'crossbow', name: { ru: 'Арбалет', en: 'Crossbow' }, category: 'weapons' },

  // Explosives & Raids
  { shortname: 'timed.explosive', id: 'c4', name: { ru: 'Заряд взрывчатки (C4)', en: 'Timed Explosive Charge' }, category: 'explosives' },
  { shortname: 'ammo.rocket.basic', id: 'rocket', name: { ru: 'Ракета', en: 'Rocket' }, category: 'explosives' },
  { shortname: 'explosive.satchel', id: 'satchel', name: { ru: 'Сумка со взрывчаткой', en: 'Satchel Charge' }, category: 'explosives' },
  { shortname: 'ammo.rifle.explosive', id: 'explosive_ammo', name: { ru: 'Разрывные патроны 5.56', en: 'Explosive 5.56 Rifle Ammo' }, category: 'explosives' },
  { shortname: 'grenade.beancan', id: 'beancan', name: { ru: 'Бобовая граната', en: 'Beancan Grenade' }, category: 'explosives' },

  // Construction & Deployables
  { shortname: 'wall.external.high.stone', id: 'high_stone_wall', name: { ru: 'Высокие каменные стены', en: 'High External Stone Wall' }, category: 'construction' },
  { shortname: 'door.hinged.wood', id: 'wood_door', name: { ru: 'Деревянная дверь', en: 'Wooden Door' }, category: 'construction' },
  { shortname: 'door.hinged.metal', id: 'sheet_door', name: { ru: 'Железная дверь', en: 'Sheet Metal Door' }, category: 'construction' },
  { shortname: 'wall.frame.garagedoor', id: 'garage_door', name: { ru: 'Гаражная дверь', en: 'Garage Door' }, category: 'construction' },
  { shortname: 'door.hinged.toptier', id: 'armored_door', name: { ru: 'МК Дверь (Бронированная)', en: 'Armored Door' }, category: 'construction' },
  { shortname: 'cupboard.tool', id: 'tc', name: { ru: 'Шкаф инструментальный (TC)', en: 'Tool Cupboard' }, category: 'construction' },
  { shortname: 'autoturret', id: 'auto_turret', name: { ru: 'Авто-турель', en: 'Auto Turret' }, category: 'construction' },
  { shortname: 'shotgun.trap', id: 'guntrap', name: { ru: 'Гантрап / Ловушка', en: 'Shotgun Trap' }, category: 'construction' },

  // Resources & Components
  { shortname: 'scrap', id: 'scrap', name: { ru: 'Скрап / Металлолом', en: 'Scrap' }, category: 'components' },
  { shortname: 'metal.fragments', id: 'metal_fragments', name: { ru: 'Фрагменты металла', en: 'Metal Fragments' }, category: 'components' },
  { shortname: 'metal.refined', id: 'high_quality_metal', name: { ru: 'МВК (HQM)', en: 'High Quality Metal' }, category: 'components' },
  { shortname: 'cloth', id: 'cloth', name: { ru: 'Ткань', en: 'Cloth' }, category: 'components' },
  { shortname: 'leather', id: 'leather', name: { ru: 'Кожа', en: 'Leather' }, category: 'components' },
  { shortname: 'rope', id: 'rope', name: { ru: 'Веревка', en: 'Rope' }, category: 'components' },
  { shortname: 'gears', id: 'gears', name: { ru: 'Шестеренки', en: 'Gears' }, category: 'components' },
  { shortname: 'metalpipe', id: 'metal_pipe', name: { ru: 'Металлическая труба', en: 'Metal Pipe' }, category: 'components' },
  { shortname: 'sewingkit', id: 'sewing_kit', name: { ru: 'Швейный набор', en: 'Sewing Kit' }, category: 'components' },
  { shortname: 'sheetmetal', id: 'sheet_metal', name: { ru: 'Листовой металл', en: 'Sheet Metal' }, category: 'components' },
  { shortname: 'roadsigns', id: 'road_signs', name: { ru: 'Дорожные знаки', en: 'Road Signs' }, category: 'components' },
  { shortname: 'techparts', id: 'tech_trash', name: { ru: 'Микросхемы', en: 'Tech Trash' }, category: 'components' },
  { shortname: 'metalspring', id: 'metal_spring', name: { ru: 'Пружина', en: 'Metal Spring' }, category: 'components' },
  { shortname: 'smgbody', id: 'smg_body', name: { ru: 'Корпус ПП (SMG Body)', en: 'SMG Body' }, category: 'components' },
  { shortname: 'semibody', id: 'semi_body', name: { ru: 'Полуавтомат корпус', en: 'Semi Auto Body' }, category: 'components' },
  { shortname: 'riflebody', id: 'rifle_body', name: { ru: 'Винтовочный корпус', en: 'Rifle Body' }, category: 'components' },
  { shortname: 'horse.saddlebag', id: 'horse.saddlebag', name: { ru: 'Сумка для седла лошади', en: 'Horse Saddlebag' }, category: 'components' },
];

export default function RustItemIconsTab({ lang }: RustItemIconsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'gallery' | 'node_code' | 'discord_bot'>('gallery');
  const [cacheCount, setCacheCount] = useState<number>(0);
  const [isCachingAll, setIsCachingAll] = useState<boolean>(false);

  useEffect(() => {
    const cache = getIconCache();
    setCacheCount(Object.keys(cache).length);
  }, []);

  const handlePrecacheAll = async () => {
    setIsCachingAll(true);
    for (const item of COMMON_RUST_ITEMS) {
      const urls = getRustLabsIconUrls(item.id);
      if (urls.length > 0) {
        cacheImageAsBase64(item.id, urls[0]);
      }
    }
    setTimeout(() => {
      const updated = getIconCache();
      setCacheCount(Object.keys(updated).length);
      setIsCachingAll(false);
    }, 1200);
  };

  const handleClearCache = () => {
    clearIconCache();
    setCacheCount(0);
  };

  const filteredItems = COMMON_RUST_ITEMS.filter((item) => {
    const matchesSearch =
      item.shortname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.ru.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.en.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const nodeScriptContent = `/**
 * Rust Game Icons Extractor & Static Web Server
 * Extracts original PNG item icons directly from installed Rust game files:
 * Default path: <SteamPath>/steamapps/common/Rust/Bundles/items/
 * Fallback source: https://www.rust-items.com/
 */

const fs = require('fs');
const path = require('path');
const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3005;

// 1. Path to installed Rust game items folder
const DEFAULT_RUST_PATH = 'C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\Rust\\\\Bundles\\\\items';
const RUST_ITEMS_DIR = process.env.RUST_ITEMS_DIR || DEFAULT_RUST_PATH;
const CACHE_DIR = path.join(__dirname, 'cached_rust_icons');

if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

/**
 * Get icon for item by shortname (e.g. "rifle.ak", "horse.saddlebag", "wood")
 */
async function getItemIcon(shortName) {
  const cleanName = shortName.toLowerCase().trim().replace(/\\.png$/, '');
  
  // A. Check local Rust game installation folder
  const gameFilePath = path.join(RUST_ITEMS_DIR, \`\${cleanName}.png\`);
  if (fs.existsSync(gameFilePath)) {
    return { source: 'local_game_files', path: gameFilePath };
  }

  // B. Check local cache folder
  const cachedFilePath = path.join(CACHE_DIR, \`\${cleanName}.png\`);
  if (fs.existsSync(cachedFilePath)) {
    return { source: 'local_cache', path: cachedFilePath };
  }

  // C. Fallback: Download official icon from rust-items.com
  const fallbackUrl = \`https://www.rust-items.com/images/\${cleanName}.png\`;
  try {
    const response = await axios({
      url: fallbackUrl,
      method: 'GET',
      responseType: 'stream',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });

    const writer = fs.createWriteStream(cachedFilePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return { source: 'rust_items_fallback', path: cachedFilePath };
  } catch (err) {
    console.error(\`Failed to fetch fallback icon for \${cleanName}: \${err.message}\`);
    return null;
  }
}

// Serve icon by shortname endpoint
app.get('/api/icons/:shortname', async (req, res) => {
  const shortname = req.params.shortname;
  const result = await getItemIcon(shortname);

  if (result && fs.existsSync(result.path)) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('X-Icon-Source', result.source);
    return res.sendFile(result.path);
  }

  res.status(404).json({ error: 'Icon not found', shortname });
});

// List all scanned PNG icons from game path
app.get('/api/icons-list', (req, res) => {
  if (!fs.existsSync(RUST_ITEMS_DIR)) {
    return res.json({ status: 'warning', message: 'Rust game path not found locally', localFilesCount: 0 });
  }

  const files = fs.readdirSync(RUST_ITEMS_DIR).filter(f => f.endsWith('.png'));
  res.json({
    status: 'ok',
    rustPath: RUST_ITEMS_DIR,
    count: files.length,
    shortnames: files.map(f => f.replace('.png', ''))
  });
});

app.listen(PORT, () => {
  console.log(\`✅ Rust Icon Integration Service listening on port \${PORT}\`);
  console.log(\`📁 Rust Game Directory: \${RUST_ITEMS_DIR}\`);
});
`;

  const discordBotSnippet = `// Example: Discord.js Bot sending original Rust item icon directly
const { Client, GatewayIntentBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');

const RUST_GAME_ITEMS_DIR = 'C:\\\\Program Files (x86)\\\\Steam\\\\steamapps\\\\common\\\\Rust\\\\Bundles\\\\items';

function getRustIconAttachment(shortname) {
  const cleanName = shortname.toLowerCase().trim().replace(/\\.png$/, '');
  const localFile = path.join(RUST_GAME_ITEMS_DIR, \`\${cleanName}.png\`);

  if (fs.existsSync(localFile)) {
    // 1. Attach directly from local installed Rust game files
    return {
      attachment: new AttachmentBuilder(localFile, { name: \`\${cleanName}.png\` }),
      embedUrl: \`attachment://\${cleanName}.png\`
    };
  }

  // 2. Fallback directly to rust-items.com official image URL
  return {
    attachment: null,
    embedUrl: \`https://www.rust-items.com/images/\${cleanName}.png\`
  };
}

// Bot command handler example:
async function handleItemCommand(message, shortname) {
  const iconData = getRustIconAttachment(shortname);

  const embed = new EmbedBuilder()
    .setTitle(\`Rust Item: \${shortname}\`)
    .setColor(0xCD412B)
    .setImage(iconData.embedUrl);

  if (iconData.attachment) {
    await message.channel.send({ embeds: [embed], files: [iconData.attachment] });
  } else {
    await message.channel.send({ embeds: [embed] });
  }
}
`;

  return (
    <div className="space-y-6 text-gray-200 font-sans">
      {/* Header Banner */}
      <div className="bg-[#14171e]/90 border border-[#2a2f3b] rounded-none p-5 sm:p-6 shadow-xl relative overflow-hidden rust-metal-pattern">
        <div className="rust-bracket-tl" />
        <div className="rust-bracket-tr" />
        <div className="rust-bracket-bl" />
        <div className="rust-bracket-br" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#cd412b]/20 text-[#cd412b] border border-[#cd412b]/40 rounded-sm">
                <ImageIcon size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white font-sans uppercase tracking-tight">
                {lang === 'ru' ? 'Оригинальные Иконки Предметов Rust' : 'Original Rust Item Icons Integration'}
              </h2>
            </div>
            <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-3xl">
              {lang === 'ru'
                ? 'Прямой доступ к оригинальным PNG-иконкам предметов напрямую из установленной папки игры (Rust/Bundles/items/) с автоматическим резервным источником rust-items.com без лишней генерации.'
                : 'Direct access to original Rust PNG item icons directly from game files (Rust/Bundles/items/) with fallback to rust-items.com.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-green-400 bg-green-500/10 border border-green-500/30 rounded-sm flex items-center gap-1.5">
              <ShieldCheck size={12} />
              <span>{lang === 'ru' ? 'Оригинальные PNG' : 'Original PNGs'}</span>
            </span>
          </div>
        </div>

        {/* Subtab Navigation */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#2a2f3b]">
          <button
            onClick={() => setActiveSubTab('gallery')}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'gallery'
                ? 'bg-[#cd412b] text-white shadow-md'
                : 'bg-[#1c202b] text-gray-400 hover:text-white hover:bg-[#252a38] border border-[#2a2f3b]'
            }`}
          >
            <ImageIcon size={14} />
            <span>{lang === 'ru' ? 'Галерея Предметов' : 'Items Gallery'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('node_code')}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'node_code'
                ? 'bg-[#cd412b] text-white shadow-md'
                : 'bg-[#1c202b] text-gray-400 hover:text-white hover:bg-[#252a38] border border-[#2a2f3b]'
            }`}
          >
            <Code size={14} />
            <span>{lang === 'ru' ? 'Node.js Экстрактор' : 'Node.js Extractor Code'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('discord_bot')}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider font-mono rounded-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'discord_bot'
                ? 'bg-[#cd412b] text-white shadow-md'
                : 'bg-[#1c202b] text-gray-400 hover:text-white hover:bg-[#252a38] border border-[#2a2f3b]'
            }`}
          >
            <Terminal size={14} />
            <span>{lang === 'ru' ? 'Интеграция в Discord Бот' : 'Discord Bot Integration'}</span>
          </button>
        </div>
      </div>

      {/* Subtab Content: Items Gallery */}
      {activeSubTab === 'gallery' && (
        <div className="space-y-4">
          {/* LocalStorage Cache Bar */}
          <div className="bg-[#10131a] border border-[#2a2f3b] p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2.5 text-gray-300">
              <span className="p-1.5 bg-[#1b202e] text-amber-400 border border-[#2a2f3b] rounded-sm">
                <HardDrive size={15} />
              </span>
              <div>
                <p className="font-bold text-white flex items-center gap-2">
                  <span>{lang === 'ru' ? 'Кэш в LocalStorage:' : 'LocalStorage Cache:'}</span>
                  <span className="text-amber-400 font-black">
                    {cacheCount} / {COMMON_RUST_ITEMS.length} {lang === 'ru' ? 'сохранено' : 'cached'}
                  </span>
                </p>
                <p className="text-[10px] text-gray-400">
                  {lang === 'ru'
                    ? 'Сохраненные иконки мгновенно загружаются без сетевых запросов при повторных открытиях.'
                    : 'Cached icons load instantly from browser storage without network delays.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={handlePrecacheAll}
                disabled={isCachingAll}
                className="px-2.5 py-1.5 bg-[#cd412b]/20 hover:bg-[#cd412b]/30 border border-[#cd412b]/50 text-[#f57462] hover:text-white font-bold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Zap size={13} className={isCachingAll ? 'animate-bounce' : ''} />
                <span>
                  {isCachingAll
                    ? lang === 'ru'
                      ? 'Сохранение...'
                      : 'Caching...'
                    : lang === 'ru'
                    ? 'Кэшировать Все'
                    : 'Precache All'}
                </span>
              </button>

              {cacheCount > 0 && (
                <button
                  onClick={handleClearCache}
                  className="px-2.5 py-1.5 bg-[#1c202b] hover:bg-red-500/20 border border-[#2a2f3b] hover:border-red-500/40 text-gray-400 hover:text-red-300 font-bold rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Clear icon cache"
                >
                  <Trash2 size={13} />
                  <span>{lang === 'ru' ? 'Сбросить' : 'Clear'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Controls: Search and Categories */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-[#14171e]/80 border border-[#2a2f3b] p-3">
            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={lang === 'ru' ? 'Поиск по shortname или названию...' : 'Search shortname or name...'}
                className="w-full bg-[#0c0d10] border border-[#2a2f3b] pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#cd412b]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-[11px] font-mono">
              {[
                { id: 'all', label: { ru: 'Все', en: 'All' } },
                { id: 'weapons', label: { ru: 'Оружие', en: 'Weapons' } },
                { id: 'explosives', label: { ru: 'Взрывчатка', en: 'Explosives' } },
                { id: 'construction', label: { ru: 'Строительство', en: 'Construction' } },
                { id: 'components', label: { ru: 'Компоненты', en: 'Components' } },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 font-bold uppercase rounded-sm cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#cd412b] text-white'
                      : 'bg-[#1b1e26] text-gray-400 hover:text-white border border-[#2a2f3b]'
                  }`}
                >
                  {cat.label[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Item Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredItems.map((item) => {
              const url = `https://www.rust-items.com/images/${item.shortname}.png`;
              return (
                <div
                  key={item.shortname}
                  className="bg-[#14171e] border border-[#2a2f3b] p-3 hover:border-[#cd412b]/50 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-black/50 border border-[#2a2f3b] p-1 flex items-center justify-center shrink-0">
                      <ItemImageOrFallback id={item.id} lang={lang} size={40} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate font-sans">{item.name[lang]}</p>
                      <p className="text-[10px] font-mono text-amber-500 font-semibold truncate">{item.shortname}</p>
                      <p className="text-[9px] font-mono text-gray-500 uppercase">{item.category}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#2a2f3b]/60 flex items-center justify-between gap-1 text-[10px] font-mono">
                    <button
                      onClick={() => handleCopy(item.shortname, `short_${item.shortname}`)}
                      className="flex-1 py-1 bg-[#1b1e26] hover:bg-[#cd412b]/20 border border-[#2a2f3b] hover:border-[#cd412b]/40 text-gray-300 hover:text-white transition-all text-center rounded-sm cursor-pointer flex items-center justify-center gap-1"
                      title="Copy shortname"
                    >
                      {copiedKey === `short_${item.shortname}` ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                      <span>Shortname</span>
                    </button>

                    <button
                      onClick={() => handleCopy(url, `url_${item.shortname}`)}
                      className="flex-1 py-1 bg-[#1b1e26] hover:bg-[#cd412b]/20 border border-[#2a2f3b] hover:border-[#cd412b]/40 text-gray-300 hover:text-white transition-all text-center rounded-sm cursor-pointer flex items-center justify-center gap-1"
                      title="Copy PNG URL"
                    >
                      {copiedKey === `url_${item.shortname}` ? <Check size={10} className="text-green-400" /> : <ExternalLink size={10} />}
                      <span>URL</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subtab Content: Node.js Code */}
      {activeSubTab === 'node_code' && (
        <div className="bg-[#14171e] border border-[#2a2f3b] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Code size={16} className="text-[#cd412b]" />
                <span>Node.js Local Game Path Scanner & Server</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {lang === 'ru'
                  ? 'Сканирует папку <Steam>/steamapps/common/Rust/Bundles/items/ на наличие .png иконки. При отсутствии обращается к https://www.rust-items.com/'
                  : 'Scans installed game folder for PNG icons with automatic fallback to rust-items.com'}
              </p>
            </div>

            <button
              onClick={() => handleCopy(nodeScriptContent, 'node_code')}
              className="px-3 py-1.5 bg-[#cd412b] hover:bg-[#b03825] text-white text-xs font-bold font-mono uppercase rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'node_code' ? (
                <>
                  <Check size={14} />
                  <span>{lang === 'ru' ? 'Скопировано!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>{lang === 'ru' ? 'Скопировать Код' : 'Copy Code'}</span>
                </>
              )}
            </button>
          </div>

          {/* Code Container */}
          <pre className="bg-[#0a0b0d] border border-[#2a2f3b] p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-[450px] leading-relaxed">
            <code>{nodeScriptContent}</code>
          </pre>
        </div>
      )}

      {/* Subtab Content: Discord Bot Integration */}
      {activeSubTab === 'discord_bot' && (
        <div className="bg-[#14171e] border border-[#2a2f3b] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2a2f3b] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Terminal size={16} className="text-[#6441a5]" />
                <span>Discord.js Attachment & Embed Integration</span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {lang === 'ru'
                  ? 'Пример функции отправки оригинальной иконки предмета как вложения AttachmentBuilder в Discord боте.'
                  : 'Example helper function for sending official Rust item icons as Discord.js attachments.'}
              </p>
            </div>

            <button
              onClick={() => handleCopy(discordBotSnippet, 'discord_code')}
              className="px-3 py-1.5 bg-[#6441a5] hover:bg-[#772ce8] text-white text-xs font-bold font-mono uppercase rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'discord_code' ? (
                <>
                  <Check size={14} />
                  <span>{lang === 'ru' ? 'Скопировано!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>{lang === 'ru' ? 'Скопировать' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>

          <pre className="bg-[#0a0b0d] border border-[#2a2f3b] p-4 font-mono text-[11px] text-purple-300 overflow-x-auto max-h-[450px] leading-relaxed">
            <code>{discordBotSnippet}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
