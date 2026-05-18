require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const leadRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', process.env.RAILWAY_PUBLIC_DOMAIN && `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/leads', leadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const distDir = path.resolve(__dirname, '..', 'dist');
app.use(express.static(distDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
