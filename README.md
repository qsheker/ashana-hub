# Ashana Hub

Ashana Hub is a team-built front-end web project for a cafeteria / food hub. It provides a responsive UI where users can browse a menu, view time-limited discounts, add items to a local cart, and manage a simple profile.

This repository was created as part of a Web Technologies (Front-End) course and is intended as a static demo (no server-side backend). The app uses localStorage for persistence and public CDNs for libraries.

---

## Project topic

Interactive front-end for a food ordering hub with menu browsing, discounts, cart management and a profile/settings dashboard.

## Key features

- Responsive menu with search and pagination (TheMealDB used to populate sample meals)
- Discounted meal offers page with add-to-cart using discounted price
- Client-side cart persisted to `localStorage` (key: `asxanaCart`)
- Simple auth/registration flow (client-side) and per-user settings saved in `localStorage`
- Profile settings form with validation (username, international phone, email), password strength meter and show/hide, and address split (street, building, apartment)
- FAQ with live search and highlight
- Theme toggle (light/dark) persisted to `localStorage`
- Visual slide-in notifications for user actions (add-to-cart, success messages)

## External APIs & Libraries

- TheMealDB — used to fetch sample meal data for the Menu (https://www.themealdb.com/)
- Bootstrap 5 (via CDN) — layout & components
- jQuery (via CDN) — lightweight DOM helpers used in several scripts
- Font Awesome (via CDN)

## File / Folder overview

- `index.html` — landing page
- `menu.html` + `scripts/menu.js` — menu browsing, TheMealDB integration
- `discounts.html` + `scripts/discounts.js` — discount cards and add-to-cart (stores discounted price)
- `cart.html` + `scripts/cart.js` — cart UI, totals, checkout mock
- `auth.html` + `scripts/auth.js` — client-side register / login flow (local storage based)
- `profile.html` + `scripts/profile.js` — user profile / settings (validation + per-user persistence)
- `styles/` & `style.css` — project styles (mostly page-level inline styles and CSS variables)
- `images/`, `sounds/` — assets used by pages

> Note: many pages load CSS/JS from CDN (Bootstrap, jQuery, Font Awesome). No server build step required — this is a static site.

## Team & responsibilities

- Almadi — Menu and `index.html` (menu UI, menu scripts)
- Aibek — Profile (`profile.html` and `scripts/profile.js`)
- Aldiyar — Cart and Auth (`cart.html`, `scripts/cart.js`, `auth.html`, `scripts/auth.js`)
- Nurgeldi — Team page and Discounts (`team.html`, `discounts.html`, `scripts/discounts.js`)

If you want to map responsibilities to code quickly, look at the `scripts/` files named above.

## How to run locally

Because this is a static site you can open `index.html` directly in the browser, but some browsers restrict AJAX from file://; to be safe run a tiny static server.

Using Python (PowerShell):

```powershell
# from repo root (where index.html lives):
python -m http.server 8000
# then open http://localhost:8000/index.html
```

Or using Node.js `serve` (if you have npm):

```powershell
npx serve . -l 8000
# then open http://localhost:8000
```

## Quick manual test checklist

1. Open `auth.html` and register a user (or log in). The app stores users client-side in `localStorage`.
2. Visit `profile.html`, edit settings (username, phone, address), Save. Settings are persisted per user.
3. Go to `discounts.html` and click `Add to Cart`. The item is saved into `localStorage` key `asxanaCart` with its discounted price, and a slide-in notification appears.
4. Open `cart.html` to verify the item and totals reflect the discounted price.

## Important notes & security

- This project is a front-end demo. All authentication and storage are client-side using `localStorage`. Do NOT treat this as secure for real users.
- Passwords in the demo (where present) are stored only in-browser (and sometimes encoded for demo purposes). For production, use a secure server-side authentication flow and never store raw or reversible passwords in localStorage.

## Contributing

If you or the team want to continue this project:

- Consider moving user management and cart to a simple backend (Node/Express, Firebase, etc.) for security and persistence.
- Centralize shared UI code (notifications, theme toggle) into `scripts/ui.js` for reuse across pages.
- Add automated UI tests (Playwright/Cypress) for flows: register → save settings → logout → login → verify settings restored; and add-to-cart → cart totals.

## Credits

Team project for Web Technologies (Front-End).

---

If you'd like, I can: extract the shared notification code into a single `scripts/ui.js`, standardize `localStorage.users` to a single format, or add a small automated test script for the main flows. Tell me which and I will implement it.

