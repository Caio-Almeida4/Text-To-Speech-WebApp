import { Router } from "express";
import { validateRegister, validateLogin } from '../middlewares/auth.validator.js'
import { register, login, getMe } from "../controllers/auth.controller.js"
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router()

router.post("/register", validateRegister , register)
router.post("/login", validateLogin, login)

router.get("/me", verifyToken, getMe)

export default router