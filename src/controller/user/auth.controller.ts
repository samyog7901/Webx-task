// Logout + pw change

import { Request, Response } from "express";
import { accessMaxAge, refreshMaxAge } from "../../constants/tokenexpiry";
import { signupService } from "../../services/user/signup.service";
import { AppDataSource } from "../../data-source";
import { Auth } from "../../entities/Auth";



export const signupController = async(req:Request,res:Response)=>{
    try{
        const {name, email, password} = req.body

        const {user,accessToken, refreshToken} = await signupService({name, email, password})

        //Setting cookies
        res.cookie("accessToken", accessToken,{
            httpOnly: true,
            maxAge: accessMaxAge,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            secure: process.env.NODE_ENV === "production"
        })

        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            maxAge: refreshMaxAge,
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            secure: process.env.NODE_ENV === "production"
        })

        const {password: _pwd, ...userWithoutPassword } = user
        res.status(201).json({user:userWithoutPassword})
    }catch(error: any){
        res.status(400).json({Error : error.message})
    }
}

export const logoutController = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies?.refreshToken
  
      if (refreshToken) {
        const authRepo = AppDataSource.getRepository(Auth)
  
        const authRecord = await authRepo.findOne({
          where: { refreshToken },
        })
  
        if (authRecord) {
          authRecord.refreshToken = null as any; // or ""
          await authRepo.save(authRecord)
        }
      }
  
      // Clear cookies
      res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
  
      res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
  
      return res.status(200).json({
        message: "Logout successful",
      })
    } catch (error) {
      return res.status(500).json({
        error: "Logout failed",
      });
    }
  }