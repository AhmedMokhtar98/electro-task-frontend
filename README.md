# Electro Task Frontend

A responsive task-management dashboard built for Electro Pi. The application provides a secure authentication flow, a protected dashboard shell, reusable API hooks, and a customizable light/dark interface.

> **Project status:** Authentication and the dashboard foundation are implemented. Task and profile pages are currently placeholders, and their routes are disabled while those features are developed.

## Features

- Account registration with form validation
- Email confirmation and code resend flow
- Login with JWT-based authentication
- Forgot-password and reset-password flows
- Protected and guest-only routes
- Automatic access-token refresh with queued request retries
- Client-side password-field encryption before API requests
- Persistent light and dark themes
- Responsive dashboard layout with collapsible navigation
- Toast notifications and API error handling
- Reusable GET, POST, PUT, and DELETE hooks
- Search, filter, sorting, date-range, and infinite-scroll controls

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 6](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Axios](https://axios-http.com/)
- [Ant Design](https://ant.design/) and [Tailwind CSS](https://tailwindcss.com/)
- [Formik](https://formik.org/) and [Yup](https://github.com/jquense/yup)
- [CryptoJS](https://cryptojs.gitbook.io/docs/)

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A running Electro Task backend API

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AhmedMokhtar98/electro-task-frontend.git
   cd electro-task-frontend
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   VITE_REACT_APP_API_URL=http://localhost:3000/api/
   VITE_X_APP_TOKEN_SECRET=your_app_token
   VITE_SECRET_KEY_ENCRYPTION=your_encryption_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL shown by Vite, usually `http://localhost:5173`.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_REACT_APP_API_URL` | Yes | Base URL of the backend API. |
| `VITE_X_APP_TOKEN_SECRET` | Yes | Value sent to the API in the `x-app-token` header. |
| `VITE_SECRET_KEY_ENCRYPTION` | Yes | AES key used to encrypt password fields before requests are sent. |

All Vite variables are embedded in the browser bundle. Do not place credentials in these values that must remain secret. Client-side encryption should complement HTTPS and server-side security, not replace them.

Restart the development server after changing `.env`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Serve the production build locally for verification. |
| `npm run lint` | Run ESLint across the project. |

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Authenticated | Dashboard home page. |
| `/login` | Guest | Sign in. |
| `/register` | Guest | Create an account. |
| `/email-confirmation` | Guest | Confirm a registered email address. |
| `/forgot-password` | Guest | Request a password reset. |
| `/reset-password` | Guest | Set a new password using the reset flow. |
| `*` | Public | Not-found page. |

Authenticated users are redirected away from guest routes. Unauthenticated users who visit protected pages are redirected to `/login`.

## Project Structure

```text
src/
|-- api/                 # Axios client, request services, and data hooks
|-- common/              # Shared form and UI components
|-- components/          # Feature-level UI components
|-- hooks/               # Reusable React hooks
|-- layout/              # Dashboard shell, header, sidebar, and theming
|-- pages/               # Authentication, home, task, and profile pages
|-- redux/               # Redux store and authentication state
|-- routes/              # Route definitions and access guards
|-- styles/              # Global styles
|-- utils/               # Validation, constants, and helper functions
|-- App.jsx              # Application providers and root component
`-- main.jsx             # Browser entry point
```

The `@` import alias points to `src`, so imports can be written as:

```js
import AppInput from "@/common/AppInput";
```

## Authentication and API Behavior

The shared Axios client:

- Adds the `x-app-token` header to API requests.
- Adds the current bearer token to protected requests.
- Encrypts common password fields using AES.
- Attempts one token refresh after a protected request returns `401` or `403`.
- Queues concurrent failed requests while a refresh is in progress.
- Clears the local session and redirects to login if refresh fails.

Access and refresh tokens are currently stored in `localStorage`. The backend must support the authentication endpoints used in `src/pages/auth` and return access and refresh tokens in the expected response shape.

## Production Build

Create and test a production build locally:

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. Because the app uses `BrowserRouter`, configure the host to rewrite unknown paths to `index.html` so direct navigation and page refreshes work correctly.

## Roadmap

- Enable task listing and task creation routes
- Implement task management workflows
- Implement the user profile page
- Expand dashboard content and replace placeholder data
- Add broader automated test coverage

## License

No license has been added yet. Unless the repository owner states otherwise, the source code should be treated as all rights reserved.
