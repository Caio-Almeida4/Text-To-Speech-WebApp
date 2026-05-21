import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]

    const token = authHeader && authHeader.split(" ")[1]

    if(!token) {
        return res.status(401).json({ message: "Acesso Negado, token não fornecido" })
    }

    try {
        const verified = jwt.verify(token, "chave_bem_secreta!")

        req.user = verified

        next()
    } catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado" })
    }
}