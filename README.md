# Formly – Online Feedback & Survey Management System

**Create. Share. Collect. Analyze. 🚀**

Formly is a web-based survey and feedback management platform that provides a complete solution for creating surveys, collecting responses, managing participants, and analyzing feedback.

The platform supports two primary user roles — **Administrators and End Users** — along with public survey participation.

Administrators can create and manage surveys, configure questions, control survey accessibility, monitor responses, and analyze feedback. End Users can discover available surveys, participate, track their submissions, and manage their profiles. Public respondents can also participate through shareable survey links without mandatory account registration when permitted.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration and login.
- Secure password hashing using bcrypt.
- JWT-based authentication.
- Protected application routes.
- Role-based access for Admin and End Users.
- Separate authentication and dashboard experiences.

### 🛠️ Admin Panel

**Survey Management**
- Create, edit, publish, and manage surveys.
- Generate unique title-based public survey URLs.
- Manage Draft, Published, and Closed survey statuses.
- Configure survey availability dates.
- Control survey visibility for End Users.
- Configure anonymous and identified participation.

**Question Management**
- Multiple Choice questions.
- Rating questions (1–5).
- Short Answer questions.
- Long Answer questions.
- Required and optional questions.
- Custom question options.

**Response & Analytics Management**
- View survey responses.
- Monitor survey participation and response statistics.
- Analyze collected feedback.
- Search and filter surveys.
- Export response data to CSV.

### 👤 End User Portal

**End User Dashboard**
- Dedicated dashboard for registered respondents.
- Overview of available surveys and submissions.
- Discover surveys enabled for End Users.
- Participate in eligible surveys.

**My Submissions**
- View previously submitted surveys.
- Track submission history.
- Review submitted answers.
- Access individual submission details.

**Profile & Account Management**
- View and update profile information.
- Change account password.
- Secure access to personal survey submissions.

### 🌐 Public Survey Participation
- Shareable public survey links.
- Anonymous and identified responses.
- Participate without mandatory account registration when allowed.
- Conditional login requirements based on survey settings.
- Server-side answer validation.
- Duplicate response prevention.
- Respondent identity verification for restricted surveys.

### ⚡ User Experience
- Responsive interface.
- Separate Admin and End User dashboards.
- Reusable loading and skeleton components.
- Route-based loading experience.
- Form validation and error handling.
- Consistent UI and reusable React components.

---

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

---

## 🏗️ Project Structure

```text
Formly/
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── EndUser/
│   │   │   ├── Common/
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

---

## 🏗️ Application Architecture

Formly follows a client-server architecture with three major layers.

### 1. Frontend
- React.js and Vite-based application.
- Admin dashboard for survey administration.
- End User dashboard for respondent activities.
- Public survey participation interface.
- Reusable components and API integration using Axios.
- Client-side routing with React Router.

### 2. Backend
- REST APIs developed using Express.js.
- Controllers for business logic.
- PostgreSQL database operations using `pg`.
- Authentication and authorization middleware.
- Role-based access control.
- Request validation using Zod.
- Survey and response management APIs.

### 3. Database
- PostgreSQL relational database.
- Stores users, surveys, questions, question options, responses, and answers.
- Relational constraints and unique indexes for data integrity.

---

## 🔄 Application Workflow

1. **Authentication:** Administrators and End Users access the platform through their respective authentication flows.
2. **Survey Creation:** Administrators create surveys, configure questions, and define participation settings.
3. **Survey Publishing:** Published surveys become accessible through public links or eligible End User dashboards.
4. **Survey Participation:** Respondents submit answers based on the survey's access and authentication requirements.
5. **Submission Management:** End Users can track and review their own submissions, while Administrators manage collected responses.
6. **Analytics & Export:** Administrators analyze feedback, monitor response statistics, and export responses as CSV files.

---

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

Configure PostgreSQL and execute the SQL schema using the project's schema files.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal from the project root:

```bash
cd frontend
npm install
```

Create a `.env` file using `frontend/.env.example` and configure the required environment variables.

Start the frontend:

```bash
npm run dev
```

The frontend development URL will be displayed in the terminal.

---

## 🔒 Security & Validation

- Password hashing using bcrypt.
- JWT-based authentication.
- Protected routes and authorization middleware.
- Role-based access control.
- Zod-based request validation.
- Survey and question ownership validation.
- Database-level uniqueness constraints.
- Respondent ownership checks for personal submissions.
- Server-side validation of submitted answers.

**Anonymous response limitation:** Browser-generated respondent tokens help prevent repeat submissions from the same browser. They cannot guarantee one response per individual across different devices or cleared browser storage.

---

## 🎯 Project Goal

Formly aims to simplify the complete survey lifecycle by connecting administrators, registered respondents, and public participants through one centralized platform.

From survey creation and publishing to response collection, submission tracking, and feedback analysis, Formly provides an organized and user-friendly experience for everyone involved.

Built with a focus on secure authentication, modular architecture, relational database design, data validation, and maintainable code.

---

**Formly — Making feedback collection smarter and simpler.** 🚀