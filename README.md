# Expense Tracker

Full-stack Expense Tracker application project scaffold built with React, Vite, Express, and MySQL.

---

## 📁 Project Structure

```
expense-tracker/
├── frontend/             # React + Vite frontend application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page views
│   │   ├── routes/       # React Router configuration
│   │   ├── services/     # Axios API service
│   │   ├── middleware/   # Middleware helpers
│   │   └── utils/        # Utility helpers
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── backend/              # Node.js + Express backend application
│   ├── config/           # Database configuration
│   ├── controllers/      # Route controllers (Health Check)
│   ├── routes/           # API routes
│   ├── services/         # Business logic services placeholder
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility helpers
│   ├── app.js            # Express app configuration
│   ├── server.js         # Entry point & DB connection check
│   ├── .env.example
│   └── package.json
├── database/             # Database initialization scripts
│   └── init.sql          # MySQL database creation script
├── docs/                 # Project documentation
│   └── setup.md          # Setup & API overview
├── .gitignore            # Git ignore file
└── README.md             # Project README
```

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MySQL Server**: v8.0 or higher running locally (Port 3306)

---

## ⚙️ Setup Instructions

### 1. Database Creation

Ensure MySQL service is running, then create the `expense_tracker` database using MySQL CLI or your GUI client (MySQL Workbench, DBeaver):

```sql
CREATE DATABASE IF NOT EXISTS expense_tracker;
```

Or execute the SQL script in `database/init.sql`:

```bash
mysql -u root -p < database/init.sql
```

---

### 2. Environment Configuration

#### Backend Setup:
Copy `.env.example` to `.env` inside `backend/`:

```bash
cd backend
cp .env.example .env
```

Ensure `.env` contains:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=expense_tracker
DB_USER=root
DB_PASSWORD=Ajinkya@2004
```

#### Frontend Setup:
Copy `.env.example` to `.env` inside `frontend/`:

```bash
cd frontend
cp .env.example .env
```

Ensure `.env` contains:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

### 3. Installing Dependencies

#### Backend:
```bash
cd backend
npm install
```

#### Frontend:
```bash
cd frontend
npm install
```

---

### 4. Running the Application

#### Start Backend API Server:
```bash
cd backend
npm run dev
```
- Server will run at: `http://localhost:5000`
- Health check endpoint: `http://localhost:5000/api/health`

#### Start Frontend React Server:
```bash
cd frontend
npm run dev
```
- Development server will run at: `http://localhost:3000`

---

## 🧪 API Health Check

GET `/api/health`

**Sample Response:**
```json
{
  "success": true,
  "message": "Expense Tracker API is running"
}
```
