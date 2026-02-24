import { Request, Response, NextFunction } from "express"
import { verifyAccessToken, verifyRefreshToken, generateAccessToken } from "../functions/token"
import { AppDataSource } from "../data-source"
import { Auth } from "../entities/Auth";
import { accessMaxAge } from "../constants/tokenexpiry";


interface AuthRequest extends Request {
  user?: any
}

export const isauthenticated = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken
    const refreshToken = req.cookies?.refreshToken

    // 1️. If both tokens missing
    if (!accessToken && !refreshToken) {
      return res.status(401).json({ error: "Please login" })
    }

    // 2️ If accessToken exists -> verify
    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken)
        req.user = decoded
        return next()
      } catch (err:any) {
        res.status(400).json({Error: err.message} )
      }
    }

    // 3️ If no valid accessToken but refreshToken exists
    if (!refreshToken) {
      return res.status(401).json({ error: "Please login" })
    }

    let decodedRefresh: any
    try {
      decodedRefresh = verifyRefreshToken(refreshToken)
    } catch (err) {
      return res.status(401).json({
        error: "Session expired, please login"
      })
    }

    // 4️ Check if refreshToken exists in DB
    const authRepo = AppDataSource.getRepository(Auth)

    const authRecord = await authRepo.findOne({
      where: { refreshToken },
      relations: ["user"],
    })

    if (!authRecord) {
      return res.status(401).json({
        error: "Session expired, please login",
      })
    }

    // 5️ Generate new accessToken
    const user = authRecord.user

    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    })

    // Set new accessToken cookie
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: accessMaxAge,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      secure: process.env.NODE_ENV === "production",
    });

    // Attach user to request
    req.user = {
      id: user.id,
      role: user.role,
    }

    next()
  } catch (error) {
    return res.status(500).json({ error: "Authentication failed" })
  }
}