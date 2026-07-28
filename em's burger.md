# EM'S BURGERS — COMPLETE APPLICATION & DESIGN SPECIFICATION

> **Universal Agent Blueprint**: This document contains **100% of the data points, system logic, authentication flows, loyalty program mechanics, design tokens, data models, and page sitemaps** for EM's Burgers. Feed this exact markdown file into any AI coding or design agent to recreate, redesign, or extend the entire web application.

---

## 1. Brand & Business Profile

| Attribute | Details |
|---|---|
| **Brand Name** | EM's Burgers |
| **Tagline / Badges** | *"BUILT TO HIT"* • *"THE GOOD DECISION"* • *"CHEMBUR CAMP, MUMBAI"* |
| **Address** | 20, Acharya Udyog Complex, Koliwada, Borla Road, Chembur Camp, Chembur, Mumbai, Maharashtra 400074 |
| **Operating Hours** | 12:00 PM – 11:00 PM (Daily) |
| **Coordinates** | Latitude: `19.0458`, Longitude: `72.9016` |
| **Phone / WhatsApp** | Click-to-call enabled (`+91-XXXXX-XXXXX`) |
| **Instagram** | [@emschembur](https://www.instagram.com/emschembur/) |
| **Delivery Links** | Zomato & Swiggy Direct Order Links |
| **Vibe & Aesthetic** | Dark mode pub & stadium vibe, glowing neon signs, Ember Red & Neon Amber accents, smashed patty craft burgers |

---

## 2. Design System & Visual Tokens (v2 — Dark Theme)

### 2.1 Color Palette
```css
:root {
  --color-bg: #0B0704;        /* Near-Black dominant surface */
  --color-surface: #1C0F09;   /* Dark Espresso elevated card background */
  --color-red: #B7301A;       /* Ember Red (Brand identity, section blocks, buttons) */
  --color-amber: #F2A020;     /* Neon Amber (CTAs, badge highlights, glowing accents) */
  --color-cream: #F5EDE0;     /* Warm Cream off-white primary text */
  --color-muted: #B8ACA0;     /* Ash muted secondary text */
}
```

### 2.2 Typography Hierarchy
- **Display / Poster Headlines (H1 & Hero):** `Anton`, `Archivo Black`, or `Bebas Neue` (Heavy condensed, poster-style, all-caps).
- **Section Headings (H2 / H3):** `Poppins` (Bold / SemiBold) or `Montserrat`.
- **Body Text & UI Labels:** `Inter` or `Work Sans` in Warm Cream or Muted Ash.
- **Badges / Sub-lines:** Condensed bold uppercase with letter-spacing (e.g. `letter-spacing: 0.1em`).

### 2.3 UI Components & Effects
- **Buttons:** Pill-shaped (`rounded-full`), Neon Amber fill + dark text (primary CTA) or Ember Red fill + cream text. Neon glow effect: `box-shadow: 0 0 20px rgba(242,160,32,0.35)`.
- **Cards & Surfaces:** Rounded corners (`16px` to `32px` / `rounded-4xl`), `--color-surface` background, thin Ember Red or Amber hairline border.
- **Loyalty Punch Slots:** Circular stamp slots with outer glow rings, animated stamp placement, active/unlocked state animations.
- **Custom Burger Cursor (`src/components/BurgerCursor.jsx`):** Interactive SVG burger cursor with smooth physics tracking, dashed cheese trailing ring, hover scale-up with `"CRAVE!"` badge on interactive elements, and click squeeze rotation. Automatically enabled on fine pointer devices (`@media (pointer: fine)`).

---

## 3. System Architecture & State Logic

### 3.1 Global State Overview
The application maintains two primary data structures in `localStorage`:
1. `ems_users`: Array of registered user objects (pre-seeded with demo account).
2. `ems_current_user`: Currently authenticated user session object (or `null` when logged out).

```
 +-----------------------------------------------------------------------+
 |                            AuthContext                                |
 +-----------------------------------------------------------------------+
    |                |                |                 |             |
 login()         signup()         logout()     toggleFavourite() updatePoints()
    |                |                |                 |             |
    v                v                v                 v             v
 +-----------------------------------------------------------------------+
 |                 localStorage ('ems_users', 'ems_current_user')       |
 +-----------------------------------------------------------------------+
```

### 3.2 Authentication & User Data Model

```typescript
interface OrderItem {
  name: string;
  qty: number;
  price: number; // Price in INR (₹)
}

interface OrderReceipt {
  id: string; // Unique order ID, e.g. "o_1042"
  date: string; // YYYY-MM-DD format
  items: OrderItem[];
  total: number; // Sum of items in ₹
  status: "delivered" | "preparing" | "cancelled";
}

interface UserProfile {
  id: string; // Unique user ID, e.g. "u_demo_001" or "u_1721731200000"
  name: string; // Full Name
  email: string; // Email address (lowercased for matching)
  password: string; // Auth password
  loyaltyPoints: number; // Integer between 0 and 9 (9 stamps = 10th burger FREE)
  favourites: string[]; // Array of favorited MenuItem IDs (e.g. ["ufo-burger"])
  orders: OrderReceipt[]; // Array of past order receipts
}
```

### 3.3 Pre-Seeded Demo User Account
- **Email:** `demo@emsburgers.com`
- **Password:** `demo1234`
- **User Object Data:**
```json
{
  "id": "u_demo_001",
  "name": "Aditi Rao",
  "email": "demo@emsburgers.com",
  "password": "demo1234",
  "loyaltyPoints": 6,
  "favourites": ["ufo-burger", "destroyed-fries", "mango-boba-shake"],
  "orders": [
    {
      "id": "o_1042",
      "date": "2026-07-18",
      "items": [
        { "name": "UFO Burger", "qty": 1, "price": 249 },
        { "name": "Destroyed Fries", "qty": 1, "price": 179 },
        { "name": "Classic Cold Coffee", "qty": 1, "price": 129 }
      ],
      "total": 557,
      "status": "delivered"
    },
    {
      "id": "o_1038",
      "date": "2026-07-12",
      "items": [
        { "name": "Pull Me Up Burger", "qty": 1, "price": 299 },
        { "name": "Mac & Cheese Bites", "qty": 1, "price": 169 }
      ],
      "total": 468,
      "status": "delivered"
    },
    {
      "id": "o_1025",
      "date": "2026-07-05",
      "items": [
        { "name": "EM's Double Smash", "qty": 1, "price": 279 },
        { "name": "Sparkling Hibiscus Lemonade", "qty": 1, "price": 119 }
      ],
      "total": 398,
      "status": "delivered"
    },
    {
      "id": "o_1011",
      "date": "2026-06-28",
      "items": [
        { "name": "Veggie Avocado Smash", "qty": 1, "price": 219 },
        { "name": "Mango Passion Boba", "qty": 1, "price": 169 }
      ],
      "total": 388,
      "status": "delivered"
    }
  ]
}
```

---

## 4. System Logic & Function Specifications

### 4.1 Login Flow (`login(email, password)`)
1. Normalize `email` to lowercase and trim whitespace.
2. Search `users` array in `localStorage` for a match where `user.email === email` AND `user.password === password`.
3. **Demo Account Fallback:** If not found in array, check if `email === 'demo@emsburgers.com'` and `password === 'demo1234'`.
4. **On Success:** Set `currentUser` state, persist `currentUser` object to `localStorage('ems_current_user')`, and return `{ success: true }`.
5. **On Failure:** Return `{ success: false, message: 'Invalid email or password. Try demo@emsburgers.com / demo1234' }`.
6. **One-Click Demo Login (`loginAsDemo()`):** Immediately set `currentUser` to pre-seeded `DEMO_USER` object without validation.

### 4.2 Signup Flow (`signup(name, email, password)`)
1. Validate required fields (`name`, `email`, `password`).
2. Verify password length (minimum 4 characters).
3. Check `users` array for existing email duplicate. If duplicate found, return `{ success: false, message: 'An account with this email already exists.' }`.
4. **Welcome Bonus Rule:** New users receive **1 FREE welcome loyalty stamp** (`loyaltyPoints: 1`).
5. Construct new `UserProfile`:
   ```js
   const newUser = {
     id: `u_${Date.now()}`,
     name,
     email,
     password,
     loyaltyPoints: 1, // 1 Welcome Stamp!
     favourites: [],
     orders: []
   };
   ```
6. Push `newUser` into `users` array, sync `localStorage`, set `currentUser = newUser`, and return `{ success: true }`.

### 4.3 Logout Flow (`logout()`)
1. Set `currentUser` state to `null`.
2. Execute `localStorage.removeItem('ems_current_user')`.
3. Redirect user away from protected routes (`/dashboard`) to `/login`.

### 4.4 Favourites System Logic (`toggleFavourite(itemId)`)
1. Guard: If `currentUser` is null, prompt user to log in.
2. Check if `itemId` exists in `currentUser.favourites`.
3. If present: Filter out `itemId` (remove from favourites).
4. If absent: Append `itemId` to `currentUser.favourites` array.
5. Update `currentUser` state and sync with `users` array in `localStorage`.

---

## 5. Loyalty Program Logic & QR Mechanics

### 5.1 Business Mechanics
- **Concept:** *"Buy 9 Burgers, Get the 10th Burger 100% FREE!"*
- **Punch Card Structure:** 10 Total Slots.
  - Slots 1 to 9 = Burger Order Stamps.
  - Slot 10 = **FREE Burger Reward Slot**.

### 5.2 Points Rules & Clamping
- `loyaltyPoints` ranges from `0` to `9`.
- **Clamping Logic:** `Math.min(9, Math.max(0, newPoints))`
- **Stamp Collection Rule:** Each burger item ordered or table QR code scan adds `+1 stamp`.
- **Reward State (`isUnlocked`):** Triggered when `loyaltyPoints >= 9`.

### 5.3 In-Store QR Workflow
```
[ Customer Dines In ] ──> [ Scans Table QR Code ] ──> [ System Adds +1 Stamp ]
                                                               |
                                                               v
[ Staff Verifies Dashboard ] <── [ Unlocks 10th FREE Burger ] <── [ Reaches 9/9 Stamps ]
```

### 5.4 UI Celebration & Confetti Logic
- When `loyaltyPoints` reaches `9`:
  1. Trigger multi-color confetti burst (`canvas-confetti` with brand colors `#D9412A`, `#F9E9C7`, `#F2B705`, `#2B1810`).
  2. Render **"🎉 10th BURGER UNLOCKED!"** golden banner.
  3. Display redemption instructions: *"Show your digital dashboard to the server at EM's Burgers Chembur Camp to claim your free burger."*
  4. Provide "+ Simulate Scan" and "Reset Stamps" interactive controls for live demonstration.

---

## 6. Complete Menu Data Points

### 6.1 Categories
| Category ID | Category Label | Description |
|---|---|---|
| `all` | All Items | Full menu catalog |
| `burgers` | Stacked Burgers | Signature press-sealed & smashed gourmet burgers |
| `sides` | Loaded Sides | Smashed fries, mac bites & chicken tenders |
| `drinks` | Drinks & Shakes | Cold brews, thick shakes & sparkling lemonades |

### 6.2 Catalog Data Items

```json
[
  {
    "id": "ufo-burger",
    "name": "UFO Burger",
    "category": "burgers",
    "isVeg": false,
    "isSignature": true,
    "description": "Signature press-sealed saucer burger, double smashed patty, melted cheddar, & EM's secret sauce",
    "price": 249,
    "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    "badge": "Bestseller"
  },
  {
    "id": "pull-me-up-burger",
    "name": "Pull Me Up Burger",
    "category": "burgers",
    "isVeg": false,
    "isSignature": true,
    "description": "Interactive molten cheese cascade poured over double smashed beef patties on a toasted brioche bun",
    "price": 299,
    "image": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    "badge": "Must Try"
  },
  {
    "id": "signature-double-burger",
    "name": "EM's Double Smash",
    "category": "burgers",
    "isVeg": false,
    "isSignature": true,
    "description": "Double smash patties, caramelized onions, house pickles, garlic aioli & double American cheddar",
    "price": 279,
    "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    "badge": "Chef's Pick"
  },
  {
    "id": "veggie-avocado-burger",
    "name": "Veggie Avocado Smash",
    "category": "burgers",
    "isVeg": true,
    "isSignature": false,
    "description": "Crispy black bean & corn patty topped with fresh Hass avocado smash, jalapeno salsa & cheddar",
    "price": 219,
    "image": "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80",
    "badge": "Pure Veg"
  },
  {
    "id": "lamb-croissant-burger",
    "name": "Lamb Croissant Burger",
    "category": "burgers",
    "isVeg": false,
    "isSignature": false,
    "description": "Spiced minced lamb patty tucked inside a flaky French butter croissant with mint tzatziki",
    "price": 329,
    "image": "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80",
    "badge": "Gourmet"
  },
  {
    "id": "spicy-crispy-chicken",
    "name": "Spicy Crispy Chicken",
    "category": "burgers",
    "isVeg": false,
    "isSignature": false,
    "description": "24-hour buttermilk soaked fried chicken breast, Nashville hot oil glaze, crunchy dill slaw",
    "price": 239,
    "image": "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=800&q=80",
    "badge": "Spicy"
  },
  {
    "id": "destroyed-fries",
    "name": "Destroyed Fries",
    "category": "sides",
    "isVeg": true,
    "isSignature": true,
    "description": "Hand-cut potato fries smashed & overloaded with liquid cheddar, caramelized onions & jalapeño chips",
    "price": 179,
    "image": "https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80",
    "badge": "Fan Favorite"
  },
  {
    "id": "mac-cheese-bites",
    "name": "Mac & Cheese Bites",
    "category": "sides",
    "isVeg": true,
    "isSignature": false,
    "description": "Panko-crusted golden fried mac & three-cheese cubes served with sriracha mayo dip",
    "price": 169,
    "image": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    "badge": "Crispy"
  },
  {
    "id": "chicken-tenders",
    "name": "Buttermilk Tenders",
    "category": "sides",
    "isVeg": false,
    "isSignature": false,
    "description": "Golden tender chicken strips marinated in herbs, served with smoky honey mustard & ranch",
    "price": 199,
    "image": "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80",
    "badge": "Juicy"
  },
  {
    "id": "classic-cold-coffee",
    "name": "Classic Cold Coffee",
    "category": "drinks",
    "isVeg": true,
    "isSignature": false,
    "description": "Dark roast espresso double shot whipped with ice-cream milk & cocoa drizzle",
    "price": 129,
    "image": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
    "badge": "Chilled"
  },
  {
    "id": "mango-boba-shake",
    "name": "Mango Passion Boba",
    "category": "drinks",
    "isVeg": true,
    "isSignature": true,
    "description": "Alphonso mango thick shake blended with passionfruit pulp and chewy brown sugar boba pearls",
    "price": 169,
    "image": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    "badge": "New"
  },
  {
    "id": "hibiscus-lemonade",
    "name": "Sparkling Hibiscus Lemonade",
    "category": "drinks",
    "isVeg": true,
    "isSignature": false,
    "description": "Cold-brewed organic hibiscus flower tea with crushed mint, freshly squeezed lemon & sparkling soda",
    "price": 119,
    "image": "https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=800&q=80",
    "badge": "Refreshing"
  }
]
```

---

## 7. Application Sitemap & Page Specifications

```
                       [ WEBSITE SITEMAP ]
                                |
  +------------------+----------+----------+-------------------+
  |                  |                     |                   |
[ / ]             [ /menu ]           [ /about ]          [ /contact ]
Home               Menu                About               Contact
  |                  |                     |                   |
  +--------+---------+                     |                   |
           |                               |                   |
     [ /loyalty ] <────────────────────────┘                   |
     Loyalty Demo                                              |
           |                                                   |
     +-----+-----+                                             |
     |           |                                             |
 [ /login ]  [ /signup ]                                       |
    Login      Signup                                          |
     |           |                                             |
     +─────┬─────+                                             |
           |                                                   |
     [ /dashboard ] (Protected Route) <────────────────────────┘
     User Dashboard (Stamps, Orders, Favourites)
```

---

### Page 1: Home Page (`/`)
- **Hero Section:**
  - Headline: `"BUILT TO HIT"`
  - Subheadline: `"Chembur's premier smashed burger spot. Press-sealed UFO burgers, molten cheese pulls & fresh local ingredients."`
  - Action Buttons: `[ View Full Menu ]` (links to `/menu`), `[ Explore Loyalty ]` (links to `/loyalty`).
  - Hero Image: Close-up juicy double smashed burger with melted cheddar & glowing amber backlighting.
- **Interactive Food Spotlight:**
  - Interactive switcher showcasing **UFO Burger** (Press-sealed saucer burger) and **Pull Me Up Burger** (Molten cheese cascade).
- **Signature Picks Strip:**
  - Horizontal grid showcasing top items: UFO Burger, Pull Me Up Burger, EM's Double Smash, Destroyed Fries.
- **Loyalty Program Banner:**
  - High-visibility banner: *"BUY 9 BURGERS, GET THE 10TH FREE!"* with a CTA to join or open the QR card.
- **Delivery Integration Section:**
  - Quick ordering links targeting Zomato and Swiggy listings.

---

### Page 2: Menu Page (`/menu`)
- **Page Header:** `"OUR CRAFT MENU"` with category navigation tabs (`All Items`, `Stacked Burgers`, `Loaded Sides`, `Drinks & Shakes`).
- **Filter Controls:**
  - Category selection pills.
  - Search bar input.
  - Pure Veg filter toggle switch.
- **Menu Items Grid:**
  - Card elements displaying item image, badge tag, green/red veg indicator dot, dish name, description, price in ₹, favourite heart toggle, and order CTA button.

---

### Page 3: About Page (`/about`)
- **Brand Story Block:**
  - Origins in Chembur Camp, Mumbai.
  - Philosophy: High-heat smashed patties for maximum caramelization, house-baked brioche buns, scratch-made secret sauces.
- **Ambience & Culture:**
  - Stadium pub atmosphere, IPL & cricket match screenings, neon sign aesthetics.
- **Craft Highlights:**
  - 100% fresh non-frozen patties, 24-hr buttermilk fried chicken marinades, extensive vegetarian gourmet options.

---

### Page 4: Contact Page (`/contact`)
- **Location & Map:**
  - Full address display: *20, Acharya Udyog Complex, Koliwada, Borla Road, Chembur, Mumbai*.
  - Embedded Google Map with location pin (`19.0458, 72.9016`).
- **Operating Hours:** `12:00 PM – 11:00 PM` daily.
- **Communication:** Click-to-call phone / WhatsApp link, Instagram link `@emschembur`.
- **Order Direct Buttons:** Links to Zomato & Swiggy.

---

### Page 5: Public Loyalty Demo Page (`/loyalty`)
- **Header:** *"EM'S BURGER CLUB PUNCH CARD — QR Table Loyalty Experience"*.
- **Interactive Component (`LoyaltyPunchCard`):**
  - Pre-loaded with 3/10 stamps.
  - Clicking slots increments/decrements stamps to demonstrate interactive mechanics.
- **3-Step How It Works Grid:**
  1. *Scan Table QR* — Scan QR code on dining table or receipt.
  2. *Order Any Burger* — Every burger ordered auto-adds a digital stamp.
  3. *Enjoy 10th FREE!* — Unlock 10th burger 100% free upon collecting 9 stamps.

---

### Page 6: Login Page (`/login`)
- **Card Container:** Dark surface card with input fields.
- **Form Inputs:** Email Address, Password.
- **Interactive Features:**
  - Error alert with shake animation on invalid credentials.
  - **One-Click Demo Login Banner:** Provides instant login with pre-seeded data (`demo@emsburgers.com`).
- **Navigation:** Redirects to `/dashboard` (or previously requested protected path) upon success. Link to `/signup`.

---

### Page 7: Signup Page (`/signup`)
- **Card Container:** Dark surface card with registration form.
- **Form Inputs:** Full Name, Email Address, Password.
- **Welcome Incentive:** Registration awards **1 FREE Welcome Loyalty Stamp** (`loyaltyPoints: 1`).
- **Navigation:** Auto-logs in new account and redirects to `/dashboard`. Link to `/login`.

---

### Page 8: User Dashboard (`/dashboard`) — Protected Route
- **Route Guard (`RequireAuth`):** Redirects unauthenticated visitors to `/login?from=/dashboard`.
- **Header Banner:**
  - Personal greeting: `"WELCOME BACK, [USER NAME]!"`.
  - Quick Stats Pill: Collected Stamps (`X/9`), Total Past Orders.
- **Tab Navigation (`DashboardTabs`):**
  1. **Tab 1: My Loyalty Points (`'loyalty'`):**
     - Digital Stamp Card displaying 10 circular slots.
     - Confetti celebration banner when `loyaltyPoints >= 9`.
     - Controls: `+ Simulate Scan (+1 Stamp)` button and `Reset Stamps` button.
     - QR scanning instructions banner.
  2. **Tab 2: Previous Orders (`'orders'`):**
     - List of past receipts showing Order ID, Date, Item breakdown, Quantity, Total ₹ Amount, Delivery Status badge.
     - Interactive `[ Reorder Dish ]` button.
  3. **Tab 3: My Favourites (`'favourites'`):**
     - Grid of user's favorited menu items with full `MenuItemCard` rendering and toggle capability.

---

## 8. Summary of Reusable Assets & External Links

- **Instagram URL:** `https://www.instagram.com/emschembur/`
- **Location Coordinates:** `19.0458, 72.9016` (Chembur Camp, Mumbai)
- **Menu Data Export:** `src/data/menu.js`
- **Auth Provider:** `src/context/AuthContext.jsx`
- **Protected Route Container:** `src/components/RequireAuth.jsx`

---
*Created for EM's Burgers — Ready to be loaded into any design or coding agent.*
