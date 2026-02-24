import express from "express"
import { forgotPassword, handleResetPassword } from "../controller/user/password-reset.controller"


const router = express.Router()
router.route("/request-pwreset").post(forgotPassword)
router.route("/reset-password").post(handleResetPassword)

export default router