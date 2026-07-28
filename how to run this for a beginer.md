# How to Run This Project for a Beginner

## 1. Install Node.js
Make sure Node.js is installed on your computer.

- Download Node.js from: https://nodejs.org/
- Install the LTS version
- After installation, open a terminal and check:

```bash
node -v
npm -v
```

## 2. Open the Project Folder
Open the project folder in VS Code or your terminal.

Example:

```bash
cd z:\Projects\EmsBurger
```

## 3. Install the Project Packages
Run this command:

```bash
npm install
```

This installs everything the project needs to work.

## 4. Start the App
Run:

```bash
npm run dev
```

## 5. Open the App in Your Browser
After the command starts, Vite will show a local address like:

```text
http://localhost:5173
```

Open that link in your browser.

## 6. If Something Goes Wrong
- Make sure Node.js is installed correctly
- Make sure you are in the project folder
- Try running:

```bash
npm install
```

## 7. Build for Production (Optional)
If you want a ready-to-upload version of the site, run:

```bash
npm run build
```

This creates a production folder that can be used for deployment.
