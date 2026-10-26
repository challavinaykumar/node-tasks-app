# node-tasks-app

A small task manager built with **Node.js**, **Express**, **SQLite** (SQL) and a
**React** front end (Vite).
SQLite is built into Node 22.13+, so there is no database server to install —
data is saved to `data/tasks.db`.

## Run

```
npm install
npm run build
npm start
```

Open http://localhost:3000. `npm run build` installs and builds the front end
in `client/`; Express then serves it together with the API.

## Develop

Run the API and the front end in two terminals:

```
npm run dev
npm run dev:client
```

Open http://localhost:5173. The React app reloads instantly when you edit
files in `client/src`, and API calls are forwarded to the Express server on
port 3000.

## Front end features

- Add, complete and delete tasks
- Filter by All / Active / Done with counts
- Click a task to open its details in a side panel and edit the title or status
- Light and dark mode (follows your system setting)

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
src/server.js          Express app, REST routes, serves the built front end
src/db.js              SQLite connection, table setup and queries
client/src/App.jsx     Task list, add form and filters
client/src/TaskPanel.jsx  Side panel for viewing and editing a task
client/src/api.js      Calls to the REST API
client/src/App.css     Styles
data/tasks.db          Database file (created on first run)
```
