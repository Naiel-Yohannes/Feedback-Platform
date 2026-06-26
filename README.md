# Feedback Platform

A full-stack feedback survey platform where coordinators create surveys and members submit responses and results can be reviewed through a protected dashboard.

## Live links

- Frontend: https://feedback-platform-pearl.vercel.app/
- Backend API: https://feedback-platform-backend-docker.onrender.com
- Docker image: naiel212/feedback-backend

## What this project demonstrates

This project was built to strengthen my full-stack development skills beyond a basic CRUD app. It focuses on real-world concerns such as authentication, authorization, relational data modeling, testing, and deployment.

Key areas covered:

- Role based workflows for coordinators and members
- Protected API routes and server side permission checks
- A relational PostgreSQL data model
- Backend and E2E testing
- Docker based deployment and CI/CD flow

## Features

- Authentication with JWT-based login and protected routes.
- Role based dashboards for coordinators and members.
- Coordinator survey creation, editing, opening, closing, and result viewing.
- Member survey discovery and response submission.
- Duplicate response prevention so a member cannot answer the same survey more than once.
- PostgreSQL backed relational data model for users, surveys, questions, options and responses.
- Backend integration tests with Jest and Supertest.
- End-to-end tests with Playwright.
- Dockerized backend image with CI/CD deployment flow.

## Tech stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- Vite
- Playwright

### Backend

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- Jest
- Supertest

### DevOps

- Docker
- GitHub Actions
- Render
- Vercel

## Architecture overview

Frontend (React/Vite)
        |
        | HTTP requests with JWT auth
        v
Backend API (Express)
        |
        | SQL queries
        v
PostgreSQL database

The frontend handles routes, form states, dashboard UI and user feedback messages. The backend owns authentication, authorization, validation, survey lifecycle rules and response submission rules. PostgreSQL stores the relational data and enforces important relationships between records.

## Data model

The app uses a relational model with these tables:

- users: account data and roles
- surveys: survey metadata and the owner
- questions: survey questions
- options: answer choices for each question
- responses: each member's selected answer for a survey

The `responses` table uses a unique constraint on survey and user so one member cannot submit multiple responses to the same survey.

## Testing

Backend tests cover authentication, survey ownership, survey lifecycle behavior, response submission, duplicate response prevention and permission rules.

Frontend E2E tests cover the main user journeys:

- Register and log in.
- Coordinator creates and edits a survey.
- Member views available surveys.
- Member submits a response.
- Member cannot submit a duplicate response.

Run backend tests:

```bash
cd Backend
npm run test
```

Run frontend E2E tests:

```bash
cd Frontend
npm run test
```

## Local setup

### 1. Clone the repository

```bash
git clone https://github.com/Naiel-Yohannes/Feedback-Platform.git
cd Feedback-Platform
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a .env file in the Backend folder:

```env
PORT=5001
POSTGRES_URI=postgresql://username:password@localhost:5432/feedback_platform
POSTGRES_URI_TEST=postgresql://username:password@localhost:5432/feedback_platform_test
SECRET=write_your_own_random_characters
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd Frontend
npm install
```

Create a .env file in the Frontend folder:

```env
VITE_API_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

## Docker and deployment

The backend is containerized with Docker and deployed through a CI/CD workflow. GitHub Actions builds the frontend, runs backend tests, builds the Docker image, pushes it to Docker Hub and triggers a Render deployment.

The frontend is deployed separately and communicates with the deployed backend through `VITE_API_URL`.

## API overview

| Method | Route | Description |
| --- | --- | --- |
| POST | /api/users | Register a new user |
| POST | /api/login | Log in and receive a JWT |
| GET | /api/survey | Get surveys visible to the current user |
| POST | /api/survey | Create a survey as a coordinator |
| PUT | /api/survey/:id | Update a survey as its owner |
| DELETE | /api/survey/:id | Delete a survey as its owner |
| POST | /api/responses | Submit a member response |
| GET | /api/responses/survey/:id | View responses for a survey |
| GET | /health | Check backend and database health |

## What I learned

- How to design role based behavior across both frontend and backend.
- Why authorization must be enforced on the server and not only hidden in the UI.
- How to choose between different databases approaches for different use cases.
- How relational tables model real application workflows.
- How unique constraints can protect business rules like one response per survey.
- How integration and E2E tests catch bugs that manual testing misses.
- How Docker images and CI/CD pipelines fit into deployment.

## Known limitations

- The app currently focuses on a single core survey workflow instead of advanced analytics.
- The app currently allows users to only create one question per survey.
- The UI could be improved with more loading, empty and error states.
- Admin level moderation and organization management are not implemented yet.
- More database migrations and seed scripts would make setup stronger.

## Future improvements

- Add richer analytics for survey results.
- Allowing users to create more than 1 question per survey.
- Add pagination and filtering for surveys and responses.
- Add a migration tool for database schema changes.
- Add TypeScript for stronger API and component contracts.
- Add more CI checks, including frontend E2E tests in the pipeline.
- Improve accessibility and responsive UI polish.

## Author

Naiel Yohannes

Aspiring full-stack developer focused on React, Node.js, PostgreSQL, testing, and deployment.