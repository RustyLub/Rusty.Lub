import { useMemo, useState } from 'react';
import { Shirt, HardHat, Footprints, Hand, Backpack, Save, Share2, Search, RotateCw, Lock, Sparkles } from 'lucide-react';

type Slot = 'head' | 'face' | 'torso' | 'legs' | 'hands' | 'feet' | 'back';
type GearItem = { id: string; name: string; slot: Slot; price: number | null; tier: 'free' | 'vip'; color: string };

const ITEMS: GearItem[] = [
  { id: 'wood-helmet', name: 'Деревянный шлем', slot: 'head', price: 45, tier: 'free', color: '#9b7653' },
  { id: 'bucket-helmet', name: 'Ведро-шлем', slot: 'head', price: 120, tier: 'free', color: '#89939a' },
  { id: 'bandana', name: 'Бандана', slot: 'face', price: 35, tier: 'free', color: '#8b3c32' },
  { id: 'hoodie', name: 'Худи', slot: 'torso', price: 80, tier: 'free', color: '#475569' },
  { id: 'roadsign', name: 'Дорожная броня', slot: 'torso', price: 210, tier: 'vip', color: '#a56b3f' },
  { id: 'pants', name: 'Штаны', slot: 'legs', price: 65, tier: 'free', color: '#4b5563' },
  { id: 'gloves', name: 'Тактические перчатки', slot: 'hands', price: 90, tier: 'vip', color: '#343b43' },
  { id: 'boots', name: 'Ботинки', slot: 'feet', price: 55, tier: 'free', color: '#554438' },
  { id: 'backpack', name: 'Рюкзак', slot: 'back', price: null, tier: 'vip', color: '#64734b' },
];

const SLOTS: { id: Slot; label: string; icon: typeof Shirt }[] = [
  { id: 'head', label: 'Голова', icon: HardHat },
  { id: 'face', label: 'Лицо', icon: Sparkles },
  { id: 'torso', label: 'Торс', icon: Shirt },
  { id: 'legs', label: 'Ноги', icon: Shirt },
  { id: 'hands', label: 'Руки', icon: Hand },
  { id: 'feet', label: 'Обувь', icon: Footprints },
  { id: 'back', label: 'Спина', icon: Backpack },
];

export default function DiamondOutfitStudio({ isVip = false, lang = 'ru' }: { isVip?: boolean; lang?: 'ru' | 'en' }) {
  const [slot, setSlot] = useState<Slot>('head');
  const [selected, setSelected] = useState<Partial<Record<Slot, GearItem>>>({});
  const [search, setSearch] = useState('');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  const en = lang === 'en';
  const currentItems = useMemo(() => ITEMS.filter(item => item.slot === slot && item.name.toLowerCase().includes(search.toLowerCase())), [slot, search]);
  const total = Object.values(selected).reduce((sum, item) => sum + (item?.price ?? 0), 0);

  const choose = (item: GearItem) => {
    if (item.tier === 'vip' && !isVip) {
      setNotice(en ? 'This item is available with Diamond VIP.' : 'Этот предмет доступен с Diamond VIP.');
      return;
    }
    setSelected(prev => ({ ...prev, [slot]: item }));
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

  return <section className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-8 text-slate-100">
    <header className="flex flex-wrap items-end justify-between gap-4 border-b border-orange-500/30 pb-5">
      <div><div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[.25em] text-orange-400">RUSTY.LUB / DIAMOND LAB</div>
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">DIAMOND OUTFIT STUDIO</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">{en ? 'Build your Rust loadout, preview selected gear and share your outfit.' : 'Собирай экипировку Rust, подбирай предметы и делись готовым комплектом.'}</p>
      </div>
      <div className="rounded border border-orange-500/30 bg-orange-500/10 px-3 py-2 text-xs font-bold text-orange-300">PREVIEW BUILD / 01</div>
    </header>

    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,.9fr)]">
      <div className="relative min-h-[520px] overflow-hidden rounded-lg border border-slate-700 bg-[radial-gradient(ellipse_at_50%_38%,rgba(249,115,22,.13),transparent_55%),linear-gradient(145deg,#151b24,#090c11)] p-5">
        <div className="absolute left-5 top-5 text-[10px] tracking-[.2em] text-slate-500">CHARACTER LOADOUT / 3D VIEWPORT</div>
        <div className="absolute right-5 top-5 flex items-center gap-2 text-[10px] text-slate-500"><RotateCw size={13}/> 3D MODEL — NEXT PHASE</div>
        <div className="flex h-full min-h-[460px] items-center justify-center">
          <div className="relative flex flex-col items-center drop-shadow-[0_20px_45px_rgba(0,0,0,.7)]">
            <div className="relative z-10 h-20 w-20 rounded-[38%] border-4 border-slate-500/70 bg-gradient-to-br from-slate-400 to-slate-700" style={{ backgroundColor: selected.head?.color }} />
            {selected.face && <div className="z-20 -mt-9 h-5 w-16 rounded bg-orange-900/90" style={{ backgroundColor: selected.face.color }}/>}
            <div className="relative mt-1 h-36 w-40 rounded-t-[42%] border-x-4 border-slate-500/50" style={{ background: selected.torso?.color ?? 'linear-gradient(90deg,#39424d,#65717d,#39424d)' }}>
              <div className="absolute -left-12 top-5 h-28 w-10 -rotate-6 rounded-full bg-slate-600" style={{ backgroundColor: selected.hands?.color ?? '#59636d' }}/>
              <div className="absolute -right-12 top-5 h-28 w-10 rotate-6 rounded-full bg-slate-600" style={{ backgroundColor: selected.hands?.color ?? '#59636d' }}/>
            </div>
            <div className="flex gap-2"><div className="h-32 w-[68px] rounded-b-lg" style={{ backgroundColor: selected.legs?.color ?? '#343d49' }}/><div className="h-32 w-[68px] rounded-b-lg" style={{ backgroundColor: selected.legs?.color ?? '#343d49' }}/></div>
            <div className="flex gap-8"><div className="h-5 w-16 rounded-b bg-amber-950" style={{ backgroundColor: selected.feet?.color ?? '#554438' }}/><div className="h-5 w-16 rounded-b bg-amber-950" style={{ backgroundColor: selected.feet?.color ?? '#554438' }}/></div>
            {selected.back && <div className="absolute right-[-42px] top-28 h-32 w-10 rounded-lg border border-slate-500" style={{ backgroundColor: selected.back.color }}/>}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap justify-between gap-2 border-t border-white/10 pt-3 text-[10px] tracking-wider text-slate-500"><span>RUST SURVIVOR / LOADOUT A</span><span>{Object.keys(selected).length}/7 SLOTS EQUIPPED</span></div>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg border border-slate-700 bg-[#111720] p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">{en ? 'Equipment slots' : 'Слоты экипировки'}</h2><span className="text-xs text-slate-500">{Object.keys(selected).length}/7</span></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SLOTS.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => { setSlot(id); setSearch(''); }} className={`flex items-center gap-2 rounded border px-3 py-3 text-left text-sm transition ${slot === id ? 'border-orange-500 bg-orange-500/10 text-orange-300' : 'border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-500'}`}><Icon size={16}/><span>{en ? ({head:'Head',face:'Face',torso:'Torso',legs:'Legs',hands:'Hands',feet:'Footwear',back:'Back'} as Record<Slot,string>)[id] : label}</span>{selected[id] && <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400"/>}</button>)}
          </div>
        </div>
        <div className="rounded-lg border border-slate-700 bg-[#111720] p-4">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">{en ? 'Item catalogue' : 'Каталог предметов'}</h2><span className="text-[10px] text-slate-500">DEMO DATA</span></div>
          <label className="mb-3 flex items-center gap-2 rounded border border-slate-700 bg-slate-950 px-3 py-2"><Search size={15} className="text-slate-500"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={en ? 'Search items...' : 'Поиск предметов...'} className="w-full bg-transparent text-sm outline-none"/></label>
          <div className="max-h-56 space-y-2 overflow-y-auto">
            {currentItems.map(item => <button key={item.id} onClick={() => choose(item)} className={`flex w-full items-center justify-between rounded border px-3 py-3 text-left ${selected[slot]?.id === item.id ? 'border-orange-500 bg-orange-500/10' : 'border-slate-800 bg-slate-950/60 hover:border-slate-600'}`}>
              <span><span className="block text-sm font-semibold">{item.name}</span><span className="mt-1 block text-[10px] text-slate-500">{item.tier === 'vip' ? 'DIAMOND VIP' : 'STANDARD'}</span></span>
              <span className="flex items-center gap-2 text-xs text-slate-300">{item.price === null ? '—' : item.price + ' ₽'}{item.tier === 'vip' && !isVip && <Lock size={13} className="text-orange-400"/>}</span>
            </button>)}
            {currentItems.length === 0 && <p className="py-6 text-center text-sm text-slate-500">{en ? 'No items in this category yet.' : 'В этой категории пока нет предметов.'}</p>}
          </div>
          {notice && <p className="mt-3 text-xs text-orange-300">{notice}</p>}
        </div>
        <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-4">
          <div className="flex items-center justify-between"><span className="text-xs tracking-widest text-orange-300">{en ? 'ESTIMATED SET VALUE' : 'ОЦЕНОЧНАЯ СТОИМОСТЬ'}</span><strong className="text-2xl">{total.toLocaleString('ru-RU')} ₽</strong></div>
          <p className="mt-1 text-[10px] text-slate-500">{en ? 'Illustrative sample prices, not live market quotes.' : 'Демонстрационные цены, не актуальные котировки торговых площадок.'}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => { setSaved(true); setNotice(en ? 'Loadout saved in this session.' : 'Комплект сохранён в текущем сеансе.'); }} className="flex items-center gap-2 rounded bg-orange-600 px-4 py-2 text-sm font-bold hover:bg-orange-500"><Save size={15}/>{en ? 'Save set' : 'Сохранить комплект'}</button>
            <button onClick={share} className="flex items-center gap-2 rounded border border-slate-600 px-4 py-2 text-sm hover:border-orange-400"><Share2 size={15}/>{en ? 'Share' : 'Поделиться'}</button>
            {saved && <span className="self-center text-xs text-emerald-400">{en ? 'Saved' : 'Сохранено'}</span>}
          </div>
        </div>
      </div>
    </div>
    <p className="text-xs leading-relaxed text-slate-500">{en ? 'Prototype note: the current character is a UI preview, not an original Rust 3D asset. The catalogue and prices are sample data. Real game models, skins, licensed textures and live market data are connected in later milestones.' : 'Важно: сейчас персонаж — интерфейсный макет, не оригинальная 3D-модель Rust. Каталог и цены демонстрационные. Подключение настоящих моделей, скинов, текстур и актуальных рыночных данных — следующие этапы разработки.'}</p>
  </section>;
}
