# RBAC & Protected Routes

An extension of the JWT Auth Demo that adds **Role-Based Access Control (RBAC)**: route protection, role-scoped pages, and dynamically rendered navigation based on the logged-in user's permissions.

## Aim

To implement role-based access control and secure application routes based on user permissions.

## Objectives

- Understand authorization mechanisms in applications
- Implement RBAC for access control
- Protect routes based on user roles
- Dynamically render UI elements based on permissions

## Features

- **Three roles** — `viewer`, `editor`, `admin`, embedded in the JWT payload at login
- **Route protection** — a reusable `ProtectedRoute` component that checks both authentication (is there a valid session?) and authorization (does this role have permission?)
- **Role hierarchy** — higher-privilege roles can access lower-privilege pages (e.g. admin can view the editor page)
- **Unauthorized redirect** — users attempting to access a page above their role are redirected to a dedicated `/unauthorized` page, distinct from the `/login` redirect used for unauthenticated users
- **Dynamic navigation** — nav links only render for pages the current user's role is permitted to visit

## Tech Stack

- React.js (functional components + Hooks)
- React Router (`react-router-dom`) for client-side routing
- JWT-based authentication (built in the previous experiment) as the source of the user's role

## Prerequisites

- Understanding of authentication concepts (JWT)
- Knowledge of React routing
- Basic understanding of user roles

## Getting Started

```bash
git clone https://github.com/kenyioliver67-collab/24BCY70263-Full-Stack-exp-1.3.2-Kenyi-Oliver.git
cd 24BCY70263-Full-Stack-exp-1.3.2-Kenyi-Oliver
npm install
npm start
```

The app runs at [http://localhost:3000](http://localhost:3000).

### Test credentials

| Username | Password    | Role   |
|----------|-------------|--------|
| alice    | password123 | viewer |
| bob      | editorpass  | editor |
| admin    | adminpass   | admin  |

## Project Structure

```
src/
├── components/
│   ├── Login.js              # Login form UI
│   └── ProtectedRoute.js     # Route guard: checks auth + role permissions
├── pages/
│   ├── Dashboard.js          # Any logged-in user
│   ├── EditorPage.js         # Editor + Admin only
│   ├── AdminPage.js          # Admin only
│   └── Unauthorized.js       # Shown when role check fails
├── services/
│   └── mockAuthApi.js        # Simulated auth server: login, JWT sign/verify
├── App.js                    # Routes, session state, nav
└── index.js                  # Wraps <App /> in <BrowserRouter>
```

## How It Works

### Roles

Each mock user is assigned a role (`viewer`, `editor`, or `admin`), which is embedded directly in the JWT payload's `role` claim during login — no separate lookup is needed once the user is authenticated, since the role travels with the token itself.

### Route Protection — `ProtectedRoute`

```jsx
function ProtectedRoute({ token, user, allowedRoles, children }) {
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
```

This single component separates two distinct concerns:
- **Authentication check** — is there a valid session at all? If not, redirect to `/login`.
- **Authorization check** — if `allowedRoles` is specified, is the user's role included? If not, redirect to `/unauthorized`.

Routes that omit `allowedRoles` (like `/dashboard`) allow any authenticated user through, regardless of role.

### Route Definitions

| Route          | Allowed Roles           |
|----------------|--------------------------|
| `/dashboard`   | any logged-in user       |
| `/editor`      | `editor`, `admin`        |
| `/admin`       | `admin`                  |
| `/unauthorized`| public (redirect target) |

### Dynamic UI Rendering

The navigation bar conditionally renders links based on `user.role`:

```jsx
{(user.role === "editor" || user.role === "admin") && (
  <Link to="/editor">Editor Page</Link>
)}
{user.role === "admin" && (
  <Link to="/admin">Admin Page</Link>
)}
```

This means users never even see links to pages they can't access — route protection blocks the *navigation*, while this handles the *presentation*, together forming a complete RBAC experience.

## Expected Outcome

- Role-based access control implemented
- Secure navigation across the application
- UI dynamically adapts based on user role

## Course Mapping

- CO2 - BT2
- CO3 - BT3
