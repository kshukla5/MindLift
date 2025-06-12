# MindLift
MindLift is your daily dose of motivation, mindset mastery, and personal growth. Unlock your full potential with empowering content designed to elevate your thinking and transform your life.

## Environment Setup

Copy `.env.example` to `.env` and fill in the required values before running the application:

```bash
cp .env.example .env
# edit .env with your secrets
```

The configuration loader in `config.js` reads these variables securely and exposes them for use in the project.

## Running the Example

To see the configuration loader in action, run:

```bash
node index.js
```

This script will print some of the loaded configuration values.
=======
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

Additional authentication routes are available:

- `POST /api/signup` – create an account (roles: `speaker`, `subscriber`, or `admin`).
- `POST /api/login` – obtain a JWT for authenticated requests.
- `GET /api/speakers` – list all speaker profiles.
- `POST /api/speakers` – create a speaker profile (admin only).
- `GET /api/speakers/:id` – fetch a single speaker profile.
- `PUT /api/speakers/:id` – update a speaker profile (admin only).
- `DELETE /api/speakers/:id` – remove a speaker profile (admin only).
- `POST /api/videos` – upload a video file or provide a YouTube/Vimeo URL (speakers and admins).
- `GET /api/videos` – list uploaded videos.

### Frontend

The React frontend fetches users from the API and renders them. Run the frontend and backend separately or behind a proxy. Both projects have their own `package.json` with typical npm scripts.

## Getting Started

1. Install dependencies in both `backend` and `frontend` directories.
2. Configure PostgreSQL and create a `users` table. Run `backend/sql/videos.sql` to create the `videos` table.
3. Start the backend (`npm run dev`) and frontend (`npm start`).

This setup is intentionally minimal and serves as a starting point for further development.

