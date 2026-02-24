import jwt, { SignOptions } from "jsonwebtoken"
import dotenv from "dotenv"
import { accessMaxAge, refreshMaxAge } from "../constants/tokenexpiry"

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

interface TokenPayload {
  userId: string
  email?: string
  role: string
}

// 🔹 Generating Access Token
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: accessMaxAge, // Short lived JWT used on every request.- Stored in httpOnly cookie named accessToken.
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options)
}

// 🔹 Generating Refresh Token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: refreshMaxAge, // - Longer lived JWT used to issue new access tokens when access expires.- Stored in httpOnly cookie named refreshToken.
  }

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options)
};

// 🔹 Verifying Access Token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload
}

// 🔹 Verifying Refresh Token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
}