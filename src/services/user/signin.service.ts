import { AppDataSource } from "../../data-source";
import { User } from "../../entities/User";
import { Auth } from "../../entities/Auth";
import bcrypt from "bcrypt"
import { generateAccessToken, generateRefreshToken } from "../../functions/token";


interface SigninInput {
  email: string;
  password: string;
}

export const signinService = async (input: SigninInput) => {
  const { email, password } = input

  const userRepo = AppDataSource.getRepository(User)
  const authRepo = AppDataSource.getRepository(Auth)

  // 1. Checking if user already exists
  const user = await userRepo.findOne({ where: { email } })
  if (!user) {
    throw new Error("Invalid email or password")
  }


  const isMatch = await bcrypt.compareSync(password, user.password)
  if(!isMatch){
    throw new Error("Invalid email or  password")
  }


//generating tokens
  const accessToken = generateAccessToken({ userId: user.id, role: user.role })

  const refreshToken = generateRefreshToken({userId: user.id, role: user.role })

 let auth = await authRepo.findOne({
    where:{user:{id:user.id}},
    relations: ["user"]
 })
 if(!auth){
    auth = authRepo.create({user,refreshToken})
 }else{
    auth.refreshToken = refreshToken
 }
 await authRepo.save(auth)
  //  Returning user + tokens
  return { user, accessToken, refreshToken }
}