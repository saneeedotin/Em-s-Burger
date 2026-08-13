# 🍔 EM's Burgers — Chembur, Mumbai

> **Classy, Vibrant & Cute Burger Cafe Website**
>
> A fully featured, animated, mobile-responsive promotional website and loyalty management system for EM's Burgers — a real burger café located in Chembur Camp, Mumbai (400074). Founded 18 October 2025 by Mr. Manav Talwar.

---

## Table of Contents

1.  [Quick Start](#quick-start)
2.  [Tech Stack & Dependencies](#tech-stack--dependencies)
3.  [Project Structure](#project-structure)
4.  [Design System & Theming](#design-system--theming)
5.  [Application Architecture](#application-architecture)
6.  [Global Features](#global-features)
7.  [Public Pages (Customer-Facing)](#public-pages-customer-facing)
    - [Home](#1-home-page--)
    - [Menu](#2-menu-page--menu)
    - [Gallery](#3-gallery-page--gallery)
    - [About](#4-about-page--about)
    - [Contact](#5-contact-page--contact)
    - [Loyalty](#6-loyalty-page--loyalty)
    - [Login](#7-login-page--login)
    - [Signup](#8-signup-page--signup)
    - [Dashboard](#9-user-dashboard--dashboard)
8.  [Admin Panel](#admin-panel--admin)
    - [Admin Layout & Sidebar](#admin-layout--sidebar)
    - [Customer Search (Admin Dashboard)](#admin-dashboard--customer-search--admin)
    - [Active Orders](#admin-orders--adminorders)
    - [Customer Database](#admin-customers--adminusers)
    - [Loyalty Override](#admin-loyalty-override--adminloyalty)
9.  [Reusable Components Reference](#reusable-components-reference)
10. [Context Providers (State Management)](#context-providers-state-management)
11. [Data Layer](#data-layer-srcdatamenujs)
12. [Demo Accounts & Mock Data](#demo-accounts--mock-data)
13. [Animations & Motion](#animations--motion)
14. [Responsive Design & Mobile Optimizations](#responsive-design--mobile-optimizations)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/saneeedotin/Em-s-Burger.git
cd Em-s-Burger

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
# → opens at http://localhost:5173 (or whichever port Vite assigns)

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

The app requires **Node.js ≥ 18** and uses **Vite** as the bundler. No backend server or database is needed — all data is stored client-side in `localStorage`.

---

## Tech Stack & Dependencies

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 18 | UI library |
| **Bundler** | Vite 6 | Dev server + build tooling |
| **Routing** | React Router DOM 6 | Client-side navigation with `AnimatePresence` transitions |
| **Styling** | Tailwind CSS 3 | Utility-first CSS with a custom design system |
| **Animation (scroll)** | GSAP 3 + `@gsap/react` + ScrollTrigger + MotionPathPlugin | Scroll-driven reveals, clip-path reveals, parallax, motion path (paper-plane) |
| **Animation (layout)** | Framer Motion 12 | Page transitions, `AnimatePresence`, layout animations, 3D tilt, spring physics |
| **Smooth scroll** | Lenis | Butter-smooth native scrolling |
| **Icons** | Lucide React | 100+ icons used throughout (Heart, Star, Filter, MapPin, etc.) |
| **Confetti** | canvas-confetti | Celebration burst when the user fills their loyalty punch card |
| **Fonts** | Baloo 2 (headings) + Work Sans (body) | Loaded via Google Fonts in `index.html` |

---

## Project Structure

```
Em-s-Burger/
├── index.html                  # HTML entry — SEO title, meta, Google Fonts
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Custom color palette, fonts, animations
├── postcss.config.js           # PostCSS for Tailwind
│
├── public/                     # Static assets served at root "/"
│   ├── logoo.svg               # Brand logo (SVG)
│   ├── favicon.svg             # Browser favicon
│   ├── ANimatedlogo.mp4        # Loading screen intro video
│   └── assets/                 # All food photography and Instagram images
│       ├── Pull me up.png
│       ├── Destroyed Fries.png
│       ├── THECHA BURGER.png
│       ├── Mac and Cheese.png
│       ├── Meltdown .png
│       ├── Double Stack.png
│       ├── Veggie Avacado.png
│       ├── Truffle Fries.png
│       ├── menu.jpeg           # Physical menu card front photo
│       ├── menu 2.jpeg         # Physical menu card back photo
│       └── ...                 # Additional cafe photos, storefront images
│
└── src/
    ├── main.jsx                # React DOM entry, wraps App in BrowserRouter
    ├── App.jsx                 # Root component — routing, layout, providers
    ├── index.css               # Global Tailwind base + custom utility classes
    │
    ├── context/
    │   ├── AuthContext.jsx      # Authentication, user data, loyalty, admin functions
    │   └── VegModeContext.jsx   # Global Pure Veg Mode toggle
    │
    ├── data/
    │   └── menu.js             # MENU_CATEGORIES array + MENU_ITEMS array (all items)
    │
    ├── components/             # 22 reusable UI components (listed below)
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── Hero.jsx
    │   ├── InteractiveHeroFood.jsx
    │   ├── SignaturePicksStrip.jsx
    │   ├── LoyaltyBanner.jsx
    │   ├── LoyaltyPunchCard.jsx
    │   ├── TakeAwaySection.jsx
    │   ├── Gallery.jsx
    │   ├── MenuItemCard.jsx
    │   ├── PhysicalMenuLayout.jsx
    │   ├── MapEmbed.jsx
    │   ├── DashboardTabs.jsx
    │   ├── BouncyButton.jsx
    │   ├── BurgerCursor.jsx
    │   ├── LoadingScreen.jsx
    │   ├── Logo.jsx
    │   ├── PageTransition.jsx
    │   ├── SmoothScroll.jsx
    │   ├── WaveDivider.jsx
    │   ├── ScrollProgressMascot.jsx
    │   └── RequireAuth.jsx
    │
    └── pages/
        ├── Home.jsx
        ├── Menu.jsx
        ├── GalleryPage.jsx
        ├── About.jsx
        ├── Contact.jsx
        ├── Loyalty.jsx
        ├── Login.jsx
        ├── Signup.jsx
        ├── Dashboard.jsx
        └── admin/
            ├── AdminLayout.jsx
            ├── AdminDashboard.jsx
            ├── AdminOrders.jsx
            ├── AdminUsers.jsx
            └── AdminLoyalty.jsx
```

---

## Design System & Theming

All custom colors, fonts, and animations are defined in `tailwind.config.js`:

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#D9412A` | **Terracotta Red** — Navbar, buttons, hero backgrounds, card backgrounds |
| `primary-hover` | `#C2351E` | Hover state for primary buttons |
| `primary-dark` | `#B02C17` | Darker accent for admin sidebar, card backgrounds |
| `cream` | `#F9E9C7` | **Warm Cream** — Page backgrounds, text on dark surfaces |
| `cream-light` | `#FFF6E3` | Slightly lighter cream for filter panels, card surfaces |
| `dark` | `#2B1810` | **Deep Dark Brown** — Body text, dark section backgrounds |
| `accent` | `#F2B705` | **Mustard Yellow** — CTAs, badges, highlights, loyalty accent |
| `accent-hover` | `#DDA604` | Hover state for accent buttons |

### Typography

- **Headings**: `Baloo 2` — Bold, playful, Indian-rooted display font
- **Body**: `Work Sans` — Clean, readable sans-serif

### Custom Animations (Tailwind keyframes)

- `pulse-glow` — Pulsating glow effect on the loyalty badge (2.5s loop)
- `bounce-subtle` — Gentle vertical bounce (3s loop)

---

## Application Architecture

### `App.jsx` — The Root

```
<AuthProvider>              ← Global auth state (users, login, logout, loyalty)
  <VegModeProvider>         ← Global veg-only filter toggle
    <LoadingScreen />       ← Full-screen animated logo video on first load
    <BurgerCursor />        ← Custom cursor (desktop only, non-admin pages)
    <SmoothScroll>          ← Lenis smooth scrolling wrapper
      <ScrollToTop />       ← Auto-scrolls to top on route change
      
      {isAdmin ? (
        <AdminLayout />     ← Sidebar + outlet for admin routes
      ) : (
        <Navbar />          ← Sticky navigation bar
        <PageTransition>    ← Framer Motion page entrance/exit animations
          <Routes />        ← Public page routes
        </PageTransition>
        <Footer />          ← Site-wide footer
      )}
    </SmoothScroll>
  </VegModeProvider>
</AuthProvider>
```

### Routing Map

| Path | Component | Auth Required | Description |
|---|---|---|---|
| `/` | `Home` | No | Landing page with hero, picks, loyalty banner, story, gallery, reviews |
| `/menu` | `Menu` | No | Full interactive menu with filters, search, 3 view modes, Zomato links |
| `/gallery` | `GalleryPage` | No | Pinterest-style masonry photo gallery with lightbox |
| `/about` | `About` | No | Brand story, founding narrative, favourite picks showcase |
| `/contact` | `Contact` | No | Location, phone, WhatsApp, Instagram, Google Maps embed |
| `/loyalty` | `Loyalty` | No | Public QR loyalty program demo with interactive punch card |
| `/login` | `Login` | No | Email/password login + one-click demo login |
| `/signup` | `Signup` | No | Create account form |
| `/dashboard` | `Dashboard` | **Yes** | User loyalty card, order history, favourites |
| `/admin` | `AdminDashboard` | No* | Customer search by hash code |
| `/admin/orders` | `AdminOrders` | No* | All orders across all users with status management |
| `/admin/users` | `AdminUsers` | No* | Customer database table |
| `/admin/loyalty` | `AdminLoyalty` | No* | Manual stamp override per user |

*\*Admin routes are not auth-gated in this demo build. In production, they would be protected.*

---

## Global Features

### 1. Loading Screen (`LoadingScreen.jsx`)
On first page load, a full-screen `<video>` element plays the animated EM's logo intro (`/ANimatedlogo.mp4`). When the video ends, GSAP slides the entire loading screen upward to reveal the app underneath. Once the animation completes, the loading screen is removed from the DOM entirely (`isDone` state).

### 2. Custom Burger Cursor (`BurgerCursor.jsx`)
**Desktop only** (checks `pointer: fine` media query). Replaces the default mouse cursor with a branded circular ring that follows the mouse using Framer Motion spring physics. The cursor:
- Has a **leading dot** and a **trailing ring** with slightly softer spring physics for a lag effect
- **Grows and changes color** when hovering interactive elements (buttons, links)
- Animates a **squish effect** on mouse-down
- Is completely disabled on touch devices and admin pages

### 3. Smooth Scrolling (`SmoothScroll.jsx`)
Wraps the entire app in a `Lenis` instance for butter-smooth momentum scrolling with customizable lerp (linear interpolation).

### 4. Page Transitions (`PageTransition.jsx`)
Every route change triggers a Framer Motion `AnimatePresence` transition: pages fade in with a slight upward slide and fade out when leaving.

### 5. Scroll-to-Top (`ScrollToTop`)
A tiny utility inside `App.jsx` that calls `window.scrollTo(0, 0)` on every `pathname` change.

### 6. Global Pure Veg Mode (`VegModeContext.jsx`)
A site-wide toggle (visible in both desktop and mobile Navbar) that:
- Persists to `localStorage` under key `emBurger_vegOnly`
- When active, **every menu listing, gallery pin, and home page image** is filtered or swapped to show only vegetarian content
- The Navbar button turns green with a filled leaf icon
- The Menu page shows a green banner: "Global Pure Veg Mode is Active"
- The Gallery page filters out non-veg pins automatically

### 7. Sticky Navbar (`Navbar.jsx`)
- **Desktop**: Horizontal pill-shaped nav links (Home, Menu, Gallery, About, Contact, Loyalty Club), a "Pure Veg" toggle, user account dropdown, and "Order Online" Zomato button
- **Mobile**: Hamburger menu that animates open to reveal full-screen navigation
- **Logged-in state**: Shows user avatar initial, name, loyalty stamp count, and a dropdown with "My Dashboard" and "Log Out"
- **Logged-out state**: Shows "Log In" button; mobile shows side-by-side Login/Sign Up buttons
- "Loyalty Club" nav link is only shown when logged out (since logged-in users access it via Dashboard)

### 8. Footer (`Footer.jsx`)
Four-column responsive footer:
1. **Brand info** — Logo, tagline, Instagram/Zomato/Swiggy links
2. **Explore** — Quick links to all pages
3. **Visit Us** — Physical address, operating hours (12 PM – 11 PM), phone number (click-to-call)
4. **QR Loyalty Teaser** — Mini promotional card with CTA to the Loyalty page

---

## Public Pages (Customer-Facing)

### 1. Home Page (`/`)

The landing page is composed of 6 distinct sections stacked vertically:

#### 1a. Hero Section
- Full-viewport-height section with terracotta red background
- **Left**: Bold headline ("BURGERS BUILT TO HIT. CHEMBUR'S FINEST."), tagline about the menu, two CTA buttons:
  - "Explore Full Menu" (accent-colored, links to `/menu`)
  - "Locate Em's" (outline, links to `/contact#map`)
- **Right**: `InteractiveHeroFood` — A large food photo with **3D mouse-tilt** (Framer Motion `useMotionValue` + `useTransform`). On hover, ingredient info badges pop out in 3D space ("In-House Baked Bun", "Molten Cheddar")
- GSAP entrance: title words stagger in with `back.out(2)` easing

#### 1b. Signature Picks Strip
- Cream background section with a `WaveDivider` at the top
- Shows the first 4 items from `MENU_ITEMS` where `isSignature === true`
- Rendered as `MenuItemCard` components in a 4-column grid
- GSAP scroll-triggered stagger reveal for each card
- "View All Menu Items" link to `/menu`

#### 1c. Loyalty Banner Teaser
- Large terracotta card with accent (gold) border
- Headline: "BUY 9 BURGERS, GET THE 10TH FREE!"
- Mini stamp card visual preview (5 circles, 3 filled)
- CTA: "Try Loyalty Punch Card" → `/loyalty`
- Pulsing glow animation on the badge

#### 1d. Brand Vibe & Story Block
- Two-column layout: staggered food image grid (left) with parallax + clip-path scroll reveals, brand narrative (right)
- Highlights "Saucer UFO Burgers" and "Pure Veg & Non-Veg" in feature cards
- CTA: "Read Our Cafe Story" → `/about`
- Images swap to veg alternatives when Pure Veg Mode is active

#### 1e. Take Away Section
- Full mustard-yellow background, massive typography ("Quality That Travels With You")
- SVG dashed flight path with an animated **paper plane** that follows the path on scroll using GSAP `MotionPathPlugin`
- The path extends 220% of the section height for a long scrub

#### 1f. "Beyond The Burgers" Mini Gallery
- Two large storefront/kitchen photos in a 2-column grid
- Hover zoom effect

#### 1g. Customer Buzz Showcase
- Dark terracotta background with `WaveDivider`
- Three customer testimonial cards with 5-star ratings
- Quotes from fictional local customers

### Continuous Scroll Path
The entire Home page has a **subtle SVG sinuous line** drawn along the scroll using Framer Motion's `useScroll` + `useSpring`, creating a visual thread through the content.

---

### 2. Menu Page (`/menu`)

The most feature-rich page on the site.

#### Header & Filter Toggle
- Left-aligned "Menu" heading with an **"Options" button** on the right
- Clicking "Options" smoothly reveals/hides the entire filter control panel using Framer Motion `AnimatePresence` with height animation

#### Filter Controls (Hidden by Default)
When visible, the panel contains:
- **Category pill buttons**: All Items, Classic Burgers, Signatures, UFO Burgers, Croissant Takeover, Pull Me Up, Avocado Burgers, Slider Buckets, Sides & Salads, Cold Beverages, Hot Beverages — with animated `layoutId` marker on the active pill
- **Search bar**: Full-text search across item names and descriptions
- **View mode toggle**: Three icons (Grid / List / Physical Menu)
- **Dietary filter** (hidden if Global Veg Mode is active): All Options / Pure Veg / Non-Veg

#### Three View Modes

1. **Grid View** (default): 3-column grid on mobile, 3 on tablet, 4 on desktop. Each item is a `MenuItemCard` (see component reference)
2. **List View**: Single-column horizontal card layout, max-width 4xl
3. **Physical Menu View**: `PhysicalMenuLayout` — A 3D-flippable dark restaurant menu card:
   - Front side: Classic Burgers, Signatures, Avocado Burgers, UFOs, Croissant Takeover
   - Back side: Pull Me Up, Slider Buckets, Fries & Sides, Cold Beverages, Hot Beverages
   - Flip button toggles a `rotateY(180deg)` spring animation
   - Styled as a zinc-dark card with textured paper overlay, gold accent text

#### Empty State
If filters return no results, a "No dishes found" message is shown with a "Reset Filters" button.

---

### 3. Gallery Page (`/gallery`)

A **Pinterest-style masonry gallery** with 15 curated pins covering:
- Physical menu card photos (front & back)
- Pull Me Up cheese cascade, Thecha UFO Burger, Destroyed Fries, Meltdown, Croissant Takeover, Mac & Cheese, Truffle Fries, Veggie Avocado
- Cafe storefront & kitchen vibe shots
- Choco Blast Thickshake, Hot Chocolate

#### Features
- **Category tabs**: All Pins, Physical Menu Cards, Pull Me Up & UFOs, Classic Burgers, Sides & Drinks, Cafe Vibe
- **Search bar**: Filters by title, subtitle, or tag
- **Pure Veg Mode awareness**: Filters out non-veg pins when active
- **Save/Pin button**: Each card has a bookmark icon; toggle saves to a local `pinnedIds` state
- **Hover overlay**: Shows title, subtitle, and "Expand Pin" prompt
- **Lightbox modal**: Clicking any pin opens a two-column modal (large image left, details right) with tag, title, subtitle, description, "Explore On Menu" CTA, and save button
- **Masonry layout**: CSS `columns-1 sm:columns-2 md:columns-3 lg:columns-4` with varying `aspectRatio` classes per pin

---

### 4. About Page (`/about`)

Three overlapping card sections that cascade with a stacking animation on load:

#### Section 1: Hero Banner (Red, rounded-bottom)
- "Who We Are" badge, "About us" headline, tagline
- Three floating circular food photos (Pull Me Up, Destroyed Fries, Thecha) with hover-scale
- GSAP entrance: card slides down, then text staggers in, then images pop in with `back.out(1.4)`

#### Section 2: Story & Narrative (Dark Brown, overlapping rounded card, -mt-12)
- Left: Three overlapping circular/oval food images (Meltdown, Mac & Cheese, Classic Cheeseburger) with hover effects
- Right: Founding story text — mentions 18 October 2025 founding date, Mr. Manav Talwar, signature items
- Badges: "Founded Oct 18, 2025" and "Talwar Legacy"

#### Section 3: Favourite Picks (Mustard Yellow, overlapping rounded-top card, -mt-12)
- Horizontally scrollable row of 6 circular food cards (Pull Me Up, Destroyed Fries, Mac & Cheese, Thecha, Classic Cheese, Melt Down)
- Each card shows a badge (Legendary, Best-Seller, Must-Try, Fusion, Classic, Heavy) and "View Story" link
- Clicking any card opens a **dish detail modal** with a two-column layout: image left, story right, including a "Behind The Recipe" section with chef's inspiration text
- CTA: "Explore The Full Menu" → `/menu`

---

### 5. Contact Page (`/contact`)

Same three-card cascading animation pattern as About:

#### Section 1: Hero Banner (Red)
- "Get In Touch" badge, "Contact Us" heading
- Three floating food photos (Truffle Fries, Double Stack, Veggie Avocado)

#### Section 2: Info Grid (Dark Brown)
- Three contact cards:
  1. **Our Location**: Full address + "View On Google Maps" external link
  2. **Call & WhatsApp**: Phone number `+91 98200 98200` with "Click to Call" button and green WhatsApp button (`wa.me/` link)
  3. **Follow Us**: Instagram `@emschembur` link + description

#### Section 3: Map & Hours (Mustard Yellow, `id="map"`)
- `MapEmbed` component rendering a Google Maps iframe of the Chembur location
- Section auto-scrolls into view when the URL hash is `#map` (linked from hero "Locate Em's" button)

---

### 6. Loyalty Page (`/loyalty`)

Public-facing demo of the QR loyalty stamp card concept:

- Header: "EM'S BURGER CLUB PUNCH CARD"
- `LoyaltyPunchCard` component initialized with 3 stamps (interactive demo)
- **How It Works** section with 3 steps:
  1. Scan Table QR
  2. Order Any Burger
  3. Enjoy 10th FREE!

---

### 7. Login Page (`/login`)

- Rounded card form with email and password inputs (lucide icons inside)
- **"Mockup Client Demo" banner**: Explains this is a pre-seeded demo and offers a **One-Click Demo Login** button that instantly logs in as user `demo@emsburgers.com / demo1234` (Aditi Rao, 6 burger stamps, 2 beverage stamps, 4 order history items)
- **Error state**: Red error banner with shake animation (the entire form card shakes horizontally)
- **Success state**: Green checkmark with bounce animation, auto-redirect to `/dashboard` after 600ms
- Redirects to the originally-requested page via `location.state.from`
- Link to `/signup` at the bottom

---

### 8. Signup Page (`/signup`)

- Rounded card form with Full Name, Email, and Password inputs
- Validation: all fields required, password ≥ 4 characters
- On success: creates a new user in the users array (via `AuthContext.signup`), assigns 1 welcome stamp, redirects to `/dashboard`
- Duplicate email detection
- Same shake/success animations as login
- Link to `/login` at the bottom

---

### 9. User Dashboard (`/dashboard`)

**Protected route** — redirects to `/login` if not authenticated (via `RequireAuth` wrapper).

#### Welcome Banner
- Large terracotta card with accent border
- Displays user name (uppercase), **4-digit hash code** (displayed prominently in a dark monospace badge, e.g. `#1482`), and stamp progress
- Quick stats pill: `X/9 Stamps Collected` and `Y Past Orders`

#### Tab Navigation (`DashboardTabs`)
Three tabs: **My Loyalty** (default), **Previous Orders**, **My Favourites**

#### Tab 1: My Loyalty
- **Reward Unlocked Banner** (conditionally shown when stamps ≥ 9): Gold celebration card with "YOUR NEXT BURGER IS 100% FREE!" and a "Celebrate Again!" button that fires confetti
- **Dual Punch Card with 3D Flip**: A card container with `perspective: 2000px` and a `rotateY` spring animation:
  - **Front face**: Burger Club card — 10 stamp slots (9 + 1 free), "Simulate QR Scan" and "Reset" buttons
  - **Back face**: Beverage Club card — same layout but with coffee/cup theming
  - A "Flip" button toggles between the two faces
- Adding the 9th stamp triggers `canvas-confetti` with branded colors (`#D9412A`, `#F9E9C7`, `#F2B705`, `#2B1810`)

#### Tab 2: Previous Orders
- Grid of order cards (1 col mobile, 2 col desktop)
- Each card shows: Order ID, date, status badge (color-coded: green for delivered, etc.), line items with quantities and prices, total amount
- "Reorder Dish" button (simulated — shows "Added!" for 2 seconds)

#### Tab 3: My Favourites
- Grid of `MenuItemCard` components for items the user has hearted
- Empty state: "No Favourites Saved Yet" with instructions

---

## Admin Panel (`/admin`)

The admin panel is a completely separate layout from the customer-facing site. It uses `AdminLayout` which renders a sidebar + content area, and does **not** render the Navbar, Footer, or BurgerCursor.

### Admin Layout & Sidebar

- **Left sidebar** (desktop, `w-64`, dark background):
  - EM's logo + "Admin" heading with link back to store
  - Navigation links: Search, Orders, Customers, Loyalty Override
  - "Back to Store" link at the bottom
- **Top header bar**: "EM's Burger Management" title + logged-in user name
- **Scrollable content area**: Renders the child route via `<Outlet />`

### Admin Dashboard / Customer Search (`/admin`)

The default admin landing page is a **customer search interface**:
- Giant search input auto-focused on load: "Enter 4-digit hash #, name, or email..."
- Filters the `users` array in real-time by name, email, or hash code
- Each result card shows:
  - User avatar initial, name, **hash code badge** (monospace `#1482`)
  - Email
  - Burger stamps (`X/9`) with a **+1 stamp button** (EM's logo icon)
  - Beverage stamps (`X/9`) with a **+1 stamp button** (coffee icon)
  - "Manage" link → `/admin/loyalty`
- Background decorative doodles (faded lucide icons)
- Empty state shows a hash icon with "Start typing to search the database"

### Admin Orders (`/admin/orders`)

- Title: "Active Orders — Manage kitchen queue and delivery statuses"
- Aggregates all orders from all users into a single table, sorted by most recent date
- Table columns: Order ID (with date), Customer (name + email), Items (with quantities), Total (₹), Status badge, Actions
- **Status badges** are color-coded:
  - `pending` — Yellow
  - `preparing` — Blue
  - `out_for_delivery` — Orange
  - `delivered` — Green
- **Actions**: A `<select>` dropdown that lets the admin change order status. Changes are persisted via `adminUpdateOrderStatus()` in `AuthContext`

### Admin Customers (`/admin/users`)

- Title: "Customer Database — View registered users and their engagement metrics"
- Summary stat card: Total Customers count
- Table columns: Customer (avatar + name + email), Total Orders, Loyalty Stamps (burger + beverage), Favourites (rendered as pill tags)

### Admin Loyalty Override (`/admin/loyalty`)

- Title: "Loyalty Override — Manually assign stamps for walk-in customers or system corrections"
- Search bar to filter users by name or email
- Grid of user cards (1/2/3 columns responsive), each containing:
  - User name + email + avatar initial
  - **Burger Stamps**: Progress bar + minus/plus buttons (clamped 0–9)
  - **Beverage Stamps**: Progress bar + minus/plus buttons (clamped 0–9)
- Uses `adminUpdateUserLoyalty()` from `AuthContext`

---

## Reusable Components Reference

### `MenuItemCard.jsx`
The universal food item card used across the Menu, Signature Picks, and Dashboard Favourites.
- **Grid mode**: Vertical card with image (aspect-square on mobile, 4/5 on desktop), badge overlay, veg/non-veg indicator, heart favourite button, title, price badge, description (hidden on mobile), "Order on Zomato" link
- **List mode**: Horizontal card with square thumbnail
- **Heart button**: Logged-in users can toggle favourites. Non-logged-in users see a popover with "Log in to save your favourites!" and a CTA button
- **Zomato link**: Each item has a `zomatoLink` property — specific items link to their exact Zomato page, others use a placeholder URL
- **"Sample Image" overlay**: A small label in the bottom-left of every image indicating these are sample photos

### `LoyaltyPunchCard.jsx` / `CardFace`
A dual-purpose punch card component used on both `/loyalty` (demo mode) and `/dashboard` (dashboard mode):
- 10 circular stamp slots arranged in a 5-column grid
- Stamps fill from left to right; the 10th slot is always the "FREE" star slot
- **Demo mode** (Loyalty page): Clicking individual slots adds/removes stamps
- **Dashboard mode**: "Simulate QR Scan" button adds stamps sequentially; "Reset" button clears all
- Each stamp animates in with a pop `scale(1.5)` and a floating emoji particle effect
- The 10th slot shows a pulsing gold star icon
- `CardFace` renders one face (burger or beverage), used twice inside a 3D flip container

### `PhysicalMenuLayout.jsx`
A 3D-flippable card that replicates the real EM's physical menu card:
- Dark zinc background with subtle paper texture
- Two-column text layout listing items with names, descriptions, veg/non-veg indicators, badges, and prices
- Spring animation flip between front and back
- Respects Pure Veg Mode filter

### `InteractiveHeroFood.jsx`
The hero image with mouse-driven 3D tilt:
- Uses `useMotionValue` for mouse position tracking
- `useTransform` converts mouse offset to `rotateX`/`rotateY` (±15°)
- `useSpring` smooths the motion
- On hover: floating ingredient badges appear with spring animations in 3D space (translateZ)

### `BurgerCursor.jsx`
Custom cursor with:
- Two concentric elements: leading dot + trailing ring
- Spring-physics following with offset damping
- Scales up when hovering interactive elements
- Squish effect on click
- Disabled on touch devices and admin routes

### `LoadingScreen.jsx`
Full-screen video splash that plays `ANimatedlogo.mp4`, then GSAP slides the screen away.

### `WaveDivider.jsx`
SVG wave separator between sections. Takes `fillClass` and `position` (top/bottom) props.

### `SignaturePicksStrip.jsx`
Filters `MENU_ITEMS` by `isSignature` flag, shows first 4 items in a grid.

### `LoyaltyBanner.jsx`
Promotional banner on the home page for the loyalty program.

### `TakeAwaySection.jsx`
Scroll-driven plane animation section using GSAP MotionPathPlugin.

### `Gallery.jsx`
Minimal 2-photo gallery used on the Home page.

### `MapEmbed.jsx`
Google Maps iframe embed for the Chembur location.

### `DashboardTabs.jsx`
Tab bar component for the user dashboard (Loyalty / Orders / Favourites).

### `BouncyButton.jsx`
Reusable animated button with hover/tap spring effects. Takes `variant` (accent/outline) and `size` (large/medium) props.

### `Logo.jsx`
Brand logo component using the `/logoo.svg` file. Takes `variant` and `size` props.

### `PageTransition.jsx`
Framer Motion wrapper that provides fade + slide animations for route transitions.

### `SmoothScroll.jsx`
Lenis smooth scrolling provider.

### `RequireAuth.jsx`
Route guard component that redirects to `/login` if `currentUser` is null.

### `ScrollProgressMascot.jsx`
A scroll progress indicator component (available but not actively mounted in current routes).

---

## Context Providers (State Management)

### `AuthContext.jsx`

The central state management for the entire application. Provides:

#### State
- `users` — Array of all registered users (persisted to `localStorage` under `ems_users`)
- `currentUser` — Currently logged-in user or `null` (persisted to `localStorage` under `ems_current_user`)

#### User Actions
| Function | Description |
|---|---|
| `login(email, password)` | Finds user by email+password in the users array. Returns `{ success, message }` |
| `loginAsDemo()` | Instant login as the demo user (Aditi Rao) |
| `signup(name, email, password)` | Creates new user with unique ID, random 4-digit hash code, 1 welcome stamp |
| `logout()` | Sets `currentUser` to `null`, clears session from localStorage |
| `toggleFavourite(itemId)` | Adds/removes a menu item ID from the user's `favourites` array |
| `updateLoyaltyPoints(n)` | Sets burger stamps (clamped 0–9) |
| `updateBeveragePoints(n)` | Sets beverage stamps (clamped 0–9) |

#### Admin Actions
| Function | Description |
|---|---|
| `adminUpdateUserLoyalty(userId, points, type)` | Sets a specific user's burger or beverage stamps |
| `adminUpdateOrderStatus(userId, orderId, status)` | Changes an order's status (pending → preparing → out_for_delivery → delivered) |

#### Exposed Values
`currentUser`, `users`, `login`, `loginAsDemo`, `signup`, `logout`, `toggleFavourite`, `updateLoyaltyPoints`, `updateBeveragePoints`, `adminUpdateUserLoyalty`, `adminUpdateOrderStatus`, `isDemoAccount`

### `VegModeContext.jsx`

Simple boolean toggle persisted to `localStorage` under `emBurger_vegOnly`.

Exposed: `isVegOnly`, `setIsVegOnly`, `toggleVegMode`

---

## Data Layer (`src/data/menu.js`)

### `MENU_CATEGORIES`

An array of 11 category objects:

```
All Items, Classic Burgers, Signatures, UFO Burgers,
Croissant Takeover, Pull Me Up, Avocado Burgers,
Slider Buckets, Sides & Salads, Cold Beverages, Hot Beverages
```

### `MENU_ITEMS`

An array of ~40+ menu items, each with:

```js
{
  id: "classic-cheeseburger-chicken",   // Unique kebab-case ID
  zomatoLink: "https://...",            // Direct Zomato deep link or placeholder
  name: "The Classic Cheeseburger (Chicken)",
  category: "classic",                  // Matches MENU_CATEGORIES id
  isVeg: false,                         // Boolean for dietary filtering
  isSignature: true,                    // Featured on Home page picks
  description: "Juicy chicken patty...",
  price: 329,                           // Price in ₹ (INR)
  image: "/assets/The classic cheeseburger.png",
  badge: "Bestseller"                   // Optional: Bestseller, Chef's Pick, Spicy, etc.
}
```

**Categories of items include**:
- Classic Burgers (chicken & veg variants)
- Signature Burgers (Spicy Chicken Smasher, UFO, Thecha, Meltdown, etc.)
- UFO Burgers (press-sealed saucer-shaped burgers)
- Croissant Takeover (burger in croissant shell)
- Pull Me Up (cheese fondue cascade burgers)
- Avocado Burgers
- Slider Buckets (3/6/9/12 piece options)
- Sides (Destroyed Fries, Truffle Fries, Salted Fries, Peri Peri Fries, Mac & Cheese, Chicken Tenders, Em's House Salad)
- Cold Beverages (shakes, boba, iced tea, lemonades)
- Hot Beverages (Americano, Cappuccino, Hot Chocolate)

---

## Demo Accounts & Mock Data

The app ships with 3 pre-seeded demo users (created in `AuthContext.jsx` when no localStorage data exists):

| Name | Email | Password | Hash Code | Burger Stamps | Beverage Stamps | Orders |
|---|---|---|---|---|---|---|
| Aditi Rao | `demo@emsburgers.com` | `demo1234` | `#1482` | 6/9 | 2/9 | 4 delivered orders |
| Rahul Verma | `rahul@emsburgers.com` | `password` | `#9274` | 3/9 | 5/9 | 1 preparing order |
| Sneha Patel | `sneha@emsburgers.com` | `password` | `#5821` | 9/9 | 9/9 | 1 pending order |

New users can be created via the Signup page and are persisted to `localStorage`.

---

## Animations & Motion

The site uses a deliberate two-library animation strategy:

### GSAP (Scroll-triggered, timeline, path)
- **ScrollTrigger reveals**: Story section text staggers, image clip-path reveals, card entrance animations
- **Parallax**: Story images move at different scroll rates
- **MotionPath**: Paper plane follows SVG path on scroll in TakeAway section
- **Loading screen**: `yPercent: -100` slide-up
- **About/Contact pages**: Three-card cascading entrance timeline with overlapping delays
- All GSAP animations check `prefers-reduced-motion` and skip if active

### Framer Motion (Layout, interaction, presence)
- **AnimatePresence**: Page transitions, menu filter panel toggle, tab content switching, modals
- **layout**: Smooth item reflow when filters change
- **3D tilt**: Hero food card with spring-physics mouse tracking
- **3D flip**: Loyalty punch card burger↔beverage flip, Physical menu card front↔back flip
- **Micro-interactions**: Button hover/tap springs, heart favourite pop, stamp punch pop, shake animation on login error
- **whileInView**: MenuItemCard entrance animation

---

## Responsive Design & Mobile Optimizations

The site is fully responsive with specific mobile optimizations:

### Menu Page
- **3-column grid** on mobile (vs 4 on desktop) with extremely compact cards
- Item names truncated to 2 lines; descriptions hidden on mobile
- Badge text reduced to 8px; price badge compact
- "Order on Zomato" button shortened to just "Zomato"
- Filter panel hidden behind an "Options" toggle button

### Navbar
- Desktop: Horizontal pill nav + veg toggle + user dropdown + order button
- Mobile: Hamburger → full-screen overlay with stacked links, user card, veg toggle, and Order on Zomato CTA

### Gallery
- Masonry columns: 1 → 2 → 3 → 4 across breakpoints

### General
- All padding/margins use responsive `sm:` / `md:` / `lg:` prefixes
- Border radius reduces on mobile (`rounded-xl` → `rounded-3xl`)
- Font sizes scale appropriately across breakpoints
- Touch-friendly tap targets (min 44px where applicable)
- BurgerCursor disabled on touch devices
- Veg indicator icons and badges scale down on mobile
