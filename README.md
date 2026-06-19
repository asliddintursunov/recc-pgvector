# Recommendation System

A small full-stack marketplace with role-based access, product management, carts,
purchases, and product recommendations based on customer interactions.

## Stack

- Backend: NestJS, Prisma, PostgreSQL, pgvector, JWT auth
- Frontend: React, Vite, React Router, TanStack Query, Zustand, Tailwind CSS
- Embeddings: Gemini API

## Project Structure

```text
backend/   NestJS API, Prisma schema, migrations, seed script
frontend/  React + Vite client
```

## Requirements

- Node.js and npm
- PostgreSQL
- pgvector extension enabled in PostgreSQL
- Gemini API key for product embeddings

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:migrate
npm run start:dev
```

Backend runs on `http://localhost:8000` by default.

Important `backend/.env` values:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
GEMINI_EMBEDDING_API_KEY=your_api_key
AUTH_JWT_ACCESS_SECRET=your_secret
AUTH_JWT_ACCESS_TOKEN_EXPIRES_IN=12h
PORT=8000
FRONTEND_URL=http://localhost:3000
```

Seed sample merchant products:

```bash
npm run prisma:seed
```

The seed creates one merchant account:

```text
username: seed_merchant
password: password123
```

It also creates 30 products for that merchant with sample embeddings.

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:3000` by default.

Important `frontend/.env` value:

```env
VITE_BASE_URL=http://localhost:8000
```

## Roles

- Customer: Main, Products, Purchases, Cart, Profile
- Merchant: Products, Profile
- Admin: Dashboard, Users, Profile

## Main Features

- Register/login as customer or merchant
- Login stores the access token and profile in persisted Zustand state
- Customers can view recommendations, browse products, add products to cart,
  and submit purchases
- Merchants can create and update their own products
- Admins can view users by Customers and Merchants tabs
- Product details send a `click` interaction
- Purchases create `purchase` interactions
- Recommendations use product embeddings and interaction weights:
  `purchase = 3.0`, `click = 2.0`, `search = 1.0`

## API Summary

Auth:

- `POST /auth/register/customer`
- `POST /auth/register/merchant`
- `POST /auth/login`

Products:

- `GET /products`
- `GET /products/recommended`
- `GET /products/:id`
- `POST /products` merchant only
- `PATCH /products/:id` merchant only
- `POST /products/:id/interaction` customer only

Purchases:

- `GET /purchases`
- `GET /purchases/:id`
- `POST /purchases` customer only

Users:

- `GET /users/profile`
- `GET /users/customers` admin only
- `GET /users/merchants` admin only
- `GET /users/:id` admin only

## Useful Commands

Backend:

```bash
npm run build
npm run start:dev
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:reset
npm run prisma:seed
npm run prisma:studio
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run format
npm run typecheck
npm run preview
```
