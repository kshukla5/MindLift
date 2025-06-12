# MindLift Full-Stack App

This repository contains a simple full-stack web application organized with the **Model–View–Controller (MVC)** pattern.

## Technologies

- **Backend**: [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/) and [PostgreSQL](https://www.postgresql.org/)
- **Frontend**: [React](https://react.dev/)

## Folder Structure

```
backend/     Express API (models, controllers, routes)
frontend/    React application (components, pages)
```

### Backend

The backend exposes an `/api/users` endpoint that queries a `users` table from PostgreSQL. Edit the database credentials in `backend/src/config/db.js` to match your environment.

### Frontend

The React frontend fetches users from the API and renders them. Run the frontend and backend separately or behind a proxy. Both projects have their own `package.json` with typical npm scripts.

## Getting Started

1. Install dependencies in both `backend` and `frontend` directories.
2. Configure PostgreSQL and create a `users` table.
3. Start the backend (`npm run dev`) and frontend (`npm start`).

This setup is intentionally minimal and serves as a starting point for further development.
