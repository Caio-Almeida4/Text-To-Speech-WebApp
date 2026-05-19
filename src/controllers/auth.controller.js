import db from "../models/index.js";

export const register = async (req, res) => {
    try {

        const { email, password} = req.body

        res.status(201).json({ message: "Controller alcançado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." });
    }
};