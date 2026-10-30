import { useMemo, useState } from 'react';
import { raidWeapons } from '../data';
import { ItemImageOrFallback } from './IconUtils';
import { ArrowLeftRight, Minus, Plus, RotateCcw, Package } from 'lucide-react';
import { weaponTranslationMap } from '../translations';

type Props = { lang: 'ru' | 'en'; onBackToRaid: () => void };

type ResourceMap = Record<string, number>;

const recipes: Record<string, { yields: number; ingredients: ResourceMap }> = {
  c4: { yields: 1, ingredients: { explosives: 20, cloth: 5, techTrash: 2 } },
  rocket: { yields: 1, ingredients: { explosives: 10, gunpowder: 150, pipes: 2 } },
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
      add('sulfur', totalGunpowder * 2);
      add('charcoal', totalGunpowder * 3);
      delete result.gunpowder;
    }
    return result;
  }, [quantities]);

  const items = raidWeapons.filter(w => craftableIds.includes(w.id));
  const selectedCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <section className="bg-[#14171e] border border-[#2a2f3b] p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-white">{isRu ? 'Калькулятор изготовления' : 'Craft calculator'}</h3>
          <p className="text-xs text-gray-500 mt-1">{isRu ? 'Укажи количество предметов — ингредиенты суммируются автоматически.' : 'Set item quantities — ingredients are combined automatically.'}</p>
        </div>
        <button onClick={onBackToRaid} className="inline-flex items-center gap-2 border border-[#3a414e] px-3 py-2 text-xs font-bold text-gray-300 hover:border-orange-500 hover:text-white">
          <ArrowLeftRight size={14}/>{isRu ? 'К рейд-калькулятору' : 'Raid calculator'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
              <button aria-label="Decrease" onClick={() => update(item.id, -1)} className="w-7 h-7 border border-[#3a414e] text-gray-300 flex items-center justify-center"><Minus size={13}/></button>
              <input type="number" min="0" max="99999" value={qty || ''} placeholder="0" onChange={e => setQuantities(p => ({...p, [item.id]: Math.max(0, Math.min(99999, Math.floor(Number(e.target.value) || 0)))}))} className="w-16 bg-[#0c0d10] border border-[#3a414e] text-center text-sm text-white py-1"/>
              <button aria-label="Increase" onClick={() => update(item.id, 1)} className="w-7 h-7 border border-[#3a414e] text-orange-400 flex items-center justify-center"><Plus size={13}/></button>
            </div>
          </div>;
        })}
      </div>

      <div className="border border-[#3a414e] bg-[#0e1117] p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-xs font-black uppercase tracking-widest text-orange-400 flex items-center gap-2"><Package size={15}/>{isRu ? 'Общий список ресурсов' : 'Combined resource list'}</h4>
          <button onClick={() => setQuantities({})} className="text-[10px] uppercase font-bold text-gray-500 hover:text-white flex items-center gap-1"><RotateCcw size={12}/>{isRu ? 'Сбросить' : 'Reset'}</button>
        </div>
        {selectedCount === 0 ? <p className="text-xs text-gray-500 py-4 text-center">{isRu ? 'Добавь предметы выше, чтобы рассчитать ингредиенты.' : 'Add items above to calculate ingredients.'}</p> :
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {Object.entries(totals).filter(([,v]) => v > 0).map(([key, value]) => <div key={key} className="bg-[#1b1e26] border border-[#2a2f3b] p-3">
              <div className="text-[10px] text-gray-500">{labels[key]?.[lang] || key}</div>
              <div className="text-lg font-black text-white tabular-nums">{Math.ceil(value).toLocaleString(lang === 'ru' ? 'ru-RU' : 'en-US')}</div>
            </div>)}
          </div>}
        <p className="text-[10px] text-gray-600">{isRu ? 'Расчёт по рецептам крафта Rust; округление выполняется до целых партий. MLRS и пропановая бомба не включены: они не входят в обычный крафт.' : 'Based on Rust crafting recipes; quantities are rounded up to whole crafting batches. MLRS and propane bomb are excluded because they are not standard craftable items.'}</p>
      </div>
    </section>
  );
}
