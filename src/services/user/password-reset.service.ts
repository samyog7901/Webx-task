import { AppDataSource } from "../../data-source"
import { PasswordReset } from "../../entities/PasswordReset"
import { User } from "../../entities/User"
import crypto from "crypto"
import { sendResetEmail } from "../../utils/mail"
import bcrypt from "bcrypt"


export const requestPasswordReset = async (email: string) => {
  const userRepo = AppDataSource.getRepository(User)
  const resetRepo = AppDataSource.getRepository(PasswordReset)

  const user = await userRepo.findOne({ where: { email } })

  if (!user) {
    // Prevent email enumeration
    return
  }

  // Generate raw token
  const rawToken = crypto.randomBytes(32).toString("hex")

  // Hash token before storing
  const tokenHash = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex")

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 min

  const reset = resetRepo.create({
    tokenHash,
    expiresAt,
    user,
  })

  await resetRepo.save(reset);

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`

  await sendResetEmail(user.email, resetUrl)
}

export const resetPassword = async (
    rawToken: string,
    newPassword: string
  ) => {
    const resetRepo = AppDataSource.getRepository(PasswordReset)
    const userRepo = AppDataSource.getRepository(User)
  
    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex")
  
    const resetEntry = await resetRepo.findOne({
      where: { tokenHash },
      relations: ["user"],
    })
  
    if (!resetEntry) {
      throw new Error("Invalid token")
    }
  
    if (resetEntry.expiresAt < new Date()) {
      throw new Error("Token expired")
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10)
  
    resetEntry.user.password = hashedPassword
    await userRepo.save(resetEntry.user)
  
    // Delete reset token after use
    await resetRepo.remove(resetEntry)
  }