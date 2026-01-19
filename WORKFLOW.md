# Job Portal - Complete Workflow

This document describes the overall architecture and the main work flows for the `job-portal` project (client + server). It explains how the frontend and backend interact, the important API endpoints, authentication flows, file uploads, and how to run the project locally.

**Overview**
- Architecture: React frontend (Vite) + Express/MongoDB backend.
- Frontend: `client/` (React, Clerk for user auth, axios for API calls).
- Backend: `server/` (Express, Mongoose, Clerk middleware for user auth, JWT for company auth, Cloudinary for file storage).

**How to run (quick)**
1. Install dependencies for server and client:

   - Server:
     ```bash
     cd server
     npm install
     ```

   - Client:
     ```bash
     cd client
     npm install
     ```

2. Create a `.env` in `server/` with required variables (see list below).
3. Start the server and client (separate terminals):

   - Server:
     ```bash
     cd server
     npm run dev   # or `node server.js` depending on scripts
     ```

   - Client:
     ```bash
     cd client
     npm run dev
     ```

**Required environment variables (server)**
- `MONGODB_URI` - base MongoDB connection string (the code appends `/job-portal`).
- `CLOUDINARY_NAME` - Cloudinary cloud name.
- `CLOUDINARY_API_KEY` - Cloudinary API key.
- `CLOUDINARY_SECRET_KEY` - Cloudinary secret.
- `JWT_SECRET` - JWT secret used for company tokens.
- `PORT` - (optional) port for server.

**Frontend env**
- `VITE_BACKEND_URL` - base backend URL used by the client (e.g. `http://localhost:5000`).
- Clerk front-end config must be set up according to Clerk docs (client already uses `@clerk/clerk-react`).

---

**Backend (routes summary)**

- Base routes declared in `server/server.js`:
  - `GET /` — returns "API Working"
  - `POST /webhooks` — Clerk webhooks handled in `controllers/webhooks.js`

- Company routes: `server/routes/companyRoutes.js` (prefix `/api/company`)
  - `POST /register` — Register a company (uploads `image`, uses `upload.single('image')`).
  - `POST /login` — Company login returns a JWT token (stored client-side as `companyToken`).
  - `GET /company` — Get company data (protected: `protectCompany` middleware expects header `token`).
  - `POST /post-job` — Post a job (protected, expects `token` header).
  - `GET /applicants` — Get applicants for company jobs (protected).
  - `GET /list-jobs` — Get jobs posted by the company (protected).
  - `POST /change-status` — Change application status (protected).
  - `POST /change-visiblity` — Toggle job visibility (protected).

- Job routes: `server/routes/jobRoutes.js` (prefix `/api/jobs`)
  - `GET /` — Get all visible jobs.
  - `GET /:id` — Get job by id.

- User routes: `server/routes/userRoutes.js` (prefix `/api/users`)
  - `GET /user` — Get user data. Uses Clerk auth (`req.auth()` in controller).
  - `POST /apply` — Apply for a job. Requires user token (client sends `Authorization: Bearer <token>` from Clerk).
  - `GET /applications` — Get user's applied jobs (protected via Clerk token).
  - `POST /update-resume` — Update user resume; accepts file under field `resume` (uses multer + Cloudinary upload).

**Auth & Tokens**
- Users: authentication is handled with Clerk. The server uses `@clerk/express` middleware (see `server/server.js`) which exposes `req.auth()`; the frontend uses `@clerk/clerk-react` and `getToken()` to obtain a Bearer token for protected calls.
- Companies (recruiter): custom JWT-based auth. On login/register the server issues a JWT signed with `JWT_SECRET`. The frontend stores it in `localStorage` (`companyToken`) and sends it in header `token` for protected company endpoints. The middleware `protectCompany` verifies this JWT and loads `req.company`.

**File uploads**
- Multer (`server/config/multer.js`) is used to accept uploads. Files are passed to Cloudinary (`server/config/cloudinary.js`) where they are uploaded, and the secure URL is saved in models (e.g., `user.resume` or `company.image`).

**Data model mapping (high level)**
- `User` model (`server/models/User.js`) — stores user profile and `resume` URL.
- `Company` model (`server/models/company.js`) — stores company details and password (hidden when returned).
- `Job` model (`server/models/job.js`) — job metadata (title, description, companyId, visible, applicants, etc.).
- `JobApplication` model (`server/models/JobApplication.js`) — links `userId`, `jobId`, `companyId` and stores status and date.

**Frontend - major pages and API usage**
- `client/src/context/AppContext.jsx` — central place that fetches and stores `jobs`, `companyData`, `userData`, `userApplications`. Contains functions used by pages:
  - `fetchJobs()` — GET `${backend}/api/jobs`
  - `fetchCompanyData()` — GET `${backend}/api/company/company` with header `token` (company JWT)
  - `fetchUserData()` — GET `${backend}/api/users/user` with `Authorization: Bearer <clerk-token>`
  - `fetchUserApplications()` — GET `${backend}/api/users/applications` with user token

- `ApplyJob.jsx` — fetches `GET /api/jobs/:id`, applies via `POST /api/users/apply` with Bearer token, navigates to resume upload if user has no resume.
- `AddJob.jsx` — rubric for company posting jobs: POST `/api/company/post-job` with `token` header.
- `ManageJobs.jsx` — GET `/api/company/list-jobs` and POST `/api/company/change-visiblity` to toggle job visibility.

**Common sequences (textual)**

1) User view & apply
  - Frontend: call `GET /api/jobs` to show list.
  - User clicks a job: `GET /api/jobs/:id` to show detail.
  - User clicks Apply: frontend checks `userData.resume`.
    - If missing -> navigate user to `/applications` (resume upload page).
    - If present -> frontend gets token via `getToken()` and POSTs to `/api/users/apply` with body `{ jobId }` and header `Authorization: Bearer <token>`.
  - Server: `applyForJob` checks duplicate application, creates `JobApplication`, and increments counters if needed.

2) Company register/login -> post job
  - Company registers via `POST /api/company/register` with an image field (multer) and receives a JWT (client stores as `companyToken`).
  - Company logs in via `POST /api/company/login` and receives `companyToken`.
  - To post a job: frontend sends `POST /api/company/post-job` with job fields and header `token: <companyToken>`.

**Sample curl examples**

- List jobs:
  ```bash
  curl http://localhost:5000/api/jobs
  ```

- Apply (user):
  ```bash
  curl -X POST http://localhost:5000/api/users/apply \
    -H "Authorization: Bearer <CLERK_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"jobId":"<JOB_ID>"}'
  ```

- Company post job:
  ```bash
  curl -X POST http://localhost:5000/api/company/post-job \
    -H "token: <COMPANY_JWT>" \
    -H "Content-Type: application/json" \
    -d '{"title":"Title","description":"...","location":"City","salary":1000}'
  ```

**Architecture Diagram**

Here is a visual representation of the project's architecture, showing how the different parts of the application interact.

```mermaid
graph TD
    subgraph "User's Browser"
        A[React Client App (Vite)]
    end

    subgraph "Backend Infrastructure"
        B[Node.js/Express Server]
        C[MongoDB Database]
        D[Clerk (User Authentication)]
        E[Cloudinary (File Storage)]
    end

    A -- "API Calls (Axios)" --> B
    B -- "User Auth & Webhooks" --> D
    B -- "Resume/Image Uploads" --> E
    B -- "Stores & Retrieves Data (Mongoose)" --> C

    style A fill:#61DAFB,stroke:#333,stroke-width:2px
    style B fill:#8CC84B,stroke:#333,stroke-width:2px
    style C fill:#4DB33D,stroke:#333,stroke-width:2px
    style D fill:#6C47FF,stroke:#333,stroke-width:2px
    style E fill:#FFB200,stroke:#333,stroke-width:2px
```

---


