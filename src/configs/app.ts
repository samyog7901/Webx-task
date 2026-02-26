import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "../routes/auth.route"
import resetPw from "../routes/password-reset.route"

const app = express()

// it enables JSON parsing
app.use(express.json())

// it enables cookie parsing
app.use(cookieParser())

// setting up CORS 
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/api/auth",authRoutes)
app.use("",resetPw)

app.get("/test",(req:Request,res:Response)=>{
  res.json({message:"Hare Krishna!"})
})
  
export default app