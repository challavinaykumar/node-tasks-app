# node-tasks-app (backend)

REST API for the tasks app, built with **Node.js**, **Express** and **SQLite**.
SQLite is built into Node 22.13+, so there is no database server to install —
data is saved to `data/tasks.db`.

The front end lives in a separate repository: [node-tasks-frontend](https://github.com/challavinaykumar/node-tasks-frontend).

## Run

```
npm install
npm start
```

The API runs at http://localhost:3000. Use `npm run dev` to restart
automatically when you edit code.

## Settings

Set these as environment variables (see `.env.example`):

| Variable      | Default                                         | Purpose                                  |
|---------------|-------------------------------------------------|------------------------------------------|
| `PORT`        | `3000`                                          | Port the API listens on                  |
| `CORS_ORIGIN` | `http://localhost:5173,http://localhost:4173`   | Front-end addresses allowed to call it   |
| `DB_FILE`     | `data/tasks.db`                                 | SQLite database file                     |

Windows cmd example:

```
set CORS_ORIGIN=http://localhost:8080 && npm start
```

## API

| Method | URL              | Body                              | Description       |
|--------|------------------|-----------------------------------|-------------------|
| GET    | /api/health      |                                   | Health check      |
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

## Docker

```
docker build -t node-tasks-app .
docker run -p 3000:3000 -e CORS_ORIGIN=http://localhost:8080 -v tasks-data:/app/data node-tasks-app
```

## Project layout

```
src/server.js   Express app and REST routes
src/db.js       SQLite connection, table setup and queries
data/tasks.db   Database file (created on first run)
```
