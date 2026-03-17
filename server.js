const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(express.json());

// Ensure data directory exists
fs.ensureDirSync(DATA_DIR);

// Auth Middleware
const auth = (req, res, next) => {
    // Simple token-based or session check could go here
    // For now, we rely on the frontend sending the right "admin" state for edits
    // But we should verify credentials on login
    next();
};

// API Endpoints

// Auth Login
app.post('/api/auth/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        const users = await fs.readJson(path.join(DATA_DIR, 'users.json'));
        const user = users.find(u => u.login === login && u.password === password);
        if (user) {
            res.json({ success: true, user: { login: user.login } });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Database error' });
    }
});

// Generic CRUD for JSON files
app.get('/api/data/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    try {
        if (await fs.pathExists(filePath)) {
            const data = await fs.readJson(filePath);
            res.json(data);
        } else {
            res.status(404).json({ message: 'File not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error reading file' });
    }
});

app.post('/api/data/:filename', async (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(DATA_DIR, `${filename}.json`);
    try {
        await fs.writeJson(filePath, req.body, { spaces: 2 });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Error saving file' });
    }
});

// Special endpoint for leads (appending)
app.post('/api/leads', async (req, res) => {
    const filePath = path.join(DATA_DIR, 'leads.json');
    try {
        let leads = [];
        if (await fs.pathExists(filePath)) {
            leads = await fs.readJson(filePath);
        }
        const newLead = { ...req.body, id: Date.now(), timestamp: new Date().toISOString() };
        leads.push(newLead);
        await fs.writeJson(filePath, leads, { spaces: 2 });
        res.json({ success: true, lead: newLead });
    } catch (err) {
        res.status(500).json({ message: 'Error saving lead' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
