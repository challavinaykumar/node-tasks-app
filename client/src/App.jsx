import { useEffect, useState } from 'react';
import { api } from './api';
import TaskPanel from './TaskPanel.jsx';

const FILTERS = {
  all: { label: 'All', match: () => true },
  active: { label: 'Active', match: (t) => !t.done },
  done: { label: 'Done', match: (t) => t.done },
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState(null);

  // Runs an API call, shows its error if it fails, and returns whether it succeeded
  const run = async (fn) => {
    setError('');
    try {
      await fn();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  useEffect(() => {
    run(async () => setTasks(await api.list())).finally(() => setLoading(false));
  }, []);

  const addTask = (e) => {
    e.preventDefault();
    const text = title.trim();
    if (!text) return;
    // Clear right away so the next task can be typed while this one saves
    setTitle('');
    run(async () => {
      const task = await api.create(text);
      setTasks((ts) => [task, ...ts]);
    }).then((ok) => {
      if (!ok) setTitle((current) => current || text);
    });
  };

  const updateTask = (id, changes) =>
    run(async () => {
      const task = await api.update(id, changes);
      setTasks((ts) => ts.map((t) => (t.id === id ? task : t)));
    });

  const deleteTask = (id) =>
    run(async () => {
      await api.remove(id);
      setTasks((ts) => ts.filter((t) => t.id !== id));
      setSelectedId((sel) => (sel === id ? null : sel));
    });

  const visible = tasks.filter(FILTERS[filter].match);
  const remaining = tasks.filter((t) => !t.done).length;
  const selected = tasks.find((t) => t.id === selectedId);

  return (
    <div className="page">
      <main className="card">
        <header className="header">
          <h1>Tasks</h1>
          <p className="muted">
            {remaining} of {tasks.length} remaining
          </p>
        </header>

        <form className="add" onSubmit={addTask}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs doing?"
            aria-label="New task"
          />
          <button type="submit" className="primary" disabled={!title.trim()}>
            Add
          </button>
        </form>

        <nav className="filters" aria-label="Filter tasks">
          {Object.entries(FILTERS).map(([key, { label, match }]) => (
            <button
              key={key}
              className={filter === key ? 'active' : ''}
              onClick={() => setFilter(key)}
            >
              {label} <span className="count">{tasks.filter(match).length}</span>
            </button>
          ))}
        </nav>

        {error && (
          <div className="error" role="alert">
            {error}
          </div>
        )}

        {loading ? (
          <p className="empty">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="empty">
            {tasks.length === 0 ? 'No tasks yet. Add one above.' : 'Nothing here.'}
          </p>
        ) : (
          <ul className="list">
            {visible.map((task) => (
              <li key={task.id} className={task.done ? 'done' : ''}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => updateTask(task.id, { done: !task.done })}
                  aria-label={`Mark "${task.title}" as ${task.done ? 'not done' : 'done'}`}
                />
                <button className="title" onClick={() => setSelectedId(task.id)}>
                  {task.title}
                </button>
                <button
                  className="icon danger"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`Delete "${task.title}"`}
                  title="Delete"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {selected && (
        <TaskPanel
          key={selected.id}
          task={selected}
          onSave={(changes) => updateTask(selected.id, changes)}
          onDelete={() => deleteTask(selected.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
