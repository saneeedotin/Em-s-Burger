# 🍔 EM'S BURGERS — Digital Flagship & Operating System (v5.0)

> **Release Version**: `v5.0`  
> **Release Date**: `29 Aug 2026`  
> **Location**: Chembur, Mumbai  
> **Status**: Production-Ready & Customer-Facing  

---

![EM'S Burgers Full Experience](./fullpage.png)

---

## 🌟 Executive Overview

**EM'S BURGERS** is an artisanal, ultra-fast, and responsive digital dining platform built for Chembur's beloved gourmet burger kitchen. It bridges an unforgettable editorial customer experience with an enterprise-grade, real-time kitchen operations dashboard.

From interactive **3D-flippable loyalty punch cards** and **instant table QR ordering** to a **live kitchen queue with audio alerts** and **universal EMCODE customer lookup**, EM'S delivers a seamless food-tech ecosystem.

---

## 📸 Visual Showcase

| Universal Customer Search & Dual Stamps | Live Kitchen Orders Queue |
| :---: | :---: |
| ![Admin Search](./docs/screenshots/admin-search.png) | ![Admin Orders](./docs/screenshots/admin-orders.png) |

---

## 🛠️ Complete Technology Stack

```
   ┌─────────────────────────────────────────────────────────────────┐
   │                       EM'S BURGERS (v5.0)                       │
   ├───────────────────┬─────────────────────────┬───────────────────┤
   │     FRONTEND      │       ANIMATIONS        │  BACKEND & CLOUD  │
   │  React 18 (SPA)   │   GSAP 3 + ScrollTrigger│  Firebase Auth    │
   │  Vite 6           │   Framer Motion         │  Cloud Firestore  │
   │  Tailwind CSS     │   Lenis Smooth Scroll   │  Firebase Storage │
   │  Lucide React     │   Canvas Confetti       │  Scoped Rules     │
   └───────────────────┴─────────────────────────┴───────────────────┘
```

### Core Technologies
- **UI Framework**: React 18 with modern functional components & custom hooks.
- **Build Tool**: Vite 6 (sub-second HMR, optimized production chunking).
- **Styling**: Tailwind CSS with tailored brand tokens (`#C8102E` Crimson, `#FFC72C` Mustard Gold, `#2B1810` Dark Chocolate, `#FFFDF7` Cream).
- **Motion & Physics**:
  - **GSAP 3 & ScrollTrigger**: Editorial headline reveals, parallax image floating, and timeline animations.
  - **Framer Motion**: Gesture-driven modal physics, multi-layer colored curtain transitions, and spring cards.
  - **Lenis**: Hardware-accelerated smooth inertia scrolling.
- **Backend & Cloud Infrastructure**:
  - **Firebase Authentication**: Google OAuth One-Tap sign-in + Email/Password with auto-recovery.
  - **Cloud Firestore**: Sub-100ms real-time data synchronization with scoped security rules.
  - **In-Browser Image Compression**: HTML5 Canvas engine converting photos to lightweight WebP files (<100KB) directly before Firestore storage.
- **Icons & Typography**: Lucide React, Google Fonts (`Outfit`, `Plus Jakarta Sans`, `Cabinet Grotesk`).

---

## ✨ Key Features & Capabilities

### 1. 🍔 Digital Menu & Smart Dining Modes
- **Dine-In Table QR Ordering**: Scan Table QR codes (`/table/1` to `/table/20`) to pin table numbers directly to live orders.
- **Reception Pick-Up Mode**: Order directly from counter or phone with auto-generated receipt tokens (`#EM-1001`).
- **Pure Veg Toggle**: Instant global vegetarian filter persisted in local session.
- **Special Custom Requests**: Add preparation notes per order (e.g., *"Extra jalapeños, crisper patty"*).

### 2. 🥤 Dual-Track Loyalty Punch Card System
- **🍔 Burger Club (0–10 Stamps)**: Every burger purchased earns 1 stamp. **10th Burger is 100% Free**.
- **🥤 Beverage Club (0–10 Stamps)**: Every shake or beverage earns 1 stamp. **10th Drink is 100% Free**.
- **3D Card Flip**: Interactive physical card flip in Customer Dashboard to toggle between Burger and Beverage punch cards with holographic foil gradients.
- **Instant Admin Override**: Single-click `+` / `-` stamp adjustment from universal customer search and dedicated loyalty screen.

### 3. ⏱️ 10-Minute Kitchen Timeout & Automatic Cart Recovery
- If an order is not approved by kitchen staff within **10 minutes (600s)**, the system:
  1. Safely archives the active pending request.
  2. Automatically **restores all items, quantities, and custom instructions** into the customer's cart.
  3. Displays a helpful alert guiding them to re-order or adjust.

### 4. 🎮 "While-You-Wait" Burger vs. Fries Arcade
- When an order transitions to `preparing`, customers are routed to the **While You Wait** suite.
- Features a **Tic-Tac-Toe minigame (🍔 vs 🍟)** with interactive win detection.
- **Privacy-Enforced**: Live cooking token and progress are strictly visible only to the verified order owner; guests and visitors see a clean arcade mode with zero leakage.

### 5. 🔔 Floating Real-Time Navbar Pill
- Persistent, non-intrusive floating pill across all pages showing current order stage:
  - 🟡 **Pending Confirmation** (with 10-min countdown)
  - 🔵 **Preparing in Kitchen** (animated chef hat)
  - 🟢 **Food is Ready** (pickup bell)
  - 🎉 **Order Delivered Celebration** (auto-dismiss and celebratory toast)

### 6. 🛡️ Master Admin Operations Dashboard
- **Universal Customer Search**: Instant search by `EMCODE` (e.g. `1015` or `EM1015`), name, or email with immediate dual stamp controls.
- **Live Orders Queue**: Real-time order stream with stage filters (`Pending`, `Preparing`, `Ready`, `Delivered`, `Rejected`), manual order generator, and order editor.
- **Live Active Carts Monitor**: Live peek into items customers are currently adding to carts in real time before checkout.
- **Menu Management CRUD**: Add, edit, or delete items and categories with automatic in-browser image compression.
- **Table QR Generator**: Auto-generate scannable, downloadable, printable QR cards for tables 1 through 20.
- **Customer Database CRUD**: Ban/unban accounts, modify profile credentials, and perform deep multi-document purges.
- **Review Moderation**: Approve, highlight, or delete customer reviews in real time.

---

## 🔄 System Architecture & Flow

### Food Ordering & Real-Time Kitchen Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant App as EM'S Client App
    participant DB as Cloud Firestore
    actor Kitchen as Admin / Kitchen Staff

    Customer->>App: Scan Table QR or Browse Menu
    App->>DB: Sync Live Cart (live_carts collection)
    Kitchen->>App: Monitor Live Active Carts
    Customer->>App: Place Order (Table / Reception)
    App->>DB: Create Document in `orders` (status: 'pending')
    DB-->>Kitchen: Real-Time Order Stream with Chime
    Note over App: 10-Min Timer Starts (Auto-restore if unconfirmed)
    Kitchen->>DB: Accept Order (status: 'preparing')
    DB-->>App: Real-Time onSnapshot Event
    App->>Customer: Auto-route to /while-you-wait & Activate Floating Pill
    Kitchen->>DB: Mark Ready (status: 'ready')
    DB-->>App: Update Floating Pill & Waiting Status ("Food Ready!")
    Kitchen->>DB: Mark Delivered (status: 'delivered')
    DB-->>App: Trigger Celebration Toast -> Auto-Return to Home
```

---

## 🔐 Authentication & Unique EMCODE Engine

1. **Guaranteed Sequential EMCODEs (`EM1001`, `EM1002`, ...)**:
   - On signup or Google OAuth sign-in, the system queries the highest existing numeric ID and executes an atomic Firestore transaction against `metadata/user_counter`.
   - **Startup Deduplication**: Automatically detects any colliding legacy accounts and re-indexes them to unique sequential IDs.
2. **Role-Based Access Control (RBAC)**:
   - Protected routes (`<RequireAdmin>`, `<RequireAuth>`) restrict admin interfaces to authorized master credentials.
   - Fine-grained Firestore Security Rules validate document writes across all collections (`profiles`, `orders`, `live_carts`, `menu_items`, `reviews`, `metadata`).

---

## 🧭 New Customer Journey Experience

```
   1. LANDING & VIBE
      ├── Cinematic Animated Splash Screen (Smooth auto-wipe)
      ├── Melt Mode & Interactive Custom Burger Cursor
      └── Parallax Brand Story ("Beyond The Burgers")

   2. DIGITAL ORDERING
      ├── Select Dining Mode (Table QR / Reception Pickup)
      ├── Browse Handcrafted UFO Burgers, Shakes, & Fries
      └── Add Custom Cooking Requests & Checkout

   3. WAITING & FUN
      ├── Auto-Transition to /while-you-wait upon Kitchen Approval
      ├── Play Burger vs. Fries Tic-Tac-Toe
      └── Monitor Live Floating Navbar Pill while browsing

   4. PICKUP & REWARDS
      ├── Real-Time Notification when Food is Ready
      ├── Earn Burger Stamps (10th Free) + Beverage Stamps (10th Free)
      └── Flip 3D Holographic Card in Dashboard to view reward status
```

---

## 🚀 How to Run Locally & Deploy

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- A Firebase project with Firestore, Authentication, and Storage enabled.

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/ems-burger.git
cd ems-burger
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

*(See `.env.example` for reference)*

### 3. Deploy Firestore Security Rules
Ensure secure collection access by deploying `firestore.rules`:
```bash
firebase deploy --only firestore:rules
```

### 4. Start Local Development Server
```bash
npm run dev
```
The app will be available at: **`http://localhost:3001`** (or `http://localhost:5173`).

### 5. Build for Production
```bash
npm run build
```
The optimized, minified production bundle will be generated in the `dist/` directory, ready to deploy to **Firebase Hosting**, **Vercel**, **Netlify**, or **Cloudflare Pages**.

---

## 📂 Project Directory Structure

```
Z:\Projects\EmsBurger\
├── docs/                        # Project documentation & visual showcases
│   └── screenshots/             # High-resolution screenshots for README
├── public/                      # Static assets & optimized WebP media
│   ├── assets/                  # High-res transparent burger imagery
│   ├── ANimatedlogo.mp4         # Cinematic preloader animation
│   └── logo.svg                 # Vector brand logos
├── src/
│   ├── components/              # Modular UI components (Hero, Navbar, Curtains, etc.)
│   ├── context/                 # State management (Auth, Cart, ActiveOrder, Menu)
│   ├── data/                    # Default menu catalog & fallback data
│   ├── pages/                   # Customer-facing views (Home, Menu, Dashboard, etc.)
│   │   └── admin/               # Admin OS (Search, Orders, Users, Loyalty, Menu, QR)
│   ├── utils/                   # Image compression & helper utilities
│   ├── App.jsx                  # Application routing & transition shell
│   ├── main.jsx                 # React root entry point
│   └── index.css                # Tailwind CSS layers & bespoke animation rules
├── unused/                      # Cleaned archive of unused media & scratch drafts
├── .env.example                 # Environment variables blueprint
├── firestore.rules              # Scoped Firestore collection security rules
├── package.json                 # Project dependencies & build scripts
├── tailwind.config.js           # Theme extensions & brand color palettes
└── vite.config.js               # Vite bundler & dev server configuration
```

---

## 👨‍🍳 Master Admin Credentials

- **Admin Login Route**: `/login`
- **Email**: `admin@emsburgers.com`
- **Default Access**: Full operational control over live orders, customer loyalty stamps, menu catalogs, and QR generators.

---

<div align="center">
  <strong>Handcrafted with ❤️ for EM'S Burgers — Chembur, Mumbai</strong><br />
  <sub>Built to Hit. Built to Melt.</sub>
</div>
