import React, { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Ticket, Wallet, Plus, Power, Trash2, Search, Percent, Coins } from 'lucide-react';

interface Props {
  lang: 'ru' | 'en';
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
  vipApplications: Array<{ id: string; userId: string; userDisplayName: string; status: string; paymentMethod: string; createdAt?: any }>;
}
interface PromoCode {
  id: string;
  code: string;
  discountType: 'fixed' | 'percent';
  discountValue: number;
  activationLimit: number;
  activationCount: number;
  active: boolean;
  expiresAt?: string;
  createdAt?: any;
}
export default function AdminFinancePanel({ lang, onToast, vipApplications }: Props) {
  const ru = lang === 'ru';
  const [section, setSection] = useState<'payments' | 'promos'>('payments');
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('percent');
  const [discountValue, setDiscountValue] = useState('10');
  const [activationLimit, setActivationLimit] = useState('10');
  const [expiresAt, setExpiresAt] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => onSnapshot(collection(db, 'promo_codes'), snapshot => {
    setPromos(snapshot.docs.map(item => ({ id: item.id, ...item.data() } as PromoCode)));
    setLoading(false);
  }, error => {
    setLoading(false);
    onToast(ru ? 'Не удалось загрузить промокоды. Проверьте права Firestore.' : 'Could not load promo codes. Check Firestore permissions.', 'error');
  }), [ru, onToast]);

  const filteredPromos = useMemo(() => promos.filter(item =>
    item.code.toLowerCase().includes(search.toLowerCase())
  ), [promos, search]);

  const createPromo = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    const value = Number(discountValue);
    const limit = Number(activationLimit);
    if (!/^[A-Z0-9_-]{3,24}$/.test(normalized) || !Number.isFinite(value) || value <= 0 ||
      !Number.isInteger(limit) || limit < 1 || (discountType === 'percent' && value > 100)) {
      onToast(ru ? 'Проверьте код, размер скидки и лимит активаций.' : 'Check the code, discount and activation limit.', 'error');
      return;
    }
    try {
      await addDoc(collection(db, 'promo_codes'), {
        code: normalized, discountType, discountValue: value, activationLimit: limit,
        activationCount: 0, active: true, expiresAt: expiresAt || null, createdAt: serverTimestamp(),
        createdBy: 'admin'
      });
      setCode(''); setDiscountValue('10'); setActivationLimit('10'); setExpiresAt('');
      onToast(ru ? 'Промокод создан.' : 'Promo code created.', 'success');
    } catch {
      onToast(ru ? 'Не удалось создать промокод. Проверьте права Firestore.' : 'Could not create promo code. Check Firestore permissions.', 'error');
    }
  };

  const togglePromo = async (promo: PromoCode) => {
    try { await updateDoc(doc(db, 'promo_codes', promo.id), { active: !promo.active }); }
    catch { onToast(ru ? 'Не удалось изменить промокод.' : 'Could not update promo code.', 'error'); }
  };
  const removePromo = async (promo: PromoCode) => {
    if (!window.confirm(ru ? `Удалить промокод ${promo.code}?` : `Delete promo code ${promo.code}?`)) return;
    try { await deleteDoc(doc(db, 'promo_codes', promo.id)); onToast(ru ? 'Промокод удалён.' : 'Promo code deleted.', 'success'); }
    catch { onToast(ru ? 'Не удалось удалить промокод.' : 'Could not delete promo code.', 'error'); }
  };

  const panel = 'bg-[#14171e] border border-[#2a2f3b] rounded-sm';
  const field = 'w-full bg-black/40 border border-zinc-700 px-3 py-2 text-sm text-white rounded-sm outline-none focus:border-red-500';
  return <div className="space-y-5 animate-in fade-in duration-300">
    <div className="flex flex-wrap gap-2">
      <button onClick={() => setSection('payments')} className={`px-4 py-2 text-xs font-mono font-bold uppercase border rounded-sm ${section === 'payments' ? 'bg-red-600/15 border-red-500/50 text-red-400' : 'border-zinc-700 text-zinc-400'}`}><Wallet size={14} className="inline mr-2"/>{ru ? 'Платежи и заявки' : 'Payments & Requests'}</button>
      <button onClick={() => setSection('promos')} className={`px-4 py-2 text-xs font-mono font-bold uppercase border rounded-sm ${section === 'promos' ? 'bg-red-600/15 border-red-500/50 text-red-400' : 'border-zinc-700 text-zinc-400'}`}><Ticket size={14} className="inline mr-2"/>{ru ? 'Промокоды' : 'Promo Codes'}</button>
    </div>
    {section === 'payments' ? <div className={`${panel} p-5 space-y-4`}>
      <div className="flex items-center justify-between gap-3"><h3 className="text-white font-black uppercase tracking-wider">{ru ? 'Заявки и платежи' : 'Requests & Payments'}</h3><span className="text-xs text-amber-400">{vipApplications.filter(item => item.status === 'pending').length} {ru ? 'ожидают' : 'pending'}</span></div>
      <p className="text-xs text-zinc-500">{ru ? 'Пока платёжный шлюз не подключён, здесь отображаются существующие VIP-заявки. Реальные транзакции не создаются.' : 'Until a payment provider is connected, this view shows existing VIP applications. No real transactions are created.'}</p>
      <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="text-zinc-500 uppercase"><tr><th className="p-2">ID</th><th className="p-2">{ru ? 'Пользователь' : 'User'}</th><th className="p-2">{ru ? 'Тип' : 'Type'}</th><th className="p-2">{ru ? 'Статус' : 'Status'}</th><th className="p-2">{ru ? 'Дата' : 'Date'}</th></tr></thead><tbody>
      {vipApplications.length ? vipApplications.map(item => <tr key={item.id} className="border-t border-zinc-800 text-zinc-300"><td className="p-2 font-mono">{item.id.slice(0, 10)}</td><td className="p-2">{item.userDisplayName}<div className="text-[10px] text-zinc-500">{item.userId}</div></td><td className="p-2">{item.paymentMethod}</td><td className="p-2">{item.status}</td><td className="p-2">{item.createdAt?.seconds ? new Date(item.createdAt.seconds * 1000).toLocaleString() : '—'}</td></tr>) : <tr><td colSpan={5} className="p-6 text-center text-zinc-500">{ru ? 'Заявок пока нет.' : 'No requests yet.'}</td></tr>}
      </tbody></table></div>
    </div> : <div className="grid lg:grid-cols-[minmax(260px,360px)_1fr] gap-5">
      <form onSubmit={createPromo} className={`${panel} p-5 space-y-3 h-fit`}>
        <h3 className="text-white font-black uppercase tracking-wider">{ru ? 'Новый промокод' : 'New Promo Code'}</h3>
        <label className="block text-[10px] uppercase text-zinc-500">{ru ? 'Код' : 'Code'}</label><input className={field} value={code} onChange={e => setCode(e.target.value)} placeholder="WELCOME20" maxLength={24} required />
        <label className="block text-[10px] uppercase text-zinc-500">{ru ? 'Тип скидки' : 'Discount type'}</label><select className={field} value={discountType} onChange={e => setDiscountType(e.target.value as 'fixed'|'percent')}><option value="percent">{ru ? 'Процент' : 'Percentage'}</option><option value="fixed">{ru ? 'Фиксированная сумма (₽)' : 'Fixed amount (RUB)'}</option></select>
        <label className="block text-[10px] uppercase text-zinc-500">{ru ? 'Размер скидки' : 'Discount value'}</label><input className={field} type="number" min="1" max={discountType === 'percent' ? 100 : undefined} value={discountValue} onChange={e => setDiscountValue(e.target.value)} required />
        <label className="block text-[10px] uppercase text-zinc-500">{ru ? 'Лимит активаций' : 'Activation limit'}</label><input className={field} type="number" min="1" step="1" value={activationLimit} onChange={e => setActivationLimit(e.target.value)} required />
        <label className="block text-[10px] uppercase text-zinc-500">{ru ? 'Действует до (необязательно)' : 'Expires at (optional)'}</label><input className={field} type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
        <button className="w-full bg-red-600 hover:bg-red-500 text-white font-bold uppercase text-xs py-3 rounded-sm"><Plus size={14} className="inline mr-2"/>{ru ? 'Создать промокод' : 'Create promo code'}</button>
      </form>
      <div className={`${panel} p-5 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-white font-black uppercase tracking-wider">{ru ? 'Список промокодов' : 'Promo Codes'}</h3><div className="relative"><Search size={14} className="absolute left-2 top-2.5 text-zinc-500"/><input className={`${field} pl-8 w-56`} value={search} onChange={e => setSearch(e.target.value)} placeholder={ru ? 'Поиск кода' : 'Search code'}/></div></div>
        {loading ? <p className="text-zinc-500 text-sm">{ru ? 'Загрузка...' : 'Loading...'}</p> : filteredPromos.length ? <div className="space-y-2">{filteredPromos.map(promo => <div key={promo.id} className="border border-zinc-800 bg-black/20 p-3 flex flex-wrap items-center justify-between gap-3"><div><div className="text-white font-mono font-bold">{promo.code}</div><div className="text-[11px] text-zinc-500">{promo.discountType === 'percent' ? `${promo.discountValue}%` : `${promo.discountValue} ₽`} · {promo.activationCount || 0}/{promo.activationLimit} {ru ? 'активаций' : 'uses'} · {promo.expiresAt || (ru ? 'без срока' : 'no expiry')}</div></div><div className="flex items-center gap-2"><span className={promo.active ? 'text-emerald-400 text-[10px]' : 'text-zinc-500 text-[10px]'}>{promo.active ? (ru ? 'АКТИВЕН' : 'ACTIVE') : (ru ? 'ОТКЛЮЧЁН' : 'DISABLED')}</span><button type="button" onClick={() => void togglePromo(promo)} className="p-2 border border-zinc-700 text-zinc-300" title={ru ? 'Вкл/выкл' : 'Enable/disable'}><Power size={14}/></button><button type="button" onClick={() => void removePromo(promo)} className="p-2 border border-red-900 text-red-400" title={ru ? 'Удалить' : 'Delete'}><Trash2 size={14}/></button></div></div>)}</div> : <p className="text-zinc-500 text-sm">{ru ? 'Промокодов пока нет.' : 'No promo codes yet.'}</p>}
      </div>
    </div>}
  </div>;
}
