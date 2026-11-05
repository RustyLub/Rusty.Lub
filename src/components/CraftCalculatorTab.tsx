import { useMemo, useState } from 'react';
import { raidWeapons } from '../data';
import { ItemImageOrFallback } from './IconUtils';
import { ArrowLeftRight, Minus, Plus, RotateCcw, Package } from 'lucide-react';
import { weaponTranslationMap } from '../translations';

type Props = { lang: 'ru' | 'en'; onBackToRaid: () => void };

type ResourceMap = Record<string, number>;

const recipes: Record<string, { yields: number; ingredients: ResourceMap }> = {
  c4: { yields: 1, ingredients: { explosives: 20, cloth: 5, techTrash: 2 } },
  rocket: { yields: 1, ingredients: { explosives: 10, gunpowder: 150, metal: 50, pipes: 2 } },
  satchel: { yields: 1, ingredients: { beancan: 4, stash: 1, rope: 1 } },
  explosive_ammo: { yields: 2, ingredients: { gunpowder: 10, sulfur: 5, metal: 10 } },
  beancan: { yields: 1, ingredients: { gunpowder: 60, sulfur: 10, metal: 20 } }
};

const labels: Record<string, { ru: string; en: string }> = {
  sulfur: { ru: 'Сера', en: 'Sulfur' },
  charcoal: { ru: 'Древесный уголь', en: 'Charcoal' },
  metal: { ru: 'Металлические фрагменты', en: 'Metal fragments' },
  gunpowder: { ru: 'Порох', en: 'Gunpowder' },
  explosives: { ru: 'Взрывчатка', en: 'Explosives' },
  cloth: { ru: 'Ткань', en: 'Cloth' },
  techTrash: { ru: 'Технический мусор', en: 'Tech trash' },
  pipes: { ru: 'Металлические трубы', en: 'Metal pipes' },
  beancan: { ru: 'Бобовые гранаты', en: 'Bean can grenades' },
  stash: { ru: 'Маленький тайник', en: 'Small stash' },
  rope: { ru: 'Верёвка', en: 'Rope' },
  lowgrade: { ru: 'Топливо низкого качества', en: 'Low grade fuel' }
};

const craftableIds = ['c4', 'rocket', 'satchel', 'explosive_ammo', 'beancan'];

export default function CraftCalculatorTab({ lang, onBackToRaid }: Props) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const isRu = lang === 'ru';

  const update = (id: string, delta: number) => setQuantities(prev => {
    const next = Math.max(0, (prev[id] || 0) + delta);
    const copy = { ...prev };
    if (next === 0) delete copy[id]; else copy[id] = next;
    return copy;
  });

  const totals = useMemo(() => {
    const result: ResourceMap = {};
    const add = (key: string, value: number) => { result[key] = (result[key] || 0) + value; };
    Object.entries(quantities).forEach(([id, qty]) => {
      const recipe = recipes[id];
      if (!recipe || qty <= 0) return;
      Object.entries(recipe.ingredients).forEach(([key, amount]) => add(key, Math.ceil(qty / recipe.yields) * amount));
    });
    // Satchels require four crafted beancan grenades each; expand those recipes too.
    const beancans = result.beancan || 0;
    if (beancans) {
      add('gunpowder', beancans * 60);
      add('sulfur', beancans * 10);
      add('metal', beancans * 20);
      delete result.beancan;
    }
    // Convert intermediate explosives and gunpowder into their base ingredients.
    const explosives = result.explosives || 0;
    if (explosives) {
      add('gunpowder', explosives * 50);
      add('lowgrade', explosives * 3);
      add('sulfur', explosives * 10);
      add('metal', explosives * 10);
      delete result.explosives;
    }
    const totalGunpowder = result.gunpowder || 0;
    if (totalGunpowder) {
      add('sulfur', totalGunpowder);
      add('charcoal', totalGunpowder * 2);
      delete result.gunpowder;
    }
    return result;
  }, [quantities]);

  const items = raidWeapons.filter(w => craftableIds.includes(w.id));
  const selectedCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <section className="space-y-4 border border-[#29313b] bg-[#11171e] p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-orange-500"><Package size={13}/>{isRu ? 'Подготовка ресурсов' : 'Resource planning'}</div>
          <h2 className="text-xl font-black tracking-tight text-white">{isRu ? 'Калькулятор крафта' : 'Craft calculator'}</h2>
          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">{isRu ? 'Добавь, что собираешься крафтить. Ниже увидишь, сколько серы, угля, металла и остальных ресурсов нужно принести на верстак.' : 'Add the items you want to craft. The list below shows how much sulfur, charcoal, metal and other resources you need.'}</p>
        </div>
        <button onClick={onBackToRaid} className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#3a414e] px-3 py-2 text-xs font-bold text-gray-300 transition-colors hover:border-orange-500 hover:text-white">
          <ArrowLeftRight size={14}/>{isRu ? 'К рейд-калькулятору' : 'Raid calculator'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(item => {
          const qty = quantities[item.id] || 0;
          const name = weaponTranslationMap[item.id]?.[lang] || item.name;
          return <div key={item.id} className={`flex items-center gap-3 border p-3 ${qty ? 'border-orange-500/60 bg-orange-500/5' : 'border-[#2a2f3b] bg-[#1b1e26]'}`}>
            <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-[#101319]">
              <ItemImageOrFallback id={item.id} lang={lang} size={30}/>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white">{name}</div>
              <div className="text-[10px] text-gray-500">{isRu ? 'Количество к изготовлению' : 'Quantity to craft'}</div>
            </div>
            <div className="flex items-center gap-2">
              <button aria-label="Decrease" onClick={() => update(item.id, -1)} className="h-9 w-9 shrink-0 border border-[#3a414e] text-gray-300 transition-colors hover:border-orange-500 hover:text-white"><Minus size={13}/></button>
              <input type="number" min="0" max="99999" value={qty || ''} placeholder="0" onChange={e => setQuantities(p => ({...p, [item.id]: Math.max(0, Math.min(99999, Math.floor(Number(e.target.value) || 0)))}))} className="h-9 w-16 bg-[#0c0d10] border border-[#3a414e] text-center text-sm text-white py-1 outline-none focus:border-orange-500"/>
              <button aria-label="Increase" onClick={() => update(item.id, 1)} className="h-9 w-9 shrink-0 border border-[#3a414e] text-orange-400 transition-colors hover:bg-orange-500 hover:text-[#101318]"><Plus size={13}/></button>
            </div>
          </div>;
        })}
      </div>

      <div className="border border-orange-500/30 bg-[#0c1117] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-orange-400 flex items-center gap-2"><Package size={15}/>{isRu ? 'Общий список ресурсов' : 'Combined resource list'}</h4>
          <button onClick={() => setQuantities({})} className="text-[10px] uppercase font-bold text-gray-500 hover:text-white flex items-center gap-1"><RotateCcw size={12}/>{isRu ? 'Сбросить' : 'Reset'}</button>
        </div>
        {selectedCount === 0 ? <p className="text-xs text-gray-500 py-4 text-center">{isRu ? 'Добавь предметы выше, чтобы рассчитать ингредиенты.' : 'Add items above to calculate ingredients.'}</p> :
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {Object.entries(totals).filter(([,v]) => v > 0).map(([key, value]) => <div key={key} className="bg-[#11171e] border border-[#29313b] p-3">
              <div className="text-[10px] text-gray-500">{labels[key]?.[lang] || key}</div>
              <div className="text-lg font-black text-white tabular-nums">{Math.ceil(value).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}</div>
            </div>)}
          </div>}
        <p className="text-[10px] text-gray-600">{isRu ? 'Считаем по обычным рецептам Rust. Если предмет крафтится партией, калькулятор округляет вверх — лишний ресурс лучше учесть заранее.' : 'Uses standard Rust crafting recipes. Items made in batches are rounded up, so you can bring enough materials.'}</p>
      </div>
    </section>
  );
}
