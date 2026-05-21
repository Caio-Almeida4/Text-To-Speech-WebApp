import { body, validationResult } from "express-validator"

    const handleValidationErrors = (req, res, next) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            return res.status(400).json({ errors: erros.array()})
        }
        next()
    }

export const validateRegister = [
    body("email").trim().isEmail().withMessage("Insira um e-mail válido!"),
    body("password").isLength({min: 8}).withMessage("Sua senha deve conter no mínimo 8 caracteres"),
    handleValidationErrors
]

export const validateLogin = [
    body("email").trim().isEmail().withMessage("Insira um e-mail válido!"),
    body("password").notEmpty().withMessage("A senha é obrigatória!"),
    handleValidationErrors
]