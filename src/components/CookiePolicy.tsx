import React from 'react';

interface CookiePolicyProps { lang: 'ru' | 'en'; onManageCookies: () => void; }

export default function CookiePolicy({ lang, onManageCookies }: CookiePolicyProps) {
  const ru = lang === 'ru';
  const sections = ru ? [
    { title: '1. Кто отвечает за сайт', body: 'Сайт Rusty.Lub (rusty-lub.ru и rusty-lub.online) администрируется командой проекта Rusty.Lub. Контакт для вопросов о конфиденциальности и технологиях хранения данных: rusty.lub_offers@bk.ru. Юридическое наименование и адрес оператора должны быть дополнены владельцем проекта до публикации этой политики как окончательного юридического документа.' },
    { title: '2. Что такое Cookies', body: 'Cookies — небольшие данные, которые сайт или сторонний сервис может сохранять в браузере. Аналогичные технологии включают Local Storage и IndexedDB. Они могут использоваться для сохранения настроек, поддержки входа и работы функций сайта.' },
    { title: '3. Что использует Rusty.Lub', body: 'По результатам проверки исходного кода сайта: отдельная установка Cookies через document.cookie и серверный Set-Cookie в проверенных файлах не обнаружены. Firebase Authentication использует IndexedDB с резервным механизмом Browser Local Persistence. Сайт также использует Local Storage для языка, темы, настроек интерфейса и локального состояния профиля. Эти механизмы не следует называть Cookies: это отдельные технологии хранения на устройстве.' },
    { title: '4. Необходимые технологии', body: 'Необходимое хранение поддерживает выбранный язык и тему, настройки интерфейса, состояние некоторых пользовательских функций и сессию Firebase Authentication. Без этих механизмов отдельные функции, включая вход в аккаунт и сохранение настроек, могут работать некорректно. Они не используются для рекламного профилирования.' },
    { title: '5. Сторонние сервисы и внешние запросы', body: 'В исходном коде обнаружены загрузка шрифтов Google Fonts, изображения/статус Enum.gg, а также внешние ресурсы Discord (например, аватары и виджеты). При обращении к серверам этих поставщиков они могут получать технические данные запроса, включая IP-адрес, сведения о браузере и время обращения. Условия обработки определяются политиками соответствующих поставщиков. Внешний запрос сам по себе не доказывает, что сайт устанавливает Cookie этого поставщика.' },
    { title: '6. Аналитика и реклама', body: 'В проверенных исходных файлах не обнаружена активная инициализация Google Analytics, рекламных пикселей или рекламных трекеров. Если такие инструменты будут добавлены в будущем, они должны быть описаны здесь и, когда этого требует применимое право, запускаться только после предварительного согласия пользователя.' },
    { title: '7. Управление выбором', body: 'Вы можете сохранить отказ от необязательной аналитики или изменить настройки через кнопку ниже и ссылку «Настройки Cookies» в нижней части сайта. Отсутствие ответа не считается согласием. Необязательные категории выключены по умолчанию.' },
    { title: '8. Срок хранения', body: 'Настройки интерфейса хранятся в браузере до их изменения или удаления пользователем. Firebase Authentication управляет сроком своей локальной сессии в соответствии с настройками SDK и браузера. Выбор Cookie-настроек сохраняется в Local Storage до изменения или очистки данных сайта.' },
    { title: '9. Ваши права и обращения', body: 'По вопросам доступа, исправления или удаления персональных данных, отзыва согласия и конфиденциальности напишите на rusty.lub_offers@bk.ru. Не отправляйте пароли, токены авторизации и другие секретные данные по электронной почте.' },
    { title: '10. Обновления документа', body: 'При изменении используемых технологий или требований закона эта страница обновляется. Дата последнего обновления: 18 ноября 2026 года.' }
  ] : [
    { title: '1. Who is responsible for the site', body: 'Rusty.Lub (rusty-lub.ru and rusty-lub.online) is administered by the Rusty.Lub project team. Privacy and device-storage contact: rusty.lub_offers@bk.ru. The operator’s legal name and address must be supplied by the project owner before this policy is treated as a final legal notice.' },
    { title: '2. What cookies are', body: 'Cookies are small pieces of data that a website or third-party service may store in a browser. Related technologies include Local Storage and IndexedDB. They may support preferences, sign-in and site functionality.' },
    { title: '3. Technologies used by Rusty.Lub', body: 'A review of the site source code found no direct document.cookie writes or server Set-Cookie implementation in the inspected files. Firebase Authentication is initialized through the Firebase JavaScript SDK; the exact browser persistence mechanism is managed by the SDK and browser. A separate email-auth module explicitly prefers IndexedDB and falls back to Browser Local Persistence. The site also uses Local Storage for language, theme, interface preferences and a local profile cache. These are distinct device-storage technologies and should not all be described as cookies.' },
    { title: '4. Essential technologies', body: 'Essential storage supports language and theme preferences, interface settings, some user features and Firebase Authentication sessions. Without these mechanisms, features such as account sign-in and preference persistence may not work correctly. They are not used for advertising profiles.' },
    { title: '5. Third-party services and external requests', body: 'The source code includes Google Fonts, Enum.gg status/images and Discord resources (for example avatars and widgets). When the browser contacts these providers, they may receive technical request data such as IP address, browser information and request time. Their own privacy policies govern their processing. An external request alone does not prove that this site sets a provider cookie.' },
    { title: '6. Analytics and advertising', body: 'No active Google Analytics initialization, advertising pixels or advertising trackers were identified in the inspected source files. If such tools are added later, they must be disclosed here and, where required by applicable law, run only after prior user consent.' },
    { title: '7. Managing your choice', body: 'You can reject optional analytics or change your settings using the button below and the “Cookie settings” link in the site footer. Silence is not consent. Optional categories are off by default.' },
    { title: '8. Retention', body: 'Interface preferences remain in the browser until changed or cleared by the user. Firebase Authentication controls its local session lifetime according to SDK and browser settings. Cookie preferences are stored in Local Storage until changed or site data is cleared.' },
    { title: '9. Your rights and requests', body: 'For requests concerning access, correction or deletion of personal data, withdrawal of consent or privacy, contact rusty.lub_offers@bk.ru. Do not send passwords, authentication tokens or other secrets by email.' },
    { title: '10. Changes', body: 'This page will be updated when the technologies used or legal requirements change. Last updated: 18 November 2026.' }
  ];
  return (
    <article className="mx-auto w-full max-w-5xl space-y-6 py-5">
      <header className="border-b border-white/10 pb-5">
        <p className="font-mono text-xs font-bold uppercase tracking-[.18em] text-[#f28a24]">R.L. / PRIVACY & COOKIES</p>
        <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{ru ? 'Политика Cookies и технологий хранения' : 'Cookie & Device Storage Policy'}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-400">{ru ? 'Информация о Cookies, Local Storage, IndexedDB и внешних сервисах сайта Rusty.Lub.' : 'Information about cookies, Local Storage, IndexedDB and external services used by Rusty.Lub.'}</p>
        <button type="button" onClick={onManageCookies} className="mt-4 border border-[#d65a2c] bg-[#c94b2b] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#e05b35]">{ru ? 'Открыть настройки Cookies' : 'Open cookie settings'}</button>
      </header>
      <div className="grid gap-3">
        {sections.map((section, index) => (
          <section key={section.title} className="border border-white/10 bg-[#0d121b] p-4 sm:p-5">
            <h2 className="text-sm font-bold text-white">{section.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-400">{section.body}</p>
          </section>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-slate-500">{ru ? 'Эта информация описывает технологии, обнаруженные в проверенной версии исходного кода. Фактическое поведение опубликованного сайта, настройки Firebase и действия сторонних поставщиков необходимо дополнительно проверить в браузере и консоли соответствующих сервисов.' : 'This notice describes technologies identified in the inspected source version. The live site behavior, Firebase configuration and third-party provider practices must also be verified in the browser and provider consoles.'}</p>
    </article>
  );
}
