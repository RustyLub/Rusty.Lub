import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { CustomUser } from '../types';
import { Star, Trash2, Pencil, Send, Users, Clock } from 'lucide-react';

type Rating = { id: string; authorUid: string; authorName: string; authorAvatar: string; rating: number; comment: string; status?: string; createdAt?: any };
export default function AdminRatingsPanel({ currentUser, lang, onToast }: { currentUser: CustomUser | null; lang: 'ru' | 'en'; onToast: (message: string, type: 'success' | 'error' | 'info') => void }) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [selected, setSelected] = useState<Rating | null>(null);
  const [reason, setReason] = useState('');
  const [proposedComment, setProposedComment] = useState('');
  const [proposedRating, setProposedRating] = useState(5);
  const [requestType, setRequestType] = useState<'edit' | 'delete'>('delete');
  const [busy, setBusy] = useState(false);
  const ru = lang === 'ru';
  useEffect(() => {
    return onSnapshot(query(collection(db, 'user_ratings'), orderBy('createdAt', 'desc')), snap => {
      setRatings(snap.docs.map(item => ({ id: item.id, ...item.data() } as Rating)).filter(item => item.status !== 'deleted'));
    }, () => onToast(ru ? 'Не удалось загрузить оценки.' : 'Could not load ratings.', 'error'));
  }, [ru]);
  const createRequest = async () => {
    if (!currentUser || !selected) return;
    if (reason.trim().length < 5) { onToast(ru ? 'Укажите причину запроса.' : 'Enter a request reason.', 'error'); return; }
    if (requestType === 'edit' && proposedComment.trim().length < 10) { onToast(ru ? 'Новый текст слишком короткий.' : 'Proposed review is too short.', 'error'); return; }
    setBusy(true);
    try {
      const existingRequests = await getDocs(query(collection(db, 'user_rating_requests'), where('ratingId', '==', selected.id)));
      const pending = existingRequests.docs.some(item => item.data().status === 'pending');
      if (pending) { onToast(ru ? 'Для этой оценки уже есть ожидающий запрос.' : 'A pending request already exists for this rating.', 'info'); return; }
      await addDoc(collection(db, 'user_rating_requests'), {
        ratingId: selected.id, authorUid: selected.authorUid, type: requestType,
        ...(requestType === 'edit' ? { proposedRating, proposedComment: proposedComment.trim() } : {}),
        reason: reason.trim(), status: 'pending', requestedBy: currentUser.uid,
        requestedByName: currentUser.displayName, createdAt: serverTimestamp()
      });
      setSelected(null); setReason(''); setProposedComment('');
      onToast(ru ? 'Запрос отправлен автору на подтверждение.' : 'Request sent to the author for approval.', 'success');
    } catch { onToast(ru ? 'Не удалось создать запрос.' : 'Could not create request.', 'error'); }
    finally { setBusy(false); }
  };
  return <div className="space-y-5">
    <div className="grid gap-3 sm:grid-cols-3">
      <div className="border border-[#2a2f3b] bg-[#14171e] p-4"><div className="text-2xl font-black text-white">{ratings.length}</div><div className="text-[10px] uppercase tracking-widest text-zinc-500">{ru ? 'Всего оценок' : 'Total ratings'}</div></div>
      <div className="border border-[#2a2f3b] bg-[#14171e] p-4"><div className="text-2xl font-black text-orange-400">{ratings.length ? (ratings.reduce((sum,r)=>sum+r.rating,0)/ratings.length).toFixed(1) : '—'} / 5</div><div className="text-[10px] uppercase tracking-widest text-zinc-500">{ru ? 'Средняя оценка' : 'Average rating'}</div></div>
      <div className="border border-[#2a2f3b] bg-[#14171e] p-4"><div className="text-2xl font-black text-white"><Users className="inline" size={20}/> {new Set(ratings.map(r=>r.authorUid)).size}</div><div className="text-[10px] uppercase tracking-widest text-zinc-500">{ru ? 'Авторов' : 'Authors'}</div></div>
    </div>
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        <h3 className="font-bold text-white">{ru ? 'Опубликованные оценки' : 'Published ratings'}</h3>
        {ratings.map(item => <button key={item.id} onClick={() => { setSelected(item); setProposedComment(item.comment); setProposedRating(item.rating); }} className={`w-full border p-4 text-left transition ${selected?.id === item.id ? 'border-orange-500/60 bg-orange-500/5' : 'border-[#2a2f3b] bg-[#14171e] hover:border-white/20'}`}>
          <div className="flex items-center gap-3"><img src={item.authorAvatar || '/avatar-placeholder.png'} className="h-10 w-10 rounded-full object-cover" /><div className="min-w-0 flex-1"><div className="font-bold text-white">{item.authorName}</div><div className="text-[10px] text-zinc-500">{item.authorUid}</div></div><div className="flex items-center gap-1 text-orange-400"><Star size={13} fill="currentColor"/>{item.rating}/5</div></div>
          <p className="mt-3 line-clamp-3 text-sm text-zinc-400">{item.comment}</p>
        </button>)}
        {!ratings.length && <div className="border border-dashed border-white/10 p-8 text-center text-sm text-zinc-500">{ru ? 'Оценок пока нет.' : 'No ratings yet.'}</div>}
      </div>
      <aside className="h-fit space-y-4 border border-[#2a2f3b] bg-[#14171e] p-4">
        <h3 className="font-bold text-white">{ru ? 'Запрос автору' : 'Request author approval'}</h3>
        {!selected ? <p className="text-sm text-zinc-500">{ru ? 'Выберите оценку, чтобы запросить её изменение или удаление.' : 'Select a rating to request an edit or deletion.'}</p> : <>
          <div className="text-xs text-zinc-400">{ru ? 'Выбрано:' : 'Selected:'} <b className="text-white">{selected.authorName}</b></div>
          <div className="flex gap-2"><button onClick={()=>setRequestType('delete')} className={`flex-1 border p-2 text-xs ${requestType==='delete'?'border-red-500/50 bg-red-500/10 text-red-300':'border-white/10 text-zinc-400'}`}><Trash2 className="mr-1 inline" size={13}/>{ru?'Удаление':'Delete'}</button><button onClick={()=>setRequestType('edit')} className={`flex-1 border p-2 text-xs ${requestType==='edit'?'border-orange-500/50 bg-orange-500/10 text-orange-300':'border-white/10 text-zinc-400'}`}><Pencil className="mr-1 inline" size={13}/>{ru?'Редактирование':'Edit'}</button></div>
          {requestType==='edit' && <><label className="block text-xs text-zinc-400">{ru?'Новая оценка':'Proposed score'}</label><select value={proposedRating} onChange={e=>setProposedRating(Number(e.target.value))} className="w-full border border-white/10 bg-black/30 p-2 text-white">{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select><label className="block text-xs text-zinc-400">{ru?'Предлагаемый текст':'Proposed review'}</label><textarea value={proposedComment} onChange={e=>setProposedComment(e.target.value)} maxLength={1200} rows={5} className="w-full border border-white/10 bg-black/30 p-3 text-sm text-white"/></>}
          <label className="block text-xs text-zinc-400">{ru?'Причина запроса':'Reason'}</label><textarea value={reason} onChange={e=>setReason(e.target.value)} maxLength={500} rows={3} className="w-full border border-white/10 bg-black/30 p-3 text-sm text-white" placeholder={ru?'Объясните, почему требуется действие...':'Explain why this action is requested...'}/>
          <button disabled={busy} onClick={createRequest} className="w-full bg-orange-600 p-3 text-xs font-bold text-white disabled:opacity-50"><Send className="mr-2 inline" size={14}/>{ru?'Отправить автору':'Send to author'}</button>
          <p className="text-[10px] leading-4 text-zinc-500"><Clock className="mr-1 inline" size={12}/>{ru?'Оценка не изменится без согласия автора.':'The rating will not change without the author’s approval.'}</p>
        </>}
      </aside>
    </div>
  </div>;
}
