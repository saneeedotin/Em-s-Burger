# 📋 EM'S BURGERS — Post-Hosting & Production Launch To-Do List

> **Target Release**: Production Launch  
> **Repository**: `Z:\Projects\EmsBurger`  
> **Last Updated**: `29 Aug 2026`  

---

## 🌐 1. Custom Domain & Google OAuth Branding (High Priority)

- [ ] **Connect Custom Domain to Firebase Hosting**
  - Go to [Firebase Console](https://console.firebase.google.com/project/ems-burgers-200826/hosting) -> **Hosting** -> **Add Custom Domain** (e.g., `emsburgers.com` or `order.emsburgers.com`).
  - Add the DNS records (A / TXT / CNAME) to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.).
  - Wait for SSL certificate verification (~15-30 mins).

- [ ] **Switch Google Sign-In "To Continue To" Domain**
  - Go to [Firebase Console — Authentication](https://console.firebase.google.com/project/ems-burgers-200826/authentication/settings) -> **Settings** -> **Authorized Domains**.
  - Add your custom domain (`emsburgers.com`).
  - Update production environment variable:
    ```env
    VITE_FIREBASE_AUTH_DOMAIN=emsburgers.com
    ```

- [ ] **Update Google OAuth Redirect URI**
  - Open [Google Cloud Console — Credentials](https://console.cloud.google.com/apis/credentials?project=ems-burgers-200826).
  - Click on **Web client (auto created by Google Service)**.
  - Under **Authorized redirect URIs**, add:
    ```text
    https://emsburgers.com/__/auth/handler
    ```
  - Under **Authorized JavaScript origins**, add:
    ```text
    https://emsburgers.com
    ```
  - Click **Save**.

- [ ] **Publish OAuth Consent Screen**
  - In [Google Cloud Console — Branding](https://console.cloud.google.com/auth/branding?project=ems-burgers-200826), ensure:
    - App Name: `EM'S BURGERS`
    - App Logo: Upload `/public/logo.svg` or `/public/assets/Meltdown_transparent.png`
    - Authorized Domain: `emsburgers.com`
  - In **Audience**, switch publishing status from **Testing** to **In Production** so any customer can sign in with their personal Google account without restrictions.

---

## 🔒 2. Database Security & Performance

- [ ] **Deploy Scoped Firestore Security Rules**
  - Run the CLI command:
    ```bash
    firebase deploy --only firestore:rules
    ```
  - Confirm in Firebase Console that `profiles`, `orders`, `live_carts`, `menu_items`, `reviews`, and `metadata` rules are active and green.

- [ ] **Verify Firestore Automatic Indexes**
  - Verify queries sorting orders by `created_at` descending in `/admin/orders`.

---

## 🪧 3. In-Store Table QR & Kitchen Deployment

- [ ] **Print In-Store Table QR Codes**
  - Visit `/admin/qr` on desktop.
  - Print QR stands or sticker tent cards for **Tables 1 through 20**.
  - Test scan each table QR code on mobile camera to ensure it opens `/table/:id` directly.

- [ ] **Set Up Kitchen Reception POS / Tablet**
  - Open `/admin/orders` on the kitchen reception iPad or tablet.
  - Ensure speaker volume is turned up to hear real-time sound chimes when customers place orders.

---

## 📱 4. Mobile & Social Sharing (OpenGraph)

- [ ] **Test Social Preview on WhatsApp & Instagram**
  - Share link `https://emsburgers.com` on WhatsApp/iMessage to verify logo thumbnail, title, and description preview.

- [ ] **Staff Bookmarks**
  - Bookmark `https://emsburgers.com/admin` on manager and staff devices for 1-tap customer lookup and loyalty overrides.

---

<div align="center">
  <sub>EM'S Burgers — Chembur, Mumbai • Production Checklist</sub>
</div>
