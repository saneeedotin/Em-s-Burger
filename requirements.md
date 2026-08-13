# Project Requirements & Setup

This guide details the technical requirements and instructions needed to run the EMS Burger project on any local machine.

## 1. System Requirements

- **Node.js**: Version 18.x or higher is strongly recommended.
- **npm**: Node Package Manager (comes bundled with Node.js).
- **Browser**: Any modern web browser (Chrome, Firefox, Safari, Edge).

## 2. Dependencies
All project dependencies are managed via `package.json`. Key libraries include:
- `react`, `react-dom`, `react-router-dom`
- `framer-motion` & `gsap` (for animations)
- `tailwindcss` (for styling)
- `lucide-react` (for icons)

## 3. How to Run Perfectly Without Errors

Follow these steps exactly to avoid the "red screen" (Vite Error Overlay) that happens when dependencies are missing or misconfigured.

### Step 1: Clone and Open
Open your terminal and navigate to the project directory:
```bash
cd path/to/EmsBurger
```

### Step 2: Install Packages (CRITICAL)
You must install the Node packages before running the server. Do not skip this!
```bash
npm install
```

### Step 3: Start the Development Server
Once installed, start Vite:
```bash
npm run dev
```

### Step 4: Open in Browser
Visit the URL provided in your terminal, which is usually:
```text
http://localhost:3001
```

## 4. Troubleshooting

**Why am I seeing a Red Screen?**
- You did not run `npm install`.
- A dependency failed to install correctly. Try deleting the `node_modules` folder and running `npm install` again.
- You are using a very old version of Node.js. Upgrade to Node 18 or newer.
- You are on a Mac/Linux and there is a case-sensitivity issue in imports (Windows is case-insensitive, but Unix is not). Ensure your file names exactly match the `import` statements in the code.

**Port 3001 is in use:**
Vite will automatically try the next port (like 3002 or 5173). Check the terminal output for the correct link.
