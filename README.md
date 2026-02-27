# Train Schedule (Mobile App)

Mobile client for the **Train Schedule** application: React Native (Expo) app for viewing and filtering train schedules, managing favorites, and (for admins) creating and editing schedules. Uses the Train Schedule API backend and receives real-time updates via WebSocket.

## Project overview

- **Authentication** — Login and register; JWT stored securely; refresh and logout.
- **Schedules** — List with filters (date range, route name, train type); schedule detail; real-time updates when backend changes.
- **Favorites** — Add/remove favorites from schedule cards; dedicated Favourites tab.
- **Admin** — Create, edit, and delete schedules (admin role); form validation with React Hook Form + Zod.
- **UI** — Bottom tabs (Schedules / Favourites); stack screens for filter, detail, settings, new-schedule.

## Tech stack

- **React Native** + **Expo** (SDK 54)
- **Expo Router** (file-based routing)
- **TypeScript**
- **Redux Toolkit** (auth state, persistence)
- **TanStack React Query** (API data, cache invalidation)
- **React Hook Form** + **Zod** (form validation)
- **Axios** (HTTP client, interceptors, refresh token)
- **Socket.IO client** (real-time schedule events)
- **ESLint** + **Prettier**

## Prerequisites

- Node.js 18+
- npm
- Expo Go (device) or iOS/Android simulator
- **Backend** running locally or a hosted API URL (e.g. Render)

## Environment variables

The app reads the API base URL from `EXPO_PUBLIC_API_URL`. Copy `.env.example` to `.env` and set:

| Variable                | Description |
|-------------------------|-------------|
| `EXPO_PUBLIC_API_URL`   | Base URL of the Train Schedule API (no trailing slash). |

**Examples:**

- **Local backend:** `http://localhost:3000`  
  For Android emulator use `http://10.0.2.2:3000` (or set this in `.env` when testing on Android).
- **Hosted backend (e.g. Render):** `https://train-schedule-server-ztop.onrender.com`

If `EXPO_PUBLIC_API_URL` is not set, the app falls back to `http://localhost:3000` (or `http://10.0.2.2:3000` on Android). Restart the Expo dev server after changing `.env` (e.g. `npx expo start -c`).

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and set EXPO_PUBLIC_API_URL (local or hosted)
npx expo start
```

Then open the app in iOS simulator, Android emulator, or Expo Go. Use **Sign in** with the demo credentials below.

## Demo credentials

Same as the backend (after seeding):

| Role  | Email               | Password  |
|-------|---------------------|-----------|
| Admin | `admin@example.com` | `admin123` |
| User  | `user@example.com`  | `user123`  |

Admin can create/edit/delete schedules and see the “New schedule” flow; both roles can view schedules, filter, and use favorites.

## Main screens

- **Auth:** Login, Register
- **Tabs:** Schedules (list + filter), Favourites
- **Stack:** Filter, Schedule detail `[id]`, Settings, New schedule (admin)

## Real-time updates

When the backend emits schedule changes (create/update/delete), the app receives them over the WebSocket connection and invalidates React Query cache so lists and detail views update without manual refresh.

## Scripts

| Script              | Description |
|---------------------|-------------|
| `npm start`         | Start Expo dev server |
| `npx expo start -c` | Start with cleared cache (use after changing .env) |
| `npm run android`   | Open on Android |
| `npm run ios`       | Open on iOS |
| `npm run lint`      | ESLint |

## License

UNLICENSED (private).
