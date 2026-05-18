const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

router.post('/login', async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ success: false, message: 'Введите логин и пароль' });
  }
  try {
    const user = await prisma.user.findUnique({ where: { login } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Неверный логин или пароль' });
    }
    const token = jwt.sign(
      { login: user.login, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    res.json({ success: true, token, user: { login: user.login } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
});

router.get('/verify', (req, res) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.json({ valid: false });
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.json({ valid: false });
  }
});

module.exports = router;
