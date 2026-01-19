# TalentForge - A Full-Stack Job Portal

TalentForge is a comprehensive, full-stack job portal application built with the MERN stack (MongoDB, Express.js, React, Node.js). It provides a platform for job seekers to find and apply for jobs, and for recruiters to post and manage job listings.

The frontend is a modern single-page application built with React (using Vite for a fast development experience), and the backend is a robust RESTful API powered by Node.js and Express.js, with MongoDB as the database.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Setup and Run (Development)](#setup-and-run-development)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [File Uploads](#file-uploads)
- [Deployment](#deployment)
- [Contributing](#contributing)

## Features
- **User Features:**
  - User authentication and authorization using Clerk.
  - Browse and search for job listings.
  - View detailed information for each job.
  - Apply for jobs with a resume.
  - Upload and update resumes (stored on Cloudinary).
  - View a list of all applied jobs.
- **Recruiter/Company Features:**
  - Company registration and JWT-based authentication.
  - Post new job listings.
  - Manage their own job postings (view, update visibility).
  - View applications for their jobs.
  - Change the status of job applications.
- **General:**
  - Responsive design for a seamless experience on all devices.
  - Secure API endpoints.

## Technologies Used
- **Frontend:**
  - React (with Vite)
  - React Router for routing
  - Axios for API requests
  - Tailwind CSS for styling
  - Clerk for user authentication
- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JSON Web Tokens (JWT) for company authentication
  - Cloudinary for file storage (resumes)
  - Multer for handling file uploads
  - Sentry for error tracking

## Project Structure
The project is organized into two main directories: `client` and `server`.

### `client/` (Frontend)
- `src/`: Contains the main source code for the React application.
  - `components/`: Reusable React components (`Navbar`, `JobCard`, `Footer`, etc.).
  - `pages/`: Top-level page components (`Home`, `AddJob`, `ApplyJob`, etc.).
  - `context/`: React context for managing global state (`AppContext.jsx`).
  - `assets/`: Static assets like images.
- `public/`: Publicly accessible files.
- `vite.config.js`: Vite configuration.
- `package.json`: Frontend dependencies and scripts.

### `server/` (Backend)
- `server.js`: The main entry point for the Express server.
- `config/`: Configuration files for the database (`db.js`), Cloudinary (`cloudinary.js`), and Multer (`multer.js`).
- `controllers/`: Logic for handling incoming requests (`jobController.js`, `userController.js`, etc.).
- `middleware/`: Custom middleware, such as for authentication (`authMiddleware.js`).
- `models/`: Mongoose schemas for the database (`Job.js`, `User.js`, `Company.js`, etc.).
- `routes/`: API route definitions (`jobRoutes.js`, `userRoutes.js`, etc.).
- `utils/`: Utility functions, like `generateToken.js`.
- `package.json`: Backend dependencies and scripts.

## Prerequisites
- Node.js (v16 or higher)
- npm (or yarn)
- MongoDB (a local instance or a cloud-based one like MongoDB Atlas)
- A Cloudinary account for file uploads.
- A Clerk account for user authentication.

## Environment Variables
You'll need to create a `.env` file in the `server/` directory with the following variables:

```
MONGODB_URI=<your_mongodb_connection_string>
CLOUDINARY_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_SECRET_KEY=<your_cloudinary_api_secret>
JWT_SECRET=<your_jwt_secret_for_company_auth>
PORT=5000
```

For the frontend, you may need to set the backend URL in a `.env` file in the `client/` directory if it's not running on the default `http://localhost:5000`:

```
VITE_BACKEND_URL=http://localhost:5000
```

## Setup and Run (Development)
1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd job-portal
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Start the backend server:**
    Open a terminal in the `server/` directory and run:
    ```bash
    npm run server
    ```
    The server will start on the port specified in your `.env` file (or 5000 by default).

5.  **Start the frontend development server:**
    In a separate terminal, navigate to the `client/` directory and run:
    ```bash
    npm run dev
    ```
    The React app will open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## API Endpoints

### Company Routes (`/api/company`)
- `POST /register`: Register a new company.
- `POST /login`: Log in a company and receive a JWT.
- `GET /company`: Get the details of the logged-in company (protected).
- `POST /post-job`: Post a new job (protected).
- `GET /applicants`: Get all applicants for the company's jobs (protected).
- `GET /list-jobs`: Get all jobs posted by the company (protected).
- `POST /change-status`: Change the status of a job application (protected).
- `POST /change-visiblity`: Toggle the visibility of a job (protected).

### Job Routes (`/api/jobs`)
- `GET /`: Get a list of all visible jobs.
- `GET /:id`: Get the details of a specific job by its ID.

### User Routes (`/api/users`)
- `GET /user`: Get the details of the logged-in user (protected by Clerk).
- `POST /apply`: Apply for a job (protected by Clerk).
- `GET /applications`: Get a list of jobs the user has applied for (protected by Clerk).
- `POST /update-resume`: Upload or update a user's resume (protected by Clerk).

### Webhooks (`/webhooks`)
- `POST /`: Handles webhooks from Clerk for user creation and updates.

## Authentication
This project uses a dual authentication system:
- **Users (Job Seekers):** Authentication is managed by **Clerk**. The frontend uses the `@clerk/clerk-react` library to handle sign-up, sign-in, and session management. For protected API routes, the client sends a Bearer token obtained from Clerk, and the backend verifies it using the `@clerk/express` middleware.
- **Companies (Recruiters):** A custom JWT-based authentication system is used. When a company registers or logs in, the server generates a JWT. This token is stored on the client (in `localStorage`) and sent in the `token` header of subsequent requests to protected company routes. The `protectCompany` middleware on the server validates this token.

## File Uploads
File uploads (for user resumes and company logos) are handled by **Multer** and **Cloudinary**.
1.  The client sends a `multipart/form-data` request to the server.
2.  **Multer**, an Express middleware, processes the form data and the file.
3.  The file is then uploaded to **Cloudinary**.
4.  The secure URL provided by Cloudinary is saved to the corresponding document in the MongoDB database (e.g., the `resume` field in the `User` model).

## Deployment
The application is configured for deployment on platforms like Vercel or Netlify.
- The `client/vercel.json` and `server/vercel.json` files contain configurations for deploying to Vercel.
- Ensure that all environment variables are set in your deployment provider's settings.

## Contributing
Contributions are welcome! If you have suggestions for improvements or find any bugs, please feel free to open an issue or submit a pull request.

