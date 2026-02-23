import express, { Request, Response } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// it enables JSON parsing
app.use(express.json())

// it enables cookie parsing
app.use(cookieParser())

// CORS setup
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.get("/test",(req:Request,res:Response)=>{
  res.json({message:"Hare Krishna!"})
})
  
export default app