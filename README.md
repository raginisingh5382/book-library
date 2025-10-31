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
## 📚 API Endpoints — Book Library Project

---

### 🔐 Auth Routes

| **Method** | **Endpoint** | **Description** |
|:--:|:--|:--|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login existing user and generate JWT token |

---

### 📘 Books Routes

| **Method** | **Endpoint** | **Description** |
|:--:|:--|:--|
| `GET` | `/api/books` | Fetch all available books |
| `POST` | `/api/books` | Add a new book (Admin only) |
| `PUT` | `/api/books/:id` | Update book details (Admin only) |
| `DELETE` | `/api/books/:id` | Delete a book (Admin only) |

---

### 📗 Borrow / Return Routes

| **Method** | **Endpoint** | **Description** |
|:--:|:--|:--|
| `POST` | `/api/borrow` | Borrow a book by ID |
| `POST` | `/api/borrow/return` | Return a borrowed book |
| `GET` | `/api/borrow` | View all borrow records (Admin only) |
| `GET` | `/api/borrow/myBorrowed` | View all books borrowed by logged-in user |

---



## Deployed Application Link

Frontend: https://book-library-six-steel.vercel.app/login  
Backend API: https://book-library-qccd.onrender.com

##  Demo Video

**Watch Demo Video**:-https://drive.google.com/file/d/1wYGkrtKDqdfK-AmM3OIZW7arur623-d6/view?usp=drive_link

> 📌 *Click the link above to view the demo hosted on Google Drive.*
