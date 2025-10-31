# Library Management System

## Project Setup and Installation Instructions

### Backend Setup
```bash
cd backend
npm install
# Create .env file with: PORT, MONGO_URI, JWT_SECRET
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
# Create .env file with: VITE_API_URL
npm run dev
npm run build  # for production
```

---

## Technologies Used and Why

**Backend:**
- Node.js & Express.js - Fast, scalable server with RESTful API support
- MongoDB & Mongoose - Flexible NoSQL database with elegant data modeling
- JWT - Secure token-based authentication
- bcryptjs - Password hashing for security

**Frontend:**
- React.js & Vite - Fast, component-based UI development
- Tailwind CSS - Rapid styling with utility classes
- Axios - HTTP client for API calls

**Why MERN Stack:** Single language (JavaScript) across full stack, large community support, fast development, industry standard.

---

## ER Diagram

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│      User       │         │      Book       │         │     Borrow      │
├─────────────────┤         ├─────────────────┤         ├─────────────────┤
│ _id (PK)        │         │ _id (PK)        │         │ _id (PK)        │
│ name            │         │ title           │         │ userId (FK)     │
│ email (unique)  │◄────────│ author          │◄────────│ bookId (FK)     │
│ password (hash) │  1   *  │ isbn (unique)   │  1   *  │ borrowDate      │
│ role (enum)     │         │ quantity        │         │ returnDate      │
│ createdAt       │         │ available       │         │ status (enum)   │
└─────────────────┘         │ addedBy (FK)    │         │ createdAt       │
                            │ createdAt       │         └─────────────────┘
                            └─────────────────┘

Relationships:
- One User can add many Books (Admin)
- One User can borrow many Books
- One Book can have many Borrow records
```

---



## Deployed Application Link

**Frontend:** [https://your-frontend-url.vercel.app](https://your-frontend-url.vercel.app)  
**Backend API:** [https://your-backend-url.vercel.app](https://your-backend-url.vercel.app)
