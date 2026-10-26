import { useEffect, useState } from 'react';

// SQLite stores datetime('now') as UTC "YYYY-MM-DD HH:MM:SS"
const formatDate = (value) => new Date(value.replace(' ', 'T') + 'Z').toLocaleString();

export default function TaskPanel({ task, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [done, setDone] = useState(task.done);
  const [saving, setSaving] = useState(false);

  // Pick up changes made outside the panel, e.g. ticking the task in the list
  useEffect(() => {
    setTitle(task.title);
    setDone(task.done);
  }, [task.title, task.done]);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const changed = title.trim() !== task.title || done !== task.done;

  const save = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    const ok = await onSave({ title: title.trim(), done });
    setSaving(false);
    if (ok) onClose();
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <aside className="panel" role="dialog" aria-labelledby="panel-heading">
        <header className="panel-header">
          <h2 id="panel-heading">Task details</h2>
          <button className="icon" onClick={onClose} aria-label="Close" title="Close">
            ✕
          </button>
        </header>

        <form className="panel-body" onSubmit={save}>
          <label className="field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </label>

          <label className="checkbox">
            <input type="checkbox" checked={done} onChange={(e) => setDone(e.target.checked)} />
            <span>Completed</span>
          </label>

          <dl className="meta">
            <dt>ID</dt>
            <dd>{task.id}</dd>
            <dt>Created</dt>
            <dd>{formatDate(task.created_at)}</dd>
          </dl>

          <footer className="panel-footer">
            <button type="button" className="danger" onClick={onDelete}>
              Delete
            </button>
            <div className="spacer" />
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={!changed || !title.trim() || saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </footer>
        </form>
      </aside>
    </>
  );
}
