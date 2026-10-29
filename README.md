# Northstar — Independent Digital Studio

A responsive studio website built with plain HTML, CSS, and JavaScript. The navigation is a lightweight hash-routed, multi-view experience contained in one `index.html`. Contact enquiries are validated in the browser and saved by the included Node.js server to `data/messages.json`.

## Run locally

Requires Node.js 18 or newer. No packages or build step are needed.

```sh
node server.js
```

Open [http://localhost:3000](http://localhost:3000). Set `PORT` to use another port.

## Features

- Responsive Home, About, Work, and Contact views with shared navigation.
- Mobile navigation, project category filters, and live form feedback.
- Required fields, custom validation messages, email format checks, and a live message counter.
- Contact form submissions are sent to `POST /api/contact`, validated again by Node, and appended to `data/messages.json`.
- No third-party runtime dependencies. Google Fonts are optional; system fallbacks are included.

## Data

Submitted messages are stored locally in `data/messages.json`. Keep this file out of public hosting if you collect real contact information. The included JSON file starts empty.
