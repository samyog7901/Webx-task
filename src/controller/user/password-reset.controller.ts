import { Request, Response } from "express"
import { requestPasswordReset, resetPassword } from "../../services/user/password-reset.service"


export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  await requestPasswordReset(req.body.email)

  res.json({
    message: "If email exists, reset link sent",
  })
}

export const handleResetPassword = async (
  req: Request,
  res: Response
) => {
  const { token, password, confirmPassword } = req.body

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    })
  }

  await resetPassword(token, password)

  res.json({
    message: "Password reset successful",
  })
}