# CareSure prototype

Run locally with Node.js and pnpm:

```sh
pnpm install --frozen-lockfile
pnpm dev --hostname 127.0.0.1
```

Open the local address printed by Next.js. Create a family account to save caretaker profiles and booking requests. An account can also submit a caretaker application; its unverified profile appears in the local directory, and requests for it appear under **Care requests** in that account's dashboard.

This is a single-computer prototype, not a production service. Accounts, requests, applications, and uploaded images are stored in the ignored `data/` folder on the server; uploads are not encrypted. Use sample details and images rather than real identity documents or sensitive information. There is no verification, email delivery, notification, messaging, payment processing, real-time availability, geolocation, or emergency dispatch. The bundled caretaker profiles and map are examples. Local JSON storage is not designed for multi-process deployments or multiple servers.
