import express from "express"
import { logoutController, signupController } from "../controller/user/auth.controller"
import { signinController } from "../controller/user/signin.controller"
import { isauthenticated } from "../middleware/authentication"
import { forgotPassword, handleResetPassword } from "../controller/user/password-reset.controller"


const router = express.Router()

router.route("/signup").post(signupController)
router.route("/signin").post(signinController)
router.route("/logout").post(isauthenticated,logoutController)
router.route("/request-pwreset").post(forgotPassword)
router.route("/reset-password").post(handleResetPassword)

export default router