import { useState } from 'react';
import fandomIcons from './fandom_icons.json';

export const getRustLabsIconUrl = (id: string): string => {
  return (fandomIcons as Record<string, string>)[id] || `https://wiki.rustclash.com/img/items180/${id}.png`;
};

interface ItemImageOrFallbackProps {
  id: string;
  lang: 'ru' | 'en';
  fallback?: React.ComponentType<{ size?: number }> | (() => React.JSX.Element);
  size?: number;
  className?: string;
  icon?: string;
}

export function ItemImageOrFallback({ id, lang, fallback: Fallback, size = 44, className = '', icon }: ItemImageOrFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const iconUrl = getRustLabsIconUrl(id);

  if (!hasError) {
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${className}`} style={{ width: size, height: size }}>
        {!loaded && (
          <div className="absolute inset-0 bg-zinc-950/20 animate-pulse flex items-center justify-center rounded-sm">
            {Fallback ? (
              <div className="opacity-40 scale-75">
                <Fallback size={size * 0.8} />
              </div>
            ) : (
              <span className="text-zinc-600 font-mono text-[9px]">...</span>
            )}
          </div>
        )}
        <img
          src={iconUrl}
          alt={id}
          referrerPolicy="no-referrer"
          className={`object-contain transition-opacity duration-200 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ width: size * 0.95, height: size * 0.95 }}
          onLoad={() => setLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // Fallback if image fails to load
  if (Fallback) {
    return <Fallback size={size} />;
  }

  return (
    <div className="text-xl flex items-center justify-center" style={{ width: size, height: size }}>
      {icon || '📦'}
    </div>
  );
}
