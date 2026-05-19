import { Router } from "express";
import { validateRegister } from '../middlewares/auth.validator.js'

const router = Router()

router.post("/register", validateRegister ,(req,res) =>{  
    res.status(200).json({message: "Registro feito com sucesso!"})
})

export default router