import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import asistenteRoutes from "./routes/asistenteRoutes.js";

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración de CORS - Permitir frontend local y de producción
const allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:5173",
];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origen (como móviles o curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== "production") {
      return callback(null, true);
    }
    return callback(null, true); // Dejar abierto para testing inicial
  },
  credentials: true
}));

app.use(express.json());

// Endpoint de estado/salud
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "Asistente DND Backend" });
});

// Rutas de la API
app.use("/api", asistenteRoutes);

// Manejo global de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor del Asistente DND corriendo en puerto ${PORT}`);
});
