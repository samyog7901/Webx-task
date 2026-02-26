import express from "express"
import { logoutController, signupController } from "../controller/user/auth.controller"
import { signinController } from "../controller/user/signin.controller"
import { isauthenticated } from "../middleware/authentication"
import { forgotPassword, handleResetPassword } from "../controller/user/password-reset.controller"


const router = express.Router()

router.route("/signup").post(signupController)
router.route("/signin").post(signinController)
router.route("/logout").post(isauthenticated,logoutController)


export default router