# Dynamic Survey Management System

A full-stack web application for creating, managing, and submitting surveys with role-based access control.

## 🚀 Features

### Admin Features
- ✅ Create dynamic survey forms with multiple field types
- ✅ Edit survey title and description
- ✅ Add/edit/delete fields (text, textarea, checkbox, radio, select)
- ✅ View all submitted responses
- ✅ Export responses to CSV
- ✅ Delete surveys with confirmation
- ✅ Premium card-based UI with animations

### Officer Features
- ✅ View available surveys  
- ✅ Submit responses with validation
- ✅ Support for all field types
- ✅ Required field enforcement
- ✅ Success confirmation screens

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Authentication:** JWT
- **Validation:** Zod

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui + Radix UI
- **HTTP Client:** Axios

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase account)
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd dynamic-survey-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma generate
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm install @radix-ui/react-toast
cp .env.example .env.local
npm run dev
```

## 🗄️ Database Schema

### Tables
- **users** - User accounts (admin/officer)
- **surveys** - Survey metadata
- **survey_fields** - Form fields
- **field_options** - Options for checkbox/radio/select
- **submissions** - Response records
- **submission_answers** - Individual answers

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Admin Routes
- `GET /api/admin/surveys` - List surveys
- `POST /api/admin/surveys` - Create survey
- `GET /api/admin/surveys/:id` - Get survey
- `PUT /api/admin/surveys/:id` - Update survey
- `DELETE /api/admin/surveys/:id` - Delete survey
- `POST /api/admin/surveys/:id/fields` - Add field
- `PUT /api/admin/surveys/fields/:id` - Update field
- `DELETE /api/admin/surveys/fields/:id` - Delete field
- `GET /api/admin/surveys/:id/submissions` - View submissions

### Officer Routes
- `GET /api/officer/surveys` - List surveys
- `GET /api/officer/surveys/:id` - Get survey
- `POST /api/officer/surveys/:id/submit` - Submit response

## 🎨 UI Features

- Card-based layouts with hover effects
- Toast notifications
- Loading states and spinners
- Empty states
- Confirmation dialogs
- Responsive design
- Gradient backgrounds

## 📝 Design Decisions

- **Supabase PostgreSQL**: Managed database with scalability
- **Prisma ORM**: Type-safe queries and migrations
- **Next.js App Router**: Modern React framework
- **shadcn/ui**: Customizable component library
- **JWT Auth**: Stateless authentication

## 🔐 Security

- JWT-based authentication
- Password hashing (bcrypt)
- Role-based authorization
- CORS configuration
- Environment variables
- Input validation

## 👨‍💻 Development

Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:3000

## 📄 License

Assessment Project 

there will be two type of user (Roles: Admin, Officer)

## Admin
1. Login to the systems
2. create survey forms dynamically. 
3. add multiple fields to a survey form
4. view submitted responses of users


## officer
1. login to the systems
2. view available survey forms
3. submit responses to those surveys


## survey forms requirement  (for admin)
1. survey form consists 
2. Title (req) 
3. Description (optional)
4. multiple fields
   1. field label
   2. field type (input, textarea radio, checkbox, select)
   3. for checkbox, radio, select options must be configured by the admin

## Admin Panel
1. Admin login
2. create a new survey (form)
3. Add/edit/delete fields in a survey
4. view list of surveys (table)
5. view all the submissions for a survey
   
## officer panel
1. officer login
2. view available surveys
3. fill up and submit a survey

## api's
1. Authentication (login only)
2. survey creation
3. field management
4. survey submission
5. viewing submissions


## supabase
cloud-hosted PostgreSQL
npx prisma db pull
npx prisma generate