# Electro Task Frontend

Electro Task is a responsive task-management application built with React and Vite. It provides secure authentication, a three-column Kanban board, persistent drag-and-drop ordering, URL-driven filters, profile management, and an adaptive light/dark dashboard.

## Features

### Task management

- Create, edit, and permanently delete tasks
- Organize tasks across **To Do**, **In Progress**, and **Done** columns
- Drag tasks within a column or between columns
- Persist task status and custom ordering through the backend API
- Display priority, due date, completion state, and overdue state
- Confirm destructive actions and show API success/error notifications

### Search and filtering

- Debounced title search
- Filter by status, priority, and due date
- Sort by custom position, creation date, due date, or title
- Clear individual date filters or reset every filter
- Store filter state in URL query parameters
- Navigate directly to task statuses from the desktop sidebar or mobile tabs

Examples:

```text
/?status=To+Do
/?status=In+Progress
/?status=Done
/?priority=High&sortBy=dueDate&sortOrder=asc
```

### Authentication and account

- Registration with client-side validation
- Email confirmation and code resend flow
- JWT-based login and protected routes
- Forgot-password and reset-password flows
- Automatic access-token refresh with queued request retries
- Profile viewing and editing
- Optional password changes from the profile page
- Logout from the sidebar or user menu

### Interface

- Responsive Kanban board and forms
- Fixed collapsible desktop sidebar
- Four-tab mobile bottom navigation
- Sticky dashboard navbar with breadcrumbs
- Animated sun/moon theme control
- Persistent light and dark themes
- Accessible labels, keyboard focus states, and loading feedback

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 6](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Axios](https://axios-http.com/)
- [dnd kit](https://dndkit.com/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Formik](https://formik.org/) and [Yup](https://github.com/jquense/yup)
- [CryptoJS](https://cryptojs.gitbook.io/docs/)
- [Lucide React](https://lucide.dev/) and [React Icons](https://react-icons.github.io/react-icons/)

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A running Electro Task backend API

### Installation

1. Clone the repository and enter the frontend directory:

   ```bash
   git clone https://github.com/AhmedMokhtar98/electro-task-frontend.git
   cd electro-task-frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:

   ```env
   VITE_REACT_APP_API_URL=http://localhost:8600/api/v1/client/
   VITE_X_APP_TOKEN_SECRET=your_app_token
   VITE_SECRET_KEY_ENCRYPTION=your_encryption_key
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the URL shown by Vite, normally [http://localhost:5173](http://localhost:5173).

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_REACT_APP_API_URL` | Yes | Base URL for client API requests. Include the trailing slash. |
| `VITE_X_APP_TOKEN_SECRET` | Yes | Value sent in the `x-app-token` request header. |
| `VITE_SECRET_KEY_ENCRYPTION` | Yes | AES key used to encrypt password fields before submission. |

Vite embeds these variables in the browser bundle. Do not use them for secrets that must remain private. Client-side encryption complements HTTPS and backend security; it does not replace them.

Restart the development server after changing `.env`.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create an optimized production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Application Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Authenticated | Task board, filters, and task CRUD. |
| `/profile` | Authenticated | View and update account details or password. |
| `/login` | Guest | Sign in. |
| `/register` | Guest | Create an account. |
| `/email-confirmation` | Guest | Confirm a registered email address. |
| `/forgot-password` | Guest | Request a password reset. |
| `/reset-password` | Guest | Complete the password-reset flow. |
| `*` | Public | Not-found page. |

Authenticated users are redirected away from guest-only routes. Unauthenticated visitors to protected routes are redirected to `/login`.

## Task Query Parameters

The task screen derives its filter state from the URL. This makes filtered views shareable and keeps the search controls, sidebar, and mobile navigation synchronized.

| Parameter | Example | Description |
| --- | --- | --- |
| `search` | `backend` | Search task titles. |
| `status` | `In Progress` | Filter by task status. |
| `priority` | `High` | Filter by priority. |
| `dueDate` | `2026-08-24` | Filter by an exact due date. |
| `sortBy` | `dueDate` | Sort field. |
| `sortOrder` | `asc` | Sort direction: `asc` or `desc`. |

Default values are omitted from the URL.

## Project Structure

```text
src/
|-- api/                 # Axios client, request services, and API hooks
|-- common/              # Shared form and UI components
|-- components/          # Task board, filters, toast, and feature UI
|-- hooks/               # Reusable React hooks
|-- layout/              # Navbar, desktop/mobile navigation, and themes
|-- pages/               # Authentication, task, and profile screens
|-- redux/               # Store and authentication state
|-- routes/              # Routes and access guards
|-- styles/              # Global theme styles
|-- utils/               # Constants, helpers, and validation schemas
|-- App.jsx              # Providers and root application component
`-- main.jsx             # Browser entry point
```

The `@` alias points to `src`:

```js
import AppInput from "@/common/AppInput";
```

## API and Authentication Behavior

The shared Axios client:

- Adds the `x-app-token` header to requests
- Adds the current bearer token to protected requests
- Encrypts common password fields with AES before submission
- Removes pagination parameters from non-GET requests
- Attempts one token refresh after a protected request returns `401` or `403`
- Queues concurrent failed requests while token refresh is running
- Clears the session and redirects to login if refresh fails

Access and refresh tokens are stored in `localStorage`. The Redux authentication state is refreshed whenever the backend returns replacement tokens.

The task UI expects backend endpoints for listing, creating, updating, deleting, and reordering tasks. The profile page expects protected profile read/update endpoints.

## Production Build

Create and verify a production build:

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static host. Because the app uses `BrowserRouter`, configure the host to rewrite unknown paths to `index.html` so direct navigation and page refreshes work correctly.

## License

No license has been added. Unless the repository owner states otherwise, the source code should be treated as all rights reserved.
