# 📋 Dynamic Survey Management System

A full-stack web application that allows administrators to create and manage surveys, while officers can submit responses. Built with a modern tech stack featuring role-based access control and a premium user interface.

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start with Docker](#-quick-start-with-docker-recommended)
- [Project Setup (Manual)](#-project-setup-manual)
- [Database Design](#-database-design)
- [Backend Architecture](#-backend-architecture)
- [API Design](#-api-design)
- [Frontend Implementation](#-frontend-implementation)
- [Design Decisions](#-design-decisions)
- [Assumptions & Limitations](#-assumptions--limitations)
- [Testing](#-testing)
- [License](#-license)

---

## ✨ Features

### 👨‍💼 Admin Features
- Create dynamic survey forms with customizable fields
- Add multiple field types: text, textarea, checkbox, radio, and select dropdown
- Edit survey details (title and description)
- Delete surveys with confirmation dialogs
- View all submitted responses in an organized table
- Export responses to CSV format
- Reorder fields with drag-and-drop functionality

### 👮 Officer Features  
- Browse available surveys
- Fill out and submit survey responses
- Support for all field types with proper validation
- Required field enforcement
- Success confirmation after submission

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Server runtime environment |
| **Express.js** | Web application framework |
| **PostgreSQL** | Relational database (hosted on Supabase) |
| **Prisma** | Modern ORM for type-safe database access |
| **JWT** | Secure authentication tokens |
| **Zod** | Schema validation library |
| **Jest** | Testing framework |
| **Swagger** | API documentation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **shadcn/ui** | Reusable component library |
| **Radix UI** | Accessible UI primitives |
| **Axios** | HTTP client for API requests |
| **Jest + Testing Library** | Frontend testing |

---

## � Quick Start with Docker (Recommended)

The easiest way to run this project is using Docker. This will set up both the frontend and backend with a single command.

### Prerequisites
- **Docker Desktop** installed and running
- **Git**
- A **Supabase account** (free tier works) for PostgreSQL database

### Setup Steps

1. **Clone the repository:**
```bash
git clone https://github.com/AlEkramHossainAbir/dynamic-survey-management-system
cd dynamic-survey-management-system
```

2. **Configure backend environment variables:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add your Supabase credentials (get from Supabase Dashboard → Project Settings → Database):

```env
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key"
```

3. **Start the application:**
```bash
# Return to project root
cd ..

# Start all services with Docker
docker-compose up --build
```

4. **Access the application:**
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api-docs

5. **Stop the application:**
```bash
docker-compose down
```

**Default Login Credentials:**
- Admin: `admin@example.com` / `admin`
- Officer: `officer@example.com` / `officer`

**Note:** Frontend environment variables are optional and have defaults. The frontend will automatically connect to `http://localhost:5000` when running via Docker.

For detailed Docker commands, troubleshooting, and production deployment, see [DOCKER.md](DOCKER.md)

---

## 🚀 Project Setup (Manual)

If you prefer to run without Docker, follow these steps:

### Prerequisites
Before you begin, make sure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **PostgreSQL database** (we use Supabase - a cloud-hosted PostgreSQL service)
- **Git**

### Step 1: Clone the Repository
```bash
git clone https://github.com/AlEkramHossainAbir/dynamic-survey-management-system
cd dynamic-survey-management-system
```

### Step 2: Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install all dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Copy the example file
cp .env.example .env

# Open .env and update with your credentials:
# - DATABASE_URL: Your PostgreSQL connection string from Supabase
# - DIRECT_URL: Direct database connection (for migrations)
# - JWT_SECRET: A strong secret key for JWT tokens
# - PORT: Server port (default: 5000)
```

4. **Important:** Pull the database schema and generate Prisma client:
```bash

# This command generates the Prisma Client for database access
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

**API Documentation:** Visit `http://localhost:5000/api-docs` for Swagger documentation

### Step 3: Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
```

2. Install all dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Copy the example file
cp .env.example .env.local

# The .env.local file should contain:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Step 4: Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **API Documentation:** http://localhost:5000/api-docs

**Default Login Credentials:**
- Admin: `admin@example.com` / `admin`
- Officer: `officer@example.com` / `officer`

---

## 🗄️ Database Design

Our database uses a **normalized relational structure** with proper relationships to store survey data efficiently.

### Tables Overview

#### 1. **users**
Stores all user accounts (both admins and officers).
- `id` - Unique identifier
- `name` - User's full name
- `email` - Login email (must be unique)
- `password` - Hashed password for security
- `role` - User role: either "admin" or "officer"
- `status` - Account status: "active" or "inactive"

#### 2. **surveys**
Stores survey metadata created by admins.
- `id` - Unique identifier
- `title` - Survey title (required)
- `description` - Survey description (optional)
- `created_by` - Links to the admin user who created it
- `created_at` - Timestamp when survey was created
- `updated_at` - Timestamp when survey was last modified

#### 3. **survey_fields**
Stores individual fields within each survey.
- `id` - Unique identifier
- `survey_id` - Links to the parent survey
- `label` - Field label/question text
- `field_type` - Type: "text", "textarea", "checkbox", "radio", or "select"
- `is_required` - Whether the field must be filled
- `order_index` - Display order of fields

#### 4. **field_options**
Stores options for checkbox, radio, and select fields.
- `id` - Unique identifier
- `field_id` - Links to the parent field
- `label` - Option display text
- `value` - Option value submitted

#### 5. **submissions**
Tracks when users submit a survey.
- `id` - Unique identifier
- `survey_id` - Links to the survey that was filled
- `user_id` - Links to the officer who submitted
- `submitted_at` - Timestamp of submission

#### 6. **submission_answers**
Stores actual answers for each submission.
- `id` - Unique identifier
- `submission_id` - Links to the parent submission
- `field_id` - Links to the field being answered
- `value` - The answer value (stored as text)

### Relationships
- One survey has many fields (1:N)
- One field has many options (1:N)
- One survey has many submissions (1:N)
- One submission has many answers (1:N)
- All tables use **CASCADE DELETE** so deleting a survey automatically removes all related data

---

## 🏗️ Backend Architecture

The backend follows a **layered architecture** pattern with clear separation of concerns.

### Folder Structure
```
backend/
├── prisma/
│   └── schema.prisma          # Database schema definition
├── src/
│   ├── config/
│   │   ├── db.js              # Database connection
│   │   └── swagger.js         # API documentation config
│   ├── controllers/           # Handle requests and responses
│   │   ├── authController.js
│   │   ├── surveyController.js
│   │   └── userController.js
│   ├── middlewares/           # Request processing
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── validateMiddleware.js  # Input validation
│   ├── models/               # Database models (if needed)
│   ├── routes/               # API endpoint definitions
│   │   ├── authRoutes.js
│   │   ├── surveyRoutes.js
│   │   └── surveySubmission.js
│   ├── validators/           # Zod validation schemas
│   │   └── surveyValidators.js
│   ├── utils/                # Helper functions
│   │   └── hash.js           # Password hashing
│   ├── app.js                # Express app setup
│   └── server.js             # Server startup
└── package.json
```

### How It Works

1. **Request Flow:**
   - Client sends HTTP request → Express receives it
   - Middleware validates JWT token (if protected route)
   - Middleware validates request body using Zod schemas
   - Controller handles business logic
   - Prisma ORM queries the database
   - Response sent back to client

2. **Authentication:**
   - Users log in with email/password
   - System verifies password using bcrypt
   - JWT token generated and sent to client
   - Client includes token in all subsequent requests
   - Middleware verifies token and extracts user info

3. **Authorization:**
   - Admin routes require "admin" role
   - Officer routes require "officer" role
   - Middleware checks user role before allowing access

---

## 🔌 API Design

All API endpoints follow RESTful conventions. Base URL: `http://localhost:5000/api`

### Authentication APIs

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login with email/password | Public |

**Request Example:**
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Admin APIs - Survey Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/surveys` | List all surveys | Admin |
| POST | `/admin/surveys` | Create new survey | Admin |
| GET | `/admin/surveys/:id` | Get survey details | Admin |
| PUT | `/admin/surveys/:id` | Update survey | Admin |
| DELETE | `/admin/surveys/:id` | Delete survey | Admin |

**Create Survey Example:**
```json
{
  "title": "Customer Satisfaction Survey",
  "description": "Help us improve our services"
}
```

### Admin APIs - Field Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/admin/surveys/:id/fields` | Add field to survey | Admin |
| PUT | `/admin/surveys/fields/:id` | Update field | Admin |
| DELETE | `/admin/surveys/fields/:id` | Delete field | Admin |

**Add Field Example:**
```json
{
  "label": "How satisfied are you?",
  "field_type": "radio",
  "is_required": true,
  "options": [
    { "label": "Very Satisfied", "value": "very_satisfied" },
    { "label": "Satisfied", "value": "satisfied" },
    { "label": "Neutral", "value": "neutral" }
  ]
}
```

### Admin APIs - View Submissions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/surveys/:id/submissions` | Get all submissions | Admin |

### Officer APIs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/officer/surveys` | List available surveys | Officer |
| GET | `/officer/surveys/:id` | Get survey to fill | Officer |
| POST | `/officer/surveys/:id/submit` | Submit survey response | Officer |

**Submit Survey Example:**
```json
{
  "answers": [
    {
      "field_id": 1,
      "value": "very_satisfied"
    },
    {
      "field_id": 2,
      "value": "The service was excellent!"
    }
  ]
}
```

**All requests (except login) must include:**
```
Authorization: Bearer <your-jwt-token>
```

---

## 💻 Frontend Implementation

The frontend is built with **Next.js 16** using the modern App Router architecture.

### Folder Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx         # Login page
│   ├── (protected)/
│   │   ├── admin/              # Admin pages
│   │   │   └── surveys/
│   │   │       ├── page.tsx    # Survey list
│   │   │       ├── create/     # Create survey
│   │   │       └── [id]/       # Survey details & submissions
│   │   └── officer/            # Officer pages
│   │       └── surveys/
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── admin-app-sidebar.tsx  # Admin navigation
│   └── officer-app-sidebar.tsx # Officer navigation
├── lib/
│   ├── api.ts                  # Axios configuration
│   ├── auth.ts                 # Auth utilities
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Helper functions
└── hooks/
    └── use-toast.ts            # Toast notifications
```

### Key Features

#### 1. **Authentication**
- Login form with validation
- JWT token stored in localStorage
- Automatic token inclusion in API requests
- Protected routes based on user role

#### 2. **Admin Features**
- **Survey List:** Card-based display with search
- **Create Survey:** Form with dynamic field builder
- **Edit Survey:** Modify title/description
- **Add Fields:** Support for 5 field types with options
- **View Submissions:** Table view with user info and answers
- **Delete Survey:** Confirmation dialog before deletion

#### 3. **Officer Features**
- **Survey List:** Browse available surveys
- **Fill Survey:** Dynamic form based on field configuration
- **Validation:** Required fields enforced
- **Submit:** Confirmation message on success

#### 4. **UI Components**
All components are built with **shadcn/ui** and **Radix UI**:
- Buttons with variants (default, outline, destructive)
- Input fields and textareas
- Checkboxes and radio groups
- Select dropdowns
- Toast notifications
- Alert dialogs
- Loading spinners
- Empty states

#### 5. **Styling**
- **Tailwind CSS** for utility-first styling
- Responsive design (mobile-friendly)
- Card-based layouts with shadows
- Gradient backgrounds
- Hover effects and animations
- Dark mode support

---

## 🎯 Design Decisions

### Why Supabase PostgreSQL?
- **Cloud-hosted:** No need to manage database servers
- **Free tier:** Perfect for development and small projects
- **Connection pooling:** Better performance for serverless apps
- **Automatic backups:** Data safety built-in

### Why Prisma ORM?
- **Type safety:** Auto-generated TypeScript types
- **Easy migrations:** Simple schema management
- **Intuitive syntax:** Clean and readable queries
- **Prisma Studio:** Built-in database GUI

### Why Next.js App Router?
- **Server Components:** Better performance
- **File-based routing:** Easy to organize pages
- **Built-in optimization:** Image and font optimization
- **TypeScript support:** Full type safety

### Why shadcn/ui?
- **Copy-paste components:** Not a dependency, full control
- **Customizable:** Modify components as needed
- **Accessible:** Built on Radix UI primitives
- **Modern design:** Beautiful out of the box

### Why JWT Authentication?
- **Stateless:** No server-side sessions needed
- **Scalable:** Works with multiple servers
- **Portable:** Token can be used in mobile apps too

---

## ⚠️ Assumptions & Limitations

### Assumptions

1. **User Management:**
   - Admin and officer accounts are pre-created in the database
   - No user registration feature (handled externally)

2. **Survey Editing:**
   - Surveys can be edited even after receiving submissions
   - Editing a survey doesn't affect past submissions
   - Deleting a survey removes all related submissions

3. **Field Types:**
   - Only 5 field types supported (text, textarea, checkbox, radio, select)
   - No file upload fields
   - No date/time pickers

4. **Submissions:**
   - Officers can submit the same survey multiple times
   - No draft-save functionality
   - Submissions cannot be edited after submission

5. **Authentication:**
   - Tokens expire after a set time (configure in backend)
   - No password reset feature
   - No remember-me functionality

### Limitations

1. **Performance:**
   - Pagination not implemented on all lists (may be slow with 1000+ items)

2. **Security:**
   - No rate limiting on API endpoints
   - No CAPTCHA on login
   - No account lockout after failed login attempts

3. **Features:**
   - No survey duplication/cloning
   - No survey templates
   - No conditional logic (skip logic based on answers)
   - No analytics/reporting dashboard
   - No email notifications

4. **Data Export:**
   - export NOT supported (no PDF, Excel, CSV)
   - Export doesn't include timestamps

5. **Validation:**
   - Basic field validation only
   - No custom validation rules per field
   - No regex pattern matching

6. **Multi-tenancy:**
   - Single organization only
   - No support for multiple companies/workspaces

---

## 🧪 Testing

### Backend Tests (85 tests)
```bash
cd backend
npm test                 # Run all tests
npm run test:coverage   # Generate coverage report
```

**Test Coverage:** 82.5%
- Authentication controller tests
- Survey controller tests
- User model tests
- Middleware tests
- Validator tests

### Frontend Tests (41 tests)
```bash
cd frontend
npm test                 # Run all tests
npm run test:coverage   # Generate coverage report
```

**Test Coverage:** 83.3%
- Auth utility tests
- Button component tests
- Utils tests
- API configuration tests

**Total:** 126 tests across both frontend and backend

---

## 📊 API Documentation

When the backend is running, visit:
**http://localhost:5000/api-docs**

This provides an interactive Swagger UI where you can:
- View all API endpoints
- See request/response schemas
- Test APIs directly in the browser
- Understand authentication requirements

---

## 📝 License

This is an assessment project.

---

## 🎉 Quick Start Checklist

- [ ] Clone the repository
- [ ] Install backend dependencies (`cd backend && npm install`)
- [ ] Setup backend `.env` file with database credentials
- [ ] Run `npx prisma db pull` and `npx prisma generate`
- [ ] Start backend (`npm run dev`)
- [ ] Install frontend dependencies (`cd frontend && npm install`)
- [ ] Setup frontend `.env.local` file
- [ ] Start frontend (`npm run dev`)
- [ ] Visit http://localhost:3000 and login
- [ ] Check API docs at http://localhost:5000/api-docs

---