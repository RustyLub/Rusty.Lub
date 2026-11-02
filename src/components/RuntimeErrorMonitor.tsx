import { useCallback, useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

type RuntimeLog = {
  id: number;
  time: string;
  kind: 'JavaScript' | 'Promise' | 'Console' | 'Resource';
  message: string;
  details?: string;
};

const MAX_LOGS = 100;

function describe(value: unknown): string {
  if (value instanceof Error) return value.stack || value.message;
  if (typeof value === 'string') return value;
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
}

export default function RuntimeErrorMonitor() {
  const [enabled, setEnabled] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('debug') === '1'
        || sessionStorage.getItem('rustylub:debug-logs') === '1';
    } catch { return false; }
  });
  const [expanded, setExpanded] = useState(true);
  const [logs, setLogs] = useState<RuntimeLog[]>([]);

  const addLog = useCallback((kind: RuntimeLog['kind'], message: string, details?: string) => {
    setLogs(previous => [{
      id: Date.now() + Math.random(),
      time: new Date().toLocaleTimeString(),
      kind,
      message: message.slice(0, 2000),
      details: details?.slice(0, 12000),
    }, ...previous].slice(0, MAX_LOGS));
  }, []);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      const target = event.target;
      if (target && target !== window) {
        const element = target as HTMLElement;
        const source = element instanceof HTMLScriptElement ? element.src
          : element instanceof HTMLLinkElement ? element.href
          : element instanceof HTMLImageElement ? element.src : element.tagName;
        addLog('Resource', `Не удалось загрузить ресурс: ${source}`);
        return;
      }
      addLog('JavaScript', event.message || 'Неизвестная ошибка JavaScript',
        [event.filename, event.lineno ? `строка ${event.lineno}` : '', event.error ? describe(event.error) : ''].filter(Boolean).join('\n'));
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      addLog('Promise', 'Необработанная ошибка Promise', describe(event.reason));
    };
    window.addEventListener('error', onError, true);
    window.addEventListener('unhandledrejection', onRejection);

    const originalError = console.error;
    console.error = (...args: unknown[]) => {
      addLog('Console', args.map(describe).join(' '));
      originalError.apply(console, args);
    };
    return () => {
      window.removeEventListener('error', onError, true);
      window.removeEventListener('unhandledrejection', onRejection);
      console.error = originalError;
    };
  }, [addLog]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        setEnabled(current => {
          const next = !current;
          try { sessionStorage.setItem('rustylub:debug-logs', next ? '1' : '0'); } catch {}
          return next;
        });
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const copyLogs = async () => {
    const text = logs.map(log => `[${log.time}] [${log.kind}] ${log.message}${log.details ? `\n${log.details}` : ''}`).join('\n\n');
    try { await navigator.clipboard.writeText(text || 'Ошибок не зарегистрировано.'); } catch {
      addLog('Console', 'Не удалось скопировать журнал: браузер запретил доступ к буферу обмена.');
    }
  };

  if (!enabled) return null;

  return (
    <section aria-label="Журнал ошибок Rusty.Lub" style={{
      position: 'fixed', right: 16, bottom: 16, zIndex: 99999, width: expanded ? 'min(560px, calc(100vw - 32px))' : 'auto',
      color: '#f4f4f5', background: '#111315', border: '1px solid #854323', borderRadius: 10,
      boxShadow: '0 12px 40px rgba(0,0,0,.55)', fontFamily: 'ui-monospace, SFMono-Regular, monospace', fontSize: 12
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: '#211711', borderRadius: '9px 9px 0 0' }}>
        <strong style={{ color: '#f29a5b' }}>RUSTY.LUB / ERROR LOG</strong>
        <span style={{ color: logs.length ? '#ff7777' : '#a3a3a3' }}>{logs.length} / {MAX_LOGS}</span>
        <button onClick={() => setExpanded(value => !value)} style={buttonStyle}>{expanded ? 'Свернуть' : 'Открыть'}</button>
        <button onClick={() => setEnabled(false)} title="Закрыть журнал" style={buttonStyle}>×</button>
      </header>
      {expanded && <>
        <div style={{ display: 'flex', gap: 8, padding: 8, borderBottom: '1px solid #303030' }}>
          <button onClick={copyLogs} style={buttonStyle}>Копировать логи</button>
          <button onClick={() => setLogs([])} style={buttonStyle}>Очистить</button>
          <span style={{ marginLeft: 'auto', color: '#888', alignSelf: 'center' }}>Ctrl + Shift + L — скрыть</span>
        </div>
        <div style={{ maxHeight: 'min(45vh, 420px)', overflow: 'auto', padding: 8 }}>
          {logs.length === 0 ? <p style={{ color: '#a3a3a3', margin: 8 }}>Ошибок пока нет. Новые события появятся здесь автоматически.</p> :
            logs.map(log => <article key={log.id} style={{ padding: '9px 8px', marginBottom: 7, background: '#1b1d20', borderLeft: `3px solid ${log.kind === 'Console' ? '#d97706' : '#dc4545'}`, borderRadius: 4 }}>
              <div style={{ display: 'flex', gap: 8, color: '#aaa', marginBottom: 5 }}><strong style={{ color: '#f29a5b' }}>{log.kind}</strong><time>{log.time}</time></div>
              <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#f3f4f6' }}>{log.message}</div>
              {log.details && <pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: '#aeb6c2', margin: '7px 0 0', fontSize: 10 }}>{log.details}</pre>}
            </article>)}
        </div>
      </>}
    </section>
  );
}

const buttonStyle: CSSProperties = {
  color: '#f4f4f5', background: '#34302c', border: '1px solid #5a4638', borderRadius: 5,
  padding: '5px 8px', cursor: 'pointer', fontSize: 11
};
