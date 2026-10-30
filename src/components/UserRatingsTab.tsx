import { useEffect, useMemo, useState } from 'react';
import { collection, db, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from '../firebase';
import { CustomUser } from '../types';
import { MessageSquare, Star, Clock3, Send, ShieldCheck, Pencil, Trash2, Check, X } from 'lucide-react';

type RatingRecord = {
  id: string; authorUid: string; authorName: string; authorAvatar: string;
  accountCreatedAt: string; rating: number; comment: string; createdAt?: any;
  status?: 'published' | 'hidden' | 'deleted';
};
type RatingRequest = {
  id: string; ratingId: string; authorUid: string; type: 'edit' | 'delete';
  proposedRating?: number; proposedComment?: string; reason: string;
  status: 'pending' | 'accepted' | 'declined'; createdAt?: any;
};

const THREE_DAYS = 72 * 60 * 60 * 1000;
const dateValue = (value: any) => {
  if (!value) return null;
  if (typeof value?.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function UserRatingsTab({ user, lang, onRequireAuth, onToast }: {
  user: CustomUser | null; lang: 'ru' | 'en'; onRequireAuth: () => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}) {
  const [ratings, setRatings] = useState<RatingRecord[]>([]);
  const [requests, setRequests] = useState<RatingRequest[]>([]);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [myRating, setMyRating] = useState<RatingRecord | null>(null);
  const ru = lang === 'ru';

  useEffect(() => {
    const q = query(collection(db, 'user_ratings'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => {
      const rows = snap.docs.map(item => ({ id: item.id, ...item.data() } as RatingRecord));
      setRatings(rows.filter(row => row.status !== 'deleted' && row.status !== 'hidden'));
      setMyRating(user ? rows.find(row => row.authorUid === user.uid) || null : null);
    }, error => onToast(ru ? 'Не удалось загрузить оценки.' : 'Could not load ratings.', 'error'));
  }, [user?.uid, ru]);

  useEffect(() => {
    if (!user) { setRequests([]); return; }
    const q = query(collection(db, 'user_rating_requests'), where('authorUid', '==', user.uid), where('status', '==', 'pending'));
    return onSnapshot(q, snap => setRequests(snap.docs.map(item => ({ id: item.id, ...item.data() } as RatingRequest))),
      () => onToast(ru ? 'Не удалось загрузить запросы.' : 'Could not load requests.', 'error'));
  }, [user?.uid, ru]);

  const createdAt = dateValue(user?.createdAt);
  const eligibleAt = createdAt ? createdAt.getTime() + THREE_DAYS : null;
  const remaining = eligibleAt ? Math.max(0, eligibleAt - Date.now()) : null;
  const eligible = Boolean(user && eligibleAt && remaining === 0);
  const average = useMemo(() => ratings.length ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length : 0, [ratings]);

  const submitRating = async () => {
    if (!user) { onRequireAuth(); return; }
    if (!eligible) { onToast(ru ? 'Оценка станет доступна через 72 часа после регистрации.' : 'Ratings unlock 72 hours after registration.', 'info'); return; }
    if (myRating) { onToast(ru ? 'У вас уже есть оценка. Изменения выполняются через запрос.' : 'You already have a rating. Changes require a request.', 'info'); return; }
    if (comment.trim().length < 10 || comment.trim().length > 1200) { onToast(ru ? 'Отзыв должен содержать от 10 до 1200 символов.' : 'Review must be 10–1200 characters.', 'error'); return; }
    setSubmitting(true);
    try {
      await setDoc(doc(db, 'user_ratings', user.uid), {
        authorUid: user.uid, authorName: user.displayName, authorAvatar: user.photoURL || '',
        accountCreatedAt: createdAt!.toISOString(), rating: score, comment: comment.trim(),
        status: 'published', createdAt: serverTimestamp(), updatedAt: serverTimestamp()
      });
      setComment('');
      onToast(ru ? 'Ваша оценка опубликована.' : 'Your rating has been published.', 'success');
    } catch {
      onToast(ru ? 'Не удалось отправить оценку.' : 'Could not submit rating.', 'error');
    } finally { setSubmitting(false); }
  };

  const respondToRequest = async (request: RatingRequest, accept: boolean) => {
    if (!user || request.authorUid !== user.uid) return;
    try {
      if (accept && request.type === 'edit') {
        const rating = ratings.find(item => item.id === request.ratingId);
        if (rating) {
          await updateDoc(doc(db, 'user_ratings', rating.id), {
            rating: request.proposedRating ?? rating.rating,
            comment: request.proposedComment ?? rating.comment,
            updatedAt: serverTimestamp()
          });
        }
      }
      if (accept && request.type === 'delete') {
        await updateDoc(doc(db, 'user_ratings', request.ratingId), { status: 'deleted', deletedAt: serverTimestamp() });
      }
      await updateDoc(doc(db, 'user_rating_requests', request.id), {
        status: accept ? 'accepted' : 'declined', answeredAt: serverTimestamp()
      });
      onToast(ru ? (accept ? 'Запрос подтверждён.' : 'Вы отклонили запрос.') : (accept ? 'Request accepted.' : 'Request declined.'), 'success');
    } catch {
      onToast(ru ? 'Не удалось обработать запрос.' : 'Could not process request.', 'error');
    }
  };

  const formatDate = (value: any) => {
    const date = dateValue(value);
    return date ? date.toLocaleDateString(ru ? 'ru-RU' : 'en-US') : (ru ? 'Дата не указана' : 'Date unavailable');
  };
  const durationText = remaining !== null && remaining > 0
    ? `${Math.floor(remaining / 86400000)}д ${Math.floor((remaining % 86400000) / 3600000)}ч ${Math.floor((remaining % 3600000) / 60000)}м`
    : '';

  return <main className="mx-auto w-full max-w-6xl space-y-8 px-3 py-8 sm:px-6">
    <header className="relative overflow-hidden border border-white/10 bg-[#11151c] p-6 sm:p-9">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="relative">
        <p className="font-mono text-[10px] tracking-[.28em] text-orange-400">RUSTY.LUB / COMMUNITY</p>
        <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">{ru ? 'Голос сообщества' : 'Community Voice'}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">{ru ? 'Оценки пользователей о справочнике Rusty.Lub — удобстве, навигации, дизайне и полезности материалов.' : 'User feedback about the Rusty.Lub guide: usability, navigation, design and content.'}</p>
        <div className="mt-6 flex flex-wrap gap-6">
          <div><div className="text-3xl font-black text-orange-400">{ratings.length ? average.toFixed(1) : '—'}<span className="text-sm text-zinc-500"> / 5</span></div><div className="text-[10px] uppercase tracking-widest text-zinc-500">{ru ? 'Средняя оценка' : 'Average rating'}</div></div>
          <div><div className="text-3xl font-black text-white">{ratings.length}</div><div className="text-[10px] uppercase tracking-widest text-zinc-500">{ru ? 'Опубликовано оценок' : 'Published ratings'}</div></div>
        </div>
      </div>
    </header>

    {user && requests.length > 0 && <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-bold text-white"><MessageSquare size={18} className="text-orange-400"/>{ru ? 'Запросы по вашей оценке' : 'Requests about your rating'}</h2>
      {requests.map(request => <article key={request.id} className="border border-orange-500/30 bg-orange-500/5 p-4">
        <div className="font-bold text-white">{request.type === 'delete' ? (ru ? 'Запрос на удаление оценки' : 'Rating deletion request') : (ru ? 'Запрос на редактирование оценки' : 'Rating edit request')}</div>
        <p className="mt-2 text-sm text-zinc-400">{request.reason}</p>
        {request.type === 'edit' && <p className="mt-2 text-sm text-zinc-300">{request.proposedComment}</p>}
        <div className="mt-4 flex gap-2">
          <button onClick={() => respondToRequest(request, true)} className="flex items-center gap-2 bg-emerald-600 px-3 py-2 text-xs font-bold text-white"><Check size={14}/>{ru ? 'Согласиться' : 'Accept'}</button>
          <button onClick={() => respondToRequest(request, false)} className="flex items-center gap-2 border border-white/15 px-3 py-2 text-xs font-bold text-zinc-300"><X size={14}/>{ru ? 'Отказаться' : 'Decline'}</button>
        </div>
      </article>)}
    </section>}

    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">{ru ? 'Оценки пользователей' : 'User ratings'}</h2>
        {ratings.length === 0 && <div className="border border-white/10 bg-[#11151c] p-8 text-center text-sm text-zinc-500">{ru ? 'Пока нет опубликованных оценок. Станьте первым!' : 'No ratings yet. Be the first!'}</div>}
        {ratings.map(item => <article key={item.id} className="border border-white/10 bg-[#11151c] p-5">
          <div className="flex items-start gap-3">
            <img src={item.authorAvatar || '/avatar-placeholder.png'} alt="" className="h-12 w-12 rounded-full border border-white/10 bg-zinc-800 object-cover" />
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white">{item.authorName}</div>
              <div className="mt-1 text-[11px] text-zinc-500">{ru ? 'В сообществе с' : 'Member since'} {formatDate(item.accountCreatedAt)}</div>
              <div className="mt-2 flex items-center gap-1 text-orange-400">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill={i < item.rating ? 'currentColor' : 'none'} />)}<span className="ml-2 text-xs text-zinc-400">{item.rating}/5</span></div>
            </div>
            <span className="text-[10px] text-zinc-500">{formatDate(item.createdAt)}</span>
          </div>
          <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-300">{item.comment}</p>
        </article>)}
      </div>

      <aside className="h-fit border border-white/10 bg-[#11151c] p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white"><Star size={18} className="text-orange-400"/>{ru ? 'Оценить Rusty.Lub' : 'Rate Rusty.Lub'}</h2>
        {!user ? <div className="mt-4 space-y-3"><p className="text-sm text-zinc-400">{ru ? 'Войдите в аккаунт, чтобы оставить оценку.' : 'Sign in to leave a rating.'}</p><button onClick={onRequireAuth} className="w-full bg-orange-600 px-4 py-3 text-sm font-bold text-white">{ru ? 'Войти' : 'Sign in'}</button></div>
        : myRating ? <p className="mt-4 text-sm text-zinc-400">{ru ? 'Вы уже оставили оценку. Если потребуется изменение или удаление, администрация отправит запрос, который вы сможете подтвердить или отклонить.' : 'You have already rated the guide. Any edit or deletion request will require your approval.'}</p>
        : !createdAt ? <p className="mt-4 text-sm text-amber-300">{ru ? 'Не удалось подтвердить дату регистрации аккаунта. Оценка временно недоступна.' : 'Account creation date could not be verified. Ratings are unavailable.'}</p>
        : !eligible ? <div className="mt-4 space-y-2"><div className="flex items-center gap-2 text-amber-300"><Clock3 size={16}/><span className="text-sm font-semibold">{ru ? 'Оценка пока закрыта' : 'Rating locked'}</span></div><p className="text-sm text-zinc-400">{ru ? 'Оставить оценку можно через 72 часа после регистрации.' : 'Ratings unlock 72 hours after registration.'}</p><div className="font-mono text-sm text-orange-300">{durationText}</div></div>
        : <div className="mt-4 space-y-4">
          <div><label className="mb-2 block text-xs text-zinc-400">{ru ? 'Ваша оценка' : 'Your rating'}</label><div className="flex gap-2">{[1,2,3,4,5].map(value => <button key={value} onClick={() => setScore(value)} aria-label={String(value)} className={value <= score ? 'text-orange-400' : 'text-zinc-600'}><Star size={25} fill={value <= score ? 'currentColor' : 'none'}/></button>)}</div></div>
          <div><label className="mb-2 block text-xs text-zinc-400">{ru ? 'Ваш отзыв (10–1200 символов)' : 'Your review (10–1200 characters)'}</label><textarea value={comment} onChange={event => setComment(event.target.value)} maxLength={1200} rows={5} className="w-full resize-y border border-white/10 bg-black/30 p-3 text-sm text-white outline-none focus:border-orange-500/50" placeholder={ru ? 'Расскажите об удобстве справочника...' : 'Tell us about your experience...'}/><div className="mt-1 text-right text-[10px] text-zinc-500">{comment.length}/1200</div></div>
          <button disabled={submitting} onClick={submitRating} className="flex w-full items-center justify-center gap-2 bg-orange-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50"><Send size={15}/>{ru ? 'Опубликовать оценку' : 'Publish rating'}</button>
        </div>}
        <div className="mt-5 border-t border-white/10 pt-4 text-[11px] leading-5 text-zinc-500"><ShieldCheck size={13} className="mr-1 inline text-orange-400"/>{ru ? 'Одна оценка на аккаунт. Минимальный возраст аккаунта — 72 часа.' : 'One rating per account. Minimum account age: 72 hours.'}</div>
      </aside>
    </section>
  </main>;
}
