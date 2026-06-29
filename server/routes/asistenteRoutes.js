import express from "express";
import { obtenerRespuestaAsistente } from "../controllers/asistenteController.js";

const router = express.Router();

// Ruta POST para recibir la pregunta y contexto de la materia, cátedra y comisión
router.post("/asistente", obtenerRespuestaAsistente);

export default router;
