import React from 'react';

type DiscordBotLegalProps = {
  lang: 'ru' | 'en';
  document: 'terms' | 'privacy';
  onBack: () => void;
};

const documents = {
  ru: {
    terms: {
      eyebrow: 'RUSTY.LUB DISCORD BOT / TERMS',
      title: 'Условия использования Discord-бота Rusty.Lub',
      updated: 'Последнее обновление: 18 ноября 2026 года',
      intro: 'Настоящие условия регулируют использование Discord-бота Rusty.Lub (далее — «Бот»), предназначенного для взаимодействия с сообществом Rusty.Lub и игровым сервером Rust.',
      sections: [
        ['1. Назначение Бота', 'Бот предоставляет информационные и административные функции Discord-сервера и игрового сервера Rust: отображение статуса и списка игроков, передачу сообщений, выполнение доступных команд управления сервером, ведение служебных журналов и приём обращений через систему тикетов. Набор функций может изменяться.'],
        ['2. Правила использования', 'Пользователь обязуется использовать Бота законно, не пытаться нарушить его работу, обойти ограничения доступа, получить чужие данные или использовать команды не по назначению. Запрещены спам, ложные обращения, угрозы, оскорбления, публикация незаконного или чужого конфиденциального материала.'],
        ['3. Команды и административные функции', 'Команды, способные изменять состояние игрового сервера или затрагивать других игроков, доступны только уполномоченным администраторам. Пользователь не должен пытаться получить или использовать административные права без разрешения. Администрация может проверять и фиксировать действия, выполненные через Бота.'],
        ['4. Тикеты и обращения', 'При создании обращения указывайте достоверную информацию и передавайте только материалы, необходимые для рассмотрения вопроса. Не отправляйте пароли, токены, платёжные данные и иные секреты. Отправка обращения не гарантирует определённого решения или срока ответа.'],
        ['5. Доступность и ограничения', 'Бот предоставляется по принципу «как есть» и «по мере доступности». Возможны перерывы, ошибки, обновления и отключение отдельных функций. Администрация вправе ограничить доступ к Боту или его функциям при нарушении этих условий, угрозе безопасности или технической необходимости.'],
        ['6. Сторонние платформы', 'Для работы Бот использует Discord и подключение к игровому серверу Rust через WebRCON. Использование Discord регулируется также условиями и политиками Discord. Rust и связанные с ним товарные знаки принадлежат соответствующим правообладателям. Rusty.Lub не заявляет об аффилированности с Facepunch Studios.'],
        ['7. Ответственность', 'Пользователь отвечает за содержание отправляемых сообщений и обращений, а также за правомерность передаваемых материалов. В пределах, допускаемых применимым законодательством, оператор не гарантирует бесперебойную работу Бота и не отвечает за сбои Discord, хостинга, игрового сервера или иных сторонних систем.'],
        ['8. Изменение условий', 'Условия могут обновляться при изменении функций Бота или требований законодательства. Актуальная редакция публикуется на этой странице. Продолжая пользоваться Ботом после публикации изменений, пользователь принимает обновлённые условия.'],
        ['9. Контакты', 'По вопросам работы Бота и настоящих условий: rusty.lub-slq@inbox.ru.']
      ]
    },
    privacy: {
      eyebrow: 'RUSTY.LUB DISCORD BOT / PRIVACY',
      title: 'Политика конфиденциальности Discord-бота Rusty.Lub',
      updated: 'Последнее обновление: 18 ноября 2026 года',
      intro: 'Эта политика описывает, какие данные могут обрабатываться при использовании Discord-бота Rusty.Lub, для каких целей они используются и как обратиться по вопросам конфиденциальности.',
      sections: [
        ['1. Какие данные обрабатываются', 'В зависимости от используемых функций Бот может обрабатывать Discord ID, имя и тег пользователя, ID сервера и каналов, содержание команд и сообщений, а также сведения об административных действиях. При работе системы тикетов могут обрабатываться выбранная категория обращения, ответы в формах, текст переписки, ID обращения, Discord ID автора и ссылки на приложенные вложения.'],
        ['2. Игровые данные', 'При взаимодействии с игровым сервером Rust Бот может получать и передавать игровые никнеймы, SteamID64, сведения о подключении и присутствии игроков, а также ответы игрового сервера на команды WebRCON. Состав данных зависит от команды и информации, которую предоставляет сервер.'],
        ['3. Цели обработки', 'Данные используются для предоставления команд и функций Бота, отображения статуса сервера и игроков, администрирования игрового сервера, обработки обращений и жалоб, обеспечения безопасности, расследования злоупотреблений и ведения служебного журнала действий.'],
        ['4. Журналы и хранение тикетов', 'Административные действия могут фиксироваться в закрытом Discord-канале аудита. Данные тикетов сохраняются в локальном хранилище процесса Бота (файл данных на сервере, где он запущен) для поддержания истории и статуса обращений. Срок хранения зависит от необходимости обработки обращения, требований безопасности и технических настроек; отдельный фиксированный срок для всех записей не заявляется.'],
        ['5. Передача данных', 'Бот работает через платформу Discord и взаимодействует с игровым сервером Rust. Сообщения и данные, отправленные в Discord, обрабатываются Discord в соответствии с его собственными документами. Данные могут быть доступны уполномоченным администраторам Rusty.Lub в объёме, необходимом для поддержки, модерации и администрирования. Оператор не продаёт персональные данные.'],
        ['6. Вложения и ссылки', 'Если пользователь прикладывает файлы или ссылки, Бот может передать их адреса в служебную ветку обращения. Не отправляйте материалы, содержащие пароли, токены, платёжные реквизиты, документы или сведения о третьих лицах, если их передача не необходима и не имеет законного основания.'],
        ['7. Безопасность', 'Доступ к служебным данным ограничивается настройками Discord-сервера и доступом к среде, где запущен Бот. Пользователь не должен передавать Боту секреты, такие как пароли и токены. Ни один способ хранения или передачи данных не может гарантировать абсолютную безопасность.'],
        ['8. Права и обращения', 'По вопросам доступа, исправления или удаления данных, а также по вопросам конфиденциальности можно обратиться по адресу rusty.lub-slq@inbox.ru. В обращении укажите свой Discord ID и суть запроса; не отправляйте пароли или токены. Возможность удаления отдельных записей может зависеть от технических журналов, требований безопасности и правил Discord.'],
        ['9. Изменения политики', 'При изменении функций Бота, состава обрабатываемых данных или применимых требований эта политика может обновляться. Актуальная редакция размещается на этой странице.'],
        ['10. Контакты', 'Контакт по вопросам конфиденциальности: rusty.lub-slq@inbox.ru.']
      ]
    }
  },
  en: {
    terms: {
      eyebrow: 'RUSTY.LUB DISCORD BOT / TERMS',
      title: 'Rusty.Lub Discord Bot Terms of Service',
      updated: 'Last updated: November 18, 2026',
      intro: 'These terms govern the use of the Rusty.Lub Discord bot (the “Bot”), which provides community features and integrations with the Rust game server.',
      sections: [
        ['1. Purpose of the Bot', 'The Bot provides informational and administrative features for the Discord community and Rust game server, including server and player status, message relays, available server-management commands, operational logs, and a ticket-based support system. Features may change over time.'],
        ['2. Acceptable Use', 'You must use the Bot lawfully and must not disrupt its operation, bypass access restrictions, obtain another person’s data, or misuse its commands. Spam, false reports, threats, harassment, and unlawful or confidential material are prohibited.'],
        ['3. Commands and Administrative Features', 'Commands that change the game server or affect other players are restricted to authorized administrators. You must not attempt to obtain or use administrative permissions without authorization. Bot actions may be reviewed and logged by the administration.'],
        ['4. Tickets and Support Requests', 'Provide accurate information and submit only material relevant to your request. Do not submit passwords, tokens, payment details, or other secrets. Submitting a ticket does not guarantee a particular outcome or response time.'],
        ['5. Availability and Restrictions', 'The Bot is provided “as is” and “as available”. Interruptions, errors, updates, and feature changes may occur. Access may be restricted when these terms are violated, security is at risk, or maintenance is required.'],
        ['6. Third-Party Platforms', 'The Bot relies on Discord and connects to the Rust game server through WebRCON. Discord use is also subject to Discord’s own terms and policies. Rust and related trademarks belong to their respective owners. Rusty.Lub is not affiliated with Facepunch Studios.'],
        ['7. Responsibility', 'You are responsible for the content of your messages and support requests and for having the right to submit any materials. To the extent permitted by applicable law, the operator does not guarantee uninterrupted Bot operation and is not responsible for outages of Discord, hosting, the game server, or other third-party systems.'],
        ['8. Changes to These Terms', 'These terms may be updated when Bot features or legal requirements change. The current version will be published on this page. Continued use after an update constitutes acceptance of the revised terms.'],
        ['9. Contact', 'For questions about the Bot or these terms, contact rusty.lub-slq@inbox.ru.']
      ]
    },
    privacy: {
      eyebrow: 'RUSTY.LUB DISCORD BOT / PRIVACY',
      title: 'Rusty.Lub Discord Bot Privacy Policy',
      updated: 'Last updated: November 18, 2026',
      intro: 'This policy explains what information may be processed when you use the Rusty.Lub Discord bot, why it is used, and how to contact us about privacy matters.',
      sections: [
        ['1. Information Processed', 'Depending on the features used, the Bot may process your Discord user ID, username and tag, server and channel IDs, command and message content, and details of administrative actions. The ticket system may process the selected category, form responses, conversation content, ticket ID, requester’s Discord ID, and links to submitted attachments.'],
        ['2. Game Server Information', 'When interacting with the Rust game server, the Bot may receive or relay player nicknames, SteamID64 identifiers, connection and presence information, and responses returned by the server through WebRCON. The exact information depends on the command and data made available by the server.'],
        ['3. Purposes', 'Information is used to provide Bot commands and features, display server and player status, administer the game server, handle support requests and reports, maintain security, investigate misuse, and keep operational records.'],
        ['4. Logs and Ticket Storage', 'Administrative actions may be recorded in a restricted Discord audit channel. Ticket records are stored in the Bot process’s local data storage (a data file on the host running the Bot) to maintain ticket history and status. Retention depends on support needs, security requirements, and technical configuration; no single fixed retention period is stated for all records.'],
        ['5. Sharing', 'The Bot operates through Discord and communicates with the Rust game server. Information submitted to Discord is processed by Discord under its own documentation. Authorized Rusty.Lub administrators may access information to the extent needed for support, moderation, and server administration. The operator does not sell personal data.'],
        ['6. Attachments and Links', 'When users submit files or links, the Bot may forward their URLs to the private support thread. Do not submit passwords, tokens, payment credentials, identity documents, or third-party information unless the submission is necessary and lawful.'],
        ['7. Security', 'Access to operational information is limited through Discord server permissions and access to the environment where the Bot runs. Do not provide the Bot with secrets such as passwords or tokens. No method of storage or transmission can be guaranteed to be completely secure.'],
        ['8. Your Requests and Rights', 'For requests concerning access, correction or deletion of information, or other privacy questions, contact rusty.lub-slq@inbox.ru. Include your Discord ID and a description of your request; never send passwords or tokens. Deletion of particular records may be subject to technical logs, security requirements, and Discord’s own rules.'],
        ['9. Policy Updates', 'This policy may be updated when Bot features, processed information, or applicable requirements change. The current version will be published on this page.'],
        ['10. Contact', 'Privacy contact: rusty.lub-slq@inbox.ru.']
      ]
    }
  }
} as const;

export default function DiscordBotLegal({ lang, document, onBack }: DiscordBotLegalProps) {
  const content = documents[lang][document];
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#f28a24]">{content.eyebrow}</p>
          <h1 className="mt-2 text-2xl font-black text-white sm:text-3xl">{content.title}</h1>
          <p className="mt-2 text-xs text-zinc-500">{content.updated}</p>
        </div>
        <button type="button" onClick={onBack} className="border border-white/15 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-orange-400/50 hover:text-white">
          {lang === 'ru' ? 'На главную' : 'Back to home'}
        </button>
      </div>
      <div className="border border-orange-500/20 bg-[#10161d] p-5 sm:p-7">
        <p className="text-sm leading-7 text-zinc-300">{content.intro}</p>
      </div>
      <div className="space-y-4">
        {content.sections.map(([heading, body]) => (
          <section key={heading} className="border border-white/10 bg-[#0c1118]/90 p-5 sm:p-6">
            <h2 className="text-base font-bold text-white">{heading}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{body}</p>
          </section>
        ))}
      </div>
      <div className="border-t border-white/10 pt-5 text-sm text-zinc-500">
        Rusty.Lub Discord Bot · rusty.lub-slq@inbox.ru
      </div>
    </div>
  );
}
