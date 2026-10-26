const express = require('express');
const cors = require('cors');
const tasks = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
// Front-end addresses allowed to call this API (comma-separated)
const CORS_ORIGIN = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:4173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks.list());
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.get(Number(req.params.id));
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.post('/api/tasks', (req, res) => {
  const title = req.body?.title?.trim();
  if (!title) return res.status(400).json({ error: 'title is required' });
  res.status(201).json(tasks.create(title));
});

app.put('/api/tasks/:id', (req, res) => {
  const { title, done } = req.body ?? {};
  if (title !== undefined && !String(title).trim()) {
    return res.status(400).json({ error: 'title cannot be empty' });
  }
  const task = tasks.update(Number(req.params.id), {
    title: title?.trim(),
    done,
  });
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
});

app.delete('/api/tasks/:id', (req, res) => {
  if (!tasks.remove(Number(req.params.id))) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
  console.log(`Allowing requests from: ${CORS_ORIGIN.join(', ')}`);
});
