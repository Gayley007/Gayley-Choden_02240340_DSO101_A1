# Task Manager (Next.js + Express + PostgreSQL)

## Stack

- Frontend: Next.js (`frontend`)
- Backend: Node.js + Express (`backend`)
- Database: PostgreSQL (`docker-compose.yml`, `db/init.sql`)

## 1) Start PostgreSQL

```bash
docker compose up -d
```

## 2) Start Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Backend runs at `http://localhost:5000`.

## 3) Start Frontend

Open a second terminal:

```bash
cd frontend
npm install
set NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
```

Frontend runs at `http://localhost:3000`.

## API Endpoints

- `GET /api/tasks` - list tasks
- `GET /api/tasks/:id` - get one task
- `POST /api/tasks` - create task
- `PUT /api/tasks/:id` - update task
- `DELETE /api/tasks/:id` - delete task

## Task JSON Example

```json
{
  "title": "Finish assignment",
  "description": "DSO101 task manager",
  "completed": false
}
```
