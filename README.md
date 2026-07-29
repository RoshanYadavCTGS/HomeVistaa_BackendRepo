# HomeVistaa Backend API

Production-ready Express.js + PostgreSQL backend for the **HomeVistaa** real estate platform.

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js 4 |
| Database | PostgreSQL 15+ |
| ORM | Prisma 5 |
| Auth | JWT (access + refresh tokens) |
| Validation | Zod |
| Password | bcryptjs (salt rounds: 12) |
| Uploads | Multer (disk storage) |
| Security | Helmet, CORS, Rate Limiting |
| Logging | Winston + Morgan |
| Email | Nodemailer (optional) |
| Language | TypeScript (strict mode) |

---

## Quick Start

### 1. Prerequisites

- Node.js 20+
- PostgreSQL 15+ running locally or via cloud
- npm or yarn

### 2. Install Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection string and secrets:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/homevistaa_db"
JWT_ACCESS_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-other-secret-here
```

### 4. Set Up Database

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed with mock data
npm run db:seed
```

### 5. Start Development Server

```bash
npm run dev
```

API will be running at **http://localhost:5000**

---

## API Reference

### Base URL
```
http://localhost:5000/api/v1
```

### Health Check
```
GET /api/v1/health
```

### Authentication

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login |
| POST | `/auth/logout` | No | Logout (clears cookie) |
| POST | `/auth/refresh` | No | Refresh access token |
| GET | `/auth/me` | Yes | Get profile |
| PATCH | `/auth/profile` | Yes | Update profile |
| PATCH | `/auth/change-password` | Yes | Change password |
| POST | `/auth/forgot-password` | No | Request reset email |
| POST | `/auth/reset-password` | No | Reset with token |
| GET | `/auth/dashboard/summary` | Yes | Dashboard stats |

### Properties

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/properties` | No | List with filters |
| GET | `/properties/featured` | No | Featured properties |
| GET | `/properties/:id` | No | Property detail |
| POST | `/properties` | Admin | Create property |
| DELETE | `/properties/:id` | Admin | Delete property |

**Filter Query Params:** `city`, `type`, `beds`, `priceMin`, `priceMax`, `possessionStatus`, `searchQuery`, `sortBy`, `page`, `limit`

### User Listings

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/listings` | Yes | Submit listing |
| GET | `/listings/my` | Yes | My listings |
| GET | `/listings/:id` | Yes | Get listing |
| PATCH | `/listings/:id` | Yes | Update listing |
| DELETE | `/listings/:id` | Yes | Delete listing |
| GET | `/listings` | Admin | All listings |
| PATCH | `/listings/:id/status` | Admin | Approve/reject |

### Favorites

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/favorites` | Yes | Get favorite IDs |
| POST | `/favorites/:propertyId` | Yes | Add to favorites |
| DELETE | `/favorites/:propertyId` | Yes | Remove from favorites |

### Saved Alerts

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| GET | `/alerts` | Yes | Get alerts |
| POST | `/alerts` | Yes | Create alert |
| DELETE | `/alerts/:id` | Yes | Delete alert |

### Inquiries

| Method | Endpoint | Auth Required | Description |
|---|---|---|---|
| POST | `/inquiries` | No | General/site visit |
| POST | `/inquiries/brochure` | No | Brochure request |
| POST | `/inquiries/advisor` | No | Finance advisor |

### Other Endpoints

| Resource | POST (public) | GET (admin) |
|---|---|---|
| Professionals | `/professionals` | `/professionals` |
| Service Requests | `/service-requests` | `/service-requests` |
| Blogs | - | `/blogs` |
| Interiors | - | `/interiors` |
| Uploads | `/uploads` (auth) | - |

---

## Authentication Flow

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{ "email": "user@example.com", "password": "Password123" }
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJ..."
  }
}
```

Refresh token is stored in an **httpOnly cookie** (`hv_refresh_token`).

### Authenticated Requests
```http
GET /api/v1/auth/me
Authorization: Bearer eyJ...
```

---

## Project Structure

```
backend/src/
├── config/          # Database, env, multer configs
├── constants/       # App-wide constants and enums
├── controllers/     # Request handlers (thin layer)
├── middleware/      # Auth, RBAC, validation, error, rate limiter
├── repositories/    # All database queries (Prisma)
├── routes/          # Express router definitions
├── services/        # Business logic (auth, email)
├── types/           # Shared TypeScript interfaces
├── utils/           # JWT, bcrypt, logger, response, pagination
├── database/        # Seed script
├── app.ts           # Express app configuration
└── server.ts        # HTTP server with graceful shutdown
```

---

## Environment Variables

See [`.env.example`](.env.example) for all available options.

**Required:**
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_ACCESS_SECRET` — Random strong secret (min 32 chars)
- `JWT_REFRESH_SECRET` — Different random strong secret

**Optional:**
- `SMTP_ENABLED=true` + SMTP config for email notifications
- `CORS_ORIGINS` — Comma-separated frontend origins

---

## Database Management

```bash
# View DB with GUI
npm run db:studio

# Create new migration after schema change
npm run db:migrate

# Reset database (⚠️ deletes all data)
npm run db:reset

# Re-seed after reset
npm run db:seed
```

---

## Default Admin Account

After seeding:
- **Email:** admin@homevistaa.com
- **Password:** Admin@123456

> ⚠️ Change these in your `.env` before deploying to production.

---

## Rate Limits

| Endpoint Type | Limit |
|---|---|
| General API | 100 req / 15 min |
| Auth endpoints | 10 req / 15 min |
| File uploads | 50 req / hour |
