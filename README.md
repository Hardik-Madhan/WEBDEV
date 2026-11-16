# CareSure - Caregiver Booking Platform
A clean, modular web application clearly divided into **frontend** and **backend**.

---

## 📁 Repository Structure

```text
WEB DEV/
├── frontend/                  # 🖥️ CLIENT-SIDE (HTML, CSS, JS)
│   ├── index.html             # Homepage
│   ├── find.html              # Find Caregivers & 5-Step Booking Modal
│   ├── dashboard.html         # User Dashboard
│   ├── caretaker.html         # Caregiver Application form
│   ├── contact.html           # Emergency & Contact page
│   ├── login.html & signup.html
│   ├── styles/                # CSS Stylesheets (main.css, find.css, home.css, dashboard.css)
│   ├── scripts/               # Client JavaScript (find.js, dashboard.js, auth.js, main.js)
│   ├── images/                # Images, photos, and logo.svg
│   └── data/                  # Client-side data copy
│
├── backend/                   # ⚙️ SERVER-SIDE (Node.js & JSON DB)
│   ├── server.js              # Native Node.js REST API & static file server
│   ├── package.json           # Backend runner
│   └── data/                  # Local JSON Database
│       ├── caretakers.json    # 8 Caretaker profiles
│       ├── bookings.json      # Confirmed bookings
│       ├── contacts.json      # Contact inquiries
│       └── users.json         # User credentials & profiles
│
└── package.json               # Root launcher ("npm start")
```

---

## 🚀 How to Run

Open terminal in the root folder and run:
```powershell
node backend/server.js
```
or
```powershell
npm start
```
Then visit: **`http://localhost:3000`** in your browser.
