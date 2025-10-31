import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import router from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import borrowRoutes from "./routes/borrowRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Configuration
const corsOptions = {
  origin: [
    "https://book-library-six-steel.vercel.app", // Production frontend
    "http://localhost:3000", // Local dev
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());

// ✅ Routes
app.use("/api/auth", router);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("Book Library API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


