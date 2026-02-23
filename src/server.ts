import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import app from "./configs/app";
// import app from "./configs/app";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize DB
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully ✅");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });