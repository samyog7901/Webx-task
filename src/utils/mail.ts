import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"

export const sendResetEmail = async (
  to: string,
  resetUrl: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  const templatePath = path.join(
    __dirname,
    "../templates/reset-password.ejs"
  )

  const html = await ejs.renderFile(templatePath, {
    resetUrl,
  })

  await transporter.sendMail({
    from: `"Webx App" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your Password",
    html,
  })
}