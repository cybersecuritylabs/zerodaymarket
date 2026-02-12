# ZeroDay Market

<p align="center">
  <strong>A production-grade e-commerce platform built for security research and penetration testing.</strong>
</p>

---

## Overview

ZeroDay Market is a fully functional, realistic e-commerce platform designed as a security training lab. It features a modern UI, wallet-based payments, promotional offers, a full order lifecycle, and an admin management panel.

The platform is purpose-built for security professionals and pentesters to practice identifying and exploiting **advanced business logic vulnerabilities** in a safe, legal environment.

> 💡 *Take advantage of our limited-time cashback and coupon offer before it expires.*

---

## Features

- **Modern E-Commerce UI** — Clean, responsive product catalog with detail pages, cart, and checkout
- **Wallet System** — Full digital wallet with balance tracking, transaction history, debits, and credits
- **Authentication** — Secure JWT-based registration and login with bcrypt password hashing
- **Promotional Engine** — Live cashback offers and coupon generation for qualifying purchases
- **Order Management** — Complete order lifecycle with status tracking and selective refund eligibility
- **Admin Dashboard** — Internal management panel with user, order, and revenue analytics
- **Notification System** — Real-time alerts for cashback, coupons, refunds, and account activity

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS      |
| Backend    | Node.js, Express, Sequelize ORM   |
| Database   | PostgreSQL 16                     |
| Auth       | JWT + bcrypt                      |
| Icons      | Lucide React (SVG)                |
| Container  | Docker, Docker Compose            |
| Proxy      | Nginx                            |

---

## Quick Start

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)

### Launch

```bash
git clone https://github.com/your-org/zeroday-market.git
cd zeroday-market
docker-compose up --build
```

Open **http://localhost** in your browser.

### Default Accounts

| Role  | Email                     | Password         |
|-------|---------------------------|------------------|
| Admin | admin@zerodaymarket.io    | Admin@ZDM2024!   |

Regular users can register through the Sign Up page.

---

## Project Structure

```
ZeroDay Market/
├── docker-compose.yml
├── README.md
├── ARCHITECTURE.md
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── config/
│       ├── models/
│       ├── middleware/
│       ├── services/
│       ├── routes/
│       └── seed/
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── api/
        ├── context/
        ├── components/
        └── pages/
```

---

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system architecture documentation.

---

## Environment Variables

Copy `.env.example` and configure:

```bash
cp .env.example .env
```

All required variables are pre-configured in `docker-compose.yml` for local development.

---

## Security Considerations

This platform implements production-grade security practices:

- Parameterized queries via Sequelize ORM (no raw SQL)
- bcrypt password hashing with configurable salt rounds
- JWT authentication with expiry
- Helmet.js HTTP security headers
- CORS origin restriction
- Rate limiting on all API endpoints
- Input validation and sanitization
- Role-based access control on admin endpoints

---

## Lab Usage

This platform is designed for **authorized security research only**. Use it to:

- Practice business logic analysis
- Understand e-commerce payment flows
- Study wallet and transaction systems
- Analyze promotional offer mechanics
- Explore multi-step financial processes

---

## License

MIT — For educational and research purposes only.
