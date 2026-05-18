const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const DEFAULTS = {
  theme: { bg: '#070a10', bg2: '#0d121b', surface: '#121928', surface2: '#182132', stroke: '#273146', text: '#eef4fb', muted: '#97a3b7', accent: '#d8ff47', accent2: '#65c2ff', ok: '#22c55e', warn: '#f59e0b', danger: '#ef4444', gold: '#d3b05d', fontFamily: 'Inter, Arial, Helvetica, sans-serif' },
  company: { name: 'Underground Fitness Academy', description: 'Сеть фитнес-клубов премиум-класса', stats: [{ value: '10+', label: 'Филиалов' }, { value: '5000+', label: 'Клиентов' }, { value: '50+', label: 'Тренеров' }, { value: '10 лет', label: 'На рынке' }], values: [{ title: 'Качество', desc: 'Лучшее оборудование' }, { title: 'Профессионализм', desc: 'Сертифицированные тренеры' }] },
  product: { items: [], halls: { gym: { title: 'Тренажерный зал', items: [] }, big: { title: 'Зал единоборств', items: [] }, silverBranches: { title: 'Silver', items: [] }, goldBranches: { title: 'Gold', items: [] }, presentationGuide: [], scheduleNote: '' }, plans: [], pt: { title: 'Персональные тренировки', items: [], tip: '' }, dj: { title: 'Детский досуг', items: [], schedule: [], warn: '' }, groups: { items: [], rules: [] }, finance: { formula: '', physDocs: [], legalDocs: [], tips: [] }, afterSale: { steps: [], example: '', warn: '' } },
  sales: { stages: [{ title: 'Знакомство' }, { title: 'Потребности' }, { title: 'Презентация' }, { title: 'Закрытие' }], cases: [] },
  crm: { kpis: [{ value: '100%', label: 'Выполнение плана' }, { value: '0', label: 'Просрочки' }], funnel: ['Лиды', 'Встречи', 'Пробные', 'Продажи'], requiredFields: ['Телефон', 'Имя', 'Филиал'] },
  calculator: { terms: [3, 6, 12], kaspiPercent: 0 },
  objections: [],
  customPages: [],
};

const LIST_DEFAULTS = {
  price: { fallback: [{ name: 'Пробное занятие', price: '0 ₸' }], fields: ['name', 'price'] },
  coach: { fallback: [], fields: ['name', 'regalia', 'branch'] },
  branch: { fallback: [{ name: 'Главный филиал', address: 'г. Алматы', video: null }], fields: ['name', 'address', 'video'] },
  scheduleItem: { fallback: [{ day: 'ПН', time: '10:00', activity: 'Йога' }], fields: ['day', 'time', 'activity'] },
  newsItem: { fallback: [], fields: ['title', 'date', 'content'] },
  galleryItem: { fallback: [], fields: ['url', 'caption'] },
  review: { fallback: [], fields: ['author', 'text', 'rating'] },
  workoutProgram: { fallback: [{ name: 'Фитнес', goal: 'Общее укрепление' }], fields: ['name', 'goal'] },
  shopItem: { fallback: [], fields: ['name', 'price'] },
  booking: { fallback: [], fields: ['client', 'date', 'time'] },
  referral: { fallback: [{ policy: 'Приведи друга', bonus: '1 месяц бесплатно' }], fields: ['policy', 'bonus'] },
  promo: { fallback: [], fields: ['title', 'discount', 'ends'] },
  faq: { fallback: [{ q: 'Как начать?', a: 'Запишись на пробное' }], fields: ['q', 'a'] },
  achievement: { fallback: [], fields: ['title', 'desc', 'date'] },
};

async function seed() {
  console.log('\n--- Seeding database ---\n');

  for (const [key, data] of Object.entries(DEFAULTS)) {
    try {
      await prisma.setting.upsert({ where: { key }, update: { data }, create: { key, data } });
      console.log(`  ✓ "${key}" (defaults)`);
    } catch (err) { console.error(`  ✗ "${key}": ${err.message}`); }
  }

  for (const [model, cfg] of Object.entries(LIST_DEFAULTS)) {
    try {
      const items = cfg.fallback;
      await prisma[model].deleteMany();
      for (const item of items) {
        const data = {};
        for (const f of cfg.fields) data[f] = item[f] ?? null;
        await prisma[model].create({ data });
      }
      console.log(`  ✓ "${model}" (${items.length})`);
    } catch (err) { console.error(`  ✗ "${model}": ${err.message}`); }
  }

  try {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.upsert({
      where: { login: 'admin' },
      update: { passwordHash },
      create: { login: 'admin', passwordHash },
    });
    console.log('  ✓ user (admin/admin123)');
  } catch (err) { console.error(`  ✗ user: ${err.message}`); }

  console.log('\n--- Seeding complete ---\n');
}

seed()
  .catch(e => { console.error('Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
