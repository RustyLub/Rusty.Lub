import React from 'react';

interface FooterProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  onOpenCabinet?: () => void;
  onOpenDonation?: () => void;
  onOpenTerms?: () => void;
}

export default function Footer({
  lang,
  onNavigate,
  onOpenCabinet,
  onOpenDonation,
  onOpenTerms
}: FooterProps) {
  return (
    <footer className="w-full border-t border-[#1e2633] bg-[#0d1016] mt-16 pt-12 pb-8 px-4 sm:px-6 lg:px-8 text-left">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5 cursor-pointer group w-fit"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ef4444] flex items-center justify-center font-black text-xs text-white shadow-[0_0_15px_rgba(249,115,22,0.35)]">
                RL
              </div>
              <div className="font-extrabold text-base tracking-wider text-[#eef2f7]">
                RUSTY<span className="text-[#f97316]">.LUB</span>
              </div>
            </div>
            <p className="text-xs text-[#8b95a8] leading-relaxed max-w-xs">
              {lang === 'ru'
                ? 'Тактический портал для игроков Rust. Гайды, калькуляторы, бинды и сообщество.'
                : 'Tactical portal for Rust players. Guides, calculators, keybinds and community hub.'}
            </p>
          </div>

          {/* Tools Col */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-widest text-[#5a6578] uppercase font-mono">
              {lang === 'ru' ? 'Инструменты' : 'Tools'}
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-[#8b95a8]">
              <button onClick={() => onNavigate('raid')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                Raid Calculator
              </button>
              <button onClick={() => onNavigate('binds')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                Macro Binds
              </button>
              <button onClick={() => onNavigate('fps')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                FPS Optimization
              </button>
              <button onClick={() => onNavigate('decay')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                Decay Timer
              </button>
              <button onClick={() => onNavigate('electrical')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                Electricity Simulator
              </button>
            </div>
          </div>

          {/* Community Col */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-widest text-[#5a6578] uppercase font-mono">
              {lang === 'ru' ? 'Сообщество' : 'Community'}
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-[#8b95a8]">
              <button onClick={() => onNavigate('clan')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                {lang === 'ru' ? 'Поиск Клана (Clan Board)' : 'Clan Board & LFG'}
              </button>
              <button onClick={() => onNavigate('chat')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                {lang === 'ru' ? 'Чат Сообщества' : 'Community Chat'}
              </button>
              <button onClick={() => onNavigate('news')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                {lang === 'ru' ? 'Новости' : 'News & Updates'}
              </button>
              <button onClick={() => onNavigate('faq')} className="hover:text-[#f97316] transition-colors text-left cursor-pointer">
                {lang === 'ru' ? 'Частые вопросы (FAQ)' : 'FAQ & Beginner Guide'}
              </button>
              <a 
                href="https://discord.gg/R2TyKZ9xvZ" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#f97316] transition-colors text-left"
              >
                Discord Server
              </a>
            </div>
          </div>

          {/* Account Col */}
          <div className="space-y-3">
            <h5 className="text-[11px] font-bold tracking-widest text-[#5a6578] uppercase font-mono">
              {lang === 'ru' ? 'Аккаунт & Инфо' : 'Account & Legal'}
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-[#8b95a8]">
              <button 
                onClick={onOpenCabinet} 
                className="hover:text-[#f97316] transition-colors text-left cursor-pointer"
              >
                {lang === 'ru' ? 'Личный кабинет' : 'User Cabinet'}
              </button>
              <button 
                onClick={onOpenDonation} 
                className="hover:text-[#f97316] transition-colors text-left cursor-pointer"
              >
                {lang === 'ru' ? 'Поддержать проект / VIP' : 'Support / VIP'}
              </button>
              <button 
                onClick={onOpenTerms} 
                className="hover:text-[#f97316] transition-colors text-left cursor-pointer"
              >
                {lang === 'ru' ? 'Пользовательское соглашение' : 'Terms & Privacy'}
              </button>
              <a 
                href="https://t.me/S1mreyReserve" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-[#f97316] transition-colors text-left"
              >
                Telegram: @S1mreyReserve
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-[#1e2633] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5a6578]">
          <span>© 2026 Rusty.Lub · {lang === 'ru' ? 'Не аффилирован с Facepunch Studios' : 'Not affiliated with Facepunch Studios'}</span>
          <span className="font-mono">Tactical Command × Orange Blaze · v2.0</span>
        </div>
      </div>
    </footer>
  );
}
