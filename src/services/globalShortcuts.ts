/**
 * Global Keyboard Shortcuts Manager for Windows Desktop (Tauri 2)
 */

export interface ShortcutBinding {
  keyCombo: string;
  descriptionRu: string;
  descriptionEn: string;
  action: () => void;
}

export function registerWebGlobalShortcuts(bindings: ShortcutBinding[]): () => void {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Ignore if user is inside a form input/textarea unless modifier keys are held
    const target = e.target as HTMLElement;
    const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

    bindings.forEach(binding => {
      const combo = binding.keyCombo.toLowerCase();
      const parts = combo.split('+').map(p => p.trim());

      const needAlt = parts.includes('alt');
      const needCtrl = parts.includes('ctrl') || parts.includes('cmd');
      const needShift = parts.includes('shift');
      const key = parts[parts.length - 1];

      if (
        e.altKey === needAlt &&
        (e.ctrlKey || e.metaKey) === needCtrl &&
        e.shiftKey === needShift &&
        e.key.toLowerCase() === key
      ) {
        if (!isInput || needAlt || needCtrl) {
          e.preventDefault();
          binding.action();
        }
      }
    });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', handleKeyDown);
    }
  };
}

export async function registerTauriGlobalShortcut(
  shortcut: string,
  onTrigger: () => void
): Promise<boolean> {
  const isTauri = typeof window !== 'undefined' && ('__TAURI_INTERNALS__' in window || '__TAURI__' in window);
  
  if (!isTauri) return false;

  try {
    const { register, isRegistered } = await import('@tauri-apps/plugin-global-shortcut' as any);
    const alreadyRegistered = await isRegistered(shortcut);
    if (!alreadyRegistered) {
      await register(shortcut, (event: any) => {
        if (event.state === 'Pressed') {
          onTrigger();
        }
      });
      return true;
    }
  } catch (err) {
    console.warn(`Tauri global shortcut registration (${shortcut}) fallback:`, err);
  }
  return false;
}
