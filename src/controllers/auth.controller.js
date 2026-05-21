import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export const login = async (req, res) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await db.users.findOne({ where: { email: email } });

        if (!user) {
            return res.status(401).json({ message: "E-mail ou senha incorretos"})
        } 

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "E-mail ou senha incorretos"})
        } 

        const token = jwt.sign(
            {id: user.id, role: user.role},
            "chave_bem_secreta!",
            { expiresIn: "1h"}
        )

        res.status(200).json({ message: "Login realizado com sucesso!", token})

    } catch {
        res.status(500).json({ message: "Erro interno no servidor." });
    }

}