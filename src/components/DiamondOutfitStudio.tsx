import { useEffect, useMemo, useState } from 'react';
import { Shirt, HardHat, Footprints, Hand, Backpack, Save, Share2, Search, RotateCw, Lock, Sparkles, RefreshCw } from 'lucide-react';

type Slot = 'head' | 'face' | 'torso' | 'legs' | 'hands' | 'feet' | 'back' | 'other';
type FilterSlot = Slot | 'all';
type ApiSkin = {
  id: number;
  name: string;
  price: number | null;
  unlock_at?: string | null;
  item_class_id?: string;
  created_at?: string;
  delivery_type?: number;
};
type GearItem = ApiSkin & { slot: Slot; tier: 'free' | 'vip'; color: string };
type RustCatalogueResponse = {
  source: string;
  sourceUrl: string;
  currency: string | null;
  currencyNote?: string;
  lastUpdate: number;
  fetchedAt: string;
  count: number;
  items: ApiSkin[];
};

const SLOTS: { id: Slot; label: string; icon: typeof Shirt }[] = [
  { id: 'head', label: 'Голова', icon: HardHat },
  { id: 'face', label: 'Лицо', icon: Sparkles },
  { id: 'torso', label: 'Торс', icon: Shirt },
  { id: 'legs', label: 'Ноги', icon: Shirt },
  { id: 'hands', label: 'Руки', icon: Hand },
  { id: 'feet', label: 'Обувь', icon: Footprints },
  { id: 'back', label: 'Спина', icon: Backpack },
  { id: 'other', label: 'Другое', icon: Lock },
];

function inferSlot(name: string): Slot {
  const value = name.toLowerCase();
  if (/helmet|hat|headgear|шлем|маска сварщика/.test(value)) return 'head';
  if (/bandana|mask|balaclava|бандана|маска/.test(value)) return 'face';
  if (/hoodie|jacket|shirt|vest|armor|coat|suit|t-shirt|топ|куртк|худи|брон|рубаш|футболк/.test(value)) return 'torso';
  if (/pants|kilt|штан|юбк/.test(value)) return 'legs';
  if (/gloves|перчатк/.test(value)) return 'hands';
  if (/boots|shoes|обув|сапог|ботин/.test(value)) return 'feet';
  if (/backpack|рюкзак/.test(value)) return 'back';
  return 'other';
}

const SLOT_COLORS: Record<Slot, string> = {
  head: '#89939a', face: '#8b3c32', torso: '#475569', legs: '#4b5563',
  hands: '#343b43', feet: '#554438', back: '#64734b', other: '#59636d'
};

function formatPrice(price: number | null, lang: 'ru' | 'en') {
  if (price === null || !Number.isFinite(Number(price))) return lang === 'en' ? 'Not listed' : 'Нет в продаже';
  return Number(price).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US', { maximumFractionDigits: 2 });
}

export default function DiamondOutfitStudio({ isVip = false, lang = 'ru' }: { isVip?: boolean; lang?: 'ru' | 'en' }) {
  const [slot, setSlot] = useState<FilterSlot>('all');
  const [selected, setSelected] = useState<Partial<Record<Slot, GearItem>>>({});
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const [items, setItems] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  const [catalogueCount, setCatalogueCount] = useState(0);
  const en = lang === 'en';

  const loadCatalogue = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const response = await fetch('/api/skins/rust', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json() as RustCatalogueResponse;
      if (!Array.isArray(payload.items) || payload.source !== 'LIS-SKINS') {
        throw new Error('Unexpected catalogue response');
      }
      const mapped: GearItem[] = payload.items.map(item => ({
        ...item,
        slot: inferSlot(item.name),
        tier: 'free',
        color: SLOT_COLORS[inferSlot(item.name)]
      }));
      setItems(mapped);
      setLastUpdate(payload.lastUpdate);
      setCatalogueCount(payload.count || mapped.length);
    } catch (error) {
      console.error('Rust skin catalogue load failed:', error);
      setLoadError(en ? 'Could not load the LIS-SKINS catalogue. Check the server API and retry.' : 'Не удалось загрузить каталог LIS-SKINS. Проверь API сервера и попробуй ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadCatalogue(); }, []);

  const currentItems = useMemo(() => items
    .filter(item => (slot === 'all' || item.slot === slot) && item.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (a.price === null) return 1;
      if (b.price === null) return -1;
      return a.price - b.price;
    }), [items, slot, search]);
  const total = Object.values(selected).reduce((sum, item) => sum + (item?.price ?? 0), 0);
  const equippedCount = Object.keys(selected).length;

  const choose = (item: GearItem) => {
    if (item.tier === 'vip' && !isVip) {
      setNotice(en ? 'This item is available with Diamond VIP.' : 'Этот предмет доступен с Diamond VIP.');
      return;
    }
    setSelected(prev => ({ ...prev, [item.slot]: item }));
    setNotice('');
    setSaved(false);
  };

  const share = async () => {
    const payload = btoa(unescape(encodeURIComponent(JSON.stringify(Object.fromEntries(Object.entries(selected).map(([key, item]) => [key, item?.id]))))));
    const url = new URL(window.location.href);
    url.hash = 'outfit=' + payload;
    try { await navigator.clipboard.writeText(url.toString()); setNotice(en ? 'Outfit link copied.' : 'Ссылка на комплект скопирована.'); }
    catch { setNotice(en ? 'Could not copy the link.' : 'Не удалось скопировать ссылку.'); }
  };

  const renderItem = (item: GearItem) => (
    <button key={item.id} onClick={() => choose(item)} className={`flex w-full items-center justify-between gap-3 rounded border px-3 py-3 text-left ${selected[item.slot]?.id === item.id ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-950/60 hover:border-slate-600'}`}>
      <span className="min-w-0"><span className="block truncate text-sm font-semibold">{item.name}</span><span className="mt-1 block text-[10px] text-slate-500">{en ? 'RUST SKIN' : 'СКИН RUST'} · ID {item.id}</span></span>
      <span className="shrink-0 text-right text-xs text-slate-300">{formatPrice(item.price, lang)}<span className="block text-[9px] text-slate-500">LIS-SKINS</span></span>
    </button>
  );

  return <section className="mx-auto w-full max-w-7xl space-y-6 p-4 text-slate-100 md:p-8">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-orange-500/30 pb-5">
      <div><div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[.25em] text-orange-400">RUSTY.LUB / DIAMOND LAB</div>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">DIAMOND OUTFIT STUDIO</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{en ? 'Build your Rust loadout with the live LIS-SKINS catalogue and prices.' : 'Собирай экипировку Rust по реальному каталогу и ценам LIS-SKINS.'}</p>
      </div>
      <div className="rounded border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300">LIS-SKINS / RUST</div>
    </header>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,.9fr)]">
      <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-700 bg-[radial-gradient(ellipse_at_50%_38%,rgba(249,115,22,.13),transparent_55%),linear-gradient(145deg,#151b24,#090c11)] p-5">
        <div className="absolute left-5 top-5 text-[10px] tracking-[.2em] text-slate-500">CHARACTER LOADOUT / PREVIEW</div>
        <div className="absolute right-5 top-5 flex items-center gap-2 text-[10px] text-slate-500"><RotateCw size={13}/> {en ? '3D MODEL — NEXT PHASE' : '3D-МОДЕЛЬ — СЛЕДУЮЩИЙ ЭТАП'}</div>
        <div className="flex h-full min-h-[460px] items-center justify-center">
          <div className="relative flex flex-col items-center drop-shadow-[0_20px_45px_rgba(0,0,0,.7)]">
            <div className="relative z-10 h-20 w-20 rounded-[38%] border-4 border-slate-500/70 bg-gradient-to-br from-slate-400 to-slate-700" style={{ backgroundColor: selected.head?.color }}/>
            {selected.face && <div className="z-20 -mt-9 h-5 w-16 rounded bg-orange-900/90" style={{ backgroundColor: selected.face.color }}/>}
            <div className="relative mt-1 h-36 w-40 rounded-t-[42%] border-x-4 border-slate-500/50" style={{ background: selected.torso?.color ?? 'linear-gradient(90deg,#39424d,#65717d,#39424d)' }}>
              <div className="absolute -left-12 top-5 h-28 w-10 -rotate-6 rounded-full" style={{ backgroundColor: selected.hands?.color ?? '#59636d' }}/>
              <div className="absolute -right-12 top-5 h-28 w-10 rotate-6 rounded-full" style={{ backgroundColor: selected.hands?.color ?? '#59636d' }}/>
            </div>
            <div className="flex gap-2"><div className="h-32 w-[68px] rounded-b-lg" style={{ backgroundColor: selected.legs?.color ?? '#343d49' }}/><div className="h-32 w-[68px] rounded-b-lg" style={{ backgroundColor: selected.legs?.color ?? '#343d49' }}/></div>
            <div className="flex gap-8"><div className="h-5 w-16 rounded-b" style={{ backgroundColor: selected.feet?.color ?? '#554438' }}/><div className="h-5 w-16 rounded-b" style={{ backgroundColor: selected.feet?.color ?? '#554438' }}/></div>
            {selected.back && <div className="absolute right-[-42px] top-28 h-32 w-10 rounded-lg border border-slate-500" style={{ backgroundColor: selected.back.color }}/>}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 text-[10px] tracking-wider text-slate-500"><span>RUST SURVIVOR / LOADOUT A</span><span>{equippedCount}/8 {en ? 'SLOTS EQUIPPED' : 'СЛОТОВ ЗАПОЛНЕНО'}</span></div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-700 bg-[#111720] p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">{en ? 'Equipment slots' : 'Слоты экипировки'}</h2><span className="text-xs text-slate-500">{equippedCount}/8</span></div>
          <div className="mb-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button onClick={() => { setSlot('all'); setSearch(''); }} className={`rounded border px-3 py-3 text-left text-sm ${slot === 'all' ? 'border-orange-500 bg-orange-500/10 text-orange-300' : 'border-slate-700 bg-slate-900/60 text-slate-300'}`}>{en ? 'All skins' : 'Все скины'}</button>
            {SLOTS.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSlot(id); setSearch(''); }} className={`flex items-center gap-2 rounded border px-3 py-3 text-left text-sm transition ${slot === id ? 'border-orange-500 bg-orange-500/10 text-orange-300' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'}`}><Icon size={16}/><span>{en ? ({head:'Head',face:'Face',torso:'Torso',legs:'Legs',hands:'Hands',feet:'Footwear',back:'Back',other:'Other'} as Record<Slot,string>)[id] : label}</span>{selected[id] && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400"/>}</button>)}
          </div>
        </div>
        <div className="rounded-lg border border-slate-700 bg-[#111720] p-4">
          <div className="mb-3 flex items-center justify-between gap-2"><h2 className="font-bold">{en ? 'Rust skin catalogue' : 'Каталог скинов Rust'}</h2><button onClick={() => void loadCatalogue()} disabled={loading} className="flex items-center gap-1 text-xs text-orange-300 disabled:opacity-50"><RefreshCw size={13} className={loading ? 'animate-spin' : ''}/>{en ? 'Refresh' : 'Обновить'}</button></div>
          <div className="mb-3 flex items-center justify-between text-[10px] text-slate-500"><span>{catalogueCount.toLocaleString()} {en ? 'items from LIS-SKINS' : 'предметов из LIS-SKINS'}</span><span>{lastUpdate ? new Date(lastUpdate * 1000).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US') : ''}</span></div>
          <label className="mb-3 flex items-center gap-2 rounded border border-slate-700 bg-slate-950 px-3 py-2"><Search size={15} className="text-slate-500"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={en ? 'Search Rust skins...' : 'Поиск скинов Rust...'} className="w-full bg-transparent text-sm outline-none"/></label>
          {loading && <p className="py-6 text-center text-sm text-slate-400">{en ? 'Loading live catalogue...' : 'Загружаем каталог LIS-SKINS...'}</p>}
          {!loading && loadError && <div className="space-y-3 py-5 text-center"><p className="text-sm text-rose-300">{loadError}</p><button onClick={() => void loadCatalogue()} className="rounded border border-orange-500/50 px-3 py-2 text-xs text-orange-300">{en ? 'Try again' : 'Повторить'}</button></div>}
          {!loading && !loadError && <div className="max-h-64 space-y-2 overflow-y-auto pr-1">{currentItems.slice(0, 300).map(renderItem)}{currentItems.length > 300 && <p className="py-2 text-center text-xs text-slate-500">{en ? 'Refine search to narrow down the catalogue.' : 'Уточни поиск, чтобы сузить список.'}</p>}{currentItems.length === 0 && <p className="py-6 text-center text-sm text-slate-500">{en ? 'No matching skins.' : 'Скины не найдены.'}</p>}</div>}
          {notice && <p className="mt-3 text-xs text-orange-300">{notice}</p>}
        </div>
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
          <div className="flex items-center justify-between"><span className="text-xs tracking-widest text-orange-300">{en ? 'LIS-SKINS SET VALUE' : 'СТОИМОСТЬ КОМПЛЕКТА LIS-SKINS'}</span><strong className="text-2xl">{formatPrice(total, lang)}</strong></div>
          <p className="mt-1 text-[10px] text-slate-500">{en ? 'Sum of selected LIS-SKINS prices. Currency is not specified in the public JSON documentation.' : 'Сумма цен выбранных предметов LIS-SKINS. Валюта в документации публичного JSON не указана.'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => { setSaved(true); setNotice(en ? 'Loadout saved in this session.' : 'Комплект сохранён в текущем сеансе.'); }} className="flex items-center gap-2 rounded bg-orange-600 px-4 py-2 text-sm font-bold hover:bg-orange-500"><Save size={15}/>{en ? 'Save set' : 'Сохранить комплект'}</button>
            <button onClick={share} className="flex items-center gap-2 rounded border border-slate-600 px-4 py-2 text-sm hover:border-orange-400"><Share2 size={15}/>{en ? 'Share' : 'Поделиться'}</button>
            {saved && <span className="self-center text-xs text-emerald-400">{en ? 'Saved' : 'Сохранено'}</span>}
          </div>
        </div>
      </div>
    </div>
    <p className="text-xs leading-relaxed text-slate-500">{en ? 'Prices and item names are loaded from the public LIS-SKINS Rust JSON list. This is a 2D loadout preview; an original Rust 3D character model and skin textures are not connected yet.' : 'Названия и цены загружаются из публичного JSON-каталога Rust от LIS-SKINS. Сейчас это 2D-предпросмотр комплекта: оригинальная 3D-модель Rust и текстуры скинов пока не подключены.'} <a href="https://lis-skins.stoplight.io/docs/lis-skins/l6th4ko9av64c-json-price-lists" target="_blank" rel="noreferrer" className="text-orange-300 hover:underline">LIS-SKINS API</a></p>
  </section>;
}
