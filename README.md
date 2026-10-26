# node-tasks-app

A small task manager built with **Node.js**, **Express** and **SQLite** (SQL).
SQLite is built into Node 22.13+, so there is no database server to install —
data is saved to `data/tasks.db`.

## Run

```
npm install
npm start
```

Open http://localhost:3000 for the web page.

Use `npm run dev` to restart automatically when you edit code.

## API

| Method | URL              | Body                              | Description       |
|--------|------------------|-----------------------------------|-------------------|
| GET    | /api/tasks       |                                   | List all tasks    |
| GET    | /api/tasks/:id   |                                   | Get one task      |
| POST   | /api/tasks       | `{ "title": "Buy milk" }`         | Create a task     |
| PUT    | /api/tasks/:id   | `{ "title": "...", "done": true }`| Update a task     |
| DELETE | /api/tasks/:id   |                                   | Delete a task     |

Example (Windows cmd):

```
curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d "{\"title\":\"Buy milk\"}"
curl http://localhost:3000/api/tasks
```

## Run with Docker

```
docker build -t node-tasks-app .
docker run -p 3000:3000 -v tasks-data:/app/data node-tasks-app
```

## Project layout

```
src/server.js     Express app and REST routes
src/db.js         SQLite connection, table setup and queries
public/index.html Web page that uses the API
data/tasks.db     Database file (created on first run)
```
