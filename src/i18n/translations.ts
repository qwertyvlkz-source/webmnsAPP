export type Lang = "ru" | "en";

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.home": { ru: "Главная", en: "Home" },
  "nav.portfolio": { ru: "Работы", en: "Portfolio" },
  "nav.order": { ru: "Заказать", en: "Order" },
  "nav.profile": { ru: "Кабинет", en: "Profile" },

  // Home
  "home.hero": {
    ru: "Современные веб-решения.\nКреативные сайты для бизнеса",
    en: "Modern Web Solutions.\nCreative Websites for Business",
  },
  "home.cta": { ru: "Бесплатная консультация", en: "Free Consultation" },
  "home.why": { ru: "Почему мы", en: "Why Us" },
  "home.fast": { ru: "Быстрая доставка", en: "Fast Delivery" },
  "home.fast.desc": { ru: "5–10 дней", en: "5–10 days" },
  "home.exp": { ru: "Большой опыт", en: "Great Experience" },
  "home.exp.desc": { ru: "7+ лет", en: "7+ years" },
  "home.quality": { ru: "Гарантия качества", en: "Quality Guarantee" },
  "home.quality.desc": { ru: "Тестируем и оптимизируем", en: "Tested & Optimized" },
  "home.latest": { ru: "Последние проекты", en: "Latest Projects" },
  "home.stat.projects": { ru: "Проектов", en: "Projects" },
  "home.stat.clients": { ru: "Клиентов", en: "Clients" },
  "home.stat.rating": { ru: "Рейтинг", en: "Rating" },
  "home.stat.years": { ru: "Лет опыта", en: "Years" },
  "home.services": { ru: "Полный цикл разработки", en: "Full-cycle Development" },
  "home.servicesDesc": {
    ru: "От дизайна до запуска — создаём сайты, которые работают на ваш бизнес",
    en: "From design to launch — we build websites that work for your business",
  },
  "home.learnMore": { ru: "Подробнее", en: "Learn More" },
  "home.partner": { ru: "Партнёрская программа", en: "Partner Program" },
  "home.partner.button": { ru: "Полный цикл разработки", en: "Full-cycle Development" },
  "home.partner.desc": {
    ru: "Приводите клиентов и получайте до 20% от каждого заказа. Выгодные условия для постоянных партнёров!",
    en: "Refer clients and earn up to 20% from every order. Great terms for regular partners!",
  },
  "partner.headline": { ru: "Зарабатывайте вместе с нами", en: "Earn With Us" },
  "partner.intro": {
    ru: "Рекомендуйте наши услуги друзьям и коллегам — получайте вознаграждение за каждого привлечённого клиента.",
    en: "Recommend our services to friends and colleagues — get rewarded for every referred client.",
  },
  "partner.benefits": { ru: "Преимущества", en: "Benefits" },
  "partner.benefit1": { ru: "До 20% комиссии", en: "Up to 20% Commission" },
  "partner.benefit1.desc": { ru: "С каждого оплаченного заказа привлечённого клиента", en: "From every paid order of a referred client" },
  "partner.benefit2": { ru: "Пассивный доход", en: "Passive Income" },
  "partner.benefit2.desc": { ru: "Клиент закреплён за вами навсегда", en: "The client stays linked to you forever" },
  "partner.benefit3": { ru: "Быстрые выплаты", en: "Fast Payouts" },
  "partner.benefit3.desc": { ru: "Выплаты в течение 3 рабочих дней", en: "Payouts within 3 business days" },
  "partner.how": { ru: "Как это работает", en: "How It Works" },
  "partner.step1": { ru: "Зарегистрируйтесь в программе", en: "Sign up for the program" },
  "partner.step2": { ru: "Поделитесь ссылкой с клиентом", en: "Share the link with a client" },
  "partner.step3": { ru: "Получите вознаграждение после оплаты", en: "Get rewarded after payment" },
  "partner.join": { ru: "Стать партнёром", en: "Become a Partner" },

  // Portfolio
  "portfolio.title": { ru: "Портфолио", en: "Portfolio" },
  "portfolio.all": { ru: "Все", en: "All" },
  "portfolio.web": { ru: "Веб", en: "Web" },
  "portfolio.mobile": { ru: "Мобильные", en: "Mobile" },
  "portfolio.design": { ru: "Дизайн", en: "Design" },
  "portfolio.portals": { ru: "Порталы", en: "Portals" },
  "portfolio.orderSimilar": { ru: "Заказать похожий", en: "Order Similar" },
  "portfolio.tech": { ru: "Технологии", en: "Tech Stack" },

  // Order
  "order.title": { ru: "Новый заказ", en: "New Order" },
  "order.step1": { ru: "Какой сайт вам нужен?", en: "What kind of website do you need?" },
  "order.landing": { ru: "Лендинг", en: "Landing Page" },
  "order.ecommerce": { ru: "Интернет-магазин", en: "E-commerce" },
  "order.corporate": { ru: "Корпоративный", en: "Corporate" },
  "order.custom": { ru: "Индивидуальный", en: "Custom" },
  "order.android": { ru: "Android приложение", en: "Android App" },
  "order.ios": { ru: "iPhone приложение", en: "iPhone App" },
  "order.step2": { ru: "Бюджет и сроки", en: "Budget & Timeline" },
  "order.budget": { ru: "Бюджет", en: "Budget" },
  "order.urgent": { ru: "Срочный заказ", en: "Urgent Order" },
  "order.step3": { ru: "Контакты", en: "Contacts" },
  "order.name": { ru: "Ваше имя", en: "Your Name" },
  "order.phone": { ru: "Телефон / Telegram", en: "Phone / Telegram" },
  "order.submit": { ru: "Отправить заявку", en: "Submit Request" },
  "order.next": { ru: "Далее", en: "Next" },
  "order.back": { ru: "Назад", en: "Back" },
  "order.success": { ru: "Заявка принята!", en: "Request Accepted!" },
  "order.successDesc": {
    ru: "Мы свяжемся с вами в ближайшее время",
    en: "We'll contact you shortly",
  },
  "order.newOrder": { ru: "Новая заявка", en: "New Request" },

  // Profile - Auth
  "profile.login.title": { ru: "Вход в кабинет", en: "Sign In" },
  "profile.login.email": { ru: "Email", en: "Email" },
  "profile.login.password": { ru: "Пароль", en: "Password" },
  "profile.login.button": { ru: "Войти", en: "Sign In" },
  "profile.login.register": { ru: "Зарегистрироваться", en: "Register" },
  "profile.login.forgot": { ru: "Забыли пароль?", en: "Forgot password?" },
  "profile.login.or": { ru: "или", en: "or" },
  "profile.login.google": { ru: "Войти через Google", en: "Sign in with Google" },

  // Profile - Dashboard
  "profile.greeting": { ru: "Привет, Алексей!", en: "Hello, Alexey!" },
  "profile.logout": { ru: "Выйти", en: "Log out" },

  // Profile - Tabs
  "profile.tab.projects": { ru: "Проекты", en: "Projects" },
  "profile.tab.invoices": { ru: "Счета", en: "Invoices" },
  "profile.tab.chat": { ru: "Чат", en: "Chat" },
  "profile.tab.partner": { ru: "Партнёрка", en: "Partner" },

  // Profile - Projects
  "profile.activeProject": { ru: "Активный проект", en: "Active Project" },
  "profile.project1.name": { ru: "Интернет-магазин «ТехноМарт»", en: "E-commerce «TechnoMart»" },
  "profile.project2.name": { ru: "Лендинг для стартапа", en: "Startup Landing Page" },
  "profile.design": { ru: "Дизайн", en: "Design" },
  "profile.development": { ru: "Разработка", en: "Development" },
  "profile.testing": { ru: "Тестирование", en: "Testing" },
  "profile.release": { ru: "Релиз", en: "Release" },

  // Profile - Invoices
  "profile.invoice.paid": { ru: "Оплачено", en: "Paid" },
  "profile.invoice.pending": { ru: "Ожидает", en: "Pending" },
  "profile.invoice.pay": { ru: "Оплатить", en: "Pay" },

  // Profile - Chat
  "profile.chat.placeholder": { ru: "Написать сообщение...", en: "Type a message..." },
  "profile.chat.send": { ru: "Отправить", en: "Send" },
  "profile.chat.manager": { ru: "Менеджер", en: "Manager" },
  "profile.chat.you": { ru: "Вы", en: "You" },
};

export default translations;
