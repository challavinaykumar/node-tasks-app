const path = require('node:path');
const fs = require('node:fs');
const { DatabaseSync } = require('node:sqlite');

const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(process.env.DB_FILE || path.join(dataDir, 'tasks.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    title      TEXT    NOT NULL,
    done       INTEGER NOT NULL DEFAULT 0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  )
`);

const toTask = (row) => row && { ...row, done: Boolean(row.done) };

module.exports = {
  list() {
    return db.prepare('SELECT * FROM tasks ORDER BY id DESC').all().map(toTask);
  },
  get(id) {
    return toTask(db.prepare('SELECT * FROM tasks WHERE id = ?').get(id));
  },
  create(title) {
    const { lastInsertRowid } = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(title);
    return this.get(lastInsertRowid);
  },
  update(id, { title, done }) {
    const task = this.get(id);
    if (!task) return null;
    db.prepare('UPDATE tasks SET title = ?, done = ? WHERE id = ?').run(
      title ?? task.title,
      (done ?? task.done) ? 1 : 0,
      id
    );
    return this.get(id);
  },
  remove(id) {
    return db.prepare('DELETE FROM tasks WHERE id = ?').run(id).changes > 0;
  },
};
