import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";
import { requireAdmin } from "../middlewares/verifyRole.js";
import { uploadPDF } from "../middlewares/upload.js";
import { uploadAudiobookFiles, getAllAudiobooks, getAllUsers, getAudiobookUsers, grantAudiobookAccess, revokeAudiobookAccess, processAudiobook } from "../controllers/audiobook.controller.js";

const router = express.Router();

router.post("/upload", verifyToken, requireAdmin, uploadPDF.array('pdfs', 10), uploadAudiobookFiles);

router.get("/users", verifyToken, requireAdmin, getAllUsers);
router.get("/:id/users", verifyToken, requireAdmin, getAudiobookUsers);
router.post("/:id/grant-access", verifyToken, requireAdmin, grantAudiobookAccess);
router.delete("/:id/revoke-access", verifyToken, requireAdmin, revokeAudiobookAccess);

router.get("/", verifyToken, getAllAudiobooks);

router.post("/:id/process", verifyToken, requireAdmin, processAudiobook);

export default router;