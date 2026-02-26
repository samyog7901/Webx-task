import "reflect-metadata"
import dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import app from "./configs/app"


dotenv.config()

const PORT = process.env.PORT || 5001

// DB Initialization
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully !")

    // Starting express server 
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  });