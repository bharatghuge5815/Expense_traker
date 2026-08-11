# Expense Tracker - Documentation

## API Overview

### Base URL
`http://localhost:5000/api`

### Health Check Endpoint
- **URL**: `/api/health`
- **Method**: `GET`
- **Response**:
```json
{
  "success": true,
  "message": "Expense Tracker API is running"
}
```

## Architecture Notes
- **Frontend**: React + Vite + React Router + Axios
- **Backend**: Node.js + Express
- **Database**: MySQL (`mysql2/promise` connection pool)
