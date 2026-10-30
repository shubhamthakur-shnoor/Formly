# Formly – Online Feedback & Survey Management System

**Create. Share. Collect. Analyze.**

Formly is a web-based survey and feedback management platform designed to simplify the process of creating surveys, collecting responses, and analyzing feedback.

It provides a centralized dashboard for managing surveys, multiple question formats, anonymous and identified submissions, response analytics, and CSV exports.

## ✨ Key Features

### 🔐 Authentication
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected application routes.

### 📋 Survey Management
- Create, edit, and manage surveys.
- Unique title-based public survey URLs.
- Draft, Published, and Closed survey statuses.
- Configure survey availability dates.
- Manage survey questions and options.

### ❓ Question Management
- Multiple Choice questions.
- Rating questions (1–5).
- Short Answer questions.
- Long Answer questions.
- Required and optional questions.
- Custom question options.

### 🌐 Public Survey Participation
- Shareable public survey links.
- Anonymous and identified responses.
- Public participation without mandatory account registration.
- Server-side answer validation.
- Duplicate response prevention.

### 📊 Dashboard & Analytics
- Centralized admin dashboard.
- Survey overview and response statistics.
- Analytics and response management.
- CSV response exports.
- Search and status filtering.

### ⚡ User Experience
- Responsive interface.
- Reusable loading and skeleton components.
- Route-based loading experience.
- Form validation and error handling.
- Clean and consistent dashboard UI.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Database Driver | node-postgres (`pg`) |
| Authentication | JWT, bcrypt |
| Validation | Zod |
| Routing | React Router |
| API Communication | Axios |
| Icons | Lucide React |

## 🏗️ Project Structure

```text
Formly/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   │   ├── AnalyticsSection.jsx
│   │   │   │   ├── CreateSurvey.jsx
│   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   ├── EditSurvey.jsx
│   │   │   │   ├── ExportsSection.jsx
│   │   │   │   ├── ResponsesSection.jsx
│   │   │   │   ├── SettingsSection.jsx
│   │   │   │   ├── SurveyQuestions.jsx
│   │   │   │   └── SurveysSection.jsx
│   │   │   ├── Common/
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── Skeleton.jsx
│   │   │   └── Landing/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── schema/
│   │   ├── utils/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## ⚙️ Application Architecture

Formly follows a client-server architecture.

**Frontend**
- React components and pages.
- Admin dashboard and survey management.
- Public survey participation.
- API integration through Axios.

**Backend**
- REST API using Express.js.
- Controllers for application logic.
- Database operations using PostgreSQL and `pg`.
- Middleware for authentication and authorization.
- Zod-based request validation.

**Database**
- PostgreSQL relational database.
- Stores users, surveys, questions, question options, responses, and answers.

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/shubhamthakur-shnoor/Formly.git
cd Formly
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
```

Configure your PostgreSQL database and execute the SQL schema using the project's schema files.

Start the backend using the development script configured in `server/package.json`.

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal from the project root:

```bash
cd Formly/frontend
npm install
```

Create or configure the frontend `.env` file using `frontend/.env.example`.

Start the Vite development server:

```bash
npm run dev
```

The frontend development URL will be displayed in the terminal.

## 🔒 Security & Validation

- Password hashing with bcrypt.
- JWT-based authentication.
- Protected routes and authorization middleware.
- Request validation using Zod.
- Survey and question ownership validation.
- Database-level uniqueness constraints for duplicate response prevention.

**Anonymous response limitation:** Browser-generated respondent tokens help prevent repeat submissions from the same browser. They cannot guarantee one response per individual across different devices or cleared browser storage.

## 🎯 Project Goal

Formly aims to provide a simple and organized solution for the complete survey lifecycle — from survey creation and public sharing to response collection, management, and analysis.

Built with a focus on maintainable code, modular architecture, data validation, and a smooth user experience.

---

**Formly — Making feedback collection smarter and simpler.** 🚀