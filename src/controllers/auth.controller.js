import db from "../models/index.js";
import bcrypt from "bcrypt"

export const register = async (req, res) => {
    try {

        const fullName = req.body.fullName
        const email = req.body.email;
        const password = req.body.password;
        
        const emailExists = await db.users.findOne({ where: { email: email } });

        if (emailExists) {
            return res.status(400).json({ message: "Email já cadastrado." });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await db.users.create({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            role: "user"
        })

        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};