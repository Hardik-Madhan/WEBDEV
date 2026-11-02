# Web Development Project - CareSure

This project is divided into **two complete options** to satisfy different evaluation and presentation requirements:

---

## 📁 Option 1: Modern Full-Stack (Next.js & TypeScript)
Located in: **[`Option-1-NextJS/`](./Option-1-NextJS)**

- **Architecture**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Node.js filesystem API.
- **Separation of Concerns**: Each page has dedicated files:
  - **CSS Stylesheet** (`*.css`)
  - **JavaScript Logic & Validation** (`*.logic.ts`)
  - **HTML Structure Component** (`page.tsx`)
- **How to run**:
  ```bash
  cd Option-1-NextJS
  npx.cmd pnpm dev
  ```
  Open: **`http://localhost:3000`**

---

## 📁 Option 2: Pure HTML, Pure CSS, Pure JavaScript & JSON Database
Located in: **[`Option-2-Pure-HTML-CSS-JS/`](./Option-2-Pure-HTML-CSS-JS)**

- **Architecture**: Traditional web development with 100% pure `.html`, `.css`, and `.js` files.
- **Pages**:
  - `index.html` (Homepage & Care Showcase)
  - `about.html` (About Us & Guiding Principles)
  - `find.html` (Caretaker Directory, Filter Sliders, List/Map View & 5-Step Booking Wizard)
  - `contact.html` (Contact Us Form with Real-Time Input Validation)
  - `caretaker.html` (Become a Caretaker Multi-Section Application with Photo Upload)
  - `login.html` & `signup.html` (Authentication with Password Confirmation Check)
  - `dashboard.html` (User Control Center with Bookings Records and Expandable Details)
- **Styling**: Pure CSS stylesheets in [`styles/`](./Option-2-Pure-HTML-CSS-JS/styles).
- **Interactivity**: Pure JavaScript modules in [`scripts/`](./Option-2-Pure-HTML-CSS-JS/scripts).
- **Database**: Form submissions write directly to local JSON files in [`data/`](./Option-2-Pure-HTML-CSS-JS/data) (`contacts.json`, `users.json`, `bookings.json`, `sessions.json`, `caretaker-applications.json`).
- **How to run**:
  ```bash
  cd Option-2-Pure-HTML-CSS-JS
  node server.js
  ```
  Open: **`http://localhost:3000`**
