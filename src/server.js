const path = require('node:path');
const fs = require('node:fs');
const express = require('express');
const tasks = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const clientDist = path.join(__dirname, '..', 'client', 'dist');

app.use(express.json());
app.use(express.static(clientDist));

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
  console.log(`Server running at http://localhost:${PORT}`);
  if (!fs.existsSync(clientDist)) {
    console.log('Front end not built yet - run "npm run build" to serve it here.');
  }
});
