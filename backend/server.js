require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./lib/prisma');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const leadRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOrigins = ['http://localhost:5173', 'http://localhost:3000'];
if (process.env.RAILWAY_PUBLIC_DOMAIN) corsOrigins.push(`https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
if (process.env.CORS_ORIGIN) corsOrigins.push(process.env.CORS_ORIGIN);
app.use(cors({ origin: corsOrigins, credentials: true }));
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

async function start() {
  for (let i = 0; i < 10; i++) {
    try {
      await prisma.$connect();
      console.log('DB connected');
      break;
    } catch (err) {
      if (i < 9) {
        console.log(`DB not ready, retry ${i + 1}...`);
        await new Promise(r => setTimeout(r, 3000));
      } else {
        console.error('DB connection failed after 10 retries:', err.message);
        process.exit(1);
      }
    }
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

start();
