import React from 'react';

interface GuidesHubTabProps {
  lang: 'ru' | 'en';
  onNavigate: (tab: any) => void;
}

export default function GuidesHubTab({ lang, onNavigate }: GuidesHubTabProps) {
  const guides = [
    {
      id: 'errors',
      icon: '🔧',
      title: lang === 'ru' ? 'Решение ошибок' : 'Error Solutions',
      desc: lang === 'ru' ? 'EAC Disconnected, краши, чёрный экран и вылеты' : 'EAC fixes, crash solutions & startup issues',
      tag: 'Critical'
    },
    {
      id: 'binds',
      icon: '⌨️',
      title: lang === 'ru' ? 'Макро-бинды' : 'Macro Binds',
      desc: lang === 'ru' ? 'Готовые конфигурации для PVP, фаст-лута и стройки' : 'Combatlog, auto-crouch, quick swap & crafting binds',
      tag: 'Hot'
    },
    {
      id: 'fps',
      icon: '📊',
      title: lang === 'ru' ? 'Оптимизация FPS' : 'FPS Optimization',
      desc: lang === 'ru' ? 'Профили настроек под слабое, среднее и мощное железо' : 'Low / Mid / High presets and console tweaks',
      tag: 'Meta'
    },
    {
      id: 'weapons',
      icon: '🔫',
      title: lang === 'ru' ? 'Оружие и отдача' : 'Weapons & Recoil',
      desc: lang === 'ru' ? 'Таблицы урона, дистанции, скорость пули и мета' : 'Damage tables, spray patterns and attachment stats',
    },
    {
      id: 'monuments',
      icon: '🗿',
      title: lang === 'ru' ? 'Монументы и головоломки' : 'Monuments & Puzzles',
      desc: lang === 'ru' ? 'Схемы предохранителей, карточки доступа и лут' : 'Card puzzle guides, fuse locations & radiation levels',
    },
    {
      id: 'wipe',
      icon: '📅',
      title: lang === 'ru' ? 'Вайпы и расписание' : 'Wipes & Events',
      desc: lang === 'ru' ? 'Глобальные Force Wipes, события и тайминги' : 'Official monthly force wipes & community schedules',
    },
    {
      id: 'faq',
      icon: '❓',
      title: lang === 'ru' ? 'FAQ для новичков' : 'Beginner FAQ',
      desc: lang === 'ru' ? 'С чего начать в Rust и как пользоваться порталом' : 'Starter tips, essential mechanics & onboarding guide',
    }
  ];

  return (
    <div className="space-y-6 text-left pb-12">
      <div className="space-y-1">
        <div className="text-xs font-bold uppercase tracking-wider text-[#f97316]">
          {lang === 'ru' ? 'База знаний' : 'Knowledge'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#eef2f7]">
          {lang === 'ru' ? 'Гайды и оптимизация' : 'Guides & Optimization'}
        </h1>
        <p className="text-sm text-[#8b95a8] max-w-xl">
          {lang === 'ru' 
            ? 'Проверенные решения ошибок, бинды, руководства по оружию и монументам.' 
            : 'Tested error fixes, console binds, weapon mechanics and monument guides.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {guides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => onNavigate(guide.id)}
            className="p-5 rounded-2xl bg-[#12161e] border border-[#1e2633] hover:border-[#f97316] transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-11 h-11 rounded-xl bg-[#f97316]/10 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  {guide.icon}
                </div>
                {guide.tag && (
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                    guide.tag === 'Critical' ? 'bg-[#ef4444] text-white' : (guide.tag === 'Hot' ? 'bg-[#f97316] text-white' : 'bg-[#3b82f6] text-white')
                  }`}>
                    {guide.tag}
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-[#eef2f7] group-hover:text-[#f97316] transition-colors mb-1">
                {guide.title}
              </h3>
              <p className="text-xs text-[#8b95a8] leading-relaxed">
                {guide.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#1e2633] flex items-center justify-between text-xs font-semibold text-[#f97316] group-hover:translate-x-0.5 transition-transform">
              <span>{lang === 'ru' ? 'Читать' : 'Read'}</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
