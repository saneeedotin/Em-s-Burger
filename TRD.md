# Technical Requirements Document (TRD)
## EM's Burgers — Website Mockup

**Audience:** coding agent / developer implementing the mockup from this spec + `design.md`.

---

## 1. Stack

- **Framework:** React (component-based), built with Vite
- **Routing:** react-router-dom (multi-page: `/`, `/menu`, `/about`, `/contact`)
- **Styling:** Tailwind CSS (utility classes) using the design tokens defined in `design.md`
- **Icons:** lucide-react
- **State:** local component state only — no global state manager needed for a static mockup
- **Data:** static JSON/JS files (no backend, no API calls, no database)
- **Deployment target:** static hosting (e.g. Vercel/Netlify) — this is a front-end-only prototype

## 2. Project structure

```
ems-burgers/
├── src/
│   ├── assets/
│   │   ├── logo.svg (or provided logo.jpg)
│   │   └── images/            # placeholder food & ambience shots
│   ├── data/
│   │   └── menu.js            # array of menu items by category
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── SignaturePicksStrip.jsx
│   │   ├── LoyaltyBanner.jsx
│   │   ├── MenuCategory.jsx
│   │   ├── MenuItemCard.jsx
│   │   ├── LoyaltyPunchCard.jsx
│   │   └── MapEmbed.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── About.jsx
│   │   └── Contact.jsx
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js
└── package.json
```

## 3. Data model

### Menu item (`src/data/menu.js`)
```js
{
  id: "ufo-burger",
  name: "UFO Burger",
  category: "burgers",     // burgers | sides | drinks
  isVeg: false,
  description: "Signature stacked burger, house sauce, toasted bun",
  price: 249,               // PLACEHOLDER — confirm with client
  image: "/assets/images/ufo-burger.jpg" // placeholder until real photos supplied
}
```
Seed the menu with known items from public listings, marked as placeholders for description/price:
Burgers — UFO Burger, Pull Me Up Burger, Signature Burger, Veggie Avocado Burger, Lamb Croissant Burger.
Sides — Destroyed Fries, Cheese Fries, Mac & Cheese Bites, Chicken Tenders.

### Loyalty card (mockup only, no backend)
```js
{
  totalRequired: 9,
  currentCount: 3, // hardcoded demo value for the mockup UI
  rewardText: "10th burger free"
}
```

## 4. Page-to-component mapping

| Route | Page | Key components |
|---|---|---|
| `/` | Home | Navbar, Hero, SignaturePicksStrip, LoyaltyBanner, Footer |
| `/menu` | Menu | Navbar, MenuCategory × N, MenuItemCard, Footer |
| `/about` | About | Navbar, ambience gallery, story block, Footer |
| `/contact` | Contact | Navbar, MapEmbed, contact details, Footer |
| `/loyalty` (or in-page section reached via QR) | Loyalty | LoyaltyPunchCard (static demo state) |

## 5. Non-functional requirements

- **Responsive:** mobile-first; must look correct at 375px, 768px, 1280px widths (majority of QR-code loyalty scans will be on mobile).
- **Performance:** this is a marketing/mockup site — keep it lightweight, no heavy animation libraries required (simple CSS transitions are enough).
- **Accessibility:** semantic HTML, alt text on all images, sufficient color contrast between the terracotta red and cream (see `design.md`).
- **Browser support:** latest Chrome, Safari, Firefox (mobile + desktop).

## 6. External links (real, functional in the mockup)
- Instagram: https://www.instagram.com/emschembur/
- Zomato / Swiggy order links (placeholder buttons — link to actual listings if available)
- Google Maps: address "20, Acharaya Udyog Complex, Koliwada, Borla Road, Chembur, Mumbai" (coordinates ≈ 19.0458, 72.9016)
- Phone/WhatsApp: click-to-call links (numbers to be confirmed directly with client before publishing)

## 7. Explicitly out of scope for this build
- No backend/API, no database, no auth
- No real QR-scan-to-points logic — `LoyaltyPunchCard` renders a hardcoded demo state only
- No CMS — menu content lives in a static JS file the developer edits directly
- No payment integration
