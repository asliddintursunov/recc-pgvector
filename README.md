# Recommendation System

A small full-stack recommendation marketplace. The backend is a NestJS API with
PostgreSQL, Prisma, and pgvector. The frontend is a React + Vite app for signing
in, browsing products, creating/updating products, and collecting interactions
for recommendations.

## Project Structure

```text
backend/   NestJS API, Prisma schema, migrations, seed data
frontend/  React + Vite app
```

## Requirements

- Node.js and npm
- PostgreSQL with the pgvector extension available
- Gemini API key for product embeddings

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

The backend runs on `http://localhost:8000` by default.

Set these values in `backend/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
GEMINI_EMBEDDING_API_KEY=your_api_key
AUTH_JWT_ACCESS_SECRET=your_secret
AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN=12h
PORT=8000
FRONTEND_URL=http://localhost:3000
```

The seed command creates sample products, interactions, and users. Seeded users
use `password123` as the password.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:3000` by default.

Set the API URL in `frontend/.env`:

```env
VITE_BASE_URL=http://localhost:8000
```

## Backend Endpoints

All endpoints except auth require an `Authorization: Bearer <token>` header.

### Auth

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/auth/register` | Create a user with `username` and `password`. |
| `POST` | `/auth/login` | Log in and return an access token. |

Example auth body:

```json
{
  "username": "alice",
  "password": "password123"
}
```

### Products

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/products` | List all products. |
| `GET` | `/products/recommended` | List up to 10 recommended products for the current user. |
| `GET` | `/products/:id` | Get one product by ID. |
| `POST` | `/products` | Create a product and generate its embedding. |
| `PATCH` | `/products/:id` | Update a product. |
| `POST` | `/products/:id/interaction` | Save a `search`, `click`, or `like` interaction. |

Example product body:

```json
{
  "title": "Wireless headphones",
  "description": "Noise-canceling headphones for travel.",
  "tags": ["new", "audio", "wireless"]
}
```

Available product tags:

```text
new, used, gaming, electronics, audio, wireless, laptop, smartphone,
home_appliance, furniture, fitness, books
```

Example interaction body:

```json
{
  "actionType": "like"
}
```

Recommendations use pgvector similarity against products the user has already
interacted with. Likes are weighted more strongly than clicks and searches.

## Frontend Features

- Login and registration
- Protected product pages
- Product list and product detail pages
- Recommended products section
- Create and edit product modal
- Product tags
- Like and click tracking for recommendations
- Toast messages for success and error states
- Sign out

## Useful Commands

Backend:

```bash
npm run start:dev
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:seed
npm run prisma:studio
```

Frontend:

```bash
npm run dev
npm run build
npm run preview
```
