import { Router } from "express";
import {
  requestSignupOtp,
  verifySignupOtp,
  requestLoginOtp,
  verifyLoginOtp,
  logout,
  myProfile,
} from "../controllers/auth.controller";
import authenticate from "../middleware/auth";

const router = Router();

router.post("/request-otp/signup", requestSignupOtp);
router.post("/verify-otp/signup", verifySignupOtp);

router.post("/request-otp/login", requestLoginOtp);
router.post("/verify-otp/login", verifyLoginOtp);

router.post("/me",authenticate, myProfile)

router.post("/logout", authenticate, logout);

export default router;
