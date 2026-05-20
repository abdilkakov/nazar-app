// ===== i18n dictionary: EN / RU / KK =====
// Three hero copy variants per language (for tweak switching).

const I18N = {
  en: {
    nav: { features: 'Features', how: 'How it works', stats: 'Beta data', pricing: 'Pricing', faq: 'FAQ' },
    cta_primary: 'Start free trial',
    cta_demo: 'See live demo',
    eyebrow_hero: 'PRIVATE BETA · 47 USERS · ALMATY',
    hero_copy: [
      {
        h: ['Nazar watches your', 'attention', '— so you can stop watching the clock.'],
        sub: 'Nazar uses your laptop camera to track when you’re focused, when you’ve drifted, and when you reach for your phone. No screenshots. No keystrokes. Just attention.'
      },
      {
        h: ['You check your phone', '58 times a day.', 'Nazar is the first thing that notices.'],
        sub: 'Most focus apps trust you to be honest. Nazar watches your eyes, your posture, and the rectangle in your hand — and gives you an attention score that doesn’t lie.'
      },
      {
        h: ['The Pomodoro timer', 'doesn’t', 'know if you’re actually working. Nazar does.'],
        sub: 'Webcam-based attention tracking. Detects phone pickups, head-down moments, and real deep work — runs locally, sends nothing to a server.'
      }
    ],
    fineprint: ['Free 14-day trial', 'No card required', 'Works offline'],
    demo_label_focused: 'Focused · gaze on screen',
    demo_label_drifting: 'Drifting · eyes off-screen',
    demo_label_phone: 'Phone detected · 4s',
    demo_score: 'Focus score',
    demo_session: 'Session',
    demo_drift: 'Drifts today',
    demo_phone: 'Phone pickups',
    live_eyebrow: 'WHAT NAZAR SEES',
    live_h: 'Four signals. One honest score.',
    live_sub: 'A small on-device model reads four things from your camera, every second. None of it leaves the laptop.',
    features: [
      { t: 'Gaze on screen', d: 'Tracks whether your eyes are on the monitor or wandering off. The accuracy comes from looking at iris position, not just face direction.' },
      { t: 'Phone in frame', d: 'Detects the moment you pick up your phone — usually three seconds before you would have admitted it to yourself.' },
      { t: 'Posture & micro-drift', d: 'Slumping, leaning back, the dead-stare. The signals that mean your brain checked out before your hands did.' },
      { t: 'Cadence of work', d: 'Combines the above into a single attention score that updates every second and an honest minute-by-minute timeline of your day.' }
    ],
    how_eyebrow: 'HOW IT WORKS',
    how_h: 'Three steps. One permission.',
    how_sub: 'Setup takes ninety seconds. After that Nazar is invisible until you’re distracted.',
    steps: [
      { t: 'Open Nazar, allow the camera.', d: 'The model runs locally on your machine. We have no servers that could ever see your face — even if we wanted to.' },
      { t: 'Start a focus session.', d: 'Pick a task, pick a length. Nazar starts watching your attention the moment the timer starts.' },
      { t: 'Get an honest day in review.', d: 'A timeline of real focus vs. drift. Trends. Phone-pickup count. The numbers most apps refuse to show you.' }
    ],
    calc_eyebrow: 'THE COST OF DISTRACTION',
    calc_h: 'Move the slider. See your year.',
    calc_label: 'Hours per day at your desk',
    calc_label_2: 'Each context switch costs ~23 minutes',
    calc_unit: 'hours lost to drift per year*',
    calc_note: '*Based on Gloria Mark’s research on attention recovery time, applied to your input.',
    stats_eyebrow: 'WHAT BETA USERS SAW',
    stats_h: 'Numbers from the first 47 people.',
    stats_sub: 'No marketing math. Median values across our private beta, three weeks of use, self-reported plus measured.',
    stats: [
      { k: 'Phone pickups before', v: '71', u: '/day', d: 'Median count across beta users on day 1.' },
      { k: 'Phone pickups after', v: '23', u: '/day', d: 'Same users, day 21. A 68% reduction.' },
      { k: 'Real focus time gained', v: '1.8', u: 'h/day', d: 'Time scored as "deep" vs. baseline week.' },
      { k: 'Stuck with it', v: '38', u: '/47', d: 'Still active after three weeks.' }
    ],
    stats_note: 'Sample is small and self-selected. We will refresh these numbers every month as the beta grows.',
    testi_eyebrow: 'EARLY BETA',
    testi_h: 'Two beta users, two real reactions.',
    testimonials: [
      {
        q: 'I didn’t realise how often I picked up my phone until something else was counting. The number is uncomfortable. The number is the product.',
        name: 'Aliya T.',
        role: 'PhD student, KBTU'
      },
      {
        q: 'Most focus apps are vibes. Nazar disagreed with me on day one — said I had 41 minutes of real work in a four-hour block. It was right.',
        name: 'Daniyar S.',
        role: 'Backend engineer, Almaty'
      }
    ],
    pricing_eyebrow: 'PRICING',
    pricing_h: 'Free to try. Worth paying for.',
    plans: [
      {
        name: 'Solo · Free',
        price: '0',
        unit: '/forever',
        desc: 'Everything you need to find out how bad it is.',
        features: [
          { on: true, t: 'Real-time attention score' },
          { on: true, t: 'Phone pickup detection' },
          { on: true, t: 'Daily timeline & summary' },
          { on: false, t: 'Last 30 days of history' },
          { on: false, t: 'Team dashboard' }
        ],
        cta: 'Start free'
      },
      {
        name: 'Pro',
        price: '6',
        unit: '/month',
        desc: 'Long-range data, calmer nudges, sleep mode.',
        features: [
          { on: true, t: 'Everything in Solo' },
          { on: true, t: 'Unlimited history & trends' },
          { on: true, t: 'Calm-mode nudges (vs. alarms)' },
          { on: true, t: 'Calendar & DND integrations' },
          { on: false, t: 'Team dashboard' }
        ],
        cta: 'Start 14-day trial',
        featured: true,
        badge: 'Most popular'
      },
      {
        name: 'Team',
        price: '12',
        unit: '/seat/month',
        desc: 'Aggregate, anonymous focus data for managers who care.',
        features: [
          { on: true, t: 'Everything in Pro' },
          { on: true, t: 'Anonymous team dashboard' },
          { on: true, t: 'SSO, SOC2 roadmap' },
          { on: true, t: 'Slack & Linear integrations' },
          { on: true, t: 'Dedicated onboarding' }
        ],
        cta: 'Contact us'
      }
    ],
    faq_eyebrow: 'FAQ',
    faq_h: 'Reasonable questions.',
    faqs: [
      { q: 'Where does the video go?', a: 'Nowhere. The attention model runs locally on your laptop. No frames are recorded, no frames are uploaded, no frames are stored. Only the resulting score (a single number per second) is saved on your device.' },
      { q: 'How is this different from a Pomodoro timer?', a: 'A timer measures intent. Nazar measures behaviour. If you start a 25-minute Pomodoro and check your phone six times, the timer still says you did 25 minutes of work. Nazar will say you did 11.' },
      { q: 'Does it work without an internet connection?', a: 'Yes. The model is bundled with the app. The only thing that needs the internet is sign-in, and you can use Nazar offline for up to 14 days between syncs.' },
      { q: 'When is mobile coming?', a: 'iOS and Android are planned for later in 2026. We are not committing to a quarter until the desktop app is rock-solid for everyone on the waitlist.' },
      { q: 'What about Windows and Linux?', a: 'macOS is the only fully supported platform today. Windows is in private beta. Linux is on the roadmap.' },
      { q: 'Who is building this?', a: 'A team of three out of Almaty, two from KBTU. We bootstrapped, we use it ourselves every day, and we read every piece of feedback that comes in.' }
    ],
    final_h: 'See what your day actually looks like.',
    final_sub: 'Fourteen days, free, no card. The number on day one is the most useful number you will get this year.',
    footer: {
      tag: 'Attention-tracking for people who do real work.',
      product: ['Features', 'How it works', 'Pricing', 'Roadmap', 'Changelog'],
      company: ['About', 'Blog', 'Careers', 'Press kit'],
      legal: ['Privacy', 'Terms', 'Security', 'On-device policy'],
      h_product: 'Product', h_company: 'Company', h_legal: 'Legal',
      built: 'Built in Almaty, Kazakhstan',
      copy: '© 2026 Nazar Labs · v0.4 beta'
    }
  },

  ru: {
    nav: { features: 'Возможности', how: 'Как работает', stats: 'Данные беты', pricing: 'Цены', faq: 'FAQ' },
    cta_primary: 'Начать бесплатно',
    cta_demo: 'Живое демо',
    eyebrow_hero: 'ЧАСТНАЯ БЕТА · 47 ПОЛЬЗОВАТЕЛЕЙ · АЛМАТЫ',
    hero_copy: [
      {
        h: ['Nazar следит за', 'вниманием —', 'чтобы вы перестали следить за часами.'],
        sub: 'Nazar использует камеру ноутбука и в реальном времени видит, когда вы сосредоточены, когда отвлеклись и когда тянетесь к телефону. Без скриншотов. Без клавиатуры. Только внимание.'
      },
      {
        h: ['Вы проверяете телефон', '58 раз в день.', 'Nazar — первое, что это заметит.'],
        sub: 'Большинство focus-приложений верят вам на слово. Nazar смотрит на глаза, осанку и прямоугольник в руке — и выдаёт оценку внимания, которая не врёт.'
      },
      {
        h: ['Таймер Pomodoro', 'не знает,', 'работаете ли вы на самом деле. Nazar знает.'],
        sub: 'Отслеживание внимания через веб-камеру. Видит, как вы берёте телефон, как смотрите в стол, и реальную глубокую работу. Модель работает локально, ничего не уходит на сервер.'
      }
    ],
    fineprint: ['14 дней бесплатно', 'Без карты', 'Работает оффлайн'],
    demo_label_focused: 'Сфокусирован · взгляд на экране',
    demo_label_drifting: 'Отвлечён · взгляд ушёл',
    demo_label_phone: 'Замечен телефон · 4с',
    demo_score: 'Внимание',
    demo_session: 'Сессия',
    demo_drift: 'Отвлечений за день',
    demo_phone: 'Раз брали телефон',
    live_eyebrow: 'ЧТО ВИДИТ NAZAR',
    live_h: 'Четыре сигнала. Одна честная оценка.',
    live_sub: 'Маленькая модель прямо на устройстве считывает с камеры четыре вещи каждую секунду. Ничего из этого не покидает ноутбук.',
    features: [
      { t: 'Взгляд на экране', d: 'Различает, смотрят ли глаза в монитор или ушли в сторону. Считаем не направление лица, а положение зрачка.' },
      { t: 'Телефон в кадре', d: 'Замечает, когда вы берёте телефон — обычно за три секунды до того, как вы признали бы это себе.' },
      { t: 'Осанка и микро-отвлечения', d: 'Откинулись, наклонились, остекленевший взгляд. Сигналы того, что мозг уже отвлёкся, прежде чем это сделали руки.' },
      { t: 'Ритм работы', d: 'Складывает всё в одну оценку внимания, которая обновляется каждую секунду, плюс честная поминутная карта вашего дня.' }
    ],
    how_eyebrow: 'КАК ЭТО РАБОТАЕТ',
    how_h: 'Три шага. Одно разрешение.',
    how_sub: 'Настройка занимает полторы минуты. Дальше Nazar незаметен, пока вы не отвлеклись.',
    steps: [
      { t: 'Откройте Nazar, дайте доступ к камере.', d: 'Модель работает локально, на вашем компьютере. У нас нет серверов, которые могли бы видеть ваше лицо — даже если бы мы захотели.' },
      { t: 'Запустите сессию фокуса.', d: 'Задача, длительность. Nazar начинает считывать внимание в момент старта таймера.' },
      { t: 'Получите честный итог дня.', d: 'Карта реального фокуса и отвлечений. Тренды. Сколько раз брали телефон. Цифры, которые другие приложения вам не покажут.' }
    ],
    calc_eyebrow: 'ЦЕНА ОТВЛЕЧЕНИЙ',
    calc_h: 'Подвиньте ползунок. Увидьте свой год.',
    calc_label: 'Часов в день за столом',
    calc_label_2: 'Каждое переключение — около 23 минут восстановления',
    calc_unit: 'часов отвлечений в год*',
    calc_note: '*По исследованиям Глории Марк о времени восстановления внимания, применено к вашим данным.',
    stats_eyebrow: 'ЧТО ПОКАЗАЛА БЕТА',
    stats_h: 'Цифры от первых 47 человек.',
    stats_sub: 'Без маркетинговой математики. Медианные значения по приватной бете, три недели использования.',
    stats: [
      { k: 'Брали телефон до', v: '71', u: '/день', d: 'Медиана среди бета-юзеров в первый день.' },
      { k: 'Брали телефон после', v: '23', u: '/день', d: 'Те же люди, день 21. Снижение на 68%.' },
      { k: 'Реального фокуса', v: '1.8', u: 'ч/день', d: 'Время, оценённое как «глубокое», против базовой недели.' },
      { k: 'Остались с нами', v: '38', u: '/47', d: 'Активны после трёх недель.' }
    ],
    stats_note: 'Выборка маленькая и не репрезентативная. Будем обновлять цифры каждый месяц по мере роста беты.',
    testi_eyebrow: 'РАННЯЯ БЕТА',
    testi_h: 'Два бета-юзера, две настоящие реакции.',
    testimonials: [
      {
        q: 'Я не понимала, насколько часто беру телефон, пока что-то другое не начало считать. Цифра неприятная. Цифра и есть продукт.',
        name: 'Алия Т.',
        role: 'PhD-студент, КБТУ'
      },
      {
        q: 'Почти все focus-приложения — это вайбы. Nazar поспорил со мной в первый же день: сказал, что за четырёхчасовой блок у меня был 41 минута реальной работы. И он был прав.',
        name: 'Данияр С.',
        role: 'Backend инженер, Алматы'
      }
    ],
    pricing_eyebrow: 'ЦЕНЫ',
    pricing_h: 'Бесплатно попробовать. За такое можно платить.',
    plans: [
      {
        name: 'Соло · Бесплатно',
        price: '0',
        unit: '/навсегда',
        desc: 'Всё, чтобы узнать, насколько всё плохо.',
        features: [
          { on: true, t: 'Оценка внимания в реальном времени' },
          { on: true, t: 'Детект телефона' },
          { on: true, t: 'Дневная карта и итоги' },
          { on: false, t: 'История за 30 дней' },
          { on: false, t: 'Командный дашборд' }
        ],
        cta: 'Начать бесплатно'
      },
      {
        name: 'Pro',
        price: '6',
        unit: '/мес',
        desc: 'Долгие тренды, мягкие нотификации, sleep-режим.',
        features: [
          { on: true, t: 'Всё из Соло' },
          { on: true, t: 'История и тренды без лимита' },
          { on: true, t: 'Мягкие напоминания (вместо тревог)' },
          { on: true, t: 'Календарь и DND' },
          { on: false, t: 'Командный дашборд' }
        ],
        cta: '14 дней бесплатно',
        featured: true,
        badge: 'Самый популярный'
      },
      {
        name: 'Team',
        price: '12',
        unit: '/место/мес',
        desc: 'Анонимные агрегированные данные для менеджеров, которым не всё равно.',
        features: [
          { on: true, t: 'Всё из Pro' },
          { on: true, t: 'Анонимный дашборд команды' },
          { on: true, t: 'SSO, SOC2 в работе' },
          { on: true, t: 'Slack и Linear' },
          { on: true, t: 'Выделенный онбординг' }
        ],
        cta: 'Связаться'
      }
    ],
    faq_eyebrow: 'FAQ',
    faq_h: 'Разумные вопросы.',
    faqs: [
      { q: 'Куда уходит видео?', a: 'Никуда. Модель работает локально на вашем ноутбуке. Кадры не записываются, не загружаются и не хранятся. На устройстве остаётся только итоговая оценка — одно число в секунду.' },
      { q: 'Чем это отличается от таймера Pomodoro?', a: 'Таймер измеряет намерение. Nazar — поведение. Если вы запустили 25-минутный Pomodoro и шесть раз посмотрели в телефон, таймер всё равно скажет, что вы поработали 25 минут. Nazar скажет — 11.' },
      { q: 'Работает ли без интернета?', a: 'Да. Модель встроена в приложение. Интернет нужен только для входа, и Nazar может работать оффлайн до 14 дней между синхронизациями.' },
      { q: 'Когда мобильное приложение?', a: 'iOS и Android запланированы на 2026. Конкретный квартал назовём, когда десктоп-версия будет стабильной для всех в листе ожидания.' },
      { q: 'А Windows и Linux?', a: 'macOS — единственная полностью поддерживаемая платформа сегодня. Windows в приватной бете. Linux в роудмапе.' },
      { q: 'Кто это делает?', a: 'Команда из трёх человек в Алматы, двое — выпускники KБТУ. Без инвесторов, пользуемся сами каждый день, читаем каждый отзыв.' }
    ],
    final_h: 'Посмотрите, как на самом деле выглядит ваш день.',
    final_sub: 'Четырнадцать дней бесплатно, без карты. Число первого дня — самое полезное число, которое вы получите в этом году.',
    footer: {
      tag: 'Трекинг внимания для тех, кто делает настоящую работу.',
      product: ['Возможности', 'Как работает', 'Цены', 'Roadmap', 'Changelog'],
      company: ['О нас', 'Блог', 'Карьера', 'Press kit'],
      legal: ['Приватность', 'Условия', 'Безопасность', 'On-device policy'],
      h_product: 'Продукт', h_company: 'Компания', h_legal: 'Юридическое',
      built: 'Сделано в Алматы, Казахстан',
      copy: '© 2026 Nazar Labs · v0.4 beta'
    }
  },

  kk: {
    nav: { features: 'Мүмкіндіктер', how: 'Қалай жұмыс істейді', stats: 'Бета деректері', pricing: 'Бағалар', faq: 'FAQ' },
    cta_primary: 'Тегін бастау',
    cta_demo: 'Тірі демо',
    eyebrow_hero: 'ЖАБЫҚ БЕТА · 47 ПАЙДАЛАНУШЫ · АЛМАТЫ',
    hero_copy: [
      {
        h: ['Nazar сіздің', 'назарыңызды', 'бақылайды — сіз сағатқа қарауды доғарасыз.'],
        sub: 'Nazar ноутбук камерасы арқылы қашан шоғырланғаныңызды, қашан назарыңыз ауғанын және телефонға қашан қол созғаныңызды нақты уақытта көреді. Скриншот жоқ. Пернетақта жоқ. Тек назар.'
      },
      {
        h: ['Сіз телефонды', 'күніне 58 рет', 'тексересіз. Бірінші болып Nazar байқайды.'],
        sub: 'Көптеген фокус-қосымшалары сізге сеніп қалады. Nazar көздерге, тұрысқа және қолыңыздағы тіктөртбұрышқа қарайды — өтірік айтпайтын назар бағасын береді.'
      },
      {
        h: ['Pomodoro таймері', 'сіз шынымен', 'жұмыс істеп жатқаныңызды білмейді. Nazar біледі.'],
        sub: 'Веб-камера арқылы назарды бақылау. Телефонды қолға алу, басты ию, нақты терең жұмыс — модель құрылғыда жұмыс істейді, серверге ештеңе жіберілмейді.'
      }
    ],
    fineprint: ['14 күн тегін', 'Картасыз', 'Офлайн жұмыс істейді'],
    demo_label_focused: 'Шоғырланған · көз экранда',
    demo_label_drifting: 'Алаңдаған · көз ауып кетті',
    demo_label_phone: 'Телефон табылды · 4с',
    demo_score: 'Назар',
    demo_session: 'Сессия',
    demo_drift: 'Күнделікті алаңдаулар',
    demo_phone: 'Телефонға қол созу',
    live_eyebrow: 'NAZAR НЕ КӨРЕДІ',
    live_h: 'Төрт сигнал. Бір адал баға.',
    live_sub: 'Құрылғыдағы шағын модель камерадан секунд сайын төрт нәрсені оқиды. Ешқайсысы ноутбуктан шықпайды.',
    features: [
      { t: 'Көз экранда', d: 'Көзіңіз мониторда ма, әлде ауып кетті ме — қадағалайды. Дәлдік иристің орнына негізделген, тек беттің бағытына емес.' },
      { t: 'Кадрдағы телефон', d: 'Телефонды қолға алған сәтті байқайды — әдетте сіз өзіңіз мойындамас бұрын үш секунд бұрын.' },
      { t: 'Тұрыс және микро-алаңдау', d: 'Иілу, артқа шалқаю, қатып қарау. Қол алмай тұрып, ми қазірдің өзінде кеткенін білдіретін сигналдар.' },
      { t: 'Жұмыс ырғағы', d: 'Жоғарыдағылардың бәрін секунд сайын жаңарып отыратын бір назар бағасына және күніңіздің адал минут-сайынғы кестесіне біріктіреді.' }
    ],
    how_eyebrow: 'ҚАЛАЙ ЖҰМЫС ІСТЕЙДІ',
    how_h: 'Үш қадам. Бір рұқсат.',
    how_sub: 'Орнату 90 секунд. Содан кейін Nazar сіз алаңдағанға дейін көрінбейді.',
    steps: [
      { t: 'Nazar ашып, камераға рұқсат беріңіз.', d: 'Модель сіздің құрылғыда жергілікті жұмыс істейді. Бізде сіздің бетіңізді көре алатын сервер жоқ — қаласақ та.' },
      { t: 'Фокус сессиясын бастаңыз.', d: 'Тапсырманы, ұзақтығын таңдаңыз. Таймер басталған сәтте Nazar назарды оқи бастайды.' },
      { t: 'Күннің адал қорытындысын алыңыз.', d: 'Нақты фокус пен алаңдаудың кестесі. Тренд. Телефонға қол созу саны. Басқа қосымшалар көрсетпейтін сандар.' }
    ],
    calc_eyebrow: 'АЛАҢДАУДЫҢ БАҒАСЫ',
    calc_h: 'Слайдерді жылжытыңыз. Жылыңызды көріңіз.',
    calc_label: 'Күніне үстелде сағат',
    calc_label_2: 'Әр ауысу — шамамен 23 минут қалпына келу',
    calc_unit: 'жылына алаңдаудан жоғалған сағат*',
    calc_note: '*Глория Марктің назарды қалпына келтіру уақыты туралы зерттеуіне негізделген, сіздің енгізген деректеріңізге қолданылды.',
    stats_eyebrow: 'БЕТА НЕ КӨРСЕТТІ',
    stats_h: 'Алғашқы 47 адамның сандары.',
    stats_sub: 'Маркетинг математикасы жоқ. Жабық бета бойынша медиандық мәндер, үш апталық қолдану.',
    stats: [
      { k: 'Бұрын телефон', v: '71', u: '/күн', d: 'Бета пайдаланушылар арасындағы 1-күн медианасы.' },
      { k: 'Қазір телефон', v: '23', u: '/күн', d: 'Сол адамдар, 21-күн. 68% төмендеу.' },
      { k: 'Алынған нақты фокус', v: '1.8', u: 'с/күн', d: '«Терең» деп бағаланған уақыт, базалық аптамен салыстырғанда.' },
      { k: 'Бізбен қалғандар', v: '38', u: '/47', d: 'Үш аптадан кейін де белсенді.' }
    ],
    stats_note: 'Іріктеме шағын және өзін-өзі таңдаған. Бета өскен сайын сандарды ай сайын жаңартып отырамыз.',
    testi_eyebrow: 'ЕРТЕ БЕТА',
    testi_h: 'Екі бета-пайдаланушы, екі шынайы реакция.',
    testimonials: [
      {
        q: 'Басқа бір нәрсе санай бастағанға дейін телефонды қаншалықты жиі алатынымды түсінбедім. Сан жайсыз. Сан — өнімнің өзі.',
        name: 'Әлия Т.',
        role: 'PhD-студент, ҚБТУ'
      },
      {
        q: 'Көптеген фокус-қосымшалары — тек әсер. Nazar бірінші күні-ақ келіспеді: төрт сағаттық блокта 41 минут нақты жұмыс болғанын айтты. Ол дұрыс еді.',
        name: 'Данияр С.',
        role: 'Backend инженер, Алматы'
      }
    ],
    pricing_eyebrow: 'БАҒАЛАР',
    pricing_h: 'Тегін көру. Төлеуге тұратын.',
    plans: [
      {
        name: 'Соло · Тегін',
        price: '0',
        unit: '/мәңгі',
        desc: 'Жағдайдың қаншалықты жаман екенін білуге қажет нәрсенің бәрі.',
        features: [
          { on: true, t: 'Нақты уақыттағы назар бағасы' },
          { on: true, t: 'Телефонды табу' },
          { on: true, t: 'Күнделікті кесте мен қорытынды' },
          { on: false, t: '30 күндік тарих' },
          { on: false, t: 'Команда панелі' }
        ],
        cta: 'Тегін бастау'
      },
      {
        name: 'Pro',
        price: '6',
        unit: '/ай',
        desc: 'Ұзақ тренд, жұмсақ ескерту, sleep режимі.',
        features: [
          { on: true, t: 'Соло-да барлығы' },
          { on: true, t: 'Шексіз тарих пен тренд' },
          { on: true, t: 'Жұмсақ ескертулер (дабылдың орнына)' },
          { on: true, t: 'Күнтізбе және DND' },
          { on: false, t: 'Команда панелі' }
        ],
        cta: '14 күн тегін',
        featured: true,
        badge: 'Ең танымал'
      },
      {
        name: 'Team',
        price: '12',
        unit: '/орын/ай',
        desc: 'Маңыз беретін менеджерлерге арналған анонимді жинақталған деректер.',
        features: [
          { on: true, t: 'Pro-дағы барлығы' },
          { on: true, t: 'Анонимді команда панелі' },
          { on: true, t: 'SSO, SOC2 жоспарда' },
          { on: true, t: 'Slack және Linear' },
          { on: true, t: 'Жеке онбординг' }
        ],
        cta: 'Байланысу'
      }
    ],
    faq_eyebrow: 'FAQ',
    faq_h: 'Орынды сұрақтар.',
    faqs: [
      { q: 'Видео қайда кетеді?', a: 'Ешқайда. Назар моделі ноутбугыңызда жергілікті жұмыс істейді. Кадрлар жазылмайды, жүктелмейді, сақталмайды. Құрылғыда тек қорытынды баға қалады — секундына бір сан.' },
      { q: 'Бұл Pomodoro таймерінен немен ерекшеленеді?', a: 'Таймер ниетті өлшейді. Nazar — мінез-құлықты. 25 минуттық Pomodoro қосып, телефонды алты рет тексерсеңіз, таймер бәрібір 25 минут жұмыс деп санайды. Nazar 11 дейді.' },
      { q: 'Интернетсіз жұмыс істейді ме?', a: 'Иә. Модель қосымшамен бірге келеді. Интернет тек кіру үшін қажет, синхрондау арасында Nazar 14 күнге дейін офлайн жұмыс істей алады.' },
      { q: 'Мобильдік қашан?', a: 'iOS және Android 2026 жылға жоспарланған. Тізімдегілер үшін десктоп тұрақты болғанша нақты тоқсанды айтпаймыз.' },
      { q: 'Windows пен Linux ше?', a: 'macOS — қазіргі толық қолдау көрсетілетін жалғыз платформа. Windows жабық бетада. Linux роудмапта.' },
      { q: 'Бұны кім жасап жатыр?', a: 'Алматыдағы үш адамнан тұратын команда, екеуі — ҚБТУ түлектері. Инвесторсыз, өзіміз күн сайын қолданамыз, әр пікірді оқимыз.' }
    ],
    final_h: 'Күніңіздің шын мәніндегі көрінісін көріңіз.',
    final_sub: 'Он төрт күн тегін, картасыз. Бірінші күннің саны — биылғы жылы алатын ең пайдалы сан.',
    footer: {
      tag: 'Шынайы жұмыс істейтіндер үшін назарды бақылау.',
      product: ['Мүмкіндіктер', 'Қалай жұмыс істейді', 'Бағалар', 'Roadmap', 'Changelog'],
      company: ['Біз туралы', 'Блог', 'Мансап', 'Press kit'],
      legal: ['Құпиялылық', 'Шарттар', 'Қауіпсіздік', 'On-device саясаты'],
      h_product: 'Өнім', h_company: 'Компания', h_legal: 'Заңды',
      built: 'Алматыда жасалған, Қазақстан',
      copy: '© 2026 Nazar Labs · v0.4 beta'
    }
  }
};

window.I18N = I18N;
