import jwt, { SignOptions } from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string

interface TokenPayload {
  userId: string
  email: string
  role: string
}

// 🔹 Generating Access Token
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: "15m", // short lived
  };

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options)
}

// 🔹 Generating Refresh Token
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: "7d", // long lived
  }

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, options)
};

// 🔹 Verifying Access Token
export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload
}

// 🔹 Verify Refresh Token
export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload
}