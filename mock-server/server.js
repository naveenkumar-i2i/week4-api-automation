const express = require('express');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const path = require('path');

const SECRET = 'supersecretkey';
const PORT = 3000;
const app = express();

app.use(express.json());

// Login endpoint
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = require('./db.json');
  const user = db.users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: '1h' });
  return res.json({ accessToken: token });
});

// Profile endpoint with role‑check
app.get('/auth/profile/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    const requestedId = parseInt(req.params.id, 10);
    if (payload.id !== requestedId) {
      return res.status(403).json({ error: 'Forbidden: cannot access other user profile' });
    }
    const db = require('./db.json');
    const { password, ...profile } = db.users.find(u => u.id === requestedId);
    return res.json(profile);
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
});

// Optional: mount json-server router under /api
const router = jsonServer.router(path.join(__dirname, 'db.json'));
app.use('/api', router);

app.listen(PORT, () => console.log(`Mock server running at http://localhost:${PORT}`));
