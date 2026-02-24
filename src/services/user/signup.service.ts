import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Auth } from "../../entities/Auth";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../../functions/token";

// DTO for signup
interface SignupInput {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const signupService = async (input: SignupInput) => {
  const { name, email, password, role = "user" } = input

  const userRepo = AppDataSource.getRepository(User)
  const authRepo = AppDataSource.getRepository(Auth)

  // 1. Checking if user already exists
  const existingUser = await userRepo.findOne({ where: { email } })
  if (existingUser) {
    throw new Error("Email already registered")
  }

  // 2️ Hashing password
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3️ Creating user record
  const user = userRepo.create({ name, email, password: hashedPassword, role })
  await userRepo.save(user)

  // 4️ Generating tokens
  const accessToken = generateAccessToken({ userId: user.id, role: user.role })

  const refreshToken = generateRefreshToken({userId: user.id, role: user.role })

  // 5️ Creating Auth record with refreshToken
  const auth = authRepo.create({ user, refreshToken })
  await authRepo.save(auth)

  // 6️ Returning user + tokens
  return { user, accessToken, refreshToken }
}