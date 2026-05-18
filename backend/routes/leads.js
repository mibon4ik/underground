const router = require('express').Router();
const prisma = require('../lib/prisma');

router.post('/', async (req, res) => {
  try {
    const { name, phone, source } = req.body;
    const lead = await prisma.lead.create({
      data: { name: name || null, phone, source: source || 'unknown' },
    });
    res.json({ success: true, lead });
  } catch (err) {
    console.error('Error saving lead:', err);
    res.status(500).json({ message: 'Ошибка сохранения лида' });
  }
});

module.exports = router;
