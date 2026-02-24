// Logout + pw change

import { Request, Response } from "express";
import { accessMaxAge, refreshMaxAge } from "../../constants/tokenexpiry";
import { signupService } from "../../services/user/signup.service";
import { signinService } from "../../services/user/signin.service";



export const signinController = async(req:Request,res:Response)=>{
    try{
        const { email, password} = req.body

        const {user,accessToken, refreshToken} = await signinService({ email, password})

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
        
        //removing pw from res
        const {password: _pwd, ...safeUser } = user
        res.status(200).json({message:"Login successful",user:safeUser})
    }catch(error: any){
        res.status(400).json({Error : error.message})
    }
}