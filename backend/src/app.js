import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import db from "./models/index.js";

import authRoutes from "./routes/auth.routes.js";
import audiobookRoutes from "./routes/audiobook.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/audios", express.static(path.join(__dirname, "../audios")));

app.use("/api/auth", authRoutes);
app.use("/api/audiobooks", audiobookRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Rota não encontrada." });
});

const startServer = async () => {
    try {
        await db.sequelize.sync({ force: false });
        console.log("Banco de dados sincronizado com sucesso.");

        app.listen(PORT, () => {
            console.log(`Servidor backend rodando perfeitamente na porta ${PORT}`);
        });
    } catch (error) {
        console.error("Falha ao iniciar o servidor devido a erros no banco de dados:", error);
        process.exit(1);
    }
};

startServer();

export default app;