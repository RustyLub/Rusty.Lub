import { useCallback, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { FileText, Settings2, Shield, History, Plus, Save, RefreshCw, Eye, EyeOff, Trash2 } from 'lucide-react';

type Lang = 'ru' | 'en';
type CmsPage = { id: string; slug: string; title: Record<Lang, string>; description: Record<Lang, string>; body: Record<Lang, string>; visible: boolean; order: number; updatedAt?: string };
type AuditEntry = { id: string; actorEmail?: string; actorUid?: string; action?: string; target?: string; createdAt?: string; details?: string };
type CmsRole = { uid: string; email?: string; role: 'owner' | 'admin' | 'editor' | 'viewer'; createdAt?: string };
type CmsAccess = { uid: string; email?: string; role: CmsRole['role'] };

interface Props { lang: Lang; onToast: (message: string, type: 'success' | 'error' | 'info') => void }

const panel = 'rounded border border-[#2a2f3b] bg-[#14171e] p-5';
const field = 'w-full rounded border border-zinc-700 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-orange-500';
const button = 'inline-flex items-center gap-2 rounded border border-zinc-700 px-3 py-2 text-xs font-bold uppercase tracking-wide text-zinc-200 hover:border-orange-500 hover:text-orange-300 disabled:opacity-40';

export default function AdminCmsPanel({ lang, onToast }: Props) {
  const ru = lang === 'ru';
  const [section, setSection] = useState<'pages' | 'settings' | 'roles' | 'audit'>('pages');
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [settings, setSettings] = useState<Record<string, unknown>>({ siteTitle: 'Rusty.Lub', maintenanceMode: false, showNews: true, showCommunity: true });
  const [roles, setRoles] = useState<CmsRole[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [selected, setSelected] = useState<CmsPage | null>(null);
  const [roleUid, setRoleUid] = useState('');
  const [roleEmail, setRoleEmail] = useState('');
  const [roleValue, setRoleValue] = useState<CmsRole['role']>('editor');
  const [busy, setBusy] = useState(false);
  const [access, setAccess] = useState<CmsAccess | null>(null);
  const canAdminister = access?.role === 'owner' || access?.role === 'admin';
  const canEdit = canAdminister || access?.role === 'editor';
  const isOwner = access?.role === 'owner';

  const request = useCallback(async (path: string, init: RequestInit = {}) => {
    const user = auth.currentUser;
    if (!user) throw new Error(ru ? 'Сначала войдите в аккаунт.' : 'Please sign in first.');
    const token = await user.getIdToken();
    const response = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(init.headers || {}) }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`);
    return data;
  }, [ru]);

  const refresh = useCallback(async () => {
    setBusy(true);
    try {
      const me = await request('/api/cms/me');
      setAccess(me);
      const [pageData, settingData] = await Promise.all([
        request('/api/cms/pages'),
        request('/api/cms/settings')
      ]);
      setPages(pageData.pages || []);
      setSettings(settingData.settings || {});
      if (me.role === 'owner' || me.role === 'admin') {
        const [roleData, auditData] = await Promise.all([
          request('/api/cms/roles'),
          request('/api/cms/audit')
        ]);
        setRoles(roleData.roles || []);
        setAudit(auditData.entries || []);
      } else {
        setRoles([]);
        setAudit([]);
      }
    } catch (error) {
      onToast(error instanceof Error ? error.message : String(error), 'error');
    } finally {
      setBusy(false);
    }
  }, [request, onToast]);

  useEffect(() => { void refresh(); }, [refresh]);

  const savePage = async () => {
    if (!selected) return;
    setBusy(true);
    try {
      const result = await request('/api/cms/pages', { method: 'POST', body: JSON.stringify(selected) });
      setSelected(result.page);
      onToast(ru ? 'Страница сохранена' : 'Page saved', 'success');
      await refresh();
    } catch (error) {
      onToast(error instanceof Error ? error.message : String(error), 'error');
    } finally { setBusy(false); }
  };

  const deletePage = async () => {
    if (!selected?.id) return;
    const confirmed = window.confirm(ru ? `Удалить страницу «${selected.title?.[lang] || selected.slug}»? Это действие нельзя отменить.` : `Delete page "${selected.title?.[lang] || selected.slug}"? This cannot be undone.`);
    if (!confirmed) return;
    setBusy(true);
    try {
      await request(`/api/cms/pages/${encodeURIComponent(selected.id)}`, { method: 'DELETE' });
      setSelected(null);
      onToast(ru ? 'Страница удалена' : 'Page deleted', 'success');
      await refresh();
    } catch (error) {
      onToast(error instanceof Error ? error.message : String(error), 'error');
    } finally { setBusy(false); }
  };

  const saveSettings = async () => {
    setBusy(true);
    try {
      await request('/api/cms/settings', { method: 'PUT', body: JSON.stringify({ settings }) });
      onToast(ru ? 'Настройки сохранены' : 'Settings saved', 'success');
      await refresh();
    } catch (error) {
      onToast(error instanceof Error ? error.message : String(error), 'error');
    } finally { setBusy(false); }
  };

  const saveRole = async () => {
    setBusy(true);
    try {
      await request('/api/cms/roles', { method: 'POST', body: JSON.stringify({ uid: roleUid.trim(), email: roleEmail.trim(), role: roleValue }) });
      setRoleUid(''); setRoleEmail('');
      onToast(ru ? 'Роль сохранена' : 'Role saved', 'success');
      await refresh();
    } catch (error) {
      onToast(error instanceof Error ? error.message : String(error), 'error');
    } finally { setBusy(false); }
  };

  const newPage = () => setSelected({ id: '', slug: '', title: { ru: '', en: '' }, description: { ru: '', en: '' }, body: { ru: '', en: '' }, visible: true, order: pages.length });

  const updatePage = (patch: Partial<CmsPage>) => setSelected(current => current ? { ...current, ...patch } : current);
  const updateLocalized = (fieldName: 'title' | 'description' | 'body', locale: Lang, value: string) => setSelected(current => current ? { ...current, [fieldName]: { ...current[fieldName], [locale]: value } } : current);

  const tabs = [
    { id: 'pages', label: ru ? 'Страницы' : 'Pages', icon: FileText },
    { id: 'settings', label: ru ? 'Настройки' : 'Settings', icon: Settings2 },
    { id: 'roles', label: ru ? 'Роли доступа' : 'Access roles', icon: Shield },
    { id: 'audit', label: ru ? 'Журнал действий' : 'Audit log', icon: History }
  ] as const;

  return <div className="space-y-5 text-zinc-200">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="text-xl font-black uppercase tracking-wide">{ru ? 'Управление сайтом' : 'Site management'}</h3><p className="mt-1 text-xs text-zinc-500">{ru ? 'CMS · формы, страницы, роли и аудит' : 'CMS · forms, pages, roles and audit'}</p></div>
      <button className={button} onClick={() => void refresh()} disabled={busy}><RefreshCw size={14} />{ru ? 'Обновить' : 'Refresh'}</button>
    </div>
    <div className="flex flex-wrap gap-2">{tabs.map(tab => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setSection(tab.id)} className={`${button} ${section === tab.id ? 'border-orange-500 bg-orange-500/10 text-orange-300' : ''}`}><Icon size={14}/>{tab.label}</button>; })}</div>

    {!canEdit && access && <div className={panel + ' text-sm text-zinc-400'}>{ru ? 'У вас есть доступ только для просмотра.' : 'Your access is read-only.'}</div>}

    {section === 'pages' && <div className="grid gap-4 lg:grid-cols-[260px_1fr]">
      <div className={panel}><div className="mb-3 flex items-center justify-between"><strong>{ru ? 'Страницы' : 'Pages'}</strong><button className={button} onClick={newPage} disabled={!canEdit}><Plus size={13}/>{ru ? 'Добавить' : 'Add'}</button></div>
        <div className="space-y-2">{pages.map(page => <button key={page.id} onClick={() => setSelected({ ...page })} className={`w-full rounded border p-3 text-left ${selected?.id === page.id ? 'border-orange-500 bg-orange-500/10' : 'border-zinc-800 hover:border-zinc-600'}`}><div className="flex items-center justify-between gap-2 text-sm font-bold"><span className="truncate">{page.title?.[lang] || page.slug}</span>{page.visible ? <Eye size={13}/> : <EyeOff size={13}/>}</div><div className="mt-1 text-[11px] text-zinc-500">/{page.slug}</div></button>)}
        {pages.length === 0 && <p className="text-xs text-zinc-500">{ru ? 'Пока нет CMS-страниц.' : 'No CMS pages yet.'}</p>}</div>
      </div>
      <div className={panel}>{selected ? <div className="space-y-4">
        <div className="flex items-center justify-between"><strong>{ru ? 'Редактор страницы' : 'Page editor'}</strong><button className={button} onClick={() => setSelected(null)}>{ru ? 'Закрыть' : 'Close'}</button></div>
        <label className="block space-y-1 text-xs text-zinc-400">Slug<input className={field} value={selected.slug} disabled={!canEdit} onChange={e => updatePage({ slug: e.target.value })} placeholder="guides/new-page"/></label>
        <div className="grid gap-3 md:grid-cols-2">{(['ru','en'] as Lang[]).map(locale => <div key={locale} className="space-y-3 rounded border border-zinc-800 p-3"><strong className="text-xs uppercase">{locale}</strong>
          <label className="block space-y-1 text-xs text-zinc-400">{ru ? 'Заголовок' : 'Title'}<input className={field} value={selected.title?.[locale] || ''} disabled={!canEdit} onChange={e => updateLocalized('title', locale, e.target.value)}/></label>
          <label className="block space-y-1 text-xs text-zinc-400">{ru ? 'Описание' : 'Description'}<input className={field} value={selected.description?.[locale] || ''} disabled={!canEdit} onChange={e => updateLocalized('description', locale, e.target.value)}/></label>
          <label className="block space-y-1 text-xs text-zinc-400">{ru ? 'Содержимое (Markdown)' : 'Content (Markdown)'}<textarea className={field} rows={9} value={selected.body?.[locale] || ''} disabled={!canEdit} onChange={e => updateLocalized('body', locale, e.target.value)}/></label>
          <div className="rounded border border-zinc-800 bg-black/20 p-3"><div className="mb-2 text-[10px] uppercase text-zinc-500">{ru ? 'Предпросмотр' : 'Preview'}</div><h4 className="mb-2 text-base font-bold">{selected.title?.[locale] || 'Untitled'}</h4><p className="whitespace-pre-wrap text-xs text-zinc-400">{selected.body?.[locale] || (ru ? 'Текст появится здесь…' : 'Content preview…')}</p></div>
        </div>)}</div>
        <div className="flex flex-wrap items-center gap-4"><label className="text-xs"><input type="checkbox" checked={selected.visible} disabled={!canEdit} onChange={e => updatePage({ visible: e.target.checked })} className="mr-2 accent-orange-500"/>{ru ? 'Опубликована' : 'Published'}</label><label className="flex items-center gap-2 text-xs">{ru ? 'Порядок' : 'Order'}<input type="number" className={field + ' w-24'} value={selected.order} disabled={!canEdit} onChange={e => updatePage({ order: Number(e.target.value) })}/></label><button className={button} disabled={!canEdit || busy || !selected.slug.trim() || !selected.title?.ru.trim() || !selected.title?.en.trim()} onClick={() => void savePage()}><Save size={14}/>{ru ? 'Сохранить страницу' : 'Save page'}</button>{selected.id && <button className={button + ' border-red-900/70 text-red-300 hover:border-red-500 hover:text-red-200'} disabled={!canEdit || busy} onClick={() => void deletePage()}><Trash2 size={14}/>{ru ? 'Удалить страницу' : 'Delete page'}</button>}</div>
      </div> : <div className="flex min-h-60 items-center justify-center text-sm text-zinc-500">{ru ? 'Выберите страницу или создайте новую.' : 'Select a page or create one.'}</div>}</div>
    </div>}

    {section === 'settings' && <div className={panel + ' space-y-5'}><strong>{ru ? 'Расширенные настройки' : 'Advanced settings'}</strong>
      <label className="block space-y-1 text-xs text-zinc-400">{ru ? 'Название сайта' : 'Site title'}<input className={field} value={String(settings.siteTitle || '')} disabled={!canAdminister} onChange={e => setSettings(s => ({ ...s, siteTitle: e.target.value }))}/></label>
      <div className="space-y-3">{([{key:'maintenanceMode',label:ru?'Режим обслуживания':'Maintenance mode'},{key:'showNews',label:ru?'Показывать новости':'Show news'},{key:'showCommunity',label:ru?'Показывать сообщество':'Show community'}]).map(item => <label key={item.key} className="flex items-center justify-between gap-4 rounded border border-zinc-800 p-3 text-sm"><span>{item.label}</span><input type="checkbox" checked={Boolean(settings[item.key])} disabled={!canAdminister} onChange={e => setSettings(s => ({ ...s, [item.key]: e.target.checked }))} className="accent-orange-500"/></label>)}</div>
      <button className={button} onClick={() => void saveSettings()} disabled={!canAdminister || busy}><Save size={14}/>{ru ? 'Сохранить настройки' : 'Save settings'}</button>
    </div>}

    {section === 'roles' && isOwner && <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"><div className={panel + ' space-y-4'}><strong>{ru ? 'Назначить роль' : 'Assign a role'}</strong><p className="text-xs text-zinc-500">{ru ? 'Только владелец может менять роли. Для назначения нужен UID из Firebase Authentication.' : 'Only the owner can change roles. A Firebase Authentication UID is required.'}</p><input className={field} value={roleUid} onChange={e => setRoleUid(e.target.value)} placeholder="Firebase UID"/><input className={field} value={roleEmail} onChange={e => setRoleEmail(e.target.value)} placeholder="Email (optional)"/><select className={field} value={roleValue} onChange={e => setRoleValue(e.target.value as CmsRole['role'])}><option value="viewer">viewer</option><option value="editor">editor</option><option value="admin">admin</option></select><button className={button} onClick={() => void saveRole()} disabled={busy || !roleUid.trim()}><Shield size={14}/>{ru ? 'Назначить роль' : 'Assign role'}</button></div><div className={panel}><strong>{ru ? 'Назначенные роли' : 'Assigned roles'}</strong><div className="mt-3 space-y-2">{roles.map(role => <div key={role.uid} className="flex flex-wrap justify-between gap-2 rounded border border-zinc-800 p-3 text-xs"><span>{role.email || role.uid}<span className="ml-2 text-zinc-500">{role.uid}</span></span><b className="uppercase text-orange-300">{role.role}</b></div>)}{roles.length === 0 && <p className="mt-3 text-xs text-zinc-500">{ru ? 'Нет назначенных ролей.' : 'No assigned roles.'}</p>}</div></div></div>}

    {section === 'audit' && canAdminister && <div className={panel}><div className="mb-4 flex items-center justify-between"><strong>{ru ? 'Журнал административных действий' : 'Administrative audit log'}</strong><span className="text-xs text-zinc-500">{audit.length}</span></div><div className="space-y-2">{audit.map(entry => <div key={entry.id} className="grid gap-2 rounded border border-zinc-800 p-3 text-xs md:grid-cols-[180px_1fr_1fr]"><span className="text-zinc-500">{entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '—'}</span><span><b>{entry.action || 'action'}</b><span className="ml-2 text-zinc-500">{entry.target || ''}</span></span><span className="break-all text-zinc-400">{entry.actorEmail || entry.actorUid || 'system'} {entry.details ? '· ' + entry.details : ''}</span></div>)}{audit.length === 0 && <p className="text-xs text-zinc-500">{ru ? 'Записей пока нет.' : 'No audit entries yet.'}</p>}</div></div>}
  </div>;
}
