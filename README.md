
# ZeroDay Market — Gadget Marketplace

<svg width="72" height="72" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <rect x="1.5" y="3" width="21" height="13" rx="1.5" stroke="#0f172a" stroke-width="0.9" fill="none"/>
  <path d="M6 19h12" stroke="#0f172a" stroke-width="0.9" stroke-linecap="round"/>
  <circle cx="8.5" cy="19" r="0.9" fill="#0f172a"/>
  <circle cx="15.5" cy="19" r="0.9" fill="#0f172a"/>
</svg>

Welcome to ZeroDay Market — a lively online gadget marketplace that looks, feels, and behaves like a modern e-commerce site. Browse devices, add items to your cart, check out, and follow transaction flows that resemble production systems.

There is a single, purposeful defect hidden somewhere in the application. No hints are given here — your task is to explore, reason, and demonstrate the issue through responsible testing. When you successfully reveal the required condition inside the running application, a confirmation popup will appear.

## Key Notes

- Use this repository only in environments where you have explicit permission.
- No solution steps, hints, or answers are included in this document.
- This is a challenging exercise intended for people comfortable with application analysis and testing.

## What You Can Do Here

- Browse a product catalog of consumer gadgets.
- Create an account and exercise normal user flows (cart, checkout, order history).
- Observe state changes, transaction records, and UI feedback as you interact with the app.

Can you find the defect that changes the normal flow? The application will tell you when you've completed the objective.

## Prerequisites

- `git` installed
- Docker Engine
- Docker Compose
- A modern web browser

## Quick Start

1. Clone the repository and change into it:

```bash
git clone <https://github.com/cybersecuritylabs/zerodaymarket>
cd <'ZeroDay Market'>
```

2. Build and run the application stack (Docker must be run in background):

```bash
docker-compose up --build -d
```

3. Open your browser and navigate to:

```
http://localhost
```

4. Tail logs to watch services start and for runtime messages:

```bash
docker-compose logs -f
```

5. you can stop containers when you want by:

```bash
docker-compose stop
```

5. you can start the containers again when you want by:

```bash
docker-compose start
```

## No Spoilers

This README intentionally avoids technical details that would reveal how to find or exploit the defect. If you discover any accidental leaks or repository issues that could reveal the solution unintentionally, open an issue without posting sensitive details publicly.

## Contributing

Improvements to the project infrastructure, deployment scripts, and documentation are welcome. Please do not contribute solution walkthroughs, exploit code, or explicit hints.

## License

MIT — for educational and experimental use only.
