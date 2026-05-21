import { Router } from "express";
import { validateRegister, validateLogin } from '../middlewares/auth.validator.js'
import { register, login } from "../controllers/auth.controller.js"

const router = Router()

router.post("/register", validateRegister , register)

router.post("/login", validateLogin, login)

export default router