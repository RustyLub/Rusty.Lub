import { useState } from 'react';
import { raidWeapons, raidTargets } from '../data';
import { RaidWeapon, RaidTarget } from '../types';
import { ItemImageOrFallback } from './IconUtils';
import { db, collection, addDoc } from '../firebase';
import { 
  Shield, 
  Hammer, 
  Flame, 
  Trash2, 
  Plus, 
  Minus, 
  Info,
  Bomb,
  Rocket,
  Backpack,
  Zap,
  Layers,
  Grid,
  Fence,
  DoorClosed,
  Warehouse,
  Lock,
  Archive,
  Crosshair,
  ShieldAlert,
  Save,
  Bookmark,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { weaponTranslationMap, targetTranslationMap } from '../translations';
import CraftCalculatorTab from './CraftCalculatorTab';

// Use the original Rust item/building icons resolved by their real shortnames.
export default function RaidCalculatorTab({ lang, user, onRequireAuth, onToast }: RaidCalculatorTabProps) {
  const [calculatorMode, setCalculatorMode] = useState<'raid' | 'craft'>('raid');
  const [selectedWeaponId, setSelectedWeaponId] = useState<RaidWeapon['id']>('c4');
  const [activeCategory, setActiveCategory] = useState<'walls' | 'doors' | 'deployables'>('walls');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isSavingRaid, setIsSavingRaid] = useState(false);
  const [raidSaveName, setRaidSaveName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);


  const WeaponIcon = ({ id, size = 20 }: { id: string; size?: number }) => {
    const weapon = raidWeapons.find((item) => item.id === id);
    return <ItemImageOrFallback id={id} lang={lang} size={size} icon={weapon?.icon} />;
  };

  const TargetIcon = ({ id, size = 24 }: { id: string; size?: number }) => {
    const target = raidTargets.find((item) => item.id === id);
    return <ItemImageOrFallback id={id} lang={lang} size={size} icon={target?.icon} />;
  };

  const selectedWeapon = raidWeapons.find((w) => w.id === selectedWeaponId)!;

  // Filter targets based on selected tab category
  const filteredTargets = raidTargets.filter((t) => t.category === activeCategory);

  const visualWallIds = ['wood_wall', 'stone_wall', 'sheet_wall', 'armored_wall'];
  const otherTargets = activeCategory === 'walls'
    ? filteredTargets.filter(t => !visualWallIds.includes(t.id))
    : filteredTargets;

  const updateQuantity = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  };

  const handleSaveRaid = async () => {
    if (!user) {
      if (onRequireAuth) onRequireAuth();
      return;
    }

    if (totalWeaponsNeeded <= 0) {
      if (onToast) onToast(lang === 'ru' ? 'Выберите цели для рейда!' : 'Select raid targets first!', 'warning');
      return;
    }

    const defaultTitle = `${targetDetailsList.map(t => `${t.qty}x ${targetTranslationMap[t.target.id]?.[lang] || t.target.name}`).slice(0, 2).join(', ')}`;
    const raidTitle = raidSaveName.trim() || defaultTitle;

    setIsSavingRaid(true);
    try {
      const raidPayload = {
        userId: user.uid,
        name: raidTitle,
        selectedWeaponId,
        quantities,
        totalWeaponsNeeded,
        totalSulfur,
        totalGP,
        createdAt: new Date().toISOString()
      };

      // Save to local storage for quick access
      try {
        const localKey = `saved_raids_${user.uid}`;
        const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
        const updated = [{ ...raidPayload, id: 'local_' + Date.now() }, ...existing].slice(0, 25);
        localStorage.setItem(localKey, JSON.stringify(updated));
      } catch (e) {
        console.error("Local storage error:", e);
      }

      // Save to Firestore
      await addDoc(collection(db, 'saved_raids'), raidPayload);
      setShowSaveDialog(false);
      setRaidSaveName('');
      if (onToast) onToast(lang === 'ru' ? 'Рейд успешно сохранен в Личный кабинет!' : 'Raid saved to your Profile Cabinet!', 'success');
    } catch (err) {
      console.error("Failed to save raid:", err);
      if (onToast) onToast(lang === 'ru' ? 'Сохранено локально в профиле' : 'Saved locally in profile', 'success');
      setShowSaveDialog(false);
    } finally {
      setIsSavingRaid(false);
    }
  };

  const clearAll = () => {
    setQuantities({});
  };

  // Calculations
  let totalWeaponsNeeded = 0;
  const targetDetailsList: { target: RaidTarget; qty: number; weaponsNeededForTarget: number }[] = [];

  Object.keys(quantities).forEach((targetId) => {
    const qty = quantities[targetId] || 0;
    const target = raidTargets.find((t) => t.id === targetId);
    if (target && qty > 0) {
      // Get requirement for single target
      const weaponsForOne = (target[selectedWeaponId] as number) || 0;
      const totalForThisTarget = weaponsForOne * qty;
      totalWeaponsNeeded += totalForThisTarget;
      targetDetailsList.push({
        target,
        qty,
        weaponsNeededForTarget: totalForThisTarget
      });
    }
  });

  // Explosive 5.56 crafts in batches of two. Round the required ammo up to a complete batch,
  // otherwise odd quantities would understate the real materials needed.
  const costedWeaponUnits = selectedWeaponId === 'explosive_ammo'
    ? Math.ceil(totalWeaponsNeeded / 2) * 2
    : totalWeaponsNeeded;
  const totalSulfur = costedWeaponUnits * selectedWeapon.sulfurPer;
  const totalCharcoal = costedWeaponUnits * selectedWeapon.charcoalPer;
  const totalGP = costedWeaponUnits * selectedWeapon.gpPer;
  const totalMetal = costedWeaponUnits * selectedWeapon.metalPer;

  const calculatorHeader = (
    <header className="relative overflow-hidden border border-[#29313b] bg-[#11171e] px-5 py-5 sm:px-7 sm:py-6">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_at_right,rgba(249,115,22,.15),transparent_72%)]" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[.2em] text-orange-500">
            <span>// RUSTY.LUB</span><span className="text-slate-600">·</span><span className="text-slate-400">{lang === 'ru' ? 'ПЛАНИРОВАНИЕ РЕЙДА' : 'RAID PLANNER'}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{lang === 'ru' ? 'Рейд-калькулятор' : 'Raid calculator'}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">{lang === 'ru' ? 'Прикинь расход взрывчатки до выхода. Выбери оружие, добавь стены и двери — калькулятор соберёт общий список.' : 'Work out the explosive cost before you head out. Pick your weapon, add walls and doors, and get the full total.'}</p>
        </div>
        <div className="flex items-center gap-3 border-l border-slate-700/70 pl-4">
          <div className="text-right"><div className="text-xl font-black tabular-nums text-white">{Object.values(quantities).reduce((sum, qty) => sum + qty, 0)}</div><div className="text-[9px] font-mono uppercase tracking-widest text-slate-400">{lang === 'ru' ? 'ЦЕЛЕЙ В СПИСКЕ' : 'TARGETS ADDED'}</div></div>
          <div className="flex h-10 w-10 items-center justify-center border border-orange-500/30 bg-orange-500/10 text-orange-400"><Bomb size={20}/></div>
        </div>
      </div>
    </header>
  );

  const modeSwitcher = (
    <div className="flex w-full flex-col gap-1 border border-[#29313b] bg-[#0c1117] p-1 sm:w-fit sm:flex-row" role="tablist" aria-label={lang === 'ru' ? 'Режим калькулятора' : 'Calculator mode'}>
      <button type="button" role="tab" aria-selected={calculatorMode === 'raid'} onClick={() => setCalculatorMode('raid')} className={`min-h-10 px-4 py-2 text-left text-xs font-bold transition-colors sm:min-w-[190px] ${calculatorMode === 'raid' ? 'bg-orange-500 text-[#101318]' : 'text-slate-400 hover:bg-[#18212b] hover:text-white'}`}>
        <span className="flex items-center gap-2"><Bomb size={15}/>{lang === 'en' ? 'Raid calculator' : 'Расчёт рейда'}</span>
        <span className={`mt-0.5 block text-[10px] font-normal ${calculatorMode === 'raid' ? 'text-[#33200f]/80' : 'text-slate-500'}`}>{lang === 'ru' ? 'Сколько взрывчатки нужно' : 'Explosives needed'}</span>
      </button>
      <button type="button" role="tab" aria-selected={calculatorMode === 'craft'} onClick={() => setCalculatorMode('craft')} className={`min-h-10 px-4 py-2 text-left text-xs font-bold transition-colors sm:min-w-[190px] ${calculatorMode === 'craft' ? 'bg-orange-500 text-[#101318]' : 'text-slate-400 hover:bg-[#18212b] hover:text-white'}`}>
        <span className="flex items-center gap-2"><Hammer size={15}/>{lang === 'en' ? 'Craft calculator' : 'Расчёт крафта'}</span>
        <span className={`mt-0.5 block text-[10px] font-normal ${calculatorMode === 'craft' ? 'text-[#33200f]/80' : 'text-slate-500'}`}>{lang === 'ru' ? 'Сколько ресурсов подготовить' : 'Resources to prepare'}</span>
      </button>
    </div>
  );

  if (calculatorMode === 'craft') {
    return (
      <div className="mx-auto w-full max-w-[1440px] space-y-4 pb-8">
        {calculatorHeader}
        {modeSwitcher}
        <CraftCalculatorTab lang={lang} onBackToRaid={() => setCalculatorMode('raid')} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-4 pb-8">
      {calculatorHeader}
      {modeSwitcher}
      <div className="border border-[#29313b] bg-[#11171e] px-4 py-3 text-xs leading-5 text-slate-400">
        <span className="font-bold text-orange-400">{lang === 'ru' ? 'Как пользоваться: ' : 'Quick start: '}</span>
        {lang === 'ru' ? 'Слева выбери тип взрывчатки, справа добавь нужные стены, двери или объекты. Если считаешь несколько точек, просто увеличивай количество — итог обновится сам.' : 'Choose your explosives on the left, then add the walls, doors or deployables on the right. Increase quantities for multiple targets and the totals update automatically.'}
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      {/* Weapon Selector */}
      <div className="xl:col-span-4 bg-[#11171e] p-4 border border-[#29313b] space-y-3 h-fit">
        <h3 className="text-xs font-bold text-white uppercase flex items-center gap-2">
          <span>⚔️</span> {lang === 'en' ? 'Weapon Selection' : 'Выбор Вооружения'}
        </h3>

        <div className="space-y-2">
          {raidWeapons.map((weapon) => {
            const isSelected = selectedWeaponId === weapon.id;
            const wName = weaponTranslationMap[weapon.id]?.[lang] || weapon.name;
            return (
              <button
                key={weapon.id}
                onClick={() => setSelectedWeaponId(weapon.id)}
                className={`w-full flex items-center gap-3 p-3 border text-left transition-all ${
                  isSelected
                    ? 'bg-[#f97316] border-[#f97316] text-white'
                    : 'bg-[#1b1e26] border-[#2a2f3b] text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <div className={`w-10 h-10 flex items-center justify-center ${isSelected ? 'bg-[#14171e]' : 'bg-[#14171e]'}`}>
                  <WeaponIcon id={weapon.id} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold uppercase truncate">
                    {wName}
                  </h4>
                  <div className={`text-[9px] mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                    {lang === 'en' ? `S:${weapon.sulfurPer} M:${weapon.metalPer}` : `Сера:${weapon.sulfurPer} Металл:${weapon.metalPer}`}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Targets & Calculations */}
      <div className="xl:col-span-8 space-y-4">
        <div className="bg-[#11171e] p-4 border border-[#29313b] flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex gap-1 bg-[#0c0d10] p-0.5 border border-[#2a2f3b] w-full sm:w-auto">
            {[
              { id: 'walls', label: lang === 'en' ? '🧱 Walls' : '🧱 Стены' },
              { id: 'doors', label: lang === 'en' ? '🚪 Doors' : '🚪 Двери' },
              { id: 'deployables', label: lang === 'en' ? '⚙️ Items' : '⚙️ Объекты' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`flex-1 sm:flex-none px-3 py-1.5 text-[10px] font-bold uppercase transition-all ${
                  activeCategory === cat.id
                    ? 'bg-[#f97316] text-white'
                    : 'text-gray-400 hover:text-white bg-[#14171e]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {Object.keys(quantities).length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 text-[10px] font-bold text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 border border-rose-500/20 uppercase"
            >
              <Trash2 size={12} className="inline mr-1" />
              {lang === 'en' ? 'Clear' : 'Очистить'}
            </button>
          )}
        </div>
        
        {/* Dynamic Target Quantity Sliders Grid / Custom Visual Wall Tier Selector */}
        {activeCategory === 'walls' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono">
              {lang === 'en' ? '🛡️ Choose Structural Wall Tier' : '🛡️ Выберите тип стены (тиры прочности)'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 'wood_wall',
                  nameRU: 'Деревянная стена',
                  nameEN: 'Wood Wall',
                  hp: 250,
                  costRU: '200 Дерева',
                  costEN: '200 Wood',
                  
                  bgColor: 'border-[#854d0e]/30 bg-[#854d0e]/5 hover:bg-[#854d0e]/10'
                },
                {
                  id: 'stone_wall',
                  nameRU: 'Каменная стена',
                  nameEN: 'Stone Wall',
                  hp: 500,
                  costRU: '300 Камня',
                  costEN: '300 Stone',
                  
                  bgColor: 'border-[#4b5563]/30 bg-[#4b5563]/5 hover:bg-[#4b5563]/10'
                },
                {
                  id: 'sheet_wall',
                  nameRU: 'Металлическая стена',
                  nameEN: 'Sheet Metal Wall',
                  hp: 1000,
                  costRU: '200 Фрагментов',
                  costEN: '200 Metal Frags',
                  
                  bgColor: 'border-[#334155]/30 bg-[#334155]/5 hover:bg-[#334155]/10'
                },
                {
                  id: 'armored_wall',
                  nameRU: 'Бронированная стена',
                  nameEN: 'Armored Wall',
                  hp: 2000,
                  costRU: '25 МВК (HQM)',
                  costEN: '25 HQM',
                  
                  bgColor: 'border-[#ca8a04]/30 bg-[#ca8a04]/5 hover:bg-[#ca8a04]/10'
                }
              ].map((wall) => {
                const targetObj = raidTargets.find(t => t.id === wall.id);
                if (!targetObj) return null;

                const qty = quantities[wall.id] || 0;
                const singleTargetWeaponNeed = (targetObj[selectedWeaponId] as number) || 0;
                const totalTargetWeaponNeed = singleTargetWeaponNeed * qty;

                return (
                  <motion.div
                    key={wall.id}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`border p-4 flex flex-col justify-between relative overflow-hidden transition-all ${
                      qty > 0 ? 'border-[#f97316] bg-[#f97316]/5 shadow-lg shadow-[#f97316]/5' : wall.bgColor
                    }`}
                  >
                    {/* Visual corner indicators */}
                    <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-500/25" />
                    <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-gray-500/25" />
                    <div className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-gray-500/25" />
                    <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-gray-500/25" />

                    <div className="space-y-4">
                      {/* Central illustration & label */}
                      <div className="text-center space-y-2">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center bg-[#0c0d10] border border-[#2a2f3b] rounded-none shadow-inner relative">
                          <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-500/50" />
                          <TargetIcon id={wall.id} size={48} />
                        </div>
                        <div>
                          <h4 className="text-xs font-black tracking-wider text-white uppercase font-sans">
                            {lang === 'ru' ? wall.nameRU : wall.nameEN}
                          </h4>
                          <span className="text-[9px] text-gray-500 font-mono block mt-0.5">
                            {lang === 'ru' ? `Стоимость: ${wall.costRU}` : `Cost: ${wall.costEN}`}
                          </span>
                        </div>
                      </div>

                      {/* HP Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[9px] font-mono text-gray-400">
                          <span>HP CAPACITY</span>
                          <span>{wall.hp} HP</span>
                        </div>
                        <div className="h-1 bg-gray-900 w-full rounded-none overflow-hidden border border-gray-800">
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                            style={{ width: `${(wall.hp / 2000) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Ammo count details */}
                      <div className="bg-[#0c0d10]/60 p-2 border border-[#2a2f3b]/50 text-center font-mono">
                        <span className="text-[9px] text-gray-500 block uppercase">
                          {lang === 'ru' ? 'Расход взрывчатки' : 'Explosives Cost'}
                        </span>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-xs font-black">
                          <WeaponIcon id={selectedWeaponId} size={14} />
                          <span className="text-[#f97316]">{singleTargetWeaponNeed > 0 ? singleTargetWeaponNeed : '—'}</span>
                          <span className="text-gray-500 text-[10px]">x</span>
                          <span className="text-gray-300">{qty || 1}</span>
                          {qty > 0 && (
                            <>
                              <span className="text-gray-500">=</span>
                              <span className="text-emerald-400 font-bold">{totalTargetWeaponNeed}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-4 bg-[#0c0d10] border border-[#2a2f3b] p-1 rounded-none">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(wall.id, -1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#f97316] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span className="text-xs font-mono font-black text-white min-w-[24px] text-center">
                        {qty}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(wall.id, 1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#f97316] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {otherTargets.length > 0 && (
          <div className="space-y-3">
            {activeCategory === 'walls' && (
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono pt-2">
                {lang === 'en' ? '🧱 External Walls & Barricades' : '🧱 Внешние стены и баррикады'}
              </h3>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {otherTargets.map((target) => {
                const qty = quantities[target.id] || 0;
                const singleTargetWeaponNeed = (target[selectedWeaponId] as number) || 0;
                const targetName = targetTranslationMap[target.id]?.[lang] || target.name;

                return (
                  <motion.div
                    key={target.id}
                    whileHover={{ scale: 1.02, y: -3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    className={`group bg-[#14171e]/90 p-4 rounded-none border flex flex-col justify-between relative overflow-hidden ${
                      qty > 0
                        ? 'border-[#f97316] bg-[#14171e]/90 shadow-md shadow-[#f97316]/5'
                        : 'border-[#2a2f3b] hover:border-gray-700'
                    }`}
                  >
                    {/* Tactical Corner Brackets */}
                    <div className="rust-bracket-tl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-tr opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-bl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="rust-bracket-br opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="text-center space-y-2 mb-3 z-10">
                      <div className="bg-[#0c0d10] w-12 h-12 rounded-none mx-auto flex items-center justify-center border border-[#2a2f3b] shadow-inner relative">
                        <div className="absolute top-0.5 left-0.5 w-0.5 h-0.5 bg-gray-500/50" />
                        <TargetIcon id={target.id} size={24} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-200 font-sans tracking-tight line-clamp-2 min-h-[32px] flex items-center justify-center uppercase font-mono">
                          {targetName}
                        </h4>
                        <span className="inline-block text-[10px] text-gray-500 font-sans mt-1">
                          {lang === 'en' ? (
                            <>HP: {target.hp} | Need: <strong className="text-[#f97316] font-mono font-bold text-xs">{singleTargetWeaponNeed > 0 ? singleTargetWeaponNeed : '—'}</strong> pcs.</>
                          ) : (
                            <>HP: {target.hp} | Надо: <strong className="text-[#f97316] font-mono font-bold text-xs">{singleTargetWeaponNeed > 0 ? singleTargetWeaponNeed : '—'}</strong> шт.</>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Adjust buttons */}
                    <div className="flex items-center justify-between bg-[#0c0d10] border border-[#2a2f3b] p-1.5 rounded-none z-10">
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(target.id, -1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#f97316] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Minus size={12} />
                      </motion.button>
                      <span className="text-xs font-mono font-bold text-white min-w-[20px] text-center">
                        {qty}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => updateQuantity(target.id, 1)}
                        className="w-8 h-8 rounded-none bg-[#1b1e26] hover:bg-[#f97316] text-gray-400 hover:text-white border border-[#2a2f3b] flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Plus size={12} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Targets Chip Container */}
        <div className="bg-[#11171e] p-5 border border-[#29313b] space-y-4 shadow-xl relative overflow-hidden">
          <div className="rust-bracket-tl" />
          <div className="rust-bracket-tr" />
          <div className="rust-bracket-bl" />
          <div className="rust-bracket-br" />

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 font-mono text-[10px]">
              {lang === 'en' ? 'Selected raid targets:' : 'Выбранные цели для рейда:'}
            </h3>
            {targetDetailsList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {targetDetailsList.map(({ target, qty, weaponsNeededForTarget }) => {
                  const targetName = targetTranslationMap[target.id]?.[lang] || target.name;
                  return (
                    <span
                      key={target.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#1b1e26] border border-[#2a2f3b] text-xs text-gray-300 font-mono uppercase"
                    >
                      <span className="flex items-center justify-center"><TargetIcon id={target.id} size={14} /></span>
                      <span>{targetName}</span>
                      <strong className="text-[#f97316] font-bold">×{qty}</strong>
                      <span className="text-[10px] text-gray-500 font-mono font-bold lowercase">
                        {lang === 'en' ? `(requires ${weaponsNeededForTarget} pcs.)` : `(требует ${weaponsNeededForTarget} шт.)`}
                      </span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-gray-500 font-sans italic font-medium">
                {lang === 'en' 
                  ? 'No targets selected. Use the "+" buttons above to add raid targets.' 
                  : 'Цели не выбраны. Используйте кнопки "+" выше, чтобы добавить элементы для рейда.'
                }
              </div>
            )}
          </div>

          {/* Results Summary Box */}
          <AnimatePresence mode="popLayout">
            {totalWeaponsNeeded > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="border-t border-[#2a2f3b] pt-5 space-y-4"
              >
                {/* Total Weapon Requirement Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="text-sm font-bold text-white flex items-center gap-2 font-sans font-medium uppercase">
                    <span>{lang === 'en' ? 'Required for raid:' : 'Потребуется для взрыва:'}</span>
                    <span className="inline-flex items-center gap-1.5 bg-[#f97316]/10 text-[#f97316] px-3 py-1 rounded-none border border-[#f97316]/20 font-mono">
                      <span className="flex items-center justify-center"><WeaponIcon id={selectedWeapon.id} size={14} /></span>
                      <span>{weaponTranslationMap[selectedWeapon.id]?.[lang] || selectedWeapon.name}</span>
                    </span>
                  </div>
                  <div className="text-2xl font-black text-[#f97316] font-mono">
                    {totalWeaponsNeeded} <span className="text-xs text-gray-400 font-sans font-bold uppercase">{lang === 'en' ? 'pcs.' : 'шт.'}</span>
                  </div>
                </div>

                {/* Raw Ingredients breakdown */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase mb-1 font-mono">
                    {lang === 'en' ? 'Total raw resources for explosive crafting:' : 'Общие сырьевые ресурсы для крафта взрывчатки:'}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Sulfur */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Sulfur' : 'Сера (Sulfur)'}
                      </span>
                      <span className="text-sm font-black text-amber-500 font-mono mt-1">
                        {totalSulfur.toLocaleString()}
                      </span>
                    </div>

                    {/* Charcoal */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Charcoal' : 'Уголь (Charcoal)'}
                      </span>
                      <span className="text-sm font-black text-gray-400 font-mono mt-1">
                        {totalCharcoal.toLocaleString()}
                      </span>
                    </div>

                    {/* Gunpowder */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Gunpowder' : 'Порох (GP)'}
                      </span>
                      <span className="text-sm font-black text-rose-500 font-mono mt-1">
                        {totalGP.toLocaleString()}
                      </span>
                    </div>

                    {/* Metal Fragments */}
                    <div className="bg-[#1b1e26] p-3 rounded-none border border-[#2a2f3b] flex flex-col justify-between relative">
                      <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                        {lang === 'en' ? 'Metal (Frags)' : 'Металл (Frags)'}
                      </span>
                      <span className="text-sm font-black text-sky-500 font-mono mt-1">
                        {totalMetal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {selectedWeapon.extraCosts && selectedWeapon.extraCosts.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedWeapon.extraCosts.map((cost) => (
                        <div key={cost.id} className="bg-[#1b1e26] p-3 border border-[#2a2f3b] flex flex-col justify-between">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">
                            {lang === 'en' ? cost.nameEn : cost.nameRu}
                          </span>
                          <span className="text-sm font-black text-slate-200 font-mono mt-1">
                            {(cost.amount * costedWeaponUnits).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {selectedWeapon.craftable === false && (
                    <p className="text-[10px] text-amber-400">
                      {lang === 'en' ? 'Loot-only item: no crafting recipe.' : 'Предмет не крафтится — добывается из игрового события/лут-таблицы.'}
                    </p>
                  )}
                </div>

                {/* Save Raid Action Bar */}
                <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-[#2a2f3b]/60">
                  <button
                    onClick={() => {
                      if (!user) {
                        if (onRequireAuth) onRequireAuth();
                        return;
                      }
                      setShowSaveDialog(true);
                    }}
                    className="btn-orange text-xs py-2 px-4 flex items-center gap-2"
                  >
                    <Bookmark size={14} />
                    <span>{lang === 'ru' ? '💾 Сохранить расчет в профиль' : '💾 Save raid to cabinet'}</span>
                  </button>

                  <div className="text-[11px] font-mono text-zinc-400">
                    {user ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check size={12} /> {lang === 'ru' ? 'Авторизован: рейд будет сохранен в облако' : 'Logged in: saved to cloud profile'}
                      </span>
                    ) : (
                      <span className="text-amber-400/80">
                        {lang === 'ru' ? 'Войдите, чтобы привязать расчет к профилю' : 'Log in to sync raid calculations'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Save Dialog Modal */}
                {showSaveDialog && (
                  <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#12161e] border border-[#1e2633] max-w-md w-full p-5 space-y-4 shadow-2xl relative">
                      <div className="hud-corner-tl" />
                      <div className="hud-corner-tr" />
                      <div className="hud-corner-bl" />
                      <div className="hud-corner-br" />

                      <h3 className="text-sm font-black text-white uppercase font-mono tracking-wider flex items-center gap-2">
                        <Bookmark size={15} className="text-[#f97316]" />
                        <span>{lang === 'ru' ? 'СОХРАНЕНИЕ РАСЧЕТА РЕЙДА' : 'SAVE RAID CALCULATION'}</span>
                      </h3>

                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        {lang === 'ru'
                          ? 'Укажите название рейда (например, "База соседа у Сферы" или "Рейд клана EAC") для быстрого доступа в личном кабинете.'
                          : 'Enter a name for this raid calculation to easily reference it later in your profile cabinet.'}
                      </p>

                      <input
                        type="text"
                        value={raidSaveName}
                        onChange={(e) => setRaidSaveName(e.target.value)}
                        placeholder={lang === 'ru' ? 'Название рейда...' : 'Raid name...'}
                        className="w-full px-3 py-2 text-xs bg-[#08090c] border border-[#1e2633] text-white focus:outline-none focus:border-[#f97316] font-mono"
                        autoFocus
                      />

                      <div className="flex gap-2 justify-end pt-2">
                        <button
                          type="button"
                          onClick={() => setShowSaveDialog(false)}
                          className="btn-ghost text-xs py-1.5 px-3"
                        >
                          {lang === 'ru' ? 'Отмена' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          disabled={isSavingRaid}
                          onClick={handleSaveRaid}
                          className="btn-orange text-xs py-1.5 px-4 flex items-center gap-1.5"
                        >
                          <Save size={13} />
                          <span>{isSavingRaid ? (lang === 'ru' ? 'Сохранение...' : 'Saving...') : (lang === 'ru' ? 'Сохранить' : 'Save')}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Info block */}
                <div className="bg-[#1b1e26]/50 p-3 rounded-none border border-[#2a2f3b] flex gap-2 items-start text-[10px] text-gray-500 font-sans leading-relaxed font-medium relative">
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-gray-600/50" />
                  <Info size={14} className="text-[#f97316] flex-shrink-0 mt-0.5" />
                  <span>
                    {lang === 'en' 
                      ? 'Counts are for full-health targets and the hard side. Unsupported explosive/target combinations are shown as a dash. Resource totals use Rust recipes; explosive ammo is rounded up to full two-round craft batches.'
                      : 'Количество указано для объекта с полным HP и жёсткой стороны. Для неподтверждённых сочетаний цели и взрывчатки показан прочерк. Разрывные патроны округляются до полной партии по 2 штуки.'
                    }
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>
    </div>
  );
}
