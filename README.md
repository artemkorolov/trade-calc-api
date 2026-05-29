# Trade Calc API

REST API for the Trade Calc app, handling secure data storage for trading strategies.

## Features
- **REST Endpoints:** Basic CRUD logic for crypto logs.
- **Persistence:** PostgreSQL / Supabase integration.
- **Validation:** Server-side input validation.

## Tech Stack
- Node.js & Express.js
- PostgreSQL / Supabase

## Endpoints
- `GET /api/strategies` — Get saved logs.
- `POST /api/strategies` — Save a new strategy.