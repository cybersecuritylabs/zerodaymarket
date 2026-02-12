# ZeroDay Market — System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser (Client)                    │
│                                                          │
│   React SPA ─── Axios ─── JWT Auth ─── Tailwind CSS     │
└──────────────────────┬───────────────────────────────────┘
                       │ HTTP (port 80)
                       ▼
┌──────────────────────────────────────────────────────────┐
│                    Nginx Reverse Proxy                    │
│                                                          │
│   Static Files (React Build)    /api/* → Backend:3001    │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   Express.js Backend                     │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  Auth    │  │  Orders  │  │  Wallet  │  │  Admin   │ │
│  │ Service  │  │ Service  │  │ Service  │  │ Service  │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │
│       │              │             │              │       │
│  ┌────┴─────┐  ┌────┴─────┐  ┌───┴──────┐  ┌───┴─────┐ │
│  │ Coupon   │  │ Refund   │  │ Cashback │  │   Lab   │ │
│  │ Service  │  │ Service  │  │ Service  │  │ Service │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │
│                                                          │
│  Middleware: Auth │ Sanitize │ Validate │ Rate Limit     │
└──────────────────────┬───────────────────────────────────┘
                       │ Sequelize ORM
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   PostgreSQL 16                          │
│                                                          │
│   users │ products │ orders │ wallets │ transactions     │
│   coupons │ notifications │ lab_completions              │
└──────────────────────────────────────────────────────────┘
```

## Service Architecture

### Authentication Service
- JWT token generation and validation
- bcrypt password hashing (12 salt rounds)
- Email format validation
- Token expiry management (24h)

### Wallet Service
- Balance management (credit/debit)
- Transaction history tracking
- Balance-after recording for audit trail
- Atomic operations with database transactions

### Order Service
- Order creation with price calculation
- Coupon discount application
- Multi-item checkout processing
- Order status lifecycle management

### Coupon Service
- Promotional coupon generation
- Code validation and redemption
- Single-use enforcement
- Expiry management

### Cashback Service
- Asynchronous cashback processing
- Promotional offer eligibility checking
- Delayed wallet credit (simulates real processing)
- Coupon reward distribution

### Refund Service
- Refund eligibility verification
- Product-level refund policy enforcement
- Wallet credit processing
- Order status update

### Admin Service
- Role-based access control
- User management (read-only)
- Order and refund analytics
- Revenue reporting
- Site configuration management

## Data Model

```
┌──────────┐     ┌──────────┐     ┌───────────┐
│  Users   │────▶│ Wallets  │────▶│Transactions│
│          │     │          │     │           │
│ id       │     │ id       │     │ id        │
│ name     │     │ userId   │     │ walletId  │
│ email    │     │ balance  │     │ type      │
│ password │     └──────────┘     │ amount    │
│ role     │                      │ balanceAfter│
└────┬─────┘                      └───────────┘
     │
     ├────────────────────────┐
     │                        │
     ▼                        ▼
┌──────────┐           ┌──────────┐
│  Orders  │           │ Coupons  │
│          │           │          │
│ id       │           │ id       │
│ userId   │           │ code     │
│ productId│──┐        │ discount │
│ amountPaid│  │       │ userId   │
│ discount │  │        │ isUsed   │
│ couponId │  │        │ expiresAt│
│ status   │  │        └──────────┘
└──────────┘  │
              │
              ▼
        ┌──────────┐
        │ Products │
        │          │
        │ id       │
        │ name     │
        │ price    │
        │ category │
        │ refundable│
        └──────────┘
```

## Security Layers

1. **Transport** — Nginx reverse proxy with security headers
2. **Authentication** — JWT bearer tokens with expiry
3. **Authorization** — Role-based access control (user/admin)
4. **Input Validation** — express-validator on all endpoints
5. **Sanitization** — HTML entity encoding on all string inputs
6. **Rate Limiting** — Per-IP request throttling
7. **SQL Protection** — Sequelize ORM parameterized queries
8. **HTTP Hardening** — Helmet.js security headers
9. **CORS** — Strict origin policy

## Docker Services

| Service    | Port | Description                    |
|------------|------|--------------------------------|
| frontend   | 80   | Nginx + React static build    |
| backend    | 3001 | Express.js API server          |
| postgres   | 5432 | PostgreSQL database            |
