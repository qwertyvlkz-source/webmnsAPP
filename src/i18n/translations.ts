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

  // Portfolio
  "portfolio.title": { ru: "Портфолио", en: "Portfolio" },
  "portfolio.all": { ru: "Все", en: "All" },
  "portfolio.landing": { ru: "Лендинги", en: "Landings" },
  "portfolio.ecommerce": { ru: "Магазины", en: "E-commerce" },
  "portfolio.corporate": { ru: "Корпоративные", en: "Corporate" },
  "portfolio.orderSimilar": { ru: "Заказать похожий", en: "Order Similar" },
  "portfolio.tech": { ru: "Технологии", en: "Tech Stack" },

  // Order
  "order.title": { ru: "Новый заказ", en: "New Order" },
  "order.step1": { ru: "Какой сайт вам нужен?", en: "What kind of website do you need?" },
  "order.landing": { ru: "Лендинг", en: "Landing Page" },
  "order.ecommerce": { ru: "Интернет-магазин", en: "E-commerce" },
  "order.corporate": { ru: "Корпоративный", en: "Corporate" },
  "order.custom": { ru: "Индивидуальный", en: "Custom" },
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

  // Profile
  "profile.greeting": { ru: "Привет, Пользователь!", en: "Hello, User!" },
  "profile.activeProject": { ru: "Активный проект", en: "Active Project" },
  "profile.projectName": {
    ru: "Разработка интернет-магазина",
    en: "E-commerce Development",
  },
  "profile.design": { ru: "Дизайн", en: "Design" },
  "profile.development": { ru: "Разработка", en: "Development" },
  "profile.testing": { ru: "Тестирование", en: "Testing" },
  "profile.release": { ru: "Релиз", en: "Release" },
  "profile.pay": { ru: "Оплатить этап", en: "Pay for Stage" },
  "profile.contact": { ru: "Связаться с менеджером", en: "Contact Manager" },
};

export default translations;
