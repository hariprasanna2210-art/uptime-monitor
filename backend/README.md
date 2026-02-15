# Uptime Monitor Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Setup Environment Variables:
   - Copy `.env.example` to `.env` (or create one based on the example below).
   - Fill in database URL, JWT secret, etc.

3. Database:
   - Ensure PostgreSQL is running.
   - Run migrations:
     ```bash
     npx prisma migrate dev --name init
     ```

4. Run:
   - Development: `npm run dev`
   - Production: `npm start`

## API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/websites
- POST /api/websites
- ...

## Services

- **Monitor**: Runs every 5 mins (configurable) to check website status.
- **Notifications**: Sends Email/Push on status change.
