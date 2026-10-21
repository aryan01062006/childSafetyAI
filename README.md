# SafeChildAI

SafeChildAI is a child safety reporting platform with a React frontend, an Express API, and MongoDB storage for safety concerns.

## Project structure

- `frontend/` — React + Vite dashboard and forms
- `backend/` — Express + Mongoose API and database model
- `ai-service/` — planned AI classification service

## Quick start

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 3) Open the app

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features

- Safety concern reporting form
- Recent concern list
- AI triage preview for risk level
- Emergency workflow guidance
- MongoDB-ready backend storage

## Notes

- The backend requires a running MongoDB instance.
- The frontend gracefully falls back to demo data if the API is unavailable.
