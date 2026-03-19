# Project Guidelines

## Tech Stack

- **Runtime**: Node.js (>=18), ES Modules (`"type": "module"`)
- **Framework**: Express 5
- **Database**: MySQL (via `mysql2` driver) — NOT PostgreSQL
- **Templating**: EJS views (`src/views/`)
- **Auth**: Passport.js with passport-local strategy, bcryptjs for hashing, express-session with Redis store
- **Session Store**: Redis (via `connect-redis`)

## Architecture

- `src/` — Main application code (MVC pattern)
  - `controllers/` — Route handlers
  - `model/` — Database connection and repository modules
  - `routers/` — Express route definitions
  - `services/` — Business logic
  - `views/` — EJS templates with `partials/`
  - `scripts/` — SQL schema, seed data, and utility scripts
- `public/` — Static assets (CSS, JS, images)
- `auth/` — Session configuration

## Database Conventions

- Use MySQL syntax for all SQL (e.g., `AUTO_INCREMENT`, `BOOLEAN`, backtick quoting)
- Do NOT use PostgreSQL syntax (e.g., `SERIAL`, `$1` parameter placeholders)
- Use `?` placeholders for parameterized queries (mysql2 style)

## Build and Test

- `npm run dev` — Start dev server with nodemon
- `npm run lint` — ESLint
- `npm test` — Tests (not yet configured)
