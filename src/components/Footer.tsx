import React from 'react';

interface FooterProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
  onOpenCabinet?: () => void;
  onOpenDonation?: () => void;
  onOpenTerms?: () => void;
}

const linkClass = 'text-left text-sm text-[#9aa5b5] hover:text-[#f28a24] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f28a24] transition-colors';

export default function Footer({ lang, onNavigate, onOpenCabinet, onOpenDonation, onOpenTerms }: FooterProps) {
  const ru = lang === 'ru';
  return (
    <footer className="w-full mt-16 border-t border-white/10 bg-[#090c10]/95 px-4 pb-8 pt-10 text-left sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-3 lg:col-span-1">
            <button type="button" onClick={() => onNavigate('home')} className="flex w-fit items-center gap-2.5 rounded-sm text-left">
              <span className="flex h-9 w-9 items-center justify-center rounded-md border border-orange-400/40 bg-gradient-to-br from-[#f28a24] to-[#b94e13] text-xs font-black text-white shadow-lg shadow-orange-950/30">RL</span>
              <span className="font-black tracking-wider text-[#eef2f7]">RUSTY<span className="text-[#f28a24]">.LUB</span></span>
            </button>
            <p className="max-w-xs text-sm leading-relaxed text-[#8793a4]">
              {ru ? 'Инструменты, справочники и материалы для игроков Rust.' : 'Tools, references and resources for Rust players.'}
            </p>
            <a className={linkClass} href="mailto:rusty.lub_offers@bk.ru">rusty.lub_offers@bk.ru</a>
          </div>

          <div className="space-y-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#f28a24]">{ru ? 'Инструменты' : 'Tools'}</h2>
            <nav className="flex flex-col items-start gap-2">
              <button className={linkClass} onClick={() => onNavigate('tools')}>{ru ? 'Все инструменты' : 'All tools'}</button>
              <button className={linkClass} onClick={() => onNavigate('raid')}>Raid Calculator</button>
              <button className={linkClass} onClick={() => onNavigate('binds')}>Macro Binds</button>
              <button className={linkClass} onClick={() => onNavigate('fps')}>FPS Optimization</button>
              <button className={linkClass} onClick={() => onNavigate('electrical')}>{ru ? 'Симулятор электрики' : 'Electrical Simulator'}</button>
            </nav>
          </div>

          <div className="space-y-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#f28a24]">{ru ? 'Сообщество' : 'Community'}</h2>
            <nav className="flex flex-col items-start gap-2">
              <button className={linkClass} onClick={() => onNavigate('clan')}>Clan Board</button>
              <button className={linkClass} onClick={() => onNavigate('chat')}>{ru ? 'Чат сообщества' : 'Community chat'}</button>
              <button className={linkClass} onClick={() => onNavigate('news')}>{ru ? 'Новости и обновления' : 'News & updates'}</button>
              <button className={linkClass} onClick={() => onNavigate('faq')}>FAQ</button>
              <a className={linkClass} href="https://discord.gg/R2TyKZ9xvZ" target="_blank" rel="noopener noreferrer">Discord</a>
            </nav>
          </div>

          <div className="space-y-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#f28a24]">{ru ? 'Аккаунт' : 'Account'}</h2>
            <nav className="flex flex-col items-start gap-2">
              <button className={linkClass} onClick={onOpenCabinet}>{ru ? 'Личный кабинет' : 'User cabinet'}</button>
              <button className={linkClass} onClick={onOpenDonation}>{ru ? 'Поддержка / VIP' : 'Support / VIP'}</button>
            </nav>
          </div>

          <div className="space-y-3">
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#f28a24]">{ru ? 'Документы' : 'Documents'}</h2>
            <nav className="flex flex-col items-start gap-2">
              <button className={linkClass} onClick={onOpenTerms}>{ru ? 'Пользовательское соглашение' : 'User agreement'}</button>
              <a className={linkClass} href="mailto:rusty.lub_offers@bk.ru?subject=Privacy%20and%20personal%20data">{ru ? 'Вопросы по персональным данным' : 'Privacy and personal data'}</a>
              <a className={linkClass} href="mailto:rusty.lub_offers@bk.ru?subject=Paid%20services%20and%20refunds">{ru ? 'Платные услуги и возвраты' : 'Paid services and refunds'}</a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-[#778294] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Rusty.Lub</span>
          <span>{ru ? 'Связь по вопросам проекта:' : 'Project contact:'} <a className="text-[#aeb8c5] hover:text-[#f28a24]" href="mailto:rusty.lub_offers@bk.ru">rusty.lub_offers@bk.ru</a></span>
          <span className="font-mono">INDUSTRIAL STEEL · R.L.</span>
        </div>
      </div>
    </footer>
  );
}
