# ReTicket
> A safe, fraud-free ticket resale platform for modern buyers and sellers

![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-brightgreen) ![PHP](https://img.shields.io/badge/PHP-%3E%3D8.2-blueviolet) ![MIT License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview
- **Problem**: Second-hand ticket markets suffer from fraud, counterfeit tickets, and security concerns that erode trust between buyers and sellers.
- **Goals**: Eliminate scams through controlled listing ownership, secure checkout flows, and verified ticket state transitions. Provide a modern, intuitive platform for buying and reselling tickets with confidence.
- **Target users**: Event enthusiasts, ticket resellers, event organizers, and anyone seeking a safe secondary ticket marketplace.
- **Live demo**: [ReTicket Platform](https://reticket.vercel.app)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript, Vite, React Router 7, TailwindCSS + Bootstrap 5 |
| Backend | Laravel 12, PHP 8.2+, Eloquent ORM |
| Database | PostgreSQL (via Laravel migrations) |
| Auth | Laravel Sanctum (personal access tokens) |
| Payment | Stripe API |
| Hosting | Vercel (frontend & backend) |
| Queue | Database driver (for async jobs) |

## Architecture

### System Flow
```
User (React App)
    ↓
Frontend Routes + Auth Context
    ↓
Vite Dev Server / Vercel (Production)
    ↓
Laravel API (Routes → Controllers → Policies)
    ↓
Eloquent Models ↔ PostgreSQL
    ↓
Stripe Integration (Payments)
    ↓
Queue Jobs + Scheduler (Reservation cleanup)
```

### Folder structure
```
/
├── backend/                          # Laravel API server
│   ├── app/
│   │   ├── Http/Controllers/         # API endpoints
│   │   ├── Models/                   # Eloquent models (Event, User, TicketForSale, Order, etc.)
│   │   ├── Policies/                 # Authorization logic
│   │   ├── Console/Commands/         # Scheduled tasks (reservation cleanup)
│   │   └── Notifications/            # Email notifications
│   ├── routes/api.php                # API route definitions
│   ├── database/migrations/          # Schema migrations
│   ├── bootstrap/app.php             # App configuration & middleware
│   └── config/                       # Environment-based config files
├── frontend/                         # React SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── router.tsx            # Route definitions
│   │   │   └── App.tsx               # Root component with providers
│   │   ├── components/               # Reusable UI & layout components
│   │   ├── pages/                    # Page components
│   │   ├── context/                  # Auth, Loading, Event, Cart contexts
│   │   ├── styles/                   # CSS modules + global tokens
│   │   └── main.tsx                  # Bootstrap entry point
│   ├── index.html                    # HTML template
│   ├── vite.config.ts                # Vite build config
│   └── tsconfig.json                 # TypeScript config
├── zz-docs/                          # Implementation-aligned documentation
└── README.md                         # This file
```

### Core Domain Entities
- **Event**: Concert, festival, sports event, etc.
- **OriginalTicket**: Initial ticket issued by event organizer
- **TicketForSale**: Listing by a reseller (in basket, reserved, or sold)
- **ActiveTicket**: User's owned ticket post-purchase
- **Order**: Transaction record with items, total, payment status
- **User**: Platform user with auth tokens, profile, settings
- **Payout**: Seller payment records

### Key Design Decisions
- **Stateless API**: Sanctum tokens for stateless auth; no session cookies on API
- **Lazy loading**: React Router lazy modules for route code-splitting
- **Policy-based authorization**: Per-resource access control at controller level
- **Database queue**: Simpler deployment; async jobs run reliably without external queue services
- **Scheduler (every 10 min)**: Automatic cleanup of expired basket reservations
- **Transaction safety**: Laravel transactions for multi-step workflows (checkout → order → payment → finalize)

## Getting Started

### Prerequisites
- **Backend**: PHP 8.2+, Composer 2+
- **Frontend**: Node.js 20+, npm
- **Database**: PostgreSQL (configured in backend `.env`)
- **Optional**: Stripe API keys for payment processing

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pdomi06/ReTicket.git
   cd ReTicket
   ```

2. **Backend setup** (from `backend/` directory)
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   npm install
   ```

3. **Frontend setup** (from `frontend/` directory)
   ```bash
   npm install
   ```

4. **Configure environment variables**
   - **Backend** (`.env`): Set `APP_URL`, `DB_*`, `STRIPE_SECRET`, `FRONTEND_URL`, mail settings
   - **Frontend** (`.env.local`): Set `VITE_API_BASE_URL` to your backend URL

### Running locally

**Option 1: Run both in parallel** (from backend root)
```bash
composer run dev
```
This starts:
- `php artisan serve` (http://localhost:8000)
- `php artisan queue:listen` (background job processor)
- `npm run dev` (Vite dev server)

**Option 2: Manual setup** (two terminals)

Terminal 1 (backend):
```bash
cd backend
php artisan serve
php artisan queue:listen --tries=1
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
# http://localhost:5173
```

### Running tests
```bash
# Backend (from backend/)
php artisan test

# Frontend (from frontend/)
npm run lint
```

## API Documentation

**Base URL**: `https://api.yourproject.com/v1` (or `http://localhost:8000/api` locally)

**Authentication**: Bearer token
```http
Authorization: Bearer <your-token>
```

### Core Endpoints

| Method | Endpoint | Public | Description |
|--------|----------|--------|-------------|
| POST | `/login` | ✓ | User login → returns token |
| POST | `/register` | ✓ | User registration → returns token |
| POST | `/logout` | | Revoke current token |
| GET | `/me` | | Get authenticated user profile |
| GET | `/events` | ✓ | List all events (paginated, filterable) |
| GET | `/events/{id}` | ✓ | Get event details |
| GET | `/ticketForSale` | ✓ | List tickets for sale |
| GET | `/ticketForSale/{id}` | ✓ | Get ticket listing details |
| POST | `/checkout` | | Create Stripe session & order |
| POST | `/orders/{id}/finalize` | | Finalize order post-payment |
| GET | `/orders` | | Get user's orders |

### Example Request
```http
GET /api/events?search=concert&limit=20 HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
Accept: application/json
```

### Example Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Summer Concert 2025",
      "date": "2025-07-15T19:00:00Z",
      "location": "Central Park",
      "available_tickets": 450
    }
  ],
  "meta": {
    "total": 450,
    "per_page": 20,
    "current_page": 1
  }
}
```

### Error Codes
| Code | Meaning |
|------|---------|
| 400 | Bad request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 422 | Unprocessable entity (validation failed) |
| 429 | Too many requests (throttled) |
| 500 | Internal server error |

For complete endpoint documentation and examples, see [zz-docs/backend-api-reference.md](zz-docs/backend-api-reference.md).

## Team
| Name | Role | GitHub |
|------|------|--------|
| Patkós Dominik | Full-stack / Frontend Lead | [@pdomi06](https://github.com/pdomi06) |
| Molnár Attila | Backend / DevOps | [@En1ry06](https://github.com/En1ry06) |
| Fodor Tamás Krisztián | Full-stack / QA | [@jobbagy06](https://github.com/jobbagy06) |

## Additional Resources

### Documentation
- [Project Overview](zz-docs/project-overview.md) — Platform purpose, domain entities, end-to-end flow
- [Local Development Setup](zz-docs/local-development-setup.md) — Installation and running locally
- [Backend Architecture](zz-docs/backend-architecture.md) — Route model, controllers, policies, scheduler
- [Frontend Architecture](zz-docs/frontend-architecture.md) — React structure, routing, context, styling
- [API Reference](zz-docs/backend-api-reference.md) — Comprehensive endpoint catalog
- [Permissions](zz-docs/permissions.md) — Access-control matrix
- [Troubleshooting](zz-docs/troubleshooting.md) — Common runtime and integration issues

### Key Libraries
- **[Stripe API](https://stripe.com/docs/api)** — Payment processing and session management
- **[Laravel Sanctum](https://laravel.com/docs/sanctum)** — Token-based API authentication
- **[React Router](https://reactrouter.com/)** — Client-side routing with lazy loading
- **[TailwindCSS](https://tailwindcss.com/)** — Utility-first CSS framework
- **[Bootstrap 5](https://getbootstrap.com/)** — Responsive component library

## License
MIT © 2025 Patkós Dominik, Molnár Attila, Fodor Tamás Krisztián
