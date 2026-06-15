import db from "../models/index.js";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import gTTS from "gtts";

export const uploadAudiobookFiles = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "Nenhum arquivo enviado." });
        }

        const audiobooks = [];
        for (const file of req.files) {
            const newBook = await db.audiobooks.create({
                title: file.originalname.replace('.pdf', ''),
                status: 'pending',
                original_pdf: Buffer.from(file.path)
            });
            audiobooks.push(newBook);
        }

        res.status(201).json({ message: "Arquivos enviados com sucesso!", audiobooks });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erro ao realizar upload." });
    }
};

export const getAllAudiobooks = async (req, res) => {
    try {
        const books = await db.audiobooks.findAll({
            include: [{ model: db.tracks }]
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar audiobooks." });
    }
};

// US-07: Conversor REAL de PDF para Áudio
export const processAudiobook = async (req, res) => {
    const { id } = req.params;
    
    try {
        const book = await db.audiobooks.findByPk(id);
        if (!book) return res.status(404).json({ message: "Audiobook não encontrado." });

        await book.update({ status: 'processing' });
        
        res.status(200).json({ message: "Conversão iniciada! Acompanhe o status no painel." });

        const pdfPath = book.original_pdf ? book.original_pdf.toString() : null;
        
        if (!pdfPath || !fs.existsSync(pdfPath)) {
            throw new Error("Arquivo PDF não encontrado no disco.");
        }

        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdfParse(dataBuffer);
        const fullText = data.text;

        if (!fullText || fullText.trim().length === 0) {
            throw new Error("O PDF está vazio ou é uma imagem escaneada (sem texto detectável).");
        }

        const chunkSize = 2000;
        const textChunks = [];
        for (let i = 0; i < fullText.length; i += chunkSize) {
            textChunks.push(fullText.substring(i, i + chunkSize));
        }

        for (let index = 0; index < textChunks.length; index++) {
            const chunk = textChunks[index];
            const trackNumber = index + 1;
            const audioFileName = `book_${book.id}_track_${trackNumber}.mp3`;
            const audioFilePath = path.join("audios", audioFileName);

            const gtts = new gTTS(chunk, 'pt');
            
            await new Promise((resolve, reject) => {
                gtts.save(audioFilePath, function (err, result) {
                    if (err) reject(err);
                    else resolve(result);
                });
            });

            await db.tracks.create({
                audiobook_id: book.id,
                title: `Parte ${trackNumber}`,
                duration: "00:00:00",
                order: trackNumber,
                file_path: `audios/${audioFileName}`
            });
        }

        await book.update({ status: 'completed' });
        console.log(`Audiobook ID ${book.id} processado com sucesso!`);

    } catch (error) {
        console.error(`Erro no processamento do livro ${id}:`, error);
        // Em caso de erro, marca como falha para o admin saber
        await db.audiobooks.update({ status: 'failed' }, { where: { id: id } });
    }
};