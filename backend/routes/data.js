const router = require('express').Router();
const auth = require('../middleware/auth');
const prisma = require('../lib/prisma');

const SETTING_KEYS = ['theme', 'company', 'product', 'sales', 'crm', 'calculator', 'objections', 'pages'];

const TABLE_MAP = {
  prices: 'price',
  coaches: 'coach',
  branches: 'branch',
  schedule: 'scheduleItem',
  news: 'newsItem',
  gallery: 'galleryItem',
  reviews: 'review',
  workout_programs: 'workoutProgram',
  shop: 'shopItem',
  booking: 'booking',
  referral: 'referral',
  promos: 'promo',
  faq: 'faq',
  achievements: 'achievement',
  leads: 'lead',
  users: 'user',
};

router.get('/:filename', async (req, res) => {
  const { filename } = req.params;
  const safe = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '');
  try {
    if (SETTING_KEYS.includes(safe)) {
      const settingKey = safe === 'pages' ? 'customPages' : safe;
      const setting = await prisma.setting.findUnique({ where: { key: settingKey } });
      if (setting) return res.json(setting.data);
      return res.json({});
    }

    const model = TABLE_MAP[safe];
    if (model) {
      if (model === 'lead') {
        const items = await prisma.lead.findMany({ orderBy: { date: 'desc' } });
        return res.json(items);
      }
      if (model === 'user') {
        const items = await prisma.user.findMany();
        return res.json(items);
      }
      const items = await prisma[model].findMany({ orderBy: { id: 'asc' } });
      return res.json(items);
    }

    res.status(404).json({ message: 'Раздел не найден' });
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
    res.status(500).json({ message: 'Ошибка чтения данных' });
  }
});

router.post('/:filename', auth, async (req, res) => {
  const { filename } = req.params;
  const safe = filename.replace(/\.\./g, '').replace(/[\/\\]/g, '');
  const data = req.body;
  try {
    if (SETTING_KEYS.includes(safe)) {
      const settingKey = safe === 'pages' ? 'customPages' : safe;
      await prisma.setting.upsert({
        where: { key: settingKey },
        update: { data },
        create: { key: settingKey, data },
      });
      return res.json({ success: true });
    }

    const model = TABLE_MAP[safe];
    if (model) {
      if (model === 'lead' || model === 'user') {
        return res.status(400).json({ message: 'Этот раздел нельзя перезаписать целиком' });
      }
      await prisma[model].deleteMany();
      if (Array.isArray(data)) {
        for (const item of data) {
          await prisma[model].create({ data: item });
        }
      }
      return res.json({ success: true });
    }

    res.status(404).json({ message: 'Раздел не найден' });
  } catch (err) {
    console.error(`Error saving ${filename}:`, err);
    res.status(500).json({ message: 'Ошибка сохранения данных' });
  }
});

module.exports = router;
