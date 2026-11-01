# Genealogy client

React and Vite frontend for the family tree. Signed-in members complete a profile before using the app. They can request member additions and name corrections; admins review requests and manage user roles in the Admin dashboard.

## Environment

Keep Firebase client settings in `.env.local`.

- `VITE_API_URL`: optional backend override. The default is `https://genealogy-server.onrender.com`; set `http://localhost:2000` for local backend development.

Configure `FIREBASE_PROJECT_ID`, `GENEALOGY_ADMIN_EMAIL`, and `IMGBB_API_KEY` in the backend environment as described in the server README. The Imgbb key stays server-side.

## Run

```sh
npm install
npm run dev
```
