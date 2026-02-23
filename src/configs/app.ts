import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Enable JSON parsing
app.use(express.json());

// Enable cookie parsing
app.use(cookieParser());

// CORS setup
// Frontend (localhost:5173 for example) must send credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// You can register routes later
// Example:
// import userRoutes from "../controller/user/user.routes";
// app.use("/api/user", userRoutes);

export default app;